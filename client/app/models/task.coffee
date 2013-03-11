BaseModel = require("./models").BaseModel

# Define a task inside a todo list.
class exports.Task extends BaseModel

    # Copy task properties to current model.
    constructor: (task) ->
        super(task)
        for property of task
            @[property] = task[property]

        @url = "todolists/#{task.list}/tasks/"
        @url += "#{@id}/" if @id?
        
        @setSimpleDate task.completionDate
        @setListName()

    # Format completionDate into a simple format. Store in simpleDate field.
    setSimpleDate: (date) ->
        date = new Date()if not date?
        @simpleDate = moment(date).format "DD/MM/YYYY"
        @fullDate = moment(date).format "DD/MM/YYYY HH:mm"

    # Store list data into model (for display outside list widget).
    setListName: ->
        list = window.app?.homeView.todolists.get(@list)
        
        if list?
            @listTitle = list.title
            path = list.path
            
            if path? and typeof(path) == "string"
                path = JSON.parse path
            if path?
                @listBreadcrumb = list.breadcrumb
                @listPath = list.urlPath
    
    setNextTask: (task) ->
        @set "nextTask", task?.id ? null
        task?.set "previousTask", @id

    setPreviousTask: (task) ->
        @set "previousTask", task?.id ? null
        task?.set "nextTask", @id

    # View binding: when task state is set to done, update view.
    setDone: ->
        @done = true
        @setSimpleDate()
        @cleanLinks()
        @view.done()

    # View binding: when task state is set to todo, update view.
    setUndone: ->
        @done = false
        @setLink()
        @completionDate = @simpleDate = null
        @set "completionDate", null
        @view.undone()

    # Set links with other task when task state becomes todo again.
    # If task is in archive section, it is put as first task of current
    # todo list.
    # If task is still in current todo list, its link are built again. It
    # looks for the first previous task of which state is todo and link it
    # to current task. Then it does the same with first next task of which
    # state is todo.
    setLink: ->
        if @collection.view.isArchive()
            @view.remove()
            @collection.view.moveToTaskList @
            @setNextTask @collection.at(0)
        else
            previousTask = @collection.getPreviousTodoTask @
            nextTask = @collection.getNextTodoTask @

            @setPreviousTask previousTask
            @setNextTask nextTask


    # Remove link from previous and next task.
    cleanLinks: ->
        previousTask = @collection.getPreviousTask @
        nextTask = @collection.getNextTask @
        previousTask?.setNextTask nextTask
        nextTask?.setPreviousTask previousTask

        @setPreviousTask null
        @setNextTask null
