{Tree} = require "./widgets/tree"
{TodoList} = require "../models/todolist"
{TagListView} = require "./taglist_view"
{TodoListCollection} = require "../collections/todolists"
{TodoListWidget} = require "./todolist_view"
helpers = require "../helpers"
client = require "../lib/request"

# Main view that manages all widgets displayed inside application.
class exports.HomeView extends Backbone.View
    id: 'home-view'
 
    ###
    # Initializers
    ###

    initialize: ->

    constructor: ->
        @todolists = new TodoListCollection()
        Backbone.Mediator.subscribe 'task:changed', @onTaskChanged

        super()

    # Build widgets (task lists) then load data.
    render: ->
        $(@el).html require('./templates/home')

        @todolist = @$("#todo-list")
        @

    # Use jquery layout so set main layout of current window.
    setLayout: ->

        # some tricks to make design more responsive
        size = $(window).width()
        if size < 700
            @layout = $(@el).layout
                size: "250"
                minSize: "250"
                resizable: true
                togglerLength_closed: "0"
                togglerLength_opened: "0"
            @layout.toggle "west"
        else
            @layout = $(@el).layout
                size: "250"
                minSize: "250"
                resizable: true
        @previousSize = size

        # Update layout when windows size is changed
        $(window).resize =>
            size = $(window).width()
            isSmall = size < 700 and @previousSize > 700
            isBig = size > 700 and @previousSize < 700
            @layout.toggle "west" if isSmall or isBig
            @previousSize = size
            

    # Grab tree data, then build and display it.
    # Links callback to tree events (creation, renaming...)
    # Set listeners for other buttons
    loadData: (callback) ->
        @$("#tree").spin()
        $.get "tree/", (data) =>
            window.tree = data
            @tree = new Tree @.$("#nav"), data,
                onCreate: @onTodoListCreated
                onRename: @onTodoListRenamed
                onRemove: @onTodoListRemoved
                onSelect: @onTodoListSelected
                onLoaded: @onTreeLoaded
                onDrop: @onTodoListDropped

        @treeLoadedCallback = callback


    ###
    # Listeners
    ###

    # Save todolist creation to backend. Update corresponding node metadata.
    onTodoListCreated: (parentId, newName, data) =>
        data =
            title: newName
            parent_id: parentId
        TodoList.createTodoList data, (err, todolist) =>
            data.rslt.obj.data "id", todolist.id
            data.rslt.obj[0].id = todolist.id
            data.inst.deselect_all()
            data.inst.select_node data.rslt.obj

    # Persist todolist renaming and update view rendering.
    onTodoListRenamed: (listId, newName, data) =>
        if newName?
            data =
                title: newName
            TodoList.updateTodoList listId, data, =>
                @tree.selectNode listId
            
    # Persist todo list deletion and remove todo list details from view.
    onTodoListRemoved: (listId) =>
        if @currentTodolist and @currentTodolist.id is listId
            @currentTodolist.destroy()
        else
            TodoList.deleteTodoList listId, ->
        $("#todo-list").html(null)

    # When a todolist is selected, the todolist widget is displayed and fill
    # with todolist data.
    # Route is updated with selected todo list path.
    onTodoListSelected: (path, id, data) =>
        @tagListView?.deselectAll()
        if id? and id != "tree-node-all"
            TodoList.getTodoList id, (err, list) =>
                app.router.navigate "todolist#{path}", trigger: false
                @renderTodolist list
                @todolist.show()
        else
            app.router.navigate "todolist/all", trigger: false
            @renderTodolist null
            @todolist.show()

    # When tree is loaded, callback given in parameter when fetchData
    # function was called is run.
    onTreeLoaded: =>
        loadLists = =>
            @todolists.fetch
                success: =>
                    @treeLoadedCallback() if @treeLoadedCallback?
                error: =>
                    @treeLoadedCallback() if @treeLoadedCallback?

        @$("#tree").spin()
        client.get "tasks/tags",
            success: (data) =>
                @tagListView = new TagListView data
                @tagListView.render()
                loadLists()
            error: =>
                loadLists()


    # When todolist is dropped, its old path and its new path are sent to server
    # for persistence.
    onTodoListDropped: (nodeId, targetNodeId) =>
        TodoList.updateTodoList nodeId, parent_id: targetNodeId , =>
            TodoList.getTodoList nodeId, (err, list) =>
                @currentTodolist.set "path", list.path
                @currentTodolist.view.refreshBreadcrump()

    # Check for new tag if a task changed.
    onTaskChanged: (tags) =>
        @tagListView?.addTags tags

    ###
    # Functions
    ###

    # Force selection inside tree of todolist represented by given path.
    selectList: (id) ->
        id = 'tree-node-all' if id is "all" or not id?
        @tree.selectNode id

    selectTag: (tag) ->
        @tree.deselectAll()
        @tagListView.selectTag tag
        list = new TodoList title: tag, tag: tag
        @renderTodolist list

    # Fill todolist widget with todolist data. Then load todo task list
    # and archives for this todolist.
    renderTodolist: (todolist) ->
        todolist.url = "todolists/#{todolist.id}" if todolist?
        @currentTodolist?.view.blurAllTaskDescriptions()
        @currentTodolist = todolist
        todolistWidget = new TodoListWidget @currentTodolist
        todolistWidget.render()
        todolistWidget.loadData()
