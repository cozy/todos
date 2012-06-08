should = require('should')
Client = require('../common/test/client').Client
app = require('../server')


client = new Client("http://localhost:8888/")

## Helpers

responseTest = null
bodyTest = null

testLength = (body, length) ->
    should.exist body
    should.exist body.rows
    body.number.should.equal length
    body.rows.length.should.equal length


describe "/tasks", ->

    before (done) ->
        app.listen(8888)
        Task.destroyAll ->
            done()

    after (done) ->
        app.close()
        done()


    describe "POST /tasks Create a task", ->
        it "When I send data for a task creation", (done) ->
            task =
                description: "my first task"

            client.post "tasks/", task, (error, response, body) =>
                @response = response
                @body = body
                done()

        it "Then a success is returned with a note with an id", ->
            should.exist @body
            should.exist @body.id
            @response.statusCode.should.equal 201


    describe "GET /tasks Get all pending tasks", ->
        it "When I send a request to retrieve tasks", (done) ->
            client.get "tasks/", (error, response, body) =>
                @response = response
                @body = JSON.parse body
                done()

        it "Then I got one tasks", ->
            testLength @body, 1
            @body.rows[0].description.should.equal "my first task"
            @id = @body.rows[0].id


    describe "PUT /tasks/:id/ Modify given task",   ->
        it "When I send a modification request for first task", (done) ->
            client.put "tasks/#{@id}/", done: true, (error, response, body) =>
                @response = response
                @body = body
                done()

        it "And I send a request to retrieve done tasks", (done) ->
            client.get "tasks/archives", (error, response, body) =>
                @response = response
                @body = JSON.parse body
                done()

        it "Then my task has been modified", ->
            testLength @body, 1
            @body.rows[0].done.should.be.ok
            @body.rows[0].completionDate.should.be.ok

        it "When I send a request to retrieve tasks", (done) ->
            client.get "tasks/", (error, response, body) =>
                @response = response
                @body = JSON.parse body
                done()

        it "Then I got no tasks", ->
            testLength @body, 0

    describe "GET /tasks/:id/ Show given task",   ->
        it "When I send a show request for first task", (done) ->
            @body = null
            client.get "tasks/#{@id}/", (error, response, body) =>
                @response = response
                @body = JSON.parse body
                done()

        it "Then I got all its data", ->
            testLength @body, 1
            @body.rows[0].done.should.be.ok
            @body.rows[0].completionDate.should.be.ok
            @body.rows[0].description.should.be.equal "my first task"


    describe "DELETE /tasks/:id/ Delete given task",   ->
        it "When I send a deletion request for first task", (done) ->
            client.delete "tasks/#{@id}/", (error, response, body) =>
                @response = response
                @body = body
                done()

        it "And I send a show request for first task", (done) ->
            @body = null
            client.get "tasks/#{@id}/", (error, response, body) =>
                @response = response
                @body = JSON.parse body
                done()

        it "Then I got a 404 response", ->
             @response.statusCode.should.equal 404



    describe "POST /tasks/ Create linked tasks",   ->
        it "When I create two new tasks", (done) ->
            task =
                description: "my first task"

            client.post "tasks/", task, (error, response, body) =>
                @id = body.id

                task =
                    description: "my third task"
                    previousTask: @id

                client.post "tasks/", task, (error, response, body) =>
                    @id3 = body.id
                    task =
                        description: "my second task"
                        previousTask: @id
                        nextTask: @id3

                    client.post "tasks/", task, (error, response, body) =>
                        @id2 = body.id
                        done()

        it "And I send a request to retrieve tasks", (done) ->
            client.get "tasks/", (error, response, body) =>
                @response = response
                @body = JSON.parse body
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


    describe "PUT /tasks/:id/ Modify task order",   ->
        it "When I send move second task to first place", (done) ->
            client.put "tasks/#{@id2}/", { previousTask: null, nextTask: @id }, (error, response, body) ->
                done()

        it "And I send a request to retrieve tasks", (done) ->
            client.get "tasks/", (error, response, body) =>
                @body = JSON.parse body
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


    describe "DELETE /tasks/:id/ Delete task and update order",   ->
        it "When I delete first task (second place) ", (done) ->
            client.delete "tasks/#{@id}/", (error, response, body) =>
                done()

        it "And I send a request to retrieve tasks", (done) ->
            client.get "tasks/", (error, response, body) =>
                @body = JSON.parse body
                done()

        it "Then I got 2 ordered tasks without first task", ->
            testLength @body, 2
            @body.rows[0].description.should.equal "my second task"
            @body.rows[0].nextTask.should.equal @id3
            @body.rows[1].description.should.equal "my third task"
            @body.rows[1].previousTask.should.equal @id2

            @id = @body.rows[0].id

