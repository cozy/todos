{Task} = require "../models/task"
{TaskLine} = require "../views/task_view"


class exports.TaskCollection extends Backbone.Collection
    
    model: Task
    url: 'tasks/'

    constructor: (view) ->
        super()
        @view = view
        @bind "add", @addTask
        @bind "reset", @addTasks

    # Select which field from backend response to use for parsing to populate
    # collection.
    parse: (response) ->
        response.rows

    # View binding : for each task added, add a task line inside view.
    addTasks: (tasks) =>
        tasks.forEach (task) =>
            @addTask task

    # View binding: when a task is added to collection, a line is created
    # inside view.
    addTask: (task) =>
        taskLine = new TaskLine task
        @view.append taskLine.render()

