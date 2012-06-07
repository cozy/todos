should = require("should")
Browser = require("../../common/test/browser").Browser
helpers = require("./helpers")

app = require("../../server")


describe "Create task", ->

    before (done) ->
        app.listen 8888
        helpers.cleandb done

    before (done) ->
        @browser = new Browser()
        @browser.visit "http://localhost:8888/", =>
            done()

    after (done) ->
        app.close()
        helpers.cleandb done


    it "When todo list is empty", ->
        @browser.length(".task").should.equal 0
        
    it "And I click on new task button", (done) ->
        @browser.click "#new-task-button"
        helpers.waits done, 200

    it "Then I expect to see a new task line", ->
        @browser.length(".task").should.equal 1

