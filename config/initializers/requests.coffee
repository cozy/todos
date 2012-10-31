requests = require "../../common/requests"

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
Task.defineRequest "all", requests.all, requests.checkError
Task.defineRequest "archive", archive, requests.checkError
Task.defineRequest "todos", todos, requests.checkError
Task.defineRequest "archiveList", archiveList, requests.checkError
Task.defineRequest "todosList", todosList, requests.checkError
tags =
    map: ->
        for tag in doc.tags
            emit tag, tag
        return
    reduce: (key, values) ->
        return true
Task.defineRequest "tags", tags, requests.checkError
