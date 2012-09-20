requests = require "../../common/requests"

## Requests

Tree.defineRequest "all", requests.allType, requests.checkError

TodoList.defineRequest "all", requests.all, requests.checkError

archive = -> emit doc.completionDate, doc if doc.done
todos = -> emit doc.description, doc if not doc.done
archiveList = -> emit [doc.list, doc.completionDate], doc if doc.done
todosList = -> emit [doc.list, doc.previousTask], doc if not doc.done
setTimeout ->
    Task.defineRequest "all", requests.all, requests.checkError
, 1000
setTimeout ->
    Task.defineRequest "archive", archive, requests.checkError
, 2000
setTimeout ->
    Task.defineRequest "todos", todos, requests.checkError
, 3000
setTimeout ->
    Task.defineRequest "archiveList", archiveList, requests.checkError
, 4000
setTimeout ->
    Task.defineRequest "todosList", todosList, requests.checkError
, 5000
