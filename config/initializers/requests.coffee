
module.exports = (compound) ->
    requests = require "../../common/requests"

    User = compound.models.User
    Tree = compound.models.Tree
    Task = compound.models.Task
    TodoList = compound.models.TodoList
    ## Requests

    User.all = (callback) -> User.request "all", callback
    Tree.defineRequest "all", requests.allType, requests.checkError
    TodoList.defineRequest "all", requests.all, requests.checkError
    Task.defineRequest "all", requests.all, requests.checkError

    archive = ->
        emit doc.completionDate, doc if doc.done
    Task.defineRequest "archive", archive, requests.checkError

    todos = ->
        emit doc.description, doc if not doc.done
    Task.defineRequest "todos", todos, requests.checkError

    archiveList = ->
        emit [doc.list, doc.completionDate], doc if doc.done
    Task.defineRequest "archiveList", archiveList, requests.checkError

    todosList = ->
        emit [doc.list, doc.previousTask], doc if not doc.done
    Task.defineRequest "todosList", todosList, requests.checkError

    archiveTag = ->
        if doc.done
            for tag in doc.tags
                emit [tag, doc.completionDate], doc
    Task.defineRequest "archiveTag", archiveTag, requests.checkError

    todosTag = ->
        if not doc.done
            for tag in doc.tags
                emit [tag, doc.list], doc
    Task.defineRequest "todosTag", todosTag, requests.checkError

    tags =
        map: ->
            unless doc.done
                for tag in doc.tags
                    emit tag, tag
            return
        reduce: (key, values) ->
            return true
    Task.defineRequest "tags", tags, requests.checkError
