Client = require('request-json').JsonClient
client = new Client "http://localhost:8888/"

module.exports = (compound) ->
    TodoList = compound.models.TodoList
    Task = compound.models.Task
    Tree = compound.models.Tree

    helpers = {}

    # Remove all todolists and tree from DB.
    helpers.cleanDb = (callback) ->
        TodoList.destroyAll ->
            Tree.destroyAll ->
                Task.destroyAll callback

    # Create a new todo list.
    helpers.createTodoListFunction = (title, path) ->
        (callback) ->
            todolist =
                title: title
                path: path

            TodoList.create todolist, callback

    helpers.newTodoListFunction = (title, parentId) ->
        (callback) ->
            todolist =
                title: title
                parent_id: path

        client.post "todolists/", todolist, callback
            
    helpers.createTaskFunction = (list, done, description) ->
        (callback) ->
            task =
                list: list
                done: done
                description: description

            Task.create task, (err, taskObject) ->
                Task.setFirstTask taskObject, callback
            
    helpers
