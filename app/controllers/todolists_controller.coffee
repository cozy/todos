DataTree = require('../../common/tree/tree_object').Tree
helpers = require '../../common/helpers'

load 'application'

# Helpers

# Return to client a todolist list like this
# { length: number of todolist, rows: todolist list }
returnTodoLists = (err, todolists) ->
    if err
        console.log err
        send error: "Retrieve todolists failed.", 500
    else
        send length: todolists.length, rows: todolists

# Grab todolist corresponding to id given in url before loading action.
before 'load todolist', ->
    TodoList.find params.id, (err, todolist) =>
        if err
            send error: 'An error occured', 500
        else if todolist is null
            send error: 'TodoList not found', 404
        else
            @todolist = todolist
            next()
, only: ['update', 'destroy', 'show']

# Before each todolist list modification current tree is loaded. If it does not
# exist it is created.
before 'load tree', ->
    createTreeCb = (err, tree) =>
        if err
            console.log err
            send error: 'An error occured while loading tree', 500
        else
            @tree = tree
            next()

    Tree.getOrCreate createTreeCb
, only: ['update', 'destroy', 'create']


# Actions

# Entry point, load first html page.
action 'index', ->
    render title: "Cozy TodoLists"

# Return all todolists
action 'all', ->
    TodoList.all returnNotes

# Return todolists corresponding at a given path of the tree.
action 'allForPath', ->
    if body.path?
        TodoList.allForPath body.path, returnNotes
    else
        returnTodoLists(null, [])

# Create a new todolist from data given in body.
action 'create', ->
    todolist = new TodoList body
    dataTree = new DataTree JSON.parse(@tree.struct)
    
    @name = todolist.title
    @path = todolist.path.split("/")
    @path.pop()
    @path = @path.join("/")

    todolist.humanPath = dataTree.getHumanPath(@path)
    todolist.humanPath.push(@name)

    updateTree = (todolist) =>
        dataTree.addNode @path, @name, todolist.id

        @tree.updateAttributes struct: dataTree.toJson(), (err) =>
            if err
                console.log err
                send error: "An error occured while node was created", 500
            else
                send todolist, 201

    TodoList.create todolist, (err, todolist) =>
        if err
            send error: 'TodoList can not be created'
        else
            updateTree todolist

# Return a todolist
action 'show', ->
    send @todolist, 200

# Update attributes with data given in body. If no data is provided for an
# attribute it is not updated.
action 'update', ->
    updateTodoList = =>
        @todolist.updateAttributes body, (err) =>
            if err
                console.log err
                send error: 'TodoList can not be updated', 400
            else
                send success: 'TodoList updated'

    if body.title != @todolist.title and body.title?
        dataTree = new DataTree JSON.parse(@tree.struct)

        # Build new path from current path and new name
        @newName = body.title
        nodes = @todolist.path.split("/")
        nodes.pop()
        nodes.push helpers.slugify(@newName)
        @newPath = nodes.join("/")
         
        # Update tree
        dataTree.updateNode @todolist.path, @newName

        # Save Tree
        @tree.updateAttributes struct: dataTree.toJson(), (err) =>
            if err
                console.log err
                send error: "An error occured while node was created", 500
            else
                # Update todolist children
                TodoList.updatePath @todolist.path, @newPath, @newName, \
                                    updateTodoList

    else if body.path? and body.path != @todolist.path

        @dataTree = new DataTree JSON.parse(@tree.struct)
        @dest = body.path.split("/")
        @dest.pop()
        @dest = @dest.join("/")
        @dataTree.moveNode @todolist.path, @dest
        @humanDest = @dataTree.getHumanPath @dest

        callback = (err) ->
             if err
                 console.log err
                 send error: "An error occured while node was moved", 500
             else
                 send success: "Node succesfully moved", 200

        @tree.updateAttributes struct: @dataTree.toJson(), (err) =>
            if err
                console.log err
                send error: "An error occured while node was moved", 500
            else
                TodoList.movePath @todolist.path, @dest, @humanDest, callback

    else
        updateTodoList()


# Remove given todolist from db.
action 'destroy', ->
    
    @dataTree = new DataTree JSON.parse(@tree.struct)
    @dataTree.deleteNode @todolist.path

    updateTree = =>
        @tree.updateAttributes struct: @dataTree.toJson(), (err) =>
            if err
                console.log err
                send error: "An error occured while node was deleted", 500
            else
                send success: 'TodoList succesfuly deleted'

    TodoList.destroyForPath @todolist.path, (err) ->
        if err
            console.log err
            send error: "An error occured while node was deleted", 500
        else
            updateTree()

