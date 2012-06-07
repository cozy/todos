
# DestroyTask corresponding to given condition
Task.destroySome = (condition, callback) ->

    # TODO Replace this with async lib call.
    wait = 0
    error = null
    done = (err) ->
        error = error || err
        if --wait == 0
            callback(error)

    Task.all condition, (err, data) ->
        if err then return callback(err)
        if data.length == 0 then return callback(null)

        wait = data.length
        data.forEach (obj) ->
            obj.destroy done

# Delete all notes.
Task.destroyAll = (callback) ->
    Task.destroySome {}, callback
