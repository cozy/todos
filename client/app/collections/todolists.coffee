{TodoList} = require "../models/todolist"


class exports.TodoListCollection extends Backbone.Collection
    
    model: TodoList
    url: 'todolists/'

    constructor: ->
        super()

    # Select which field from backend response to use for parsing to populate
    # collection.
    parse: (response) ->
        response.rows
