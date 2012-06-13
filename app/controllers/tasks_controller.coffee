load 'application'

async = require 'async'


# Entry point
action 'index', ->
   render
       title: "Cozy To-do"


# Helpers


# Return to client a task list like this
# { length: number of taks, rows: task list }
returnTasks = (err, tasks) ->
    if err
        console.log err
        send error: "Retrieve tasks failed.", 500
    else
        send number: tasks.length, rows: tasks

# Find task based on its id and check for errors only if it is required
findTask = (taskId, checkError, callback) ->
    Task.find taskId, (err, task) =>
        if err and not checkError
            send error: 'An error occured while getting task', 500
        else if not task? and not checkError
            send error: 'Linked task not found', 400
        else
            callback(task)

# Save task and check for errors.
saveTask = (task, callback) ->
    task.save (err) =>
        if err
            send error: "An error occured while modifying task", 500
        else
            callback(task)

# Change next task ID of previous task with next task ID of current task.
removePreviousLink = (task, callback) ->
    if task.previousTask?
        findTask task.previousTask, true, (previousTask) =>
            previousTask.nextTask = task.nextTask
            saveTask previousTask, callback
    else
        callback()
        
# Change next task ID of previous task with current task ID.
setPreviousLink = (task, callback) ->
    if task.previousTask?
        findTask task.previousTask, true, (previousTask) =>
            previousTask.nextTask = task.id
            saveTask previousTask, callback
    else
        callback()

# Change previous task ID of next task with previous task ID of curren task.
removeNextLink = (task, callback) ->
    if task.nextTask?
        findTask task.nextTask, true, (nextTask) =>
            nextTask.previousTask = task.previousTask
            saveTask nextTask, callback
    else
        callback()

# Change previous task ID of next task with current task ID.
setNextLink = (task, callback) ->
    if task.nextTask?
        findTask task.nextTask, true, (nextTask) =>
            nextTask.previousTask = task.id
            saveTask nextTask, callback
    else
        callback()


setFirstTask = (task, callback) ->
    Task.all {"where": { "done": false } }, (err, tasks) ->
        if err
            console.log err
            send error: "Retrieve tasks failed.", 500
        else if not tasks.length \
                or (tasks.length == 1 and tasks[0].id == task.id)
            callback task
        else
            firstTask = tasks[0]
            i = 1
            while firstTask.previousTask? and i < tasks.length
                if tasks[i].id != task.id
                    firstTask = tasks[i]
                i++
            
            if firstTask?
                firstTask.previousTask = task.id
                task.nextTask = firstTask.id
                saveTask firstTask, (firstTask) ->
                    saveTask task, callback
            else
                callback null

before 'load task', ->
    Task.find params.id, (err, task) =>
        if err
            send error: 'An error occured', 500
        else if task is null
            send error: 'Task not found', 404
        else
            @task = task
            next()
, only: ['update', 'destroy', 'show']


# Controllers


action 'all', ->
    Task.all {}, returnTasks

action 'todo', ->
    orderTasks = (tasks) ->

        idList = {}
        for task in tasks
            idList[task.id] = task
            firstTask = task if not task.previousTask?

        task = firstTask
        result = [firstTask]
        while task? and task.nextTask? and result.length <= tasks.length
            task = idList[task.nextTask]
            result.push(task)
        send number: result.length, rows: result

    Task.all { "where": { "done": false } }, (err, tasks) ->
        if err
            console.log err
            send error: "Retrieve tasks failed.", 500
        else if not tasks.length
            send number: 0, rows: []
        else
            orderTasks(tasks)

action 'archives', ->
    Task.all {"where": { "done": true }, "sort": {"completionDate"} }, \
             returnTasks


action 'create', ->
    newTask = new Task body
    
    createTask = (task, callback) ->
        Task.create task, (err, note) =>
            if err
                console.log err
                send error: 'Task cannot be created'
            else
                callback(task)

    if not newTask.done and not newTask.previousTask? and not newTask.nextTask?
        createTask newTask, (createdTask) ->
            setFirstTask createdTask, (task) ->
                send task, 201
    else
        createTask newTask, (task) ->
            setPreviousLink task, ->
                setNextLink task, ->
                    send task, 201

    
# * Update task attributes
# * perform completionDate modification depending on whether is finished or not.
# * update linked list depending on previous and next task values
action 'update', ->

    # TODO when task go to undone

    # set completion date
    if body.done? and body.done
        body.completionDate = Date.now()
    else if body.done? and not body.done
        body.completionDate = null

    # Save task function
    updateTaskAttributes = =>
        @task.updateAttributes body, (err) =>
            if err
                console.log err
                send error: 'Task cannot be updated', 500
            else
                send success: 'Task updated'

    # Remove old previous link and set new previous link
    updatePreviousLink = (tmpTask, callback) =>
        if body.previousTask !=  undefined \
           and tmpTask.previousTask != body.previousTask
            removePreviousLink tmpTask, (task) =>
                tmpTask.previousTask = body.previousTask
                setPreviousLink tmpTask, (task) =>
                    callback()
        else
            callback()

    # Remove old next link and set new next link
    updateNextLink = (tmpTask, callback) =>
        if body.nextTask != undefined \
           and tmpTask.nextTask != body.nextTask
            removeNextLink tmpTask, (task) =>
                tmpTask.nextTask = body.nextTask
                setNextLink tmpTask, (task) =>
                    callback()
        else
            callback()

    # Task move from todo to done
    if body.done? and body.done and @task.done != body.done
        removePreviousLink @task, =>
            removeNextLink @task, =>
                body.previousTask = null
                body.nextTask = null
                updateTaskAttributes()

    # Task move from done to todo
    else if body.done? and not body.done and @task.done != body.done
        setFirstTask @task, (task) ->
            updateTaskAttributes()

    # When link changes previous and next task are updated.
    else if body.previousTask != undefined or body.nextTask != undefined
        tmpTask = new Task
            previousTask: @task.previousTask
            nextTask: @task.nextTask
            id: @task.id
        updatePreviousLink tmpTask, =>
            tmpTask = new Task
                previousTask: @task.previousTask
                nextTask: @task.nextTask
                id: @task.id
            updateNextLink tmpTask, =>
                updateTaskAttributes()
    else
        updateTaskAttributes()

action 'destroy', ->
    
    destroyTask = (task, callback) ->
        task.destroy (err) ->
            if err
                console.log err
                send error: 'Cannot destroy task', 500
            else
                callback(task)

    destroyTask @task, (task) ->
        removePreviousLink task, ->
            removeNextLink task, ->
                send success: 'Task succesfuly deleted'


action 'show', ->
    returnTasks null, [@task]

