{TaskCollection} = require "../collections/tasks"
{TaskLine} = require "../views/task_view"

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

    moveToTaskList: (task) ->
        @mainView.moveToTaskList task

