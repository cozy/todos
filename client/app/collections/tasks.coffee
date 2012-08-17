{Task} = require "../models/task"


class exports.TaskCollection extends Backbone.Collection
    
    model: Task
    url: 'tasks/'

    constructor: (@view, @listId, @options) ->
        super()
       
        @url = "todolists/#{@listId}/tasks"
        @bind "add", @onTaskAdded
        @bind "reset", @onReset

    # Select which field from backend response to use for parsing to populate
    # collection.
    parse: (response) ->
        response.rows

    # View binding : for each task added, it appends a task line to task list.
    onReset: (tasks) =>
        previousTask = @at @length - 1 if @length > 0
        tasks.forEach (task) =>
            task.collection = @
            task.setPreviousTask previousTask if previousTask?

            if @options?.grouping
                if @lastTask?.simpleDate != task.simpleDate
                    @view.addDateLine task.simpleDate
                @lastTask = task
            @view.addTaskLine task

            previousTask = task
        @lastTask = null

    # Prepend a task to the task list and update previousTask field of 
    # previous first task.
    onTaskAdded: (task) =>
        task.url = "#{@url}/#{task.id}/" if task.id?
        task.collection = @
        task.setPreviousTask @at(@length - 2) if @length > 1
        
        @view.addTaskLine task

    # Insert task at a given position, update links then save task to backend.
    insertTask: (previousTask, task, callbacks) ->
        index = @toArray().indexOf previousTask
        task.set "nextTask", previousTask.nextTask
        task.setPreviousTask previousTask
        task.collection = @

        task.url = "#{@url}/"
        task.save task.attributes,
            success: =>
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
        index = @indexOf task
        if index > 0
            index--
            task = @at index
            while task?.done and index > 0
                index--
                task = @at index
            task
        else
            null

    # Return first next task which state is todo
    getNextTodoTask: (task) ->
        index = @indexOf task
        if index < @length - 2
            index++
            task = @at index
            while task?.done and index < @length - 2
                index++
                task = @at index
            task
        else
            null
        
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

        if previousTask
            nextTask?.setPreviousTask previousTask
        else
            nextTask?.setPreviousTask null
        if nextTask
            previousTask?.setNextTask nextTask
        else
            previousTask?.setNextTask null
        
        task.destroy
            success: ->
                task.view.remove()
                callbacks?.success()
            error: callbacks?.error

