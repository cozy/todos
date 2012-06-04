should = require('should')
Client = require('../common/test/client').Client
app = require('../server')


client = new Client("http://localhost:8888/")

## Helpers

responseTest = null
bodyTest = null


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
            should.exist @body
            should.exist @body.rows
            @body.number.should.equal 1
            @body.rows.length.should.equal 1
            @body.rows[0].description.should.equal "my first task"
            @id = @body.rows[0].id


    describe "PUT /tasks/:id/ Modify given task",   ->
        it "When I send a modification request for first task", (done) ->
            client.put "tasks/#{@id}/", done: true, (error, response, body) =>
                @response = response
                @body = body
                done()

        it "And I send a request to retrieve tasks", (done) ->
            client.get "tasks/", (error, response, body) =>
                @response = response
                @body = JSON.parse body
                done()

        it "Then my task has been modified", ->
            should.exist @body
            should.exist @body.rows
            @body.number.should.equal 1
            @body.rows.length.should.equal 1
            @body.rows[0].done.should.be.ok

