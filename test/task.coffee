should = require('chai').Should()
async = require('async')
Client = require('request-json').JsonClient
app = require('../server')
helpers = require("./helpers")

client = new Client("http://localhost:8888/")


## Helpers

testLength = (body, length) ->
    should.exist body
    should.exist body.rows
    body.rows.length.should.equal length

initDb = (callback) ->
    async.series [
        helpers.createTodoListFunction "My Tasks", "/all/my-tasks"
        helpers.createTodoListFunction "Recipe", "/all/recipe"
        helpers.createTodoListFunction "Dessert", "/all/recipe/dessert"
    ], ->
        callback()


describe "/tasks", ->

    before (done) ->
        app.listen 8888
        helpers.cleanDb ->
            initDb done

    after (done) ->
        app.close()
        done()


    describe "GET /todolists ", ->
        it "Retrieve working todo-list", (done) ->
            client.get "todolists/", (error, response, body) =>
                body = body
                testLength body, 2
                @listId = body.rows[0].id
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

        it "Then a success is returned with a note with an id", ->
            should.exist @body
            should.exist @body.id
            @response.statusCode.should.equal 201


    describe "GET /todolists/:listId/tasks Get all pending tasks", ->
        it "When I send a request to retrieve tasks", (done) ->
            client.get "todolists/#{@listId}/tasks/", (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then I got one task", ->
            testLength @body, 1
            @body.rows[0].description.should.equal "my first task"
            @id = @body.rows[0].id


    describe "PUT /todolists/:listId/tasks/:id/ Modify given task", ->
        it "When I send a modification request for first task", (done) ->
            client.put "todolists/#{@listId}/tasks/#{@id}/", \
                       done: true, (error, response, body) =>
                @response = response
                @body = body
                done()

        it "And I send a request to retrieve done tasks", (done) ->
            client.get "todolists/#{@listId}/tasks/archives",  \
                        (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then my task has been modified", ->
            testLength @body, 1
            @body.rows[0].done.should.be.ok
            @body.rows[0].completionDate.should.be.ok

        it "When I send a request to retrieve tasks", (done) ->
            client.get "todolists/#{@listId}/tasks/", \
                       (error, response, body) =>
                @response = response
                @body = body
                done()
    
        it "Then I got no tasks", ->
            testLength @body, 0

    describe "GET /tasks/archives/", ->
        it "And I send a request to retrieve done tasks from all lists", \
                 (done) ->
            client.get "tasks/archives/", \
                       (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then I have one task", ->
            testLength @body, 1


    describe "GET /todolists/:listId/tasks/:id/ Show given task", ->
        it "When I send a show request for first task", (done) ->
            @body = null
            client.get "todolists/#{@listId}/tasks/#{@id}/", \
                       (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then I got all its data", ->
            testLength @body, 1
            @body.rows[0].done.should.be.ok
            @body.rows[0].completionDate.should.be.ok
            @body.rows[0].description.should.be.equal "my first task"


    describe "DELETE /todolists/:listId/tasks/:id/ Delete given task", ->
        it "When I send a deletion request for first task", (done) ->
            client.del "todolists/#{@listId}/tasks/#{@id}/", \
                          (error, response, body) =>
                @response = response
                @body = body
                done()

        it "And I send a show request for first task", (done) ->
            @body = null
            client.get "todolists/#{@listId}/tasks/#{@id}/", \
                       (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then I got a 404 response", ->
             @response.statusCode.should.equal 404

    describe "POST /todolists/:listId/tasks/ Create linked tasks", ->
        it "When I create two new tasks", (done) ->
            task =
                description: "my first task"

            client.post "todolists/#{@listId}/tasks/", \
                        task, (error, response, body) =>
                @id = body.id

                task =
                    description: "my third task"
                    previousTask: @id

                client.post "todolists/#{@listId}/tasks/", \
                            task, (error, response, body) =>
                    @id3 = body.id
                    task =
                        description: "my second task"
                        previousTask: @id
                        nextTask: @id3

                    client.post "todolists/#{@listId}/tasks/", \
                                task, (error, response, body) =>
                        @id2 = body.id
                        done()

        it "And I send a request to retrieve tasks", (done) ->
            client.get "todolists/#{@listId}/tasks/", (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then I got 3 ordered tasks", ->
            testLength @body, 3
            @body.rows[0].description.should.equal "my first task"
            @body.rows[0].nextTask.should.equal @id2
            @body.rows[1].description.should.equal "my second task"
            @body.rows[1].previousTask.should.equal @id
            @body.rows[1].nextTask.should.equal @id3
            @body.rows[2].description.should.equal "my third task"
            @body.rows[2].previousTask.should.equal @id2

            @id = @body.rows[0].id

    describe "PUT /todolists/:listId/tasks/:id/ Modify task order", ->
        it "When I send move second task to first place", (done) ->
            client.put "todolists/#{@listId}/tasks/#{@id2}/", \
                       { previousTask: null, nextTask: @id }, \
                       (error, response, body) ->
                done()

        it "And I send a request to retrieve tasks", (done) ->
            client.get "todolists/#{@listId}/tasks/", (error, response, body) =>
                @body = body
                done()

        it "Then I got 3 ordered tasks", ->
            testLength @body, 3
            @body.rows[0].description.should.equal "my second task"
            @body.rows[0].nextTask.should.equal @id
            @body.rows[1].description.should.equal "my first task"
            @body.rows[1].previousTask.should.equal @id2
            @body.rows[1].nextTask.should.equal @id3
            @body.rows[2].description.should.equal "my third task"
            @body.rows[2].previousTask.should.equal @id


    describe "DELETE /todolists/:listId/tasks/:id/ Del task + update order", ->
        it "When I delete first task (second place) ", (done) ->
            client.del "todolists/#{@listId}/tasks/#{@id}/", \
                          (error, response, body) =>
                done()

        it "And I send a request to retrieve tasks", (done) ->
            client.get "todolists/#{@listId}/tasks/", \
                       (error, response, body) =>
                @body = body
                done()

        it "Then I got 2 ordered tasks without first task", ->
            testLength @body, 2
            @body.rows[0].description.should.equal "my second task"
            @body.rows[0].nextTask.should.equal @id3
            @body.rows[1].description.should.equal "my third task"
            @body.rows[1].previousTask.should.equal @id2

            @id = @body.rows[0].id


    describe "POST /todolists/:listId/tasks/:id/ New task and update order", ->
        it "When I create one new task", (done) ->
            task =
                description: "my first task"

            client.post "todolists/#{@listId}/tasks/", \
                        task, (error, response, body) =>
                @id = body.id
                done()

        it "And I send a request to retrieve tasks", (done) ->
            client.get "todolists/#{@listId}/tasks/", (error, response, body) =>
                @body = body
                done()

        it "My new task is set as first one", ->
            testLength @body, 3
            @body.rows[0].description.should.equal "my first task"
            should.not.exist @body.rows[0].previousTask
            @body.rows[0].nextTask.should.equal @id2
            @body.rows[1].description.should.equal "my second task"
            @body.rows[1].previousTask.should.equal @id
            @body.rows[1].nextTask.should.equal @id3
            @body.rows[2].description.should.equal "my third task"
            @body.rows[2].previousTask.should.equal @id2
            should.not.exist @body.rows[2].nextTask

    describe "PUT /todolists/:listId/tasks/:id/ From done to todo", ->
        it "When I set first task to done", (done) ->
            client.put "todolists/#{@listId}/tasks/#{@id2}/", \
                       done: true, (error, response, body) =>
                @response = response
                @body = body
                done()

        it "And I set first task to todo", (done) ->
            client.put "todolists/#{@listId}/tasks/#{@id2}/", \
                       { done: false, previousTask: @id }, \
                    (error, response, body) =>
                @response = response
                @body = body
                done()

        it "And I send a request to retrieve todo tasks", (done) ->
            client.get "todolists/#{@listId}/tasks/", (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then my task is still at same position", ->
            testLength @body, 3
            @body.rows[0].description.should.equal "my first task"
            should.not.exist @body.rows[0].previousTask
            @body.rows[0].nextTask.should.equal @id2
            @body.rows[1].description.should.equal "my second task"
            @body.rows[1].previousTask.should.equal @id
            @body.rows[1].nextTask.should.equal @id3
            @body.rows[2].description.should.equal "my third task"
            @body.rows[2].previousTask.should.equal @id2
            should.not.exist @body.rows[2].nextTask
