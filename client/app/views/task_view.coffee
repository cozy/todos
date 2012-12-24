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

        @.$(".task-buttons").hide()
        @descriptionField.data 'before', @descriptionField.val()
        @todoButton = @$(".todo-button")

        @todoButton.hover =>
            if @model.done
                @todoButton.html("todo?")
            else
                @todoButton.html("done?")
        @todoButton.mouseout =>
            if @model.done
                @todoButton.html("done")
            else
                @todoButton.html("todo")
        @el

    # Listen for description modification
    setListeners: ->
        # Do nothing when tab or enter is pressed.
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
    onTodoButtonClicked: (event) =>
        @showLoading()
        @model.url = "todolists/#{@model.list}/tasks/#{@model.id}"
        @model.done = not @model.done

        @model.save { done: @model.done },
            success: =>
                @hideLoading()
                if not @model.done
                    @model.setUndone()
                else
                    @model.setDone()

            error: =>
                alert "An error occured, modifications were not saved."
                @hideLoading()

    # On delete clicked, send delete request to server then remove task line
    # from DOM.
    onDelButtonClicked: (event) =>
        @delTask()

    # Move line to one row up by modifying model collection.
    onUpButtonClicked: (event) =>
        persistUp = =>
            @focusDescription()
            @showLoading()
            @model.save null,
                success: =>
                    @todoButton = @$(".todo-button")
                    @hideLoading()
                    @saving = false
                error: =>
                    @todoButton = @$(".todo-button")
                    alert "An error occured, modifications were not saved."
                    @hideLoading()
                    @saving = false

        if not @saving
            @saving = true
            isUp = @model.collection.up @model
            if @model.collection.listId? and not @model.done and isUp
                persistUp()


    # Move line to one row down by modifying model collection.
    onDownButtonClicked: (event) =>
        persistDown = =>
            @showLoading()
            @model.save null,
                success: =>
                    @todoButton = @$(".todo-button")
                    @hideLoading()
                    @saving = false
                error: =>
                    @todoButton = @$(".todo-button")
                    alert "An error occured, modifications were not saved."
                    @hideLoading()
                    @saving = false
                
        if not @saving
            @saving = true
            isDown = @model.collection.down @model
            if @model.collection.listId? and not @model.done and isDown
                persistDown()


    # When description is changed, model is saved to backend.
    onDescriptionChanged: (event, keyCode) =>
        unless keyCode == 8 or @descriptionField.val().length == 0
            @saving = true
            @model.description = @descriptionField.val()
            @showLoading()
            @model.save { description: @model.description },
                success: =>
                    tags = helpers.extractTags(@model.description)
                    Backbone.Mediator.publish 'task:changed', tags
                    @model.set 'tags', tags
                    @hideLoading()
                    @saving = false
                error: =>
                    alert "An error occured, modifications were not saved."
                    @hideLoading()
                    @saving = false

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
        if @model.collection.listId?
            @showLoading()
            task = new Task
                description: "new task"
                list: @model.collection.listId

            @model.collection.insertTask @model, task,
                 success: (task) =>
                     helpers.selectAll task.view.descriptionField
                     @hideLoading()
                 error: =>
                     alert "Saving failed, an error occured."
                     @hideLoading()

    # When backspace key is up, if field is empty, current task is deleted.
    onBackspaceKeyup: ->
        description = @descriptionField.val()
        if description.length == 0 and @firstDel
            @isDeleting = true

            if @list.$("##{@model.id}").prev().find(".description").length
                @list.moveUpFocus @, maxPosition: true
            else
                @list.moveDownFocus @, maxPosition: true

            @delTask()

        else if description.length == 0 and not @firstDel
            @firstDel = true
        else
            @firstDel = false

            
    ###
    # Functions
    ###

    # Change styles and text to display done state.
    done: ->
        @.$(".todo-button").html "done"
        @.$(".todo-button").removeClass "btn-info"
        $(@el).addClass "done"

    # Change styles and text to display todo state.
    undone: ->
        @.$(".todo-button").html "todo"
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
        @showLoading()
        @model.collection.removeTask @model,
            success: =>
                callback() if callback
                @hideLoading()
            error: =>
                alert "An error occured, deletion was not saved."
                @hideLoading()

    # Show buttons linked to task.
    showButtons: ->
        @buttons.show()

    # Hide buttons linked to task.
    hideButtons: ->
        @buttons.hide()

    # Display loading indicator inside todo/done button and hide button text.
    showLoading: ->
        @todoButton.html "&nbsp;"
        @todoButton.spin "tiny"

    # Hide loading indicator and restore button text.
    hideLoading: ->
        @todoButton.spin()
        if @model.done then @todoButton.html "done" else @todoButton.html "todo"
