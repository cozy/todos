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
    moveUpFocus: (taskLine, options) ->
        selector = "##{taskLine.model.id}"
        nextDescription = $(selector).prev().find(".description")
        @moveFocus taskLine.descriptionField, nextDescription, options

    # Set focus on next task.
    moveDownFocus: (taskLine, options) ->
        selector = "##{taskLine.model.id}"
        nextDescription = $(selector).next().find(".description")
        @moveFocus taskLine.descriptionField, nextDescription, options
 
    moveFocus: (previousNode, nextNode, options) ->
        cursorPosition = helpers.getCursorPosition previousNode
        nextNode.focus()
        if options?.maxPosition? and options.maxPosition
            helpers.setCursorPosition nextNode, \
                                      nextNode.text().length
        else
            helpers.setCursorPosition nextNode, cursorPosition


    # Insert a task represented by task after previousTaskLine
    insertTask: (previousTaskLine, task) ->
        taskLine = new TaskLine(task)
        taskLine.list = @
        taskLineEl = $(taskLine.render())
        taskLineEl.insertAfter($(previousTaskLine.el))
        taskLine.focusDescription()
        taskLine
    
