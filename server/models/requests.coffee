americano = require 'americano-cozy'


module.exports =
    tree:
        all: requests.allType
    todolist:
        all: requests.all

    task:
        all: americano.defaultRequests.all
        archive: (doc) -> emit doc.completionDate, doc if doc.done
        todos: (doc) -> emit doc.description, doc if not doc.done
        archiveList: (doc) ->
            emit [doc.list, doc.completionDate], doc if doc.done
        todosList: (doc) ->
            emit [doc.list, doc.previousTask], doc if not doc.done
        archiveTag: (doc) ->
            if doc.done
                emit [tag, doc.completionDate], doc for tag in doc.tags
        todosTag: (doc) ->
            emit [tag, doc.list], doc for tag in doc.tags when not doc.done
        tags:
            map: (doc) ->
                unless doc.done
                    for tag in doc.tags
                        emit tag, tag
                return
            reduce: (key, values) ->
                return true
