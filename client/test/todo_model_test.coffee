{Task} = require 'models/task'
{TaskCollection} = require 'collections/tasks'
{TaskLine} = require 'views/task_view'

describe 'TaskLine', ->
    beforeEach ->
        @model = new Task
            list: 123
            description: "test"
        @view = new TaskLine(@model)
        @model.collection = new TaskCollection

    afterEach ->


  
    it "when I create a model", ->
    it "its url is automatically set", ->
        expect(@model.url).to.equal "/todolists/#{@model.list}/tasks/"
        
    it "When task is change its state to done", ->
        @model.setDone()

    it "Then its completion date is converted to an easily displayable date", ->
        expect(@model.simpleDate).to.equal "DD/MM/YYYY"

    it "And task line has done class", ->
        console.log @view.el.className
        expect(@view.el.hasClass("done")).to.be.ok

