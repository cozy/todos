BaseModel = require("./models").BaseModel

# Model that describes a single task.
class exports.Task extends BaseModel

    url: 'tasks/'

    # Copy note properties to current model.
    constructor: (task) ->
        super()
        for property of task
            @[property] = task[property]
        if @id
            @url = "tasks/#{@id}/"

    setDone: ->
        @done = true
        @view.done()

    setUndone: ->
        @done = false
        @view.undone()
