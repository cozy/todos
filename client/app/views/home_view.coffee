{Tree} = require "./widgets/tree"
{TodoList} = require "../models/todolist"
{TodoListWidget} = require "./todolist_view"
helpers = require "../helpers"

# Main view that manages all widgets displayed inside application.
class exports.HomeView extends Backbone.View
    id: 'home-view'
 
    ###
    # Initializers
    ###

    initialize: ->

    constructor: ->
        super()

    # Build widgets (task lists) then load data.
    render: ->
        $(@el).html require('./templates/home')

        @todolist = $("#todo-list")
        this

    # Use jquery layout so set main layout of current window.
    setLayout: ->
        $(@el).layout
            size: "350"
            minSize: "350"
            resizable: true

    # Grab tree data, then build and display it. 
    # Links callback to tree events (creation, renaming...)
    loadData: ->
        $.get "tree/", (data) =>
           @tree = new Tree @.$("#nav"), @.$("#tree"), data,
                onCreate: @onTodoListCreated
                onRename: @onTodoListRenamed
                onRemove: @onTodoListRemoved
                onSelect: @onTodoListSelected
                onLoaded: @onTreeLoaded
                onDrop: @onTodoListDropped


    ###
    # Listeners
    ###

    # Save todolist creation to backend. Update corresponding node metadata.
    onTodoListCreated: (path, newName, data) =>
        path = path + "/" + helpers.slugify(newName)
        TodoList.createTodoList
            path: path
            title: newName
            , (todolist) =>
                data.rslt.obj.data "id", todolist.id
                data.inst.deselect_all()
                data.inst.select_node data.rslt.obj

    # Persist todolist renaming and update view rendering.
    onTodoListRenamed: (path, newName, data) =>
        if newName?
            TodoList.updateTodoList data.rslt.obj.data("id"),
                title: newName
            , () =>
                data.inst.deselect_all()
                data.inst.select_node data.rslt.obj
            
    # Persist todo list deletion and remove todo list details from view.
    onTodoListRemoved: (path) =>
        $("#todo-list").html(null)
        @currentTodolist.destroy()

    # When a todolist is selected, the todolist widget is displayed and fill 
    # with todolist data.
    # Route is updated with selected todo list path.
    onTodoListSelected: (path, id) =>
        path = "/#{path}" if path.indexOf("/")
        app.router.navigate "todolist#{path}", trigger: false
        if id?
            TodoList.getTodoList id, (todolist) =>
                @renderTodolist todolist
                @todolist.show()
        else
            $("#todo-list").html(null)

    # When tree is loaded, callback given in parameter when fetchData
    # function was called is run.
    onTreeLoaded: =>
        @treeCreationCallback() if @treeCreationCallback?

    # When todolist is dropped, its old path and its new path are sent to server
    # for persistence.
    onTodoListDropped: (newPath, oldPath, todolistTitle, data) =>
        newPath = newPath + "/" + helpers.slugify(todolistTitle)
        alert newPath
        TodoList.updateTodoList data.rslt.o.data("id"),
            path: newPath
            , () =>
                data.inst.deselect_all()
                data.inst.select_node data.rslt.o

    ###
    # Functions
    ###

    # Force selection inside tree of todolist represented by given path.
    selectList: (path) ->
        @tree.selectNode path

    # Fill todolist widget with todolist data. Then load todo task list 
    # and archives for this todolist.
    renderTodolist: (todolist) ->
        todolist.url = "todolists/#{todolist.id}"
        @currentTodolist = todolist
        todolistWidget = new TodoListWidget @currentTodolist
        todolistWidget.render()
        todolistWidget.loadData()

