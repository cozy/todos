{TaskCollection} = require "../collections/tasks"
{TaskLine} = require "../views/task_view"
helpers = require "../helpers"

# Small widget used to handle interactions inside list.
class exports.TaskList extends Backbone.View
    className: "task clearfix"
    tagName: "div"

    constructor: (@mainView, @el) ->
        super()

        @tasks = new TaskCollection @

    # Add a line at the bottom of the list.
    addTaskLine: (task) ->
        taskLine = new TaskLine task, @
        $(@el).append taskLine.render()

    # Add a line at the top of the list.
    addTaskLineAsFirstRow: (task) ->
        taskLine = new TaskLine task, @
        $(@el).prepend taskLine.render()

    # Return true if it is an archive list.
    isArchive: ->
        $(@el).attr("id") == "archive-list"

    # Remove a task from its current position then add it to todo task list.
    moveToTaskList: (task) ->
        @mainView.moveToTaskList task

    # Set focus on previous task.
    moveUpFocus: (taskLine) ->
        cursorPosition = helpers.getCursorPosition taskLine.descriptionField
        selector = "##{taskLine.model.id}"
        previousDescription = $(selector).prev().find(".description")
        previousDescription.focus()
        helpers.setCursorPosition previousDescription, cursorPosition

    # Set focus on next task.
    moveDownFocus: (taskLine) ->
        cursorPosition = helpers.getCursorPosition taskLine.descriptionField
        selector = "##{taskLine.model.id}"
        nextDescription = $(selector).next().find(".description")
        nextDescription.focus()
        helpers.setCursorPosition nextDescription, cursorPosition

    # Insert a task represented by task after previousTaskLine
    insertTask: (previousTaskLine, task) ->
        taskLine = new TaskLine(task)
        taskLine.list = @
        taskLineEl = $(taskLine.render())
        taskLineEl.insertAfter($(previousTaskLine.el))
        taskLine.focusDescription()
        taskLine

    
