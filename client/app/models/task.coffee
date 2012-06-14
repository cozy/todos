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

    # TODO
    setLink: ->
        #if @collection.view.id() == "archive-list"


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



