BaseModel = require("models/models").BaseModel

slugify = require "lib/slug"
request = require "lib/request"


# Model that describes a single todolist.
class exports.TodoList extends BaseModel

    url: 'todolists/'

    # Copy todolist properties to current model.
    # Set two fields : breadcrumb and urlpath defined by list path
    constructor: (todolist) ->
        super(todolist)
        for property of todolist
            @[property] = todolist[property]

        path = @get "path"
        if path?
            @breadcrumb = path.join(" > ")
            slugs = []
            slugs.push slugify(title) for title in path
            @urlPath = slugs.join("/")
            @urlPath = "todolist/#{@id}/all/#{@urlPath}"

    @createTodoList = (data, callback) ->
        request.post "todolists", data, callback

    @updateTodoList = (id, data, callback) ->
        request.put "todolists/#{id}", data, callback

    @getTodoList = (id, callback) ->
        request.get "todolists/#{id}", (err, data) =>
            todolist = new TodoList data
            callback todolist

    @deleteTodoList = (id, callback) ->
        requet.del "todolists/#{id}", callback
