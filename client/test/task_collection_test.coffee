{Task} = require 'models/task'
{TaskCollection} = require 'collections/tasks'
{TaskLine} = require 'views/task_view'
{TaskList} = require 'views/tasks_view'
{TodoListWidget} = require 'views/todolist_view'
{TodoList} = require 'models/todolist'


TaskCollection::addNewTask = (id, list, description) ->
    task = new Task
        id: id
        list: list
        description: description
    @add task


describe 'Task Collection', ->

    before ->
        todoList = new TodoList
            id: 123
            title: "list 01"

        todoListView = new TodoListWidget todoList
        @view = new TaskList todoListView
        @view.render()
        @collection = @view.tasks
        @collection.addNewTask 1, 123, "task 01"
        @collection.addNewTask 2, 123, "task 02"
        @collection.addNewTask 3, 123, "task 03"
        @collection.addNewTask 4, 123, "task 04"

    after ->

    describe "Creation", ->

        it "when I create a collection", ->
        it "Then URL is automatically set", ->
            expect(@collection.url).to.equal \
                "todolists/#{@collection.listId}/tasks"

 
    describe "onReset", ->

        it "when collection is reset with a list of tasks", ->
            @tasks = [
                new Task id: 5, list :123, description:"task 05"
                new Task id: 6, list :123, description:"task 06"
                new Task id: 7, list :123, description:"task 07"
            ]
            @collection.onReset @tasks
            @collection.add task, silent: true for task in @tasks

        it "then their links are correctly set", ->
            expect(@tasks[0].get "previousTask").to.equal 4
            expect(@tasks[1].get "previousTask").to.equal 5
            expect(@tasks[2].get "previousTask").to.equal 6
            expect(@tasks[1].get "nextTask").to.equal 7
            expect(@tasks[0].get "nextTask").to.equal 6
            expect(@tasks[2].get "nextTask").to.equal undefined

        it "and each tasks are linked to the collection", ->
            expect(task.collection).to.equal @collection for task in @tasks

        it "and lines are correctly added to the list widget", ->
            expect(@view.$(".task").length).to.equal 7

    describe "onTaskAdded", ->

        it "when a task is added to the collection", ->
            @task = new Task id: 8, list: 123, description: "task 08"
            @collection.add @task

        it "Then its url is updated ", ->
            expect(@task.url).to.equal "todolists/123/tasks/8/"

        it "and its links too", ->
            expect(@task.get "previousTask").to.equal 7
            expect(@task.get "nextTask").to.equal undefined

        it "and a task line is added as last row", ->
            expect(@view.$(".task .description:last").val()).to.equal "task 08"

    describe "getPreviousTask", ->
        it "getPreviousTask", ->
            @previousTask = @collection.getPreviousTask @task
            expect(@previousTask.id).to.equal 7

    describe "getNextTask", ->
        it "getNextTask", ->
            @nextTask = @collection.getNextTask @previousTask
            expect(@nextTask.id).to.equal 8
