{TaskList} = require "../tasks_view"

class exports.HaveDoneListModal extends Backbone.View

    class: "modal hide"
    id: "have-done-list-modal"

    initialize: ->

    constructor: ->
        super()

    # Build widgets and setup model.
    render: ->
        $(@el).html require('../templates/have_done_list')
        $(@el).addClass "modal"

        @taskList = new TaskList null, @$("#have-done-task-list"),
            grouping: true
        @taskList.tasks.url = "tasks/archives"

        @$(".close").click @hide

    # Clear current list before displaying modal.
    show: ->
        @$("#have-done-task-list").html null
        $(@el).show()

    hide: =>
        $(@el).hide()

    isVisible: ->
        $(@el).is(":visible")

    loadData: ->
        @taskList.tasks.fetch()
