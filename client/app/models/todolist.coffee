BaseModel = require("models/models").BaseModel


request = (type, url, data, callback) ->
    $.ajax
        type: type
        url: url
        data: data
        success: callback
        error: (data) ->
            if data and data.msg
                alert data.msg
            else
                alert "Server error occured."


# Model that describes a single todolist.
class exports.TodoList extends BaseModel

    url: 'todolists/'

    # Copy todolist properties to current model.
    constructor: (todolist) ->
        super()
        for property of todolist
            @[property] = todolist[property]

    # Set right url then send save request to server.
    saveContent: (content) ->
        @content = content
        @url = "todolists/#{@.id}"
        @save content: @content


    @createTodoList = (data, callback) ->
        request "POST", "todolists", data, callback

    @updateTodoList = (id, data, callback) ->
        request "PUT", "todolists/#{id}", data, callback

    @moveTodoList = (data, callback) ->
        request "POST", "tree/path/move", data, callback

    @getTodoList = (id, callback) ->
        $.get "todolists/#{id}", (data) =>
            todolist = new TodoList data
            callback(todolist)


