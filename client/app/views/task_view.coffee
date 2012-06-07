template = require('./templates/task')

# Row displaying task status and description
class exports.TaskLine extends Backbone.View
    className: "task clearfix"
    tagName: "div"

    events:
        "click .todo-button": "onTodoButtonClicked"
        "click .del-task-button": "onDelButtonClicked"
        "keyup span": "onDescriptionChanged"

    ### Constructor ####

    constructor: (@model) ->
        super()

        @saving = false
        @id = @model._id
        @model.view = @

    onTodoButtonClicked: (event) =>
        if @model.done then @model.setUndone() else @model.setDone()
        @model.save { done: @model.done },
            success: ->
            error: ->
                alert "An error occured, modifications were not saved."

    onDelButtonClicked: (event) =>
        @model.destroy
            success: =>
                @remove()
            error: ->
                alert "An error occured, deletion was not saved."


    onDescriptionChanged: (event) =>
        if not @saving
            @saving = true
            setTimeout(
                =>
                    @saving = false
                    @model.description = @.$("span.description").html()
                    @model.save { description: @model.description },
                        success: ->
                        error: ->
                            alert "An error occured, modifications were not saved."
                , 2000)

    done: ->
        @.$(".todo-button").html "done"
        @.$(".todo-button").addClass "disabled"
        @.$(".todo-button").removeClass "btn-info"
        $(@el).addClass "done"

    undone: ->
        @.$(".todo-button").html "todo"
        @.$(".todo-button").removeClass "disabled"
        @.$(".todo-button").addClass "btn-info"
        $(@el).removeClass "done"

    remove: ->
        @unbind()
        $(@el).remove()

    render: ->
        template = require('./templates/task')
        $(@el).html template("model": @model)
        @el.id = @model.id

        @.$("span.description").live 'blur keyup paste', ->
            $this = $(this)
            if $this.data('before') isnt $this.html()
                $this.data 'before', $this.html()
                $this.trigger('change')
            return $this
        @.$("span.description").bind "change", @onDescriptionChanged

        @.$(".del-task-button").hide()

        if @model.done
            @done()

        @el

