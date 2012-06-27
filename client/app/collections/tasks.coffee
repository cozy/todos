{Task} = require "../models/task"


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
            @view.addTaskLine task

    # Prepend a task to the task list and update previousTask field of 
    # previous first task.
    prependTask: (task) =>
        task.collection = @
        nextTask = @at(0)
        if nextTask?
            nextTask.set("previousTask", task.id)
            task.set("nextTask", nextTask.id)
        @view.addTaskLineAsFirstRow task

    insertTask: (previousTask, task, callbacks) ->
        index = @toArray().indexOf previousTask
        task.set("nextTask", previousTask.nextTask)
        task.set("previousTask", previousTask.id)
        task.collection = @
        task.save task.attributes,
            success: =>
                previousTask.set("nextTask", task.id)
                task.url = "tasks/#{task.id}/"
                @add task, { at: index, silent: true }
                @view.insertTask previousTask.view, task
                callbacks?.success(task)
            error: =>
                callbacks?.error

    # Return previous task, if there is no previous task, it returns null.
    getPreviousTask: (task) ->
        @get(task.previousTask)

    # Return next task, if there is no next task, it returns null.
    getNextTask: (task) ->
        @get(task.nextTask)

    # Return first previous task which state is todo
    getPreviousTodoTask: (task) ->
        task = @getPreviousTask task
        while task? and task.done
            task = @getPreviousTask task
        task

    # Return first next task which state is todo
    getNextTodoTask: (task) ->
        task = @getNextTask task
        while task? and task.done
            task = @getNextTask task
        task
        
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

        @remove(task)
        @add task,
            at: index - 1
            silent: true

        task.view.up(oldPreviousTask.id)

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

        @remove(task)
        @add task,
            at: index + 1
            silent: true

        task.view.down(oldNextTask.id)

        return true

    # Remove task from collection and delete it from backend.
    # Update previous and next links.
    removeTask: (task, callbacks) ->
        previousTask = @getPreviousTask task
        nextTask = @getNextTask task

        nextTask?.set("previousTask", previousTask?.id | null)
        previousTask?.set("nextTask", nextTask?.id | null)
        
        task.destroy
            success: ->
                task.view.remove()
                callbacks.success()
            error: callbacks.error

