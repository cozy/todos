{Task} = require "../models/task"
{TaskLine} = require "../views/task_view"


class exports.TaskCollection extends Backbone.Collection
    
    model: Task
    url: 'tasks/'

    constructor: (view) ->
        super()
        @view = view
        @bind "add", @prependTask
        @bind "reset", @addTasks

    # Select which field from backend response to use for parsing to populate
    # collection.
    parse: (response) ->
        response.rows

    # View binding : for each task added, it appends a task line to task list.
    addTasks: (tasks) =>
        tasks.forEach (task) =>
            task.collection = @
            @appendTask task

    # Append a task to the task list.
    appendTask: (task) =>
        taskLine = new TaskLine task
        @view.append taskLine.render()

    # Prepend a task to the task list and update previousTask field of 
    # previous first task.
    prependTask: (task) =>
        task.collection = @
        nextTask = @at(1)
        if nextTask?
            nextTask.set("previousTask", task.id)
        taskLine = new TaskLine task
        @view.prepend taskLine.render()

    up: (task) =>
        index = @toArray().indexOf task
    
        console.log index
        if index == 0
            return false

        oldPreviousTask = @at(index - 1) if index > 0
        previousTask = @at(index - 2) if index > 1
        nextTask = @at(index + 1)

        if nextTask?
            nextTask.set("previousTask", oldPreviousTask.id)
            oldPreviousTask.set("nextTask", nextTask.id)
        else
            oldPreviousTask.set("nextTask", null)

        if previousTask?
            previousTask.set("nextTask", task.id)
            task.set("previousTask", previousTask.id)
        else
            task.set("previousTask", null)
        task.set("nextTask", oldPreviousTask.id)

        task.view.up(oldPreviousTask.id)

        @remove(task)
        @add task,
            at: index - 1
            silent: true

        return true
