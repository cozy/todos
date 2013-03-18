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
        task.url = "#{@url}/#{task.id}/" if task.id?
        task.collection = @
        task.setPreviousTask @at(@length - 2) if @length > 1

        @view.addTaskLine task

    # Insert task at a given position, update links then save task to backend.
    # When previousTask is null, the task is inserted at the first place
    insertTask: (previousTask, task, callbacks) ->
        index = @toArray().indexOf previousTask

        if previousTask? and previousTask.get("nextTask")?
            nextTask = @at(index + 1)
            nextTask?.set "previousTask", task.id
        else if (firstTask = @at(0))?
            nextTask = firstTask
        else
            nextTask = null

        task.set "nextTask", nextTask
        task.setPreviousTask previousTask
        task.collection = @

        task.url = "#{@url}/"
        task.save task.attributes,
            success: =>
                task.url = "#{@url}/#{task.id}/"
                @add task, { at: (index + 1), silent: true }
                if previousTask?
                    @view.insertTask previousTask.view, task
                else
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

    reorder: (task, newIndex) ->
        index = @toArray().indexOf task

        oldPreviousTask = @getPreviousTask task
        oldNextTask = @getNextTask task

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

        newNextTask?.previousTask = task.id

        # avoid error in the index because we make a remove/add
        if index < newIndex
            newIndex--

        console.debug newIndex
        @remove task
        @add task,
            at: newIndex
            silent: true

        #console.debug @toArray()

        #return false

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
            success: =>
                task.view.remove()
                callbacks?.success()
            error: callbacks?.error
