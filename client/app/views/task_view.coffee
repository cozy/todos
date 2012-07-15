template = require "./templates/task"
{Task} = require "../models/task"
helpers = require "../helpers"

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
        @firstDel = false
        @isDeleting = false
        @list

    # Render wiew and bind it to model.
    render: ->
        template = require('./templates/task')
        $(@el).html template("model": @model)
        @el.id = @model.id
        @done() if @model.done

        @descriptionField = @.$(".description")
        @buttons = @.$(".task-buttons")
        @setListeners()

        # TODO check if edit mode is on before hiding
        @.$(".task-buttons").hide()
        @descriptionField.data 'before', @descriptionField.val()

        @el

    # Listen for description modification
    setListeners: ->
        @descriptionField.keypress (event) ->
            keyCode = event.which | event.keyCode
            keyCode != 13 and keyCode != 9

        @descriptionField.keyup (event) =>
            keyCode = event.which | event.keyCode
            if event.ctrlKey
                @onCtrlUpKeyup() if keyCode is 38
                @onCtrlDownKeyup() if keyCode is 40
                @onTodoButtonClicked() if keyCode is 32
            else
                @onUpKeyup() if keyCode is 38
                @onDownKeyup() if keyCode is 40
                @onEnterKeyup() if keyCode is 13
                @onBackspaceKeyup() if keyCode is 8
                @onDownKeyup() if keyCode is 9 and not event.shiftKey
                @onUpKeyup() if keyCode is 9 and event.shiftKey

        @descriptionField.bind 'blur paste beforeunload', (event) =>
            el = @descriptionField

            if el.data('before') != el.val() and not @isDeleting
                el.data 'before', el.val()
                @onDescriptionChanged event, event.which | event.keyCode
            return el

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
            @focusDescription()

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
    onDescriptionChanged: (event, keyCode) =>
        unless keyCode == 8 or @descriptionField.val().length == 0
            @saving = false
            @model.description = @descriptionField.val()
            @model.save { description: @model.description },
                success: ->
                error: ->
                    alert "An error occured, modifications were not saved."

    # Change focus to next task.
    onUpKeyup: ->
        @list.moveUpFocus @

    # Change focus to previous task.
    onDownKeyup: ->
        @list.moveDownFocus @

    # Move line on line above.
    onCtrlUpKeyup: ->
        @onUpButtonClicked()

    # Move line on line below.
    onCtrlDownKeyup: ->
        @onDownButtonClicked()

    # When enter key is up a new task is created below current one.
    onEnterKeyup: ->
        @model.collection.insertTask @model, \
             new Task(description: "new task"),
             success: (task) ->
                 helpers.selectAll(task.view.descriptionField)
             error: ->
                 alert "Saving failed, an error occured."

    # When backspace key is up, if field is empty, current task is deleted.
    onBackspaceKeyup: ->
        description = @descriptionField.val()
        if (description.length == 0 or description is " ") and @firstDel
            @isDeleting = true
            if @model.previousTask?
                @list.moveUpFocus @, maxPosition: true
            else if @model.nextTask?
                @list.moveDownFocus @, maxPosition: true
            @delTask()

        else if (description.length == 0 or description is " ") and not @firstDel
            @firstDel = true
        else
            @firstDel = false

            
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
        cursorPosition = @descriptionField.getCursorPosition()
        $(@el).insertBefore($("##{previousLineId}"))
        @descriptionField.setCursorPosition cursorPosition

    # Put line below line correspondig to nextLineId.
    down: (nextLineId) ->
        cursorPosition = @descriptionField.getCursorPosition()
        $(@el).insertAfter($("##{nextLineId}"))
        @descriptionField.setCursorPosition cursorPosition

    # Remove object from view and unbind listeners.
    remove: ->
        @unbind()
        $(@el).remove()

    # Put mouse focus on description field.
    focusDescription: ->
        @descriptionField.focus()
        helpers.selectAll @descriptionField

    # Delete task from collection and remove this field from view.
    delTask: (callback) ->
        @model.collection.removeTask @model,
            success: ->
                callback() if callback
            error: ->
                alert "An error occured, deletion was not saved."

    # Show buttons linked to task.
    showButtons: ->
        @buttons.show()

    # Hide buttons linked to task.
    hideButtons: ->
        @buttons.hide()
