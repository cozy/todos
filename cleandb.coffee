server = require './server'

Tree.destroyAll ->
    TodoList.destroyAll ->
        Task.destroyAll ->
            console.log "all data are deleted"
            process.exit(0)
