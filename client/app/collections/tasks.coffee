{Task} = require "../models/task"


class exports.TaskCollection extends Backbone.Collection
    
    model: Task
    url: 'tasks/'

    constructor: (view) ->
        super()
        @view = view
        @bind "add", @view.addTaskLine
        @bind "reset", @addTasks

    # Select which field from backend response to use for parsing to populate
    # collection.
    parse: (response) ->
        response.rows

    # View binding : for each task added, it appends a task line to task list.
    addTasks: (tasks) =>
        tasks.forEach (task) =>
            task.collection = @
            @view.addTaskLine task

    # Prepend a task to the task list and update previousTask field of 
    # previous first task.
    prependTask: (task) =>
        task.collection = @
        nextTask = @at(1)
        if nextTask?
            nextTask.set("previousTask", task.id)
        @view.addTaskLineAsFirstRow task

    # Return previous task, if there is no previous task, it returns null.
    getPreviousTask: (task) ->
        @get(task.previousTask)

    # Return next task, if there is no next task, it returns null.
    getNextTask: (task) ->
        @get(task.nextTask)

    # Change task position, decrement its index position.
    # Links are updated.
    # View is changed too.
    up: (task) =>
        index = @toArray().indexOf task
    
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

    # Change task position, increment its index position.
    # Links are updated.
    # View is changed too.
    down: (task) =>
        index = @toArray().indexOf task
        tasksLength = @size()
    
        if index == tasksLength - 1
            return false

        oldNextTask = @at(index + 1) if index < tasksLength - 1
        nextTask = @at(index + 2) if index < tasksLength - 1
        previousTask = @at(index - 1)

        if previousTask?
            previousTask.set("nextTask", oldNextTask.id)
            oldNextTask.set("previousTask", previousTask.id)
        else
            oldNextTask.set("previousTask", null)

        if nextTask?
            nextTask.set("previousTask", task.id)
            task.set("nextTask", nextTask.id)
        else
            task.set("nextTask", null)
        task.set("previousTask", oldNextTask.id)

        task.view.down(oldNextTask.id)

        @remove(task)
        @add task,
            at: index + 1
            silent: true

        return true

