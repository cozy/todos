
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


# Returns all tasks of which state is todo. Order them following the link
# list.
Task.todo = (callback) ->
    orderTasks = (tasks) ->

        idList = {}
        for task in tasks
            idList[task.id] = task
            firstTask = task if not task.previousTask?

        task = firstTask
        result = []
        while task? and result.length <= tasks.length
            result.push(task)
            task = idList[task.nextTask]
        result

    Task.all { "where": { "done": false } }, (err, tasks) ->
        if err then callback err, null else callback null, orderTasks(tasks)

# Set given task as first task of todo task list.
Task.setFirstTask = (task, callback) ->
    Task.all {"where": { "done": false, "previousTask": null } }, \
             (err, tasks) ->
        return callback(err, null) if err

        if not tasks.length \
           or (tasks.length == 1 and tasks[0].id == task.id)
            callback null, task
        else
            firstTask = tasks[0]
            firstTask.previousTask = task.id
            task.nextTask = firstTask.id
            firstTask.save (err) ->
                return callback(err, null) if err

                task.save (err) ->
                    return callback(err, null) if err

                    callback(null, task)

# Change next task ID of previous task with current task ID.
Task.setPreviousLink = (task, callback) ->
    if task.previousTask?
        Task.find task.previousTask, (err, previousTask) ->
            return callback err if err
            return callback null if not previousTask?

            previousTask.nextTask = task.id
            previousTask.save (err) ->
                return callback err if err
                callback null
    else
        callback null

Task.setNextLink = (task, callback) ->
    if task.nextTask?
        Task.find task.nextTask, (err, nextTask) ->
            return callback err if err
            return callback null if not nexTask?

            nextTask.previousTask = task.id
            nextTask.save (err) ->
                return callback err if err
                callback null
    else
        callback null

Task.updateLinks = (task, callback) ->
    Task.setPreviousLink task, (err) ->

        return callback err if err
        Task.setNextLink task, callback

Task.insertTask = (task, callback) ->
    Task.find task.previousTask, (err, previousTask) ->
        return callback err if err
        return callback null if not previousTask?

        nextTaskId = previousTask.nextTask
        previousTask.nextTask = task.id

        previousTask.save (err) ->
            return callback err if err

            Task.find nextTaskId, (err, nextTask) ->
                return callback err if err
                return callback null if not nextTask?

                nextTask.previousTask = task.id
                nextTask.save (err) ->
                    return callback err if err
                    task.nextTask = nextTaskId
                    task.save (err) ->
                        return callback err if err
                        callback null
            
Task.createNew = (task, callback) ->
    task.nextTask = null
    Task.create task, (err, task) ->
        return callback err if err

        if not task.done \
           and not task.previousTask?
            Task.setFirstTask task, callback
        else
            Task.insertTask task, (err) ->
                callback err, task

