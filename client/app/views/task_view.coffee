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
        "click .task-infos a": "onListLinkClicked"
        "dragstart": "onDragStart"
        "dragover": "onDragOver"
        "drop": "onDrop"
        "dragend": "onDragEnd"
        "hover": "onMouseOver"

    ###
    # Initializers
    ###

    ###
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
        template = require './templates/task'
        $(@el).html template(model: @model)
        @el.id = @model.id
        @done() if @model.done

        @descriptionField = @$ ".description"
        @buttons = @$ ".task-buttons"
        @setListeners()

        @$(".task-buttons").hide()
        @descriptionField.data 'before', @descriptionField.val()
        @todoButton = @$ ".todo-button"

        @todoButton.hover =>
            if @model.done
                @todoButton.html "todo?"
            else
                @todoButton.html "done?"
        @todoButton.mouseout =>
            if @model.done
                @todoButton.html "done"
            else
                @todoButton.html "todo"

        if not @list.tasks.listId?
            @$el.unbind 'dragstart'
            @$el.unbind 'dragover'
            @$el.unbind 'drop'
            @$el.unbind 'dragend'
            @$el.unbind 'hover'
        else
            @$(".handle").prop 'draggable', true

        @$('.handle').tooltip
            placement: "left"
            title: "You can sort the tasks by dragging and dropping them. " + \
                   "Hint: if you press shift, you can move a task " + \
                   "to another list."

        @el

    ###
        Drag'n'Drop management
    ###

    onDragStart: (event) ->
        @$el.css 'opacity', '0.4'

        event.originalEvent.dataTransfer.effectAllowed = 'all'
        @list.draggedItem = @

        # mandatory to firefox
        event.originalEvent.dataTransfer.setData 'text/plain', @model.id

    onDragOver: (event) ->
        event.preventDefault() if event.preventDefault
        event.originalEvent.dataTransfer.dropEffect = 'move'
        $('.separator').css 'visibility', 'hidden'
        index = @list.$el.children().index @$el

        pageY = event.originalEvent.pageY
        targetOffsetTop = event.target.offsetTop
        offsetY = event.originalEvent.offsetY
        y = pageY - targetOffsetTop | offsetY
        limit = @$el.height() / 2

        if y <= limit
            $(@list.$el.children()[index - 1]).css 'visibility', 'visible'
        else
            $(@list.$el.children()[index + 1]).css 'visibility', 'visible'

        return false

    onDrop: (event) ->
        event.stopPropagation() if event.stopPropagation

        pageY = event.originalEvent.pageY
        targetOffsetTop = event.target.offsetTop
        offsetY = event.originalEvent.offsetY
        y = pageY - targetOffsetTop | offsetY
        limit = @$el.height() / 2

        index = @list.$el.children('.task').index @$el
        newIndex = index
        if y > limit
            newIndex = index + 1

            nextTask = $(@list.$el.children('.task')[index + 1])
            nextTaskID = nextTask?.prop 'id'
        else
            previousTask = $(@list.$el.children('.task')[index - 1])
            previousTaskID = previousTask?.prop 'id'

        draggedItemID = @list.draggedItem.model.id
        condition = (nextTaskID? and nextTaskID is draggedItemID) or
                    (previousTaskID? and previousTaskID is draggedItemID)

        unless draggedItemID is @model.id or condition
            @onReorder @list.draggedItem, newIndex

        return false

    onDragEnd: (event) ->
        $('.separator').css 'visibility', 'hidden'
        @$el.css 'opacity', '1'
        @list.draggedItem = null

    onReorder: (draggedItem, newIndex) ->
        if not @list.isSaving
            isReordered = @model.collection.reorder draggedItem.model, newIndex

            if @model.collection.listId? and isReordered
                @list.isSaving = true
                draggedItem.saving = true
                draggedItem.showLoading()
                childrenTasks = @list.$el.children('.task')
                oldIndex = childrenTasks.index(draggedItem.$el)
                children = @list.$el.children()
                index = children.index(draggedItem.$el)
                separator = children.eq(index + 1)

                if newIndex >= childrenTasks.length
                    @list.$el.append(draggedItem.$el)
                else
                    childrenTasks.eq(newIndex).before(draggedItem.$el)
                separator.insertAfter(draggedItem.$el)
                draggedItem.descriptionField.focus()

                draggedItem.model.save null,
                success: =>
                    @list.isSaving = false
                    draggedItem.saving = false
                    draggedItem.hideLoading()
                error: =>
                    console.log "An error while saving the task."
                    @list.isSaving = false
                    draggedItem.saving = false
                    draggedItem.hideLoading()


    # Listen for description modification
    setListeners: ->
        # Do nothing when tab or enter is pressed.
        @descriptionField.keypress (event) ->
            keyCode = event.which | event.keyCode
            keyCode isnt 13 and keyCode isnt 9

        # to detect the "CMD" key on OSX
        @descriptionField.keydown (event) =>
            keyCode = event.which | event.keyCode

            @onCtrlUpKeyup() if keyCode is 38 and event.metaKey
            @onCtrlDownKeyup() if keyCode is 40 and event.metaKey

        @descriptionField.keyup (event) =>
            keyCode = event.which | event.keyCode
            if event.ctrlKey
                @onCtrlUpKeyup() if keyCode is 38
                @onCtrlDownKeyup() if keyCode is 40
                @onTodoButtonClicked() if keyCode is 32
            else
                @onUpKeyup() if keyCode is 38
                @onDownKeyup() if keyCode is 40
                @onEnterKeyup(event.shiftKey) if keyCode is 13
                @onBackspaceKeyup() if keyCode is 8
                @onDownKeyup() if keyCode is 9 and not event.shiftKey
                @onUpKeyup() if keyCode is 9 and event.shiftKey

        @descriptionField.bind 'blur paste beforeunload', (event) =>
            el = @descriptionField

            if el.data('before') != el.val() and not @isDeleting and not @saving
                el.data 'before', el.val()
                @onDescriptionChanged event, event.which | event.keyCode
            return el

    ###
    # Listeners
    ###

    onMouseOver: (event) ->
        if event.type is 'mouseenter'
            @$el.children('.description').addClass('hovered')
        else
            @$el.children('.description').removeClass('hovered')

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
        @onDescriptionChanged null, -1,
            success: =>
                newIndex = (@list.$el.children('.task').index @$el) - 1
                @onReorder @, newIndex if newIndex? and newIndex >= 0

    # Move line to one row down by modifying model collection.
    onDownButtonClicked: (event) =>
        @onDescriptionChanged null, -1,
            success: =>
                tasks = @list.$el.children('.task')
                taskListLength = tasks.length
                newIndex = (tasks.index @$el) + 2
                @onReorder @, newIndex if newIndex? and \
                                          newIndex <= taskListLength

    # When description is changed, model is saved to backend.
    onDescriptionChanged: (event, keyCode, callback) =>
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
                    callback?.success()
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
    onEnterKeyup: (isShiftKeyPressed) ->
        if @model.collection.listId?
            @showLoading()
            task = new Task
                description: "new task"
                list: @model.collection.listId

            if isShiftKeyPressed
                insertAfter = @model.collection.getPreviousTask(@model)
            else
                insertAfter = @model

            @model.collection.insertTask insertAfter, task,
                 success: (task) =>
                     helpers.selectAll task.view.descriptionField
                     @hideLoading()
                 error: =>
                     alert "Saving failed, an error occured."
                     @hideLoading()

    # When backspace key is up, if field is empty, current task is deleted.
    onBackspaceKeyup: ->
        description = @descriptionField.val()
        if description.length is 0 and @firstDel
            @isDeleting = true

            if @list.$("##{@model.id}").prev().find(".description").length
                @list.moveUpFocus @, maxPosition: true
            else
                @list.moveDownFocus @, maxPosition: true

            @delTask()

        else if description.length is 0 and not @firstDel
            @firstDel = true
        else
            @firstDel = false

    onListLinkClicked: (event) ->
        window.app.router.navigate @model.listPath, true
        event.preventDefault()


    ###
    # Functions
    ###

    # Change styles and text to display done state.
    done: ->
        @$(".todo-button").html "done"
        @$(".todo-button").removeClass "btn-info"
        @$el.addClass "done"

    # Change styles and text to display todo state.
    undone: ->
        @.$(".todo-button").html "todo"
        @.$(".todo-button").addClass "btn-info"
        $(@el).removeClass "done"

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
