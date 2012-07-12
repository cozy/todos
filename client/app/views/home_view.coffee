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

    isEditMode: false

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

    # Grab data for archive and task list and display them through
    # model-view binding.
    # If there is no task, one is automatically created.
    loadData: ->

        $.get "tree/", (data) =>
           @tree = new Tree @.$("#nav"), $("#tree"), data,
                onCreate: @createFolder
                onRename: @renameFolder
                onRemove: @deleteFolder
                onSelect: @selectFolder
                onLoaded: @onTreeLoaded
                onDrop: @onTodolistDropped


    ###
    # Listeners
    ###

    # Create a new folder inside currently selected node.
    createFolder: (path, newName, data) =>
        path = path + "/" + helpers.slugify(newName)
        TodoList.createTodoList
            path: path
            title: newName
            , (todolist) =>
                data.rslt.obj.data("id", todolist.id)
                data.inst.deselect_all()
                data.inst.select_node data.rslt.obj

    # Rename currently selected node.
    renameFolder: (path, newName, data) =>
        if newName?
            TodoList.updateTodolist data.rslt.obj.data("id"),
                title: newName
            , () =>
                data.inst.deselect_all()
                data.inst.select_node data.rslt.obj
            
    # Delete currently selected node.
    deleteFolder: (path) =>
        @todolist.hide()
        @currentTodolist.destroy()

    # When a todolist is selected, the todolist widget is displayed and fill 
    # with todolist data.
    selectFolder: (path, id) =>
        path = "/#{path}" if path.indexOf("/")
        app.router.navigate "todolist#{path}", trigger: false
        if id?
            TodoList.getTodoList id, (todolist) =>
                @renderTodolist todolist
                @todolist.show()
        else
            @todolist.hide()

    # Force selection inside tree of todolist represented by given path.
    selectList: (path) ->
        @tree.selectNode path

    # Fill todolist widget with todolist data.
    renderTodolist: (todolist) ->
        todolist.url = "todolists/#{todolist.id}"
        @currentTodolist = todolist
        todolistWidget = new TodoListWidget @currentTodolist
        todolistWidget.render()

    # When tree is loaded, callback given in parameter when fetchData
    # function was called is run.
    onTreeLoaded: =>
        @treeCreationCallback() if @treeCreationCallback?

    # When todolist is dropped, its old path and its new path are sent to server
    # for persistence.
    onTodolistDropped: (newPath, oldPath, todolistTitle, data) =>
        newPath = newPath + "/" + helpers.slugify(todolistTitle)
        Todolist.updateTodolist data.rslt.o.data("id"),
            path: newPath
            , () =>
                data.inst.deselect_all()
                data.inst.select_node data.rslt.o

