template = require('./templates/task')

# Row displaying task status and description
class exports.TaskLine extends Backbone.View
    className: "task clearfix"
    tagName: "div"

    events:
        "click button": "onButtonClicked"

    ### Constructor ####

    constructor: (@model) ->
        super()

        @id = @model._id
        @model.view = @

    onButtonClicked: (event) =>
        if @model.done then @model.setUndone() else @model.setDone()
        @model.save { done: @model.done },
            success: ->
            error: ->
                alert "An error occured, modification was not saved."

    done: ->
        @.$("button").html "done"
        @.$("button").addClass "disabled"
        @.$("button").removeClass "btn-info"
        $(@el).addClass "done"

    undone: ->
        @.$("button").html "todo"
        @.$("button").removeClass "disabled"
        @.$("button").addClass "btn-info"
        $(@el).removeClass "done"

    remove: ->
        $(@el).remove()

    render: ->
        $(@el).html require('./templates/task')
        if @model.done
            @done()

        @el

