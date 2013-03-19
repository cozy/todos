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

    archive = ->
        emit doc.completionDate, doc if doc.done
    todos = ->
        emit doc.description, doc if not doc.done
    archiveList = ->
        emit [doc.list, doc.completionDate], doc if doc.done
    todosList = ->
        emit [doc.list, doc.previousTask], doc if not doc.done
    archiveTag = ->
        if doc.done
            for tag in doc.tags
                emit [tag, doc.completionDate], doc
    todosTag = ->
        if not doc.done
            for tag in doc.tags
                emit [tag, doc.list], doc
    Task.defineRequest "all", requests.all, requests.checkError
    Task.defineRequest "archive", archive, requests.checkError
    Task.defineRequest "todos", todos, requests.checkError
    Task.defineRequest "archiveList", archiveList, requests.checkError
    Task.defineRequest "todosList", todosList, requests.checkError
    Task.defineRequest "archiveTag", archiveTag, requests.checkError
    Task.defineRequest "todosTag", todosTag, requests.checkError
    tags =
        map: ->
            if not doc.done
                for tag in doc.tags
                    emit tag, tag
            return
        reduce: (key, values) ->
            return true
    Task.defineRequest "tags", tags, requests.checkError
