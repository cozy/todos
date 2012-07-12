Client = require('../common/test/client').Client
client = new Client("http://localhost:8888/")


# Remove all todolists and tree from DB.
exports.cleanDb = (callback) ->
    TodoList.destroyAll ->
        Tree.destroyAll callback

# Create a new todo list.
exports.createTodoListFunction = (title, path) ->
    (callback) ->
        todolist =
            title: title
            path: path

        client.post "todolists/", todolist, callback

