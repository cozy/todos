async = require "async"

module.exports = (compound, Task) ->

    # Requests

    # Delete all tasks.
    Task.destroyAll = (params, callback) ->
        callback = params if typeof(params) is "function"

        Task.requestDestroy "all", params, callback

    # Retrieve all tags
    Task.tags = (callback) ->
        Task.rawRequest "tags", group: true, callback

    # Retrieve all todo task for a given tag
    Task.tagTodos = (tag, callback) ->
        params =
            startkey: [tag]
            endkey: [tag + "z0"]
        Task.request "todosTag", params, callback

    # Retrieve all archives for a given tag
    Task.tagArchives = (tag, callback) ->
        params =
            startkey: [tag + "0"]
            endkey: [tag]
            limit: 30
            descending: true
        Task.request "archiveTag", params, callback

    # Get all archived tasks for a given list
    Task.archives = (listId, callback) ->
        if not listId?
            params =
                limit: 30
                descending: true

            Task.request "archive", params, callback
        else
            params =
                startkey: [listId + "0"]
                endkey: [listId]
                limit: 30
                descending: true
            Task.request "archiveList", params, callback

    # Helpers

    Task.retrieveTodoList = (listId, callback) ->
        params =
            startkey: [listId]
            endkey: [listId + "0"]
        Task.request "todosList", params, callback

    # Returns all tasks of which state is todo. Order them following the linked
    # list.
    Task.allTodo = (listId, callback) ->
        orderTasks = (tasks) ->
            if tasks.length is 0
                callback null, []
                return

            idList = {}
            for task in tasks
                idList[task.id] = task
                firstTask = task if not task.previousTask?

            task = firstTask
            task = tasks[0] if not task?
            result = []

            # Order tasks
            while task? and result.length <= tasks.length
                result.push task
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
                # TODO: make saving with async.
                for task in brokenTasks
                    attributes =
                        nextTask: task.nextTask
                        previousTask: task.previousTask
                    task.updateAttributes attributes, ->
                        true
            callback null, result

        if listId?
            Task.retrieveTodoList listId, (err, tasks) ->
                if err
                    callback err, null
                else
                    orderTasks tasks, callback
        else
            Task.request "todos", callback

    Task.getFirstTaskFromList = (tasks) ->
        tasks[tasks.length - 1]

        firstTask = null
        for task in tasks
            firstTask = task if not task.previousTask?
        firstTask

    # Set given task as first task of todo task list.
    Task.setFirstTask = (task, callback) ->
        compound.logger.write "first task"
        compound.logger.write task.list
        compound.logger.write task.id
        Task.retrieveTodoList task.list, (err, tasks) ->
            return callback err, null if err
            compound.logger.write tasks.length

            # Case where the given task is already the first task
            if not tasks.length or
            (tasks.length is 1 and tasks[0].id is task.id)
                if task.id? then callback null, task
                else task.save (err) -> callback err, task

            # Case where the given task is not the first task
            else
                firstTask = Task.getFirstTaskFromList tasks
                compound.logger.write firstTask.id
                compound.logger.write task.id


                updateLinks = (task) ->
                    firstTask.previousTask = task.id
                    task.nextTask = firstTask.id
                    task.previousTask = null

                    firstTask.save (err) ->
                        return callback err, null if err

                        task.save (err) ->
                            return callback err, null if err

                            callback null, task

                if task.id?
                    updateLinks task
                else
                    task.save (err) ->
                        return callback err, null if err
                        updateLinks task


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
                return callback null if not nextTask?

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
            # TODO: better behavior when previous Task does not exist.
            return callback null if not previousTask?

            nextTaskId = previousTask.nextTask
            previousTask.nextTask = task.id

            previousTask.save (err) ->
                return callback err if err

                if nextTaskId?
                    Task.find nextTaskId, (err, nextTask) ->
                        return callback err if err
                        # TODO: better behavior when next Task does not exist.
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

    # Create a new task and add it to the todo task list if its state is not
    # done.
    Task.createNew = (task, callback) ->
        task.nextTask = null
        task.extractTags()

        if not task.done
            if not task.previousTask?
                Task.setFirstTask task, (err, task) ->
                    return callback err if err
                    callback err, task
            else
                Task.create task, (err, task) ->
                    return callback err if err
                    Task.insertTask task, (err) ->
                        callback err, task
        else
            Task.create task, (err, task) ->
                return callback err if err
                callback err, task

    # Change next task ID of previous task with next task ID of current task.
    Task.removePreviousLink = (task, callback) ->
        if task? and task.previousTask? and not task.done
            Task.find task.previousTask, (err, previousTask) =>
                return callback err if err

                if previousTask?
                    previousTask.nextTask = task.nextTask
                    previousTask.save callback
                else
                    task.previousTask = null
                    task.save callback
        else
            callback null

    # Change previous task ID of next task with previous task ID of current
    # task.
    Task.removeNextLink = (task, callback) ->
        if task.nextTask? and not task.done
            Task.find task.nextTask, (err, nextTask) =>
                return callback err if err

                if nextTask?
                    nextTask.previousTask = task.previousTask
                    nextTask.save callback
                else
                    task.nextTask = null
                    task.save callback
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
        Task.removeLinks task, (err) ->
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
            Task.setFirstTask task, (err, task) ->
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
                Task.setFirstTask task, (err, task) ->
                    return callback err if err

                    attributes.nextTask = task.nextTask
                    task.updateAttributes attributes, callback

    # Extract string prefixed with a # from the description and set them as tags
    Task::extractTags = () ->
        if @description?
            desc = @description + " "
            tags =  desc.match(/#(\w)*/g)

            @tags = []

            if tags?
                for tag in tags
                    tag = "#today" if tag is "#t"
                    tag = "#week" if tag is "#w"
                    tag = "#month" if tag is "#m"
                    @tags.push tag.substring(1) if tag isnt "#"
