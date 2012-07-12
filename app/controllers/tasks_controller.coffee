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

before 'set list id', ->
    @listId = params.listId
    next()
, except: ['index']

# Controllers

# Return all tasks
action 'all', ->
    Task.all {}, returnTasks

# Return all task 
action 'todo', ->
    Task.allTodo @listId, (err, tasks) ->
        if err
            console.log err
            send error: "Retrieve tasks failed.", 500
        else if not tasks.length
            send number: 0, rows: []
        else
            send number: tasks.length, rows: tasks

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

    # Save task function
    answer = (err) ->
        if err
            console.log err
            send error: 'Task cannot be updated', 500
        else
            send success: 'Task updated'

    # Task move from todo to done
    if body.done? and body.done and @task.done != body.done
        Task.done @task, body, answer

    # Task move from done to todo
    else if body.done? and not body.done and @task.done != body.done
        Task.todo @task, body, answer

    # When link changes previous and next task are updated.
    else if body.previousTask != undefined \
            and body.previousTask != @task.previousTask
        Task.move @task, body, answer

    else
        @task.updateAttributes body, answer

# Destroy given task and remove it from todo linked list.
action 'destroy', ->
    
    Task.remove @task, (err) ->
        if err
            console.log err
            send error: 'Cannot destroy task', 500
        else
            send success: 'Task succesfuly deleted'

# Returns a given task
action 'show', ->
    returnTasks null, [@task]

