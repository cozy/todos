should = require('chai').Should()
async = require('async')
Client = require('../common/test/client').Client
app = require('../server')
helpers = require("./helpers")



initDb = (callback) ->
    list =
        title: "test todolist"
    TodoList.create list, callback



describe "Task Model", ->

    before (done) ->
        helpers.cleanDb ->
            initDb done

    describe "GET /todolists ", ->
        it "Retrieve working todo-list", (done) ->


    describe "archives",
        it "When I create three archived"

