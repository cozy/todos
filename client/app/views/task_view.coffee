template = require('./templates/task')
{Task} = require('../models/task')

# Row displaying task status and description
class exports.TaskLine extends Backbone.View
    className: "task clearfix"
    tagName: "div"

    events:
        "click .todo-button": "onTodoButtonClicked"
        "click .del-task-button": "onDelButtonClicked"
        "click .up-task-button": "onUpButtonClicked"
        "click .down-task-button": "onDownButtonClicked"

    ### 
    # Initializers 
    ###

    constructor: (@model, @list) ->
        super()

        @saving = false
        @id = @model._id
        @model.view = @
        @list

    # Render wiew and bind it to model.
    render: ->
        template = require('./templates/task')
        $(@el).html template("model": @model)
        @el.id = @model.id
        @done() if @model.done

        @setListeners()

        # TODO check if edit mode is on before hiding
        @.$(".task-buttons").hide()
        @.$("span.description").data 'before', @.$("span.description").html()

        @el

    # Listen for description modification
    setListeners: ->
        @.$("span.description").keypress (event) ->
            keyCode = event.which | event.keyCode
            keyCode != 13 and keyCode != 38 and keyCode != 40

        @.$("span.description").keyup (event) =>
            keyCode = event.which | event.keyCode
            if event.ctrlKey
                @onCtrlUpKeyup() if event.which is 38
                @onCtrlDownKeyup() if event.which is 40
            else
                @onUpKeyup() if event.which is 38
                @onDownKeyup() if event.which is 40
                @onEnterKeyup() if event.which is 13
                @onBackspaceKeyup() if event.which is 8

        @.$("span.description").live 'blur paste', (event) ->
            el = $(@)

            if el.data('before') != el.html()
                el.data 'before', el.html()
                el.trigger('change', event.which | event.keyCode)
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
        @delTask()

    # Move line to one row up by modifying model collection.
    onUpButtonClicked: (event) =>
        if not @model.done and @model.collection.up @model
            $("##{@model.id} span.description").focus()

            @model.save
                success: ->
                error: ->
                    alert "An error occured, modifications were not saved."

    # Move line to one row down by modifying model collection.
    onDownButtonClicked: (event) =>
        if not @model.done and @model.collection.down @model
            @model.save
                success: ->
                error: ->
                    alert "An error occured, modifications were not saved."

    # When description is changed, model is saved to backend after 2 seconds
    # to avoid making too much requests.
    # TODO : force saving when window is closed.
    onDescriptionChanged: (event, keyCode) =>
        
        unless keyCode == 8 and @.$("span.description").html().length == 0
            @saving = false
            @model.description = @.$("span.description").html()
            @model.save { description: @model.description },
                success: ->
                error: ->
                    alert "An error occured, modifications were not saved."

        if not @saving
            @saving = true
            setTimeout saveDescription, 2000

    # Change focus to next task.
    onUpKeyup: ->
        @list.moveUpFocus @

    # Change focus to previous task.
    onDownKeyup: ->
        @list.moveDownFocus @

    # Move line on line above.
    onCtrlUpKeyup: ->
        @onUpButtonClicked()
        $("##{@model.id} span.description").focus()

    # Move line on line below.
    onCtrlDownKeyup: ->
        @onDownButtonClicked()
        @.$("span.description").focus()

    onEnterKeyup: ->
        @model.collection.insertTask @.model, new Task(description: "new task")

    onBackspaceKeyup: ->
        description = @.$("span.description").html()
        if description.length == 0 or description is " "
            @list.moveUpFocus @
            @delTask()

            
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

    # Put line above line correspondig to previousLineId.
    up: (previousLineId) ->
        $(@el).insertBefore($("##{previousLineId}"))

    # Put line below line correspondig to nextLineId.
    down: (nextLineId) ->
        $(@el).insertAfter($("##{nextLineId}"))

    # Remove object from view and unbind listeners.
    remove: ->
        @unbind()
        $(@el).remove()

    focusDescription: ->
        @.$("span.description").focus()

    delTask: ->
        @model.collection.removeTask @model,
            success: ->
            error: ->
                alert "An error occured, deletion was not saved."

