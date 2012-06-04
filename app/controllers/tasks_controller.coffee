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


action 'create', ->
    task = new Task body
    Task.create task, (err, note) =>
        if err
            console.log err
            send error: 'Task can not be created'
        else
            send task, 201

action 'all', ->
    Task.all returnTasks


