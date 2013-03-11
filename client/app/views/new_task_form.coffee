{Task} = require "../models/task"

# Display todo list wrapper that contains todo task list and archive task list.
class exports.NewTaskForm extends Backbone.View

    constructor: (@taskList) ->
        super()

    initialize: ->

        # We cache the references to the relevant DOM objects
        @newTaskForm = $('.new-task')
        @newTaskFormButton = @newTaskForm.find("button.add-task")
        @newTaskFormInput = @newTaskForm.find(".description")
        @toggleButton = $('button.toggle-task-form')

        # When the list is loaded we start the mangement
        @taskList.tasks.on 'reset', (collection) =>
            @initializeForm()

        # If the list is empty, we need to show the form
        @taskList.tasks.on 'remove', (collection) =>
            @toggleTaskForm(false, true)

        # whether the user has written something or not in the new task form
        @hasUserTyped = false

    initializeForm: () ->

        # if we are in a tag list, we don't show the form
        if !@taskList.tasks.listId?
            @toggleButton.hide()
            return

        # Show the button if we are not in the tag list
        @toggleButton.fadeTo(1000, 1)
        @toggleButton.tooltip({placement: 'bottom'}) # shortcut's tooltip

        @initializeShortcut()
        @handleDefaultFormState()
        @inputHandler()

    ###
        Input handling
    ###

    # Form input behaviour management
    inputHandler: () ->

        @newTaskFormInput.keyup (event) =>
            @hasUserTyped = true
            @newTaskButtonHandler()

            keyCode = event.which | event.keyCode
            @taskCreationHandler(event) if(keyCode is 13) # enter key

        @newTaskFormInput.focus (event) =>
            if !@hasUserTyped
                @newTaskFormInput.val("")

        @newTaskFormInput.focusout (event) =>
            if @newTaskFormInput.val() is ""
                @clearNewTaskInput()
                @hasUserTyped = false

    clearNewTaskInput: () ->
        @newTaskButtonHandler()
        @newTaskFormInput.val "What do you have to do next ?"

    # "new task" Button behaviour management
    newTaskButtonHandler: () ->
        if !@hasUserTyped || !@newTaskFormInput.val()
            @newTaskFormButton.addClass 'disabled'
            @newTaskFormButton.html 'new'
            @newTaskFormButton.unbind 'click'
        else
            @newTaskFormButton.removeClass 'disabled'
            @newTaskFormButton.html 'add'
            @newTaskFormButton.unbind 'click'
            @newTaskFormButton.click(@taskCreationHandler)


    taskCreationHandler: (event) =>
        @newTaskFormButton.html('&nbsp;')
        @newTaskFormButton.spin('tiny')
        @hasUserTyped = false

        task = new Task
            done: false
            description: @newTaskFormInput.val()

        @taskList.tasks.insertTask null, task,
            success: (data) =>
                @clearNewTaskInput()
                @newTaskFormButton.html('new')
                @newTaskFormButton.spin()
            error: (data) =>
                @newTaskFormButton.html('new')
                @newTaskFormButton.spin()

    ###
        ./end Input handling
    ###



    ###
        Toggle handling
    ###

    # alt+t: toggle the "new task" form
    initializeShortcut: () ->
        # prevent the shortcut from writing in forms
        $(document).keydown (event) ->
            keyCode = event.which | event.keyCode
            if keyCode is 84 && event.altKey # alt + t
                event.preventDefault()

        $(document).keyup (event) =>
            keyCode = event.which | event.keyCode
            if (keyCode is 84 && event.altKey) # alt + t
                @toggleTaskForm(true)

        @toggleButton.click (event) =>
            @toggleTaskForm(true)

    handleDefaultFormState: () ->

        show_form = $.cookie('todos_prefs:show_form')

        # The collection must fire "reset" before the value is relevant
        isListEmpty = @taskList.tasks.length is 0

        # The form is shown by default if the cookie is set or
        # if it doesn't exist or if the collection is empty
        if(show_form is 'true' || !show_form? || isListEmpty)
            @showTaskForm()

        else
            @hideTaskForm()

    toggleTaskForm: (updatePreferences, mustFade) ->

        if @newTaskForm.is ':visible'
            @hideTaskForm(updatePreferences, mustFade)
        else
            @showTaskForm(updatePreferences, mustFade)

    showTaskForm: (updatePreferences, mustFade) ->

        if mustFade? && mustFade
            @newTaskForm.fadeIn(1000)
        else
            @newTaskForm.show()

        @toggleButton.text 'Hide the form'
        if updatePreferences? && updatePreferences
            $.cookie('todos_prefs:show_form', 'true')

    hideTaskForm: (updatePreferences, mustFade) ->

        if mustFade? && mustFade
            @newTaskForm.fadeOut(1000)
        else
            @newTaskForm.hide()

        @toggleButton.text 'Show the form'
        if updatePreferences? && updatePreferences
            $.cookie('todos_prefs:show_form', 'false')

    ###
        ./end Toggle handling
    ###
