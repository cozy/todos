load 'application'

async = require "async"


### Helpers ###

###
# Return to client a todoList list like this
# { length: number of todoList, rows: todoList list }
###
returnTodoLists = (err, todoLists) ->
    if err
        console.log err
        send error: "Retrieve todoLists failed.", 500
    else
        todoLists.forEach (list)->
            try
                list.path = JSON.parse list.path
            catch error

        send length: todoLists.length, rows: todoLists

###
# Grab todoList corresponding to id given in url before
# update, destroy or show actions
###
before 'load todoList', ->
    TodoList.find params.id, (err, todoList) =>
        if err
            send error: 'An error occured', 500
        else if todoList is null
            send error: 'TodoList not found', 404
        else
            todoList.path = JSON.parse todoList.path
            @todoList = todoList
            next()
, only: ['destroy', 'show']


###*
# Before each todoList list modification current tree is loaded. If it does not
# exist it is created.
###
before 'load tree', ->
    createTreeCb = (err, tree) ->
        if err
            console.log err
            send error: 'An error occured while loading tree', 500
        else
            next()

    Tree.getOrCreate createTreeCb, only: ['update', 'destroy', 'create']



### Actions ###

###
# Return all todoLists
###
action 'all', ->
    TodoList.all(returnTodoLists)

###
# Return a todoList
###
action 'show', ->
    send @todoList, 200

###
# Create a new todoList from data given in the body of request
# params : post object :
#               { title : "the title, mandatory",
#                 parent_id : "the parent todoList, mandatory, null if root"}
#          Other attributes of a todoList are optionnal (content, tags)
###
action 'create', ->
    parent_id = body.parent_id
    parent_id = "tree-node-all" if not parent_id?
    path = Tree.getPath parent_id
    path.push(body.title)
    body.path = JSON.stringify(path)
    TodoList.create body, (err, todoList) ->
        if err
            send error: 'TodoList can not be created'
        else
            Tree.addNode todoList, parent_id, (err)->
                if err
                    send error: 'TodoList can not be created'
                else
                    todoList.path = JSON.parse(todoList.path)
                    send todoList, 201
###
# Update the todoList and tree in case of :
#   change of the title
#   change of the parent_id (move in the tree)
#   change of the content
###
action 'update', ->
    callback = (err) ->
        if err
            send error: 'TodoList can not be updated', 400
        else
            send success: 'TodoList updated', 200

    dataTreeNode = Tree.dataTree.nodes[params.id]
    isNewTitle   = body.title? and body.title isnt dataTreeNode.data
    isNewParent  = body.parent_id? and \
                        body.parent_id isnt dataTreeNode._parent._id

    if isNewTitle or isNewParent
        # update the path of the todoList in the tree.
        # This operation updates the todoList and its children paths and the
        # tree.
        Tree.moveOrRenameNode params.id, body.title, body.parent_id, (err) ->
            newData    = {}
            isToUpdate = false
            if isNewTitle
                newData.title = body.title
                isToUpdate = true
            if body.tags
                newData.tags = body.tags
                isToUpdate = true
            if isNewParent
                newData.parent_id = body.parent_id
                isToUpdate = true
            if isToUpdate
                newData.id = params.id
                
                list = new TodoList newData
                list.updateAttributes newData, callback
            else
                callback null

    # neither title nor path is changed, the todoList can be updated directly.
    else
        newData    = {}
        isToUpdate = false
        if body.tags
            newData.tags = body.tags
            isToUpdate = true
        if isToUpdate
            newData.id = params.id
            list = new TodoList newData
            list.updateAttributes newData, callback
        else
            callback null

# Destroy todo list and all tasks linked to that list.
action 'destroy', ->
    TodoList.destroy params.id, (err) ->
        if err
            send error: true, msg: "Server error occured.", 500
        else
            send success: 'TodoLists and tasks succesfuly deleted', 200
