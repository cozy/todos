{TaskCollection} = require "../collections/tasks"
{Task} = require "../models/task"
{TaskList} = require "./tasks_view"
helpers = require "../helpers"
slugify = require "lib/slug"

# Display todo list wrapper that contains todo task list and archive task list.
class exports.TodoListWidget extends Backbone.View
    id: "todo-list"
    tagName: "div"
    el: "#todo-list"
    isEditMode: false

    ### Constructor ####

    constructor: (@model) ->
        super()

        if @model?
            @id = @model.slug
            @model.view = @

    remove: ->
        $(@el).remove()

    ### configuration ###


    # Render template then build all widgets and bind them to their listeners.
    render: ->
        $(@el).html require('./templates/todolist')

        @title = @.$(".todo-list-title .description")
        @breadcrumb = @.$(".todo-list-title .breadcrumb")
        
        @taskList = new TaskList @, @.$("#task-list")
        @archiveList = new TaskList @, @.$("#archive-list")
        @tasks = @taskList.tasks
        @archiveTasks = @archiveList.tasks

        @refreshBreadcrump()

        @el

    ###
    # Listeners
    ###

    # When add is clicked a new task is added to the top of the task list.
    # Adding task is done after task was created on the server.
    onAddClicked: (event) =>
        task = new Task done: false, description: "new task", list: @model.id
        task.save null,
            success: (data) =>
                data.url = "tasks/#{data.id}/"
                @tasks.add data
                $(".task:first .description").focus()
                helpers.selectAll($(".task:first .description"))
                
                if @creationInfosRequired()
                    @taskList.$el.append '<p class="info">To add a new ' + \
                        'task, focus on a task then type enter.</p>'

            error: ->
                alert "An error occured while saving data"
 
    # When edit is clicked, edition widgets are displayed (editions widgets are
    # better for touch interfaces).
    onEditClicked: (event) =>
        if not @isEditMode
            @.$(".task:not(.done) .task-buttons").show()
            @newButton.show()
            @isEditMode = true
            @showButtonsButton.html "hide buttons"
        else
            @.$(".task-buttons").hide()
            @newButton.hide()
            @isEditMode = false
            @showButtonsButton.html "show buttons"


    ###
    # Functions
    ###

    # Load data then focus on first task loaded.
    # If list is empty a new task is automatically created.
    loadData: ->
        if not @model?
            @tasks.url = "tasks/todo"
            @archiveTasks.url = "tasks/archives"
        else
            console.log @model
            
            if @model.tag?
                @tasks.url = "tasks/tags/#{@model.tag}/todo"
                @archiveTasks.url = "tasks/tags/#{@model.tag}/archives"
            else
                @archiveTasks.url += "/archives"

        $(@archiveTasks.view.el).spin()
        $(@tasks.view.el).spin()
        @archiveTasks.fetch
            success: =>
                $(@archiveTasks.view.el).spin()
            error: =>
                $(@archiveTasks.view.el).spin()
        @tasks.fetch
            success: =>
                if @$(".task:not(.done)").length > 0
                    @$(".task:first .description").focus()
                    
                    if @creationInfosRequired()
                        @taskList.$el.append '<p class="info">To add a new ' + \
                            'task, focus on a task then type enter.</p>'
                else
                    @onAddClicked() if @model? and @model.id?

                @$(@tasks.view.el).spin()
            error: =>
                @$(@tasks.view.el).spin()

    creationInfosRequired: =>
        @tasks.length is 1 and @model.get("id")?

    # Add task to todo task list.
    moveToTaskList: (task) ->
        @tasks.onTaskAdded task

    # Force task saving if task was modified.
    blurAllTaskDescriptions: ->
        @$(".task .description").trigger("blur")

    # Refresh breadcrump with data from current model.
    refreshBreadcrump: ->
        @$(".breadcrumb a").unbind()
        if @model? and @model.id?
            @breadcrumb.html @createBreadcrumb()
            @$(".breadcrumb a").click (event) ->
                event.preventDefault()
                hash = event.target.hash.substring(1)
                path = hash.split("/")
                id = path[1]
                app.homeView.selectList id
                                             
            @title.html @model.title
        else
            @breadcrumb.html ""
            if @model?.tag?
                @title.html @model.tag
            else
                @title.html "All tasks"

    # breadcrumb will contain the path of the selected list in a link format
    # the code below generates the breadcrumb corresponding
    # to the current list path
    createBreadcrumb: ->
        paths = @model.path
        
        listName = paths.pop()
        slugs = []
        slugs.push slugify(path) for path in paths
        breadcrumb = ""
        parent = app.homeView.tree.getSelectedNode()
        
        while paths.length > 0
            parent = app.homeView.tree.getParent parent
            
            if parent?
                href = "#todolist/#{parent[0].id}/#{slugs.join("/")}"
                slugs.pop()
                listName = paths.pop()
                link = "<a href='#{href}'>#{listName}</a> "
                breadcrumb = "#{link} > #{breadcrumb}"
            else
                listName = paths.pop()

        breadcrumb = "<a href='#todolist/all'> All</a> > #{breadcrumb}"
        breadcrumb
