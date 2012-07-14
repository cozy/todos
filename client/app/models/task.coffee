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


    # View binding: when task state is set to done, update view.
    setDone: ->
        @done = true
        @set "previousTask", null
        @set "nextTask", null
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
            @set "nextTask", firstTask.id
            firstTask.set "firstTask", @id
        else
            previousTask = @collection.getPreviousTodoTask @
            nextTask = @collection.getNextTodoTask @

            if previousTask?
                @set "previousTask", previousTask.id
                previousTask.set "nextTask", @id
            else
                @set "previousTask", null

            if nextTask?
                @set "nextTask", nextTask.id
                nextTask.set "previousTask", @id
            else
                @set "nextTask", null


    # Remove link from previous and next task.
    cleanLinks: ->
        previousTask = @collection.getPreviousTask @
        nextTask = @collection.getNextTask @
        if nextTask? and previousTask?
            previousTask.set "nextTask", nextTask.id
            nextTask.set "previousTask", previousTask.id
        else if previousTask?
            previousTask.set "nextTask", null
        else if nextTask?
            nextTask.set "previousTask", null
        @set "previousTask", null
        @set "nextTask", null



