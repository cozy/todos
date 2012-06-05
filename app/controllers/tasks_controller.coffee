load 'application'


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


action 'all', ->
    Task.all {"where": { "done": false } }, returnTasks

action 'archives', ->
    Task.all {"where": { "done": true } }, returnTasks

action 'create', ->
    task = new Task body
    Task.create task, (err, note) =>
        if err
            console.log err
            send error: 'Task can not be created'
        else
            send task, 201

action 'update', ->
    @task.updateAttributes body, (err) =>
        if err
            console.log err
            send error: 'Task can not be updated', 500
        else
            send success: 'Task updated'

action 'show', ->
    returnTasks null, [@task]

