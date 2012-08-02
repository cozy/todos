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
    task.setPreviousTask @last()
    @add task


describe 'Task Model', ->

    before ->
        todoList = new TodoList
            id: 123
            title: "list 01"

        @model = new Task
            list: 123
            description: "task 02"
            id: 2

        todoListView = new TodoListWidget todoList
        @collectionView = new TaskList todoListView
        @collection = @collectionView.tasks
        @collection.addNewTask 1, 123, "task 01"
        @collection.add @model
        @model.setPreviousTask @collection.last()
        @collection.addNewTask 3, 123, "task 03"
        @collection.addNewTask 4, 123, "task 04"
        @view = @model.view

    after ->

    describe "Creation", ->
        it "when I create a model", ->

        it "its url is automatically set", ->
            expect(@model.url).to.equal "todolists/#{@model.list}/tasks/2/"
 
    describe "Done", ->
        it "When task state is changed to done.", ->
            @model.setDone()

        it "Then task line has done class", ->
            expect(@model.done).to.equal true
            expect($(@view.el).hasClass("done")).to.be.ok

        it "And links are cleaned", ->
            expect(@model.get "previousTask").to.equal null
            expect(@model.get "nextTask").to.equal null
            
            previousTask = @collection.at 0
            nextTask = @collection.at 2
            expect(previousTask.get "nextTask").to.equal nextTask.id
            expect(nextTask.get "previousTask").to.equal previousTask.id

        it "And its completion date is copied to an easily displayable date", ->
            completionDate = moment @model.completionDate
            expect(@model.simpleDate).to.equal completionDate.format(
                "DD/MM/YYYY")

    describe "Undone", ->
        it "When task state is changed to undone.", ->
            @model.setUndone()
            expect(@model.done).to.equal false
            expect($(@view.el).hasClass("done")).to.not.be.ok

