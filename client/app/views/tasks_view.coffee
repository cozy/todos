{TaskCollection} = require "../collections/tasks"
{TaskLine} = require "../views/task_view"
helpers = require "../helpers"

# Small widget used to handle interactions inside list.
class exports.TaskList extends Backbone.View
    className: "task clearfix"
    tagName: "div"

    constructor: (@todoListView, @el, options) ->
        super()

        id = if @todoListView? then @todoListView.model.id else null
        @tasks = new TaskCollection @, id, options

    # Add a line at the bottom of the list.
    # If grouping option is activated, date is displayed every time it changes
    # in listing. 
    addTaskLine: (task) ->
        taskLine = new TaskLine task, @
        $(@el).append taskLine.render()

    # Add a date line that just display date of all following tasks
    addDateLine: (date) ->
        $(@el).append('<div class="completion-date">' + date + '</div>')

    # Add a line at the top of the list.
    addTaskLineAsFirstRow: (task) ->
        taskLine = new TaskLine task, @
        $(@el).prepend taskLine.render()

    # Return true if it is an archive list.
    isArchive: ->
        $(@el).attr("id") == "archive-list"

    # Remove a task from its current position then add it to todo task list.
    moveToTaskList: (task) ->
        @todoListView?.moveToTaskList task

    # Set focus on previous task. Preserve focus position.
    moveUpFocus: (taskLine, options) ->
        selector = "##{taskLine.model.id}"
        nextDescription = taskLine.list.$(selector).prev().find(".description")
        if nextDescription.length
            @moveFocus taskLine.descriptionField, nextDescription, options

    # Set focus on next task. Preserve focus position.
    moveDownFocus: (taskLine, options) ->
        selector = "##{taskLine.model.id}"
        nextDescription = taskLine.list.$(selector).next().find(".description")
        if nextDescription.length
            @moveFocus taskLine.descriptionField, nextDescription, options
 
    # Move focus from previous field to next field by saving cursor position.
    # If options contains flag maxPosition, cursor position is set at the end
    # of the field.
    moveFocus: (previousField, nextField, options) ->
        cursorPosition = previousField.getCursorPosition()
        nextField.focus()
        if options?.maxPosition? and options.maxPosition
            nextField.setCursorPosition nextField.val().length
        else
            nextField.setCursorPosition cursorPosition

    # Insert a task line represented by task after previousTaskLine, then put
    # focus on it.
    insertTask: (previousTaskLine, task) ->
        taskLine = new TaskLine(task)
        taskLine.list = @
        taskLineEl = $(taskLine.render())
        taskLineEl.insertAfter($(previousTaskLine.el))
        taskLine.focusDescription()
        if @todoListView?.isEditMode
            taskLine.showButtons()
        taskLine
    
