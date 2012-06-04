template = require('./templates/task')

# Row displaying application name and attributes
class exports.TaskLine extends Backbone.View
    className: "task clearfix"
    tagName: "div"

    ### Constructor ####

    constructor: (@model) ->
        super()

        @id = @model.slug
        @model.view = @

    remove: ->
        $(@el).remove()

    render: ->
        $(@el).html require('./templates/task')
        @el

