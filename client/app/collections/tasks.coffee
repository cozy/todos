{Task} = require "../models/task"


class exports.TaskCollection extends Backbone.Collection

    model: Task

    constructor: (@view, @listId, @options) ->
        super(id: @listId, @options)

        @url = "todolists/#{@listId}/tasks/"

        @bind "add", @onTaskAdded
        @bind "reset", @onReset

    # Select which field from backend response to use for parsing to populate
    # collection.
    parse: (response) ->
        response.rows

    # View binding : for each task added, it appends a task line to task list.
    onReset: (tasks) =>
        previousTask = null
        tasks.forEach (task) =>
            task.collection = @
            task.setPreviousTask previousTask if previousTask?
            previousTask = task

            if @options?.grouping
                if @lastTask?.simpleDate != task.simpleDate
                    @view.addDateLine task.simpleDate
                @lastTask = task
            @view.addTaskLine task

        @lastTask = null

    # Prepend a task to the task list and update previousTask field of
    # previous first task.
    onTaskAdded: (task) =>
        task.setPreviousTask @at(@length - 2) if @length > 1

        @view.addTaskLine task

    # Insert task at a given position, update links then save task to backend.
    # When previousTask is null, the task is inserted at the first place
    insertTask: (previousTask, task, callbacks) ->
        index = @toArray().indexOf previousTask

        nextTask = null
        if previousTask? and index > -1 and index < @length - 1
            nextTask = @at(index + 1)
            nextTask?.set "previousTask", task.id
        else
            firstTask = @at 0
            nextTask = firstTask if firstTask?

        task.set "list", @listId
        task.set "nextTask", nextTask.id if nextTask?
        if previousTask?
            task.set "previousTask", previousTask.id
        else
            task.set "previousTask", null

        @socketListener.watchOne(task)
        task.save task.attributes,
            ignoreMySocketNotification: true
            success: (data) =>
                previousTask?.set "nextTask", task.id
                nextTask?.set "previousTask", task.id

                if previousTask?
                    @add task, { at: (index + 1), silent: true }
                    if @view?
                        @view.insertTask previousTask.view, task
                else
                    @add task, { at: 0, silent: true }
                    if @view?
                        @view.insertTask null, task

                callbacks?.success(task)
            error: =>
                callbacks?.error
                # should make a rollback...

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

    reorder: (task, newIndex) ->
        index = @toArray().indexOf task

        oldPreviousTask = @getPreviousTask task
        console.log task
        oldNextTask = @getNextTask task
        console.log @
        console.log oldNextTask

        if oldPreviousTask?
            oldPreviousTask.setNextTask(oldNextTask)
        else
            oldNextTask.setPreviousTask(oldPreviousTask)

        newPreviousTask = null
        if newIndex > 0
            newPreviousTask = @at(newIndex - 1)

        if newIndex >= @length
            newNextTask = null
        else
            newNextTask = @at(newIndex)

        task.setPreviousTask newPreviousTask
        task.setNextTask newNextTask

        # avoid error in the index because we make a remove/add
        if index < newIndex
            newIndex--

        @remove task
        @add task,
            at: newIndex
            silent: true

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
            ignoreMySocketNotification: true
            success: =>
                task.view.remove()
                callbacks?.success()
            error: callbacks?.error
