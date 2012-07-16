{Task} = require "../models/task"


class exports.TaskCollection extends Backbone.Collection
    
    model: Task
    url: 'tasks/'

    constructor: (@view, @listId) ->
        super()
       
        @url = "todolists/#{@listId}/tasks"
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
        task.url = "#{@url}/#{task.id}/"
        task.collection = @
        nextTask = @at(0)
        if nextTask?
            nextTask.setPreviousTask task
            task.setNextTask nextTask
        @view.addTaskLineAsFirstRow task

    # Insert task at a given position, update links then save task to backend.
    insertTask: (previousTask, task, callbacks) ->
        index = @toArray().indexOf previousTask
        task.set "nextTask", previousTask.nextTask
        task.setPreviousTask previousTask
        task.collection = @
        task.url = "#{@url}/"
        task.save task.attributes,
            success: =>
                previousTask.setNextTask task
                task.url = "#{@url}/#{task.id}/"
                @add task, { at: index, silent: true }
                @view.insertTask previousTask.view, task
                callbacks?.success(task)
            error: =>
                callbacks?.error

    # Return previous task, if there is no previous task, it returns null.
    getPreviousTask: (task) ->
        @get(task.get "previousTask")

    # Return next task, if there is no next task, it returns null.
    getNextTask: (task) ->
        @get(task.get "nextTask")

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
        return false if index == 0

        oldPreviousTask = @at(index - 1) if index > 0
        oldNextTask = @at(index + 1)
        newPreviousTask = @at(index - 2) if index > 1

        if oldNextTask?
            oldNextTask.setPreviousTask oldPreviousTask
            oldPreviousTask.setNextTask oldNextTask
        else
            oldPreviousTask.setNextTask null

        if newPreviousTask?
            newPreviousTask.setNextTask task
            task.setPreviousTask newPreviousTask
        else
            task.setPreviousTask null
        task.setNextTask oldPreviousTask

        @remove task
        @add task,
            at: index - 1
            silent: true

        task.view.up oldPreviousTask.id

        return true

    # Change task position, increment its index position.
    # Links are updated.
    # View is changed too.
    down: (task) =>
        index = @toArray().indexOf task
        tasksLength = @size()
    
        return false if index == tasksLength - 1

        oldNextTask = @at(index + 1) if index < tasksLength - 1
        newNextTask = @at(index + 2) if index < tasksLength - 2
        oldPreviousTask = @at(index - 1) if index > 0

        if oldPreviousTask?
            oldPreviousTask.setNextTask oldNextTask
            oldNextTask?.setPreviousTask oldPreviousTask
        else
            oldNextTask?.setPreviousTask null

        if newNextTask?
            newNextTask.setPreviousTask task
            task.setNextTask newNextTask
        else
            task.setNextTask null
        task.setPreviousTask oldNextTask

        @remove task
        @add task,
            at: index + 1
            silent: true

        task.view.down oldNextTask.id

        return true

    # Remove task from collection and delete it from backend.
    # Update previous and next links.
    removeTask: (task, callbacks) ->
        previousTask = @getPreviousTask task
        nextTask = @getNextTask task

        nextTask?.setPreviousTask previousTask | null
        previousTask?.setNextTask nextTask | null
        
        task.destroy
            success: ->
                task.view.remove()
                callbacks?.success()
            error: callbacks?.error

