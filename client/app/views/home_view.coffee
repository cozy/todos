{TaskCollection} = require "../collections/tasks"
{Task} = require "../models/task"

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
      
    # Build widgets then load data.
    render: ->
        $(@el).html require('./templates/home')

        @tasks = new TaskCollection(@.$("#task-list"))
        @archivedTasks = new TaskCollection(@.$("#archive-list"))

        @loadData()
        this

    loadData: ->
        @tasks.fetch()
        @archivedTasks.url = "tasks/archives/"
        @archivedTasks.fetch()
        

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
                @tasks.add(data)
                $("#{data.id} span.description").contents().focus()
            error: ->
                alert "An error occured while saving data"
 
    # When edit is clicked, edition widgets are displayed (editions widgets are
    # better for touch interfaces).
    onEditClicked: (event) ->
        if not @isEditMode
            @.$(".task-buttons").show()
            @isEditMode = true
        else
            @.$(".task-buttons").hide()
            @isEditMode = false
            


