{TaskCollection} = require "../collections/tasks"
{Task} = require "../models/task"
{TaskList} = require "./tasks_view"
{NewTaskForm} = require "./new_task_form"
helpers = require "../helpers"
slugify = require "lib/slug"

# Display todo list wrapper that contains todo task list and archive task list.
class exports.TodoListWidget extends Backbone.View
    tagName: "div"
    id: "todo-list"
    el: "#todo-list"

    ### Constructor ####

    constructor: (@model) ->
        super()

        if @model?
            @id = @model.slug
            @model.view = @

    remove: ->
        $(@el).remove()

    ### configuration ###

    # Render template then build all widgets and bind them to their listeners.
    render: ->
        $(@el).html require('./templates/todolist')

        @title = @$(".todo-list-title .description")
        @breadcrumb = @$(".todo-list-title .breadcrumb")

        @taskList?.tasks.socketListener.stopWatching @taskList.tasks
        @archiveList?.tasks.socketListener.stopWatching @archiveList.tasks

        @taskList = new TaskList @, @$("#task-list")
        @archiveList = new TaskList @, @$("#archive-list")
        @tasks = @taskList.tasks
        @archiveTasks = @archiveList.tasks
        @refreshBreadcrump()

        @newTaskForm = new NewTaskForm @taskList

        $(document).unbind('keydown').keydown (event) ->
            keyCode = event.which | event.keyCode
            if keyCode is 16
                $('.handle').addClass('jstree-draggable')

        $(document).unbind('keyup').keyup (event) ->
            keyCode = event.which | event.keyCode
            $('.handle').removeClass('jstree-draggable') if keyCode is 16

        @el

    ###
    # Functions
    ###

    # Load data then focus on first task loaded.
    # If list is empty a new task is automatically created.
    loadData: ->

        # Configure collections
        if not @model?
            @tasks.url = "tasks/todo"
            @archiveTasks.url = "tasks/archives"
        else
            if @model.tag?
                @tasks.url = "tasks/tags/#{@model.tag}/todo"
                @archiveTasks.url = "tasks/tags/#{@model.tag}/archives"
            else
                @archiveTasks.url += "archives"

        # Show laoding indicators
        $(@archiveTasks.view.el).spin "small"
        $(@tasks.view.el).spin "small"

        # Load data
        @archiveTasks.fetch
            success: =>
                $(@archiveTasks.view.el).spin()
            error: =>
                $(@archiveTasks.view.el).spin()

        @tasks.fetch
            success: =>
                if @$(".task:not(.done)").length > 0
                    @$(".task:first .description").focus()

                @$(@tasks.view.el).spin()
            error: =>
                @$(@tasks.view.el).spin()

    creationInfosRequired: =>
        @tasks.length is 1 and @model? and @model.get("id")?

    removeCreationInfos: =>
        @$el.remove '.info'

    # Add task to todo task list.
    moveToTaskList: (task) ->
        @archiveTasks.remove task, silent: true
        @tasks.insertTask null, task

    # Force task saving if task was modified.
    blurAllTaskDescriptions: ->
        @$(".task .description").trigger("blur")

    # Set focus on add task input
    focusNewTask: ->
        @newTaskForm.newTaskFormInput.focus()

    # Refresh breadcrump with data from current model.
    refreshBreadcrump: ->
        @$(".breadcrumb a").unbind()

        if @model? and @model.id?
            @breadcrumb.html @createBreadcrumb()
            @$(".breadcrumb a").click (event) ->
                event.preventDefault()
                hash = event.target.hash.substring(1)
                path = hash.split("/")
                id = path[1]
                app.homeView.selectList id
            @title.html @model.title

        else
            @breadcrumb.html ""
            if @model?.tag?
                @title.html @model.tag
            else
                @title.html "All tasks"

    # breadcrumb will contain the path of the selected list in a link format
    # the code below generates the breadcrumb corresponding
    # to the current list path
    createBreadcrumb: ->
        paths = @model.path

        listName = paths.pop()
        slugs = []
        slugs.push slugify(path) for path in paths
        breadcrumb = ""
        parent = app.homeView.tree.getSelectedNode()

        while paths.length > 0
            parent = app.homeView.tree.getParent parent

            if parent? and parent[0]?
                href = "#todolist/#{parent[0].id}/#{slugs.join("/")}"
                slugs.pop()
                listName = paths.pop()
                link = "<a href='#{href}'>#{listName}</a> "
                breadcrumb = "#{link} > #{breadcrumb}"
            else
                listName = paths.pop()

        breadcrumb = "<a href='#todolist/all'> All</a> > #{breadcrumb}"
        breadcrumb
