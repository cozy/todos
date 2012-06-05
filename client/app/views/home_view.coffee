{TaskCollection} = require "../collections/tasks"
{Task} = require "../models/task"

class exports.HomeView extends Backbone.View
    id: 'home-view'
 
    events:
        "click #new-task-button": "onAddClicked"

    constructor: ->
        super()
       
    onAddClicked: (event) ->
        task = new Task done: false, description: "my task"
        @tasks.add(task)
        task.save()

    render: ->
        $(@el).html require('./templates/home')
        @tasks = new TaskCollection(@.$("#task-list"))
        @archivedTasks = new TaskCollection(@.$("#archive-list"))
        @tasks.fetch()
        @archivedTasks.url = "tasks/archives/"
        @archivedTasks.fetch()
        this
