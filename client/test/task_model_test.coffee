{Task} = require 'models/task'
{TaskCollection} = require 'collections/tasks'
{TaskLine} = require 'views/task_view'
{TaskList} = require 'views/tasks_view'
{TodoListWidget} = require 'views/todolist_view'
{TodoList} = require 'models/todolist'
{HomeView} = require 'views/home_view'


TaskCollection::addNewTask = (id, list, description) ->
    task = new Task
        id: id
        list: list
        description: description
    @add task


describe 'Task Model', ->

    before ->
        window.app = {}
        window.app.homeView = new HomeView()

        todoList = new TodoList
            id: 123
            title: "list 01"
            path: ["parent", "list 01"]

        window.app.homeView.todolists.add todoList

        @model = new Task
            list: 123
            description: "task 02"
            id: 2

        todoListView = new TodoListWidget todoList
        @collectionView = new TaskList todoListView
        @collection = @collectionView.tasks
        @collection.addNewTask 1, 123, "task 01"
        @collection.add @model
        @collection.addNewTask 3, 123, "task 03"
        @collection.addNewTask 4, 123, "task 04"
        @view = @model.view

    after ->

    describe "Creation", ->
        it "when I create a model", ->

        it "its url is automatically set", ->
            expect(@model.url).to.equal "todolists/#{@model.list}/tasks/2/"
 
        it "just like list data", ->
            expect(@model.listTitle).to.equal "list 01"
            expect(@model.listPath).to.equal "parent > list 01"
 
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

        it "Then task line has not done class anymore", ->
            expect(@model.done).to.equal false
            expect($(@view.el).hasClass("done")).to.be.not.ok

        it "And links are back", ->
            expect(@model.get "previousTask").to.equal 1
            expect(@model.get "nextTask").to.equal 3
            
            previousTask = @collection.at 0
            nextTask = @collection.at 2
            expect(previousTask.get "nextTask").to.equal @model.id
            expect(nextTask.get "previousTask").to.equal @model.id

        it "And its completion date is set to null", ->
            expect(@model.simpleDate).to.equal null

    describe "setSimpleDate", ->
        it "When I set simple date", ->
            @date = new Date()
            @model.setSimpleDate @date

        it "Then this date is available in a readable string", ->
            expect(@model.simpleDate).to.equal moment(@date).format(
                "DD/MM/YYYY")
            @model.simpleDate = null

    describe "setPreviousTask", ->
        it "When I set model previous task", ->
            @previousTask = @collection.at(@collection.length - 1)
            @model.setPreviousTask @previousTask

        it "Then both task have their fields rightly set", ->
            expect(@model.get "previousTask").to.equal 4
            expect(@previousTask.get "nextTask").to.equal @model.id

    describe "setNextTask", ->
        it "When I set model next task", ->
            @nextTask = @collection.at(@collection.length - 1)
            @model.setNextTask @nextTask

        it "Then both task have their fields rightly set", ->
            expect(@model.get "nextTask").to.equal 4
            expect(@nextTask.get "previousTask").to.equal @model.id

            # Reset links
            @model.setPreviousTask @collection.at 0
            @model.setNextTask @collection.at 2
            @nextTask.setPreviousTask @collection.at 2

    describe "cleanLinks", ->
        it "When I clean task links", ->
            @model.cleanLinks()
            
        it "Then task has no more links", ->
            expect(@model.get "previousTask").to.equal null
            expect(@model.get "nextTask").to.equal null
            
        it "And previously set links are updated.", ->
            previousTask = @collection.at 0
            nextTask = @collection.at 2
            expect(previousTask.get "nextTask").to.equal nextTask.id
            expect(nextTask.get "previousTask").to.equal previousTask.id

    describe "setLinks", ->
        it "When I set links back", ->
            @model.setLink()
            
        it "Then task has its links back (depending on position in list)", ->
            expect(@model.get "previousTask").to.equal 1
            expect(@model.get "nextTask").to.equal 3
            
        it "And previously set links are back too.", ->
            previousTask = @collection.at 0
            nextTask = @collection.at 2
            expect(previousTask.get "nextTask").to.equal @model.id
            expect(nextTask.get "previousTask").to.equal @model.id

