{TaskCollection} = require "../collections/tasks"
{Task} = require "../models/task"

class exports.HomeView extends Backbone.View
    id: 'home-view'
 
    events:
        "click #new-task-button": "onAddClicked"

    constructor: ->
        super()
       
    onAddClicked: (event) ->
        @tasks.add(new Task done: false, description: "")

    render: ->
        $(@el).html require('./templates/home')
        @tasks = new TaskCollection(@.$("#task-list"))
        this
