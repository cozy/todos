{TaskCollection} = require "../collections/tasks"
{Task} = require "../models/task"
{TaskList} = require "./tasks_view"
helpers = require "../helpers"

# Display todo list wrapper that contains todo task list and archive task list.
class exports.TodoListWidget extends Backbone.View
    id: "todo-list"
    tagName: "div"
    el: "#todo-list"
    isEditMode: false

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

        @title = @.$(".todo-list-title .description")
        @breadcrumb = @.$(".todo-list-title .breadcrumb")
        
        @taskList = new TaskList @, @.$("#task-list")
        @archiveList = new TaskList @, @.$("#archive-list")
        @tasks = @taskList.tasks
        @archiveTasks = @archiveList.tasks

        @newButton = $("#new-task-button")
        @showButtonsButton = $("#edit-button")
        @newButton.hide()

        @newButton.unbind "click"
        @newButton.click @onAddClicked
        @showButtonsButton.unbind "click"
        @showButtonsButton.click @onEditClicked

        if @model?
            breadcrumb = @model.humanPath.split(",")
            breadcrumb.pop()
            @breadcrumb.html breadcrumb.join(" / ")
            @title.html @model.title
        else
            @breadcrumb.html ""
            @title.html "all tasks"

        @el

    ###
    # Listeners
    ###

    # When add is clicked a new task is added to the top of the task list.
    # Adding task is done after task was created on the server.
    onAddClicked: (event) =>
        task = new Task done: false, description: "new task", list: @model.id
        task.save null,
            success: (data) =>
                data.url = "tasks/#{data.id}/"
                @tasks.add data
                $(".task:first .description").focus()
                helpers.selectAll($(".task:first .description"))

                if not @isEditMode
                    $(".task:first .task-buttons").hide()
                else
                    $(".task:first .task-buttons").show()

            error: ->
                alert "An error occured while saving data"
 
    # When edit is clicked, edition widgets are displayed (editions widgets are
    # better for touch interfaces).
    onEditClicked: (event) =>
        if not @isEditMode
            @.$(".task:not(.done) .task-buttons").show()
            @newButton.show()
            @isEditMode = true
            @showButtonsButton.html "hide buttons"
        else
            @.$(".task-buttons").hide()
            @newButton.hide()
            @isEditMode = false
            @showButtonsButton.html "show buttons"


    ###
    # Functions
    ###

    # Load data then focus on first task loaded.
    # If list is empty a new task is automatically created.
    loadData: ->
        if not @model?
            @tasks.url = "tasks/todo"
            @archiveTasks.url = "tasks/archives"
        else
            @archiveTasks.url += "/archives"


        $(@archiveTasks.view.el).spin()
        $(@tasks.view.el).spin()
        @archiveTasks.fetch
            success: =>
                $(@archiveTasks.view.el).spin()
            error: =>
                $(@archiveTasks.view.el).spin()
        @tasks.fetch
            success: =>
                if $(".task:not(.done)").length > 0
                    $(".task:first .description").focus()
                else
                    @onAddClicked() if model?
                $(@tasks.view.el).spin()
            error: =>
                $(@tasks.view.el).spin()

    # Add task to todo task list. 
    moveToTaskList: (task) ->
        @tasks.onTaskAdded task


    # Force task saving if task was modified.
    blurAllTaskDescriptions: ->
        @.$(".task .description").trigger("blur")
