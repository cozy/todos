server = require './server'
async = require "async"

DataTree = require("./common/tree/tree_object").Tree

## Small script to intialize list of available applications.

todolist = new TodoList
    title: "Tutorial"
    path: "/all/tutorial"
    humanPath: "All,Tutorial"
    tags: "all,tutorial"


tasks = [
    new Task
        description: "When you hit enter in a task, it creates a new task line\
just above"
    new Task
        description: "When you hit backspace in an empty task, it is deleted."
    new Task
        description: "Keyboard shortcut: ctrl+space change state of current\
task"
    new Task
        description: "Keyboard shortcut: ctrl+up makes move up current task
one row over."
    new Task
        description: "Keyboard shortcut: ctrl+down makes move down current\
task from one above"
    new Task
        description: "Click on done button and task will be back to the todo\
the todo state."
    new Task
        description: "Click on todo button and task will be archived and set\
to done."
    new Task
        description: "Last button will display your have done list"
    new Task
        description: "magnifying glass button lets you find list"
    new Task
        description: "pencil button lets you rename selected list"
    new Task
        description: "x button lets you delete selected list"
    new Task
        description: "+ button lets you create a new todo list as child of \
currenlty selected list"
    ]

saveFunc = (obj) ->
    (callback) ->
        obj.save callback


TodoList.create todolist, (err, list) ->
    if err
        console.log err
        console.log "Initialization failed (can't save todo-list)"
        process.exit(0)

    task.list = list.id for task in tasks
    saveFuncs = (saveFunc(task) for task in tasks)
    async.series saveFuncs, ->
        Tree.getOrCreate (err, tree) ->
            if err
                console.log err
                console.log "Initialization failed (cannot update tree)"
                process.exit(0)
            dataTree = new DataTree JSON.parse(tree.struct)
            dataTree.addNode "/all", list.title, list.id

            tree.updateAttributes struct: dataTree.toJson(), (err) ->
                console.log "Initialization succeeds."
                process.exit(0)

