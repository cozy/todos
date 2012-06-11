template = require('./templates/task')

# Row displaying task status and description
class exports.TaskLine extends Backbone.View
    className: "task clearfix"
    tagName: "div"

    events:
        "click .todo-button": "onTodoButtonClicked"
        "click .del-task-button": "onDelButtonClicked"
        "keyup span": "onDescriptionChanged"

    ### 
    # Initializers 
    ###

    constructor: (@model) ->
        super()

        @saving = false
        @id = @model._id
        @model.view = @

    render: ->
        template = require('./templates/task')
        $(@el).html template("model": @model)
        @el.id = @model.id
        @done() if @model.done

        @setListeners()

        # TODO check if edit mode is on before hiding
        @.$(".task-buttons").hide()

        @el

    setListeners: ->
        @.$("span.description").keypress (event) ->
            return event.which != 13

        @.$("span.description").live 'blur keyup paste', (event) ->
            el = $(@)

            if el.data('before') isnt el.html()
                el.data 'before', el.html()
                el.trigger('change', event.which)
            return el
        @.$("span.description").bind "change", @onDescriptionChanged

    ###
    # Listeners
    ###

    # On todo button clicked, update task state and send modifications to 
    # backend.
    # TODO: display indicator to say that it is saving.
    onTodoButtonClicked: (event) =>
        if @model.done then @model.setUndone() else @model.setDone()
        @model.save { done: @model.done },
            success: ->
            error: ->
                alert "An error occured, modifications were not saved."

    # On delete clicked, send delete request to server then remove task line
    # from DOM.
    # TODO: display indicator to say that it is saving.
    onDelButtonClicked: (event) =>
        @model.destroy
            success: =>
                @remove()
            error: ->
                alert "An error occured, deletion was not saved."

    # When description is changed, model is saved to backend after 2 seconds
    # to avoid making too much requests.
    # TODO : force saving when window is closed.
    onDescriptionChanged: (event, keyCode) =>
        if keyCode == 13
            event.preventDefault()
        else if not @saving
            @saving = true
            setTimeout(
                =>
                    @saving = false
                    @model.description = @.$("span.description").html()
                    @model.save { description: @model.description },
                        success: ->
                        error: ->
                            alert "An error occured, modifications were not saved."
                , 2000)

    ###
    # Functions
    ###

    # Change styles and text to display done state.
    done: ->
        @.$(".todo-button").html "done"
        @.$(".todo-button").addClass "disabled"
        @.$(".todo-button").removeClass "btn-info"
        $(@el).addClass "done"

    # Change styles and text to display todo state.
    undone: ->
        @.$(".todo-button").html "todo"
        @.$(".todo-button").removeClass "disabled"
        @.$(".todo-button").addClass "btn-info"
        $(@el).removeClass "done"

    remove: ->
        @unbind()
        $(@el).remove()

