async = require "async"

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

Task.archives = (listId, callback) ->
    Task.all { where: { done: true, list: listId }, \
               order: "completionDate DESC" }, callback
    
# Returns all tasks of which state is todo. Order them following the link
# list.
Task.allTodo = (listId, callback) ->
    orderTasks = (tasks) ->
        console.log tasks.length

        if tasks.length == 0
            callback null, []
            return

        idList = {}
        for task in tasks
            idList[task.id] = task
            firstTask = task if not task.previousTask?

        task = firstTask
        result = []
        while task? and result.length <= tasks.length
            result.push(task)
            nextTaskId = task.nextTask
            delete idList[task.id]
            task = idList[nextTaskId]

        # Rebuild linked list if there are unlinked tasks
        lastTask = result[result.length - 1]
        brokenTasks = [lastTask]
        for taskId of idList
            task = idList[taskId]
            task.previousTask = lastTask.id
            lastTask.nextTask = task.id
            result.push task
            lastTask = task
            brokenTasks.push task

        # Save correction if something wrong happened
        if brokenTasks.length > 0
            # make saving with async.
            for task in brokenTasks
                attributes =
                    nextTask: task.nextTask
                    previousTask: task.previousTask
                task.updateAttributes attributes, ->

        callback null, result

    Task.all { where: { done: false, list: listId } }, (err, tasks) ->
        if err
            callback err, null
        else
            orderTasks tasks, callback

# Set given task as first task of todo task list.
Task.setFirstTask = (task, callback) ->
    Task.all { where: { done: false, list: task.list, \
                        previousTask: null } }, \
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

# Change previous task ID of next task with current task ID.
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

# Change both previous and next links
Task.updateLinks = (task, callback) ->
    Task.setPreviousLink task, (err) ->

        return callback err if err
        Task.setNextLink task, callback

# Insert task after task given via previousTask field.
Task.insertTask = (task, callback) ->
    Task.find task.previousTask, (err, previousTask) ->
        return callback err if err
        return callback null if not previousTask?

        nextTaskId = previousTask.nextTask
        previousTask.nextTask = task.id

        previousTask.save (err) ->
            return callback err if err

            if nextTaskId?
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
            else
                task.nextTask = null
                callback null
                
# Create a new task and add it to the todo task list if its state is not done.
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

# Change next task ID of previous task with next task ID of current task.
Task.removePreviousLink = (task, callback) ->
    if task.previousTask? and not task.done
        Task.find task.previousTask, (err, previousTask) =>
            return callback err if err

            previousTask.nextTask = task.nextTask
            previousTask.save callback
    else
        callback null

# Change previous task ID of next task with previous task ID of current task.
Task.removeNextLink = (task, callback) ->
    if task.nextTask? and not task.done
        Task.find task.nextTask, (err, nextTask) =>
            return callback err if err

            nextTask.previousTask = task.previousTask
            nextTask.save callback
    else
        callback null

# Remove all links set on given task.
Task.removeLinks = (task, callback) ->
    Task.removePreviousLink task, (err) ->
        return callback err if err

        Task.removeNextLink task, callback

# Remove task from DB and clean links if tasks were inside todo list.
Task.remove = (task, callback) ->
    Task.removeLinks task, (err) ->
        return callback err if err

        task.destroy callback

# When task is done, it is removed from todo linked list.
Task.done = (task, attributes, callback) ->
    Task.removePreviousLink task, (err) ->
        return callback err if err

        Task.removeNextLink task, (err) ->
            return callback err if err

            attributes.previousTask = null
            attributes.nextTask = null
            
            task.updateAttributes attributes, callback


# When task go back to todo, it is added as first task to the todo list.
# If task previous task is specified, it is inserted after this task. 
Task.todo = (task, attributes, callback) ->
    if attributes.previousTask?
        task.previousTask = attributes.previousTask
        Task.insertTask task, (err) ->
            return callback err if err

            attributes.nextTask = task.nextTask
            attributes.previousTask = task.previousTask
            task.updateAttributes attributes, callback

    # If now new link are set task become first task
    else
        Task.setFirstTask task, (err) ->
            return callback err if err

            attributes.nextTask = task.nextTask
            task.updateAttributes attributes, callback

# Moving a task is doing in two steps: remove links, then insert it inside
# todo linked list.
Task.move = (task, attributes, callback) ->
    Task.removeLinks task, (err) ->
        return callback err if err

        if attributes.previousTask?
            task.previousTask = attributes.previousTask
            Task.insertTask task, (err) ->
                return callback err if err

                attributes.nextTask = task.nextTask
                attributes.previousTask = task.previousTask

                task.updateAttributes attributes, callback
        else
            Task.setFirstTask task, (err) ->
                return callback err if err

                attributes.nextTask = task.nextTask
                task.updateAttributes attributes, callback

