should = require('chai').Should()
async = require('async')
Client = require('request-json').JsonClient

client = new Client("http://localhost:8888/")

instantiateApp = require('../server')
app = instantiateApp()

## Helpers

testLength = (body, length) ->
    should.exist body
    should.exist body.rows
    body.rows.length.should.equal length

describe "/tasks (not prefixed)", ->

    before (done) ->
        helpers = require("./helpers")(app.compound)

        initDb = (callback) ->
            async.series [
                helpers.createTodoListFunction "Inbox", ["Inbox"]
                helpers.createTodoListFunction "Others", ["Others"]
            ], ->
                callback()
        app.listen 8888
        helpers.cleanDb ->
            initDb done

    after ->
        app.compound.server.close()


    describe "GET /todolists ", ->
        it "Retrieve todo-lists", (done) ->
            client.get "todolists/", (error, response, body) =>

                testLength body, 2
                @listId = body.rows[0].id
                @newListId = body.rows[1].id
                done()


    describe "POST /todolists/:listId/tasks Create a task", ->
        it "When I send data for a task creation", (done) ->
            task =
                description: "my first task"

            client.post "todolists/#{@listId}/tasks/", \
                        task, (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then a success is returned with a task with an id", ->
            should.exist @body
            should.exist @body.id
            @taskId = @body.id
            @response.statusCode.should.equal 201


    describe "GET /tasks/:taskId Get my task", ->
        it "When I send a request to retrieve task", (done) ->
            client.get "tasks/#{@taskId}", (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then I got one task", ->
            testLength @body, 1
            @body.rows[0].description.should.equal "my first task"
            @id = @body.rows[0].id


    describe "PUT /tasks/:id/ Modify given task", ->
        it "When I send a modification request for first task", (done) ->

            update =
                description: "updated description"
            client.put "tasks/#{@taskId}", update, (error, response, body) =>
                @response = response
                @body = body
                done()

        it "And I get my task again", (done) ->
            client.get "tasks/#{@taskId}", (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then my task has been modified", ->
            testLength @body, 1
            @body.rows[0].description.should.equal 'updated description'



    describe "PUT {list: newlist} /todolist/:todoId/tasks/:id/
    Move this task", ->

        it "When I send a move request for first task", (done) ->

            update =
                list: @newListId

            client.put "tasks/#{@taskId}", update, (error, response, body) =>
                @response = response
                @body = body
                done()

        it "And I get my task from the new list", (done) ->
            client.get "todolists/#{@newListId}/tasks/", \
            (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then my task is in the new list", ->
            testLength @body, 1
            @body.rows[0].list.should.equal @newListId


    describe "DELETE /tasks/:id/ Delete given task", ->
        it "When I send a deletion request for first task", (done) ->
            client.del "tasks/#{@taskId}/", (error, response, body) =>
                @response = response
                @body = body
                done()

        it "And I send a show request for first task", (done) ->
            client.get "tasks/#{@id}/", (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then I got a 404 response", ->
            @response.statusCode.should.equal 404

