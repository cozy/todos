load 'application'

async = require 'async'

###
# Helpers
###

# Return to client a task list like this
# { length: number of taks, rows: task list }
returnTasks = (err, tasks) ->
    if err
        console.log err
        send error: "Retrieve tasks failed.", 500
    else
        send number: tasks.length, rows: tasks

###
# Preprocessor
###

# If action is an instance action, it loads corresponding task
before 'load task', ->
    Task.find params.id, (err, task) =>
        if err
            send error: 'An error occured', 500
        else if task == null
            send error: 'Task not found', 404
        else
            @task = task
            next()
, only: ['update', 'destroy', 'show']

# Get current list from params (operations occurs always on a list).
before 'set list id', ->
    @listId = params.listId
    next()

###
# Controllers
###

action 'all', ->
    Task.all {}, returnTasks

action 'all-todo', ->
    Task.allTodo null, returnTasks

action 'all-archives', ->
    Task.archives null, returnTasks

# Return all todo tasks for given list.
action 'todo', ->
    Task.allTodo @listId, (err, tasks) ->
        if err
            console.log err
            send error: "Retrieve tasks failed.", 500
        else if not tasks.length
            send number: 0, rows: []
        else
            send number: tasks.length, rows: tasks

# Return all done tasks for given list.
action 'archives', ->
    Task.archives @listId, returnTasks

# Creates a new task.
# If its state is todo, it is added as first task.
# If its state is todo with a specified previous task, it is inserted
# inside todo linked list after specified previous task.
action 'create', ->
    newTask = new Task body
    newTask.list = @listId

    Task.createNew newTask, (err, task) ->
        if err
            console.log err
            send error: "Creating task failed.", 500
        else
            send task, 201


# * Update task attributes
# * perform completionDate modification depending on whether is finished or not.
# * update linked list depending on previous and next task values
action 'update', ->

    # set completion date
    if body.done? and body.done
        body.completionDate = Date.now()
    else if body.done? and not body.done
        body.completionDate = null

    callback = (err) ->
        if err
            console.log err
            send error: true, msg: 'Task cannot be updated', 500
        else
            send success: true, msg: 'Task updated'

    # Task move from todo to done
    if body.done? and body.done and @task.done isnt body.done
        Task.done @task, body, callback

    # Task move from done to todo
    else if body.done? and not body.done and @task.done isnt body.done
        Task.todo @task, body, callback

    # When link changes previous and next task are updated.
    else if body.previousTask isnt undefined \
            and body.previousTask isnt @task.previousTask
        Task.move @task, body, callback

    else
        @task.description = body.description
        @task.extractTags()
        body.tags = @task.tags

        @task.updateAttributes body, callback

# Destroy given task and remove it from todo linked list.
action 'destroy', ->
    Task.find params.id, (err, task) =>
        Task.remove @task, (err) ->
            if err
                console.log err
                send error: 'Cannot destroy task', 500
            else
                send success: 'Task succesfuly deleted'

# Returns a given task
action 'show', ->
    returnTasks null, [@task]

# Return all tags as a list of strings
action 'tags', ->
    Task.tags (err, tags) ->
        if err
            railway.logger.write(err)
            send error: "Server error", 500
        else
            results = []
            results.push tag.key for tag in tags
            send results

# Get all not done tasks for a given tag
action 'tagTodo', ->
    tag = params.tag
    if tag?
        Task.tagTodos tag, returnTasks
    else
        send error: "No tag given", 400

# Get all done tasks for a given tag
action 'tagArchives', ->
    tag = params.tag
    if tag?
        Task.tagArchives tag, returnTasks
    else
        send error: "No tag given", 400
