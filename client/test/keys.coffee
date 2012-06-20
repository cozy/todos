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

    describe "Arrow keys", ->

        describe "Up", ->

            it "When I focus second task description", ->
                @browser.evaluate('$(".task:nth-child(2) span.description").focus()')

            it "And I type on up arrow key", ->
                @browser.keyup ".task:nth-child(2) span.description", 38
                
            it "Then I got focus on first task", ->
                # Should test focus

        describe "ctrl + Up", ->

            it "When I edit second task description", ->
                @browser.evaluate('$(".task:nth-child(2) span.description").focus()')

            it "And I type on up arrow key + ctrl", ->
                @browser.keyup ".task:nth-child(2) span.description", 38, true
                
            it "Then second task becomes first task", ->
                @browser.html(".task:nth-child(1) .description").should.equal \
                     "My second task "
                @browser.html(".task:nth-child(2) .description").should.equal \
                     "My third task "

        describe "Down", ->

            it "When I focus second task description", ->
                @browser.evaluate('$(".task:nth-child(2) span.description").focus()')

            it "And I type on down arrow key", ->
                @browser.keyup ".task:nth-child(2) span.description", 40

            it "Then I got focus on third task", ->
                # Should test focus

        describe "ctrl + Down", ->

            it "When I edit second task description", ->
                @browser.evaluate('$(".task:nth-child(2) span.description").focus()')

            it "And I type on up arrow key + ctrl", ->
                @browser.keyup ".task:nth-child(2) span.description", 40, true
                
            it "Then I second task becomes third task", ->
                @browser.html(".task:nth-child(2) .description").should.equal \
                     "My first task "
                @browser.html(".task:nth-child(3) .description").should.equal \
                     "My third task "

