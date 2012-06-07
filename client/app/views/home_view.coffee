{TaskCollection} = require "../collections/tasks"
{Task} = require "../models/task"

class exports.HomeView extends Backbone.View
    id: 'home-view'
 
    events:
        "click #new-task-button": "onEditClicked"
        "click #edit-button": "onEditClicked"

    constructor: ->
        super()

        @isEditMode = false
       
    onAddClicked: (event) ->
        task = new Task done: false, description: "new task"
        task.save null,
            success: (data) =>
                data.url = "tasks/#{data.id}/"
                @tasks.add(data)
                $("#{data.id} span").contents().focus()
            error: ->
                alert "An error occured while saving data"
 
    onEditClicked: (event) ->
        if not @isEditMode
            @.$(".del-task-button").show()
            @isEditMode = true
        else
            @.$(".del-task-button").hide()
            @isEditMode = false
            


    render: ->
        $(@el).html require('./templates/home')
        @tasks = new TaskCollection(@.$("#task-list"))
        @archivedTasks = new TaskCollection(@.$("#archive-list"))
        @tasks.fetch()
        @archivedTasks.url = "tasks/archives/"
        @archivedTasks.fetch()
        this
