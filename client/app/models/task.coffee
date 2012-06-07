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
        @view.done()

    # View binding: when task state is set to todo, update view.
    setUndone: ->
        @done = false
        @view.undone()
