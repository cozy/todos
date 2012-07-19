class exports.HaveDoneListModal extends Backbone.View

    class: "modal hide"
    id: "have-done-list-modal"

    initialize: ->

    constructor: ->
        super()

    render: ->
        $(@el).html require('../templates/have_done_list')
        $(@el).addClass "modal"

        @$(".close").click @hide

    show: ->
        $(@el).show()
        @$(".modal-body").html null
        @fetch

    hide: =>
        $(@el).hide()

    isVisible: ->
        $(@el).is(":visible")

    fetch: ->
