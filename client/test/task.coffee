should = require("should")
Browser = require("../../common/test/browser").Browser
helpers = require("./helpers")

app = require("../../server")


describe "Update task", ->

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


    it "When I click on first task todo button", ->
        @browser.click ".task button:first"

    it "Then it changes task style to done", ->
        @browser.hasClass(".task:first", "done").should.be.ok
        @browser.hasClass(".task button:first", "disabled").should.be.ok
        @browser.html(".task button:first").should.equal "done"
        @browser.hasClass(".task button:first", "btn-info").should.not.be.ok


    it "When I click again on first task todo button", ->
        @browser.click ".task button:first"

    it "Then it changes task style to undone", ->
        @browser.hasClass(".task:first", "done").should.not.be.ok
        @browser.hasClass(".task button:first", "disabled").should.not.be.ok
        @browser.html(".task button:first").should.equal "todo"
        @browser.hasClass(".task button:first", "btn-info").should.be.ok

