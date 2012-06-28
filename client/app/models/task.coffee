BaseModel = require("./models").BaseModel


class exports.Task extends BaseModel

    url: 'tasks/'

    # Copy note properties to current model.
    constructor: (task) ->
        super(task)
        for property of task
            @[property] = task[property]
        if @id
            @url = "tasks/#{@id}/"

        if not task.description? or task.description.length is 0 or task.description is " "  or task.description is "   " or task.description is "  "
            @["description"] = "empty task"

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



