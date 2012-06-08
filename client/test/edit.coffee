should = require("should")
Browser = require("../../common/test/browser").Browser
helpers = require("./helpers")

app = require("../../server")


describe "Create task", ->

    before (done) ->
        app.listen 8888
        helpers.cleandb ->
            helpers.initdb done

    before (done) ->
        @browser = new Browser()
        @browser.visit "http://localhost:8888/", =>
            done()

    after (done) ->
        app.close()
        helpers.cleandb done

    describe "Button mode", ->
        it "When I click on button mode", ->
            @browser.evaluate('$(".task-buttons:visible").length')
                    .should.equal 0
            @browser.click "#edit-button"
            
        it "Then all buttons are displayed", ->
            @browser.evaluate('$(".task-buttons:visible").length')
                    .should.equal 4

    describe "Up task", ->
        it "When I click on task up button.", ->
            @id = @browser.evaluate('$(".task:last").attr("id")')
            i = 0
            child = @browser.evaluate("$(\"##{@id}\")")
            console.log @id
            console.log child
            child = child[0]
            while child != null
                child = child.previousSibling
                i++
            console.log i
            @browser.click ".up-task-button:last"

        it "Then task is displayed one row above previous task", ->
            i = 0
            child = @browser.evaluate("$(#'#{@id}')").el
            i++ while (child = child.previousSibling) != null
            console.log i
            @browser.click ".up-task-button:last"
            i.should.equal 2

    describe "Down task", ->
        it "When I click on task up button.", ->
            @browser.click ".down-task-button:first"

        it "Then task is displayed one row below previous task", ->

            @browser.length(".task").should.equal 2

    describe "Delete task", (done) ->
        it "When I click on a task remove button.", ->
            @browser.click ".del-task-button:first"
            helpers.waits done, 300

        it "Then task is removed from DOM.", ->
            @browser.length(".task").should.equal 3

    describe "Modify task description", (done) ->
        it "When I modify first task description", ->
            @browser.html ".task-description:first", "change task"
            @browser.evaluate('$(".task-description").blur()')
            helpers.waits done, 2300

        it "Then a PUT request is sent to backend.", ->
            lastMethod = @browser.evaluate "helpers.client.lastRequest.method"
            lastMethod.should.be.equal "PUT"

