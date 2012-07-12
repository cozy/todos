{TaskCollection} = require "../collections/tasks"
{Task} = require "../models/task"
{TaskList} = require "./tasks_view"

# Row displaying application name and attributes
class exports.TodoListWidget extends Backbone.View
    id: "todo-list"
    tagName: "div"

    events:
        "click #new-task-button": "onAddClicked"
        "click #edit-button": "onEditClicked"


    ### Constructor ####

    constructor: (@model) ->
        super()

        @id = @model.slug
        @model.view = @

    remove: ->
        $(@el).remove()

    ### configuration ###

    render: ->
        @el = $("#todo-list")
        $(@el).html require('./templates/todolist')
        $(".todo-list-title span.description").html @model.title
        path =  @model.humanPath.split(",").join(" / ")
        $(".todo-list-title span.breadcrump").html path
        
        @taskList = new TaskList @, @.$("#task-list")
        @archiveList = new TaskList @, @.$("#archive-list")
        @tasks = @taskList.tasks
        @archiveTasks = @archiveList.tasks

        @newButton = @.$("#new-task-button")
        @showButtonsButton = @.$("#edit-button")
        @newButton.hide()

        breadcrump = @model.humanPath.split(",").join(" / ")
        $("#todo-list-full-breadcrump").html breadcrump
        $("#todo-list-full-title").html @model.title

        @el

    # When add is clicked a new task is added to the top of the task list.
    # Adding task is done after task was created on the server.
    onAddClicked: (event) ->
        task = new Task done: false, description: "new task"
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
    onEditClicked: (event) ->
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

    loadData: ->
        @archiveTasks.url = "tasks/archives/"
        @archiveTasks.fetch()
        @tasks.fetch
            success: =>
                if $(".task:not(.done)").length > 0
                    $(".task:first .description").focus()
                else
                    @onAddClicked()

    moveToTaskList: (task) ->
        @tasks.prependTask task

