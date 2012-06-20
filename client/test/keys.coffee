should = require("should")
Browser = require("../../common/test/browser").Browser
helpers = require("./helpers")

app = require("../../server")


describe "Edit task with keyboard", ->

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
        it "When I edit task description and I type on up arrow key", ->
            
        it "Then all buttons are displayed", ->

