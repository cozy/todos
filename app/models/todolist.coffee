async = require "async"
helpers = require '../../common/helpers'

# DestroyTodoList corresponding to given condition
# TODO optimise deletion : each deletion requires on request.
TodoList.destroySome = (condition, callback) ->

    # Replace this with async lib call.
    wait = 0
    error = null
    done = (err) ->
        error = error || err
        if --wait == 0
            callback(error)

    TodoList.all condition, (err, data) ->
        if err then return callback(err)
        if data.length == 0 then return callback(null)

        wait = data.length
        data.forEach (obj) ->
            obj.destroy done

# Delete all todolists.
TodoList.destroyAll = (callback) ->
    TodoList.destroySome {}, callback

# Return todolists which live under given path.
TodoList.allForPath = (path, callback) ->
    regExp = helpers.getPathRegExp path
    TodoList.all { where: { path: { regex: regExp } } }, callback

# Destroy todolists which live under given path.
TodoList.destroyForPath = (path, callback) ->
    regExp = helpers.getPathRegExp path
    TodoList.destroySome { where: { path: { regex: regExp } } }, callback

# Change path for every todolist which are children of given path to the
# new given one.
# It is the result of moving todolists inside tree.
TodoList.updatePath = (path, newPath, newName, callback) ->
    TodoList.allForPath path, (err, todolists) ->
        return callback(err) if err
        return callback(new Error("No todolist for this path")) \
            if todolists.length == 0

        wait = todolists.length
        done = (err) ->
            error = error || err
            if --wait == 0
                callback(error)

        nodeIndex = path.split("/").length - 2

        for todolist in notes
            todolist.path = newPath + note.path.substring(path.length)
            humanNames = todolist.humanPath.split(",")
            humanNames[nodeIndex] = newName
            todolist.humanPath = humanNames
            todolist.save done

# When a node is moved, all todolists that are linked to this node are
# updated : sub-path are replaced by new node path.
TodoList.movePath = (path, dest, humanDest, callback) ->
    TodoList.allForPath path, (err, todolists) ->
        return callback(err) if err
        return callback(new Error("No todolist for this path")) \
            if todolists.length == 0

        wait = todolists.length
        done = (err) ->
            error = error || err
            if --wait == 0
                callback(error)

        parentPath = path.split("/")
        parentPath.pop()
        pathLength = parentPath.join("/").length
        nodeIndex = parentPath.length - 1

        for todolist in notes
            # Replace old path by new path
            todolist.path = dest + note.path.substring(pathLength)
            
            # Replace human path by new human path
            humanNames = todolist.humanPath.split(",")
            humanNames.shift() for i in [0..nodeIndex-1]
            humanNames = humanDest.concat humanNames
            todolist.humanPath = humanNames

            todolist.save done


