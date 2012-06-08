should = require("should")
Browser = require("../../common/test/browser").Browser
helpers = require("./helpers")

app = require("../../server")


describe "Browse tasks", ->

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
        helpers.cleandb ->
            done()

    it "When I display todo list", ->
        
    it "Then I see three tasks", ->
        @browser.evaluate('$("#task-list .task").length').should.equal 3
        @browser.evaluate('$("#archive-list .task").length').should.equal 1



