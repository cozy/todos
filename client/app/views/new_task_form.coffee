{Task} = require "../models/task"

# Display todo list wrapper that contains todo task list and archive task list.
class exports.NewTaskForm extends Backbone.View

    constructor: (@taskList) ->
        super()

    initialize: ->

        # We cache the references to the relevant DOM objects
        @newTaskForm = $('.new-task')
        @newTaskFormButton = @newTaskForm.find "button.add-task"
        @newTaskFormInput = @newTaskForm.find ".description"

        @initializeForm()

        # whether the user has written something or not in the new task form
        @hasUserTyped = false

    initializeForm: ->
        @handleDefaultFormState()
        @inputHandler()

    # Form input behaviour management
    inputHandler: () ->
        @newTaskFormInput.keyup (event) =>
            @hasUserTyped = true
            @newTaskButtonHandler()

            keyCode = event.which | event.keyCode
            @taskCreationHandler event if keyCode is 13 # enter key
            @taskList.focusFirstTask() if keyCode is 40

        @newTaskFormInput.focus (event) =>
            @newTaskFormInput.val("") unless @hasUserTyped

        @newTaskFormInput.focusout (event) =>
            if @newTaskFormInput.val() is ""
                @clearNewTaskInput()
                @hasUserTyped = false

    clearNewTaskInput: () ->
        @newTaskButtonHandler()
        ##@newTaskFormInput.val "What do you have to do next ?"

    # "new task" Button behaviour management
    newTaskButtonHandler: () ->
        unless @hasUserTyped
            @newTaskFormButton.addClass 'disabled'
            @newTaskFormButton.html 'new'
            @newTaskFormButton.unbind 'click'
        else
            @newTaskFormButton.removeClass 'disabled'
            @newTaskFormButton.html 'add'
            @newTaskFormButton.unbind 'click'
            @newTaskFormButton.click @taskCreationHandler


    taskCreationHandler: (event) =>
        @newTaskFormButton.html '&nbsp;'
        @newTaskFormButton.spin 'tiny'
        @hasUserTyped = false

        task = new Task
            done: false
            description: @newTaskFormInput.val()

        @taskList.tasks.insertTask null, task,
            success: (data) =>
                @clearNewTaskInput()
                @newTaskFormButton.html 'new'
                @newTaskFormButton.spin()
                tags = task.extractTags()
                Backbone.Mediator.publish 'task:changed', tags
                @newTaskFormInput.focus()
            error: (data) =>
                @newTaskFormButton.html 'new'
                @newTaskFormButton.spin()

    handleDefaultFormState: ->
        if @taskList.todoListView.model?.get('id')?
            @showTaskForm()
        else
            @hideTaskForm()

    showTaskForm: (updatePreferences, mustFade) ->
        if mustFade? && mustFade
            @newTaskForm.fadeIn 1000
        else
            @newTaskForm.show()

    hideTaskForm: (updatePreferences, mustFade) ->
        if mustFade? && mustFade
            @newTaskForm.fadeOut 1000
        else
            @newTaskForm.hide()
