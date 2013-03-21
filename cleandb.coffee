instantiateApp = require './server'
app = instantiateApp()

app.compound.on 'models', (models, compound) ->
    models.Tree.destroyAll ->
        models.TodoList.destroyAll ->
            models.Task.destroyAll ->
                console.log "all data are deleted"
                process.exit(0)
