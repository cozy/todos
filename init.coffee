server = require './server'
async = require "async"

DataTree = require("./common/data-tree").DataTree

## Small script to intialize list of available applications.

todolist = new TodoList
    title: "Tutorial"
    path: '["Tutorial"]'


tasks = [
    new Task
        description: "When you hit backspace in an empty task, the task is\ 
deleted."
    new Task
        description: "Keyboard shortcut: ctrl+space change state of current\ 
task: done or todo."
    new Task
        description: "Keyboard shortcut: ctrl+up makes move up current task\ 
one line above."
    new Task
        description: "Keyboard shortcut: ctrl+down makes move down one line\ 
under."
    new Task
        description: "Click on done button and task will be back to the todo\ 
with the todo state."
    new Task
        description: "Click on todo button and task will be archived and set\ 
to done."
    new Task
        description: "navigation: pencil button lets you rename selected list."
    new Task
        description: "navigation: x button lets you delete selected list."
    new Task
        description: "navigation: + button lets you create a new todo list\ 
as a child of currenlty selected list."
    new Task
        description: "Writes an # at the begginning of a word and task will\ 
be tagged with that word."
    new Task
        description: "A shortcut list for all the task that share this\ 
tag is available in the navigation pane."
    new Task
        description: "When you hit enter in a task, it creates a new task\ 
line under the current line."
    ]

saveFunc = (obj) ->
    (callback) ->
        Task.createNew obj, callback


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
            dataTree = new DataTree tree.struct
            dataTree.addNode list

            tree.updateAttributes struct: dataTree.toJson(), (err) ->
                console.log "Initialization succeeds."
                process.exit(0)

