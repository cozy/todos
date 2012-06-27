{TaskCollection} = require "../collections/tasks"
{Task} = require "../models/task"
{TaskList} = require "./tasks_view"
helpers = require "../helpers"

# Main view that manages all widgets displayed inside application.
class exports.HomeView extends Backbone.View
    id: 'home-view'
 
    events:
        "click #new-task-button": "onAddClicked"
        "click #edit-button": "onEditClicked"

    ###
    # Initializers
    ###

    constructor: ->
        super()

        @isEditMode = false
      
    # Build widgets (task lists) then load data.
    render: ->
        $(@el).html require('./templates/home')

        @taskList = new TaskList @, @.$("#task-list")
        @archiveList = new TaskList @, @.$("#archive-list")
        @tasks = @taskList.tasks
        @archiveTasks = @archiveList.tasks

        @newButton = @.$("#new-task-button")
        @showButtonsButton = @.$("#edit-button")
        @newButton.hide()

        @loadData()
        this

    # Grab data for archive and task list and display them through
    # model-view binding.
    # If there is no task, one is automatically created.
    loadData: ->
        @tasks.fetch
            success: =>
                if $(".task:not(.done)").length > 0
                    $(".task:first .description").focus()
                else
                    @onAddClicked()
        @archiveTasks.url = "tasks/archives/"
        @archiveTasks.fetch()
        

    ###
    # Listeners
    ###

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
    
    moveToTaskList: (task) ->
        @tasks.prependTask task

