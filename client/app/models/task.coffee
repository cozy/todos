BaseModel = require("./models").BaseModel

# Model that describes a single task.
class exports.Task extends BaseModel

    url: 'tasks/'

    # Copy note properties to current model.
    constructor: (task) ->
        super()
        for property of task
            @[property] = task[property]
