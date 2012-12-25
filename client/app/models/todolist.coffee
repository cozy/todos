BaseModel = require("models/models").BaseModel

slugify = require "lib/slug"


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
    # Set two fields : breadcrumb and urlpath defined by list path
    constructor: (todolist) ->
        super(todolist)
        for property of todolist
            @[property] = todolist[property]

        if @path?
            @breadcrumb = @path.join(" > ")
            slugs = []
            for title in @path
                slugs.push slugify(title)
            @urlPath = slugs.join("/")
            @urlPath = "todolist/#{@id}/all/#{@urlPath}/"

    # Set right url then send save request to server.
    saveContent: (content) ->
        @content = content
        @url = "todolists/#{@.id}"
        @save content: @content


    @createTodoList = (data, callback) ->
        request "POST", "todolists", data, callback

    @updateTodoList = (id, data, callback) ->
        request "PUT", "todolists/#{id}", data, callback

    @getTodoList = (id, callback) ->
        $.get "todolists/#{id}", (data) =>
            todolist = new TodoList data
            callback(todolist)

    @deleteTodoList = (id, callback) ->
        request "DELETE", "todolists/#{id}", callback
