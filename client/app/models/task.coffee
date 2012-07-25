BaseModel = require("./models").BaseModel

# Define a task inside a todo list.
class exports.Task extends BaseModel

    # Copy task properties to current model.
    constructor: (task) ->
        super(task)
        for property of task
            @[property] = task[property]
        if @id
            @url = "/todolists/#{task.list}/tasks/#{@id}/"
        else
            @url = "/todolists/#{task.list}/tasks/"
        
        @setSimpleDate task.completionDate

    # Format completionDate into a simple format. Store in simpleDate field.
    setSimpleDate: (date) ->
        if date?
            dateWrapper = moment new Date(date)
        else
            dateWrapper = moment new Date()

        @simpleDate = dateWrapper.format "DD/MM/YYYY"

    setNextTask: (task) ->
        if task?
            @set "nextTask", task.id
        else
            @set "nextTask", null

    setPreviousTask: (task) ->
        if task?
            @set "previousTask", task.id
        else
            @set "previousTask", null

    # View binding: when task state is set to done, update view.
    setDone: ->
        @done = true
        @setSimpleDate()
        @cleanLinks()
        @view.done()

    # View binding: when task state is set to todo, update view.
    setUndone: ->
        @done = false
        @setLink()
        @view.undone()

    # Set links with other task when task state becomes todo again.
    # If task is in archive section, it is put as first task of current
    # todo list.
    # If task is still in current todo list, its link are built again. It
    # looks for the first previous task of which state is todo and link it
    # to current task. Then it does the same with first next task of which
    # state is todo.
    setLink: ->
        if @collection.view.isArchive()
            @view.remove()
            @collection.view.moveToTaskList @
            firstTask = @collection.at 0
            @setNextTask firstTask
            firstTask.setPreviousTask @
        else
            previousTask = @collection.getPreviousTodoTask @
            nextTask = @collection.getNextTodoTask @

            if previousTask?
                @setPreviousTask previousTask
                previousTask.setNextTask @
            else
                @setPreviousTask null

            if nextTask?
                @setNextTask nextTask
                nextTask.setPreviousTask @
            else
                @setNextTask null


    # Remove link from previous and next task.
    cleanLinks: ->
        previousTask = @collection.getPreviousTask @
        nextTask = @collection.getNextTask @
        if nextTask? and previousTask?
            previousTask.setNextTask nextTask
            nextTask.setPreviousTask previousTask
        else if previousTask?
        else if nextTask?
            previousTask.setNextTask null
            nextTask.setPreviousTask null

        @setPreviousTask null
        @setNextTask null
