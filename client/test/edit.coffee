should = require("should")
Browser = require("../../common/test/browser").Browser
helpers = require("./helpers")

app = require("../../server")


describe "Edit task", ->

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
        done()
        #helpers.cleandb ->
        #    done()

    describe "Button mode", ->
        it "When I click on button mode", ->
            @browser.length(".task-buttons:visible").should.equal 0
            @browser.isVisible("#new-task-button").should.not.be.ok
            @browser.click "#edit-button"
            
        it "Then all todo task buttons are displayed", ->
            @browser.length(".task-buttons:visible").should.equal 3
            @browser.isVisible("#new-task-button").should.be.ok

        it "And button label changes.", ->
            @browser.html("#edit-button").should.equal "hide buttons"

    describe "Up task", ->
        it "When I click on task up button.", ->
            @browser.html(".task:nth-child(1) .description").should.equal \
                 "My third task "
            @browser.html(".task:nth-child(2) .description").should.equal \
                 "My second task "
            @browser.click ".task:nth-child(2) .up-task-button"

        it "Then task is displayed one row above previous task", ->
            @browser.html(".task:nth-child(1) .description").should.equal \
                 "My second task "
            @browser.html(".task:nth-child(2) .description").should.equal \
                 "My third task "

    describe "Down task", ->
        it "When I click on task up button.", ->
            @browser.html(".task:nth-child(2) .description").should.equal \
                 "My third task "
            @browser.html(".task:nth-child(3) .description").should.equal \
                 "My first task "
            @browser.click ".task:nth-child(2) .down-task-button"

        it "Then task is displayed one row below previous task", ->
            @browser.html(".task:nth-child(2) .description").should.equal \
                 "My first task "
            @browser.html(".task:nth-child(3) .description").should.equal \
                 "My third task "

    describe "Delete task", (done) ->
        
        it "When I click on a task remove button.", ->
            @browser.click ".task:nth-child(2) .del-task-button"

        it "Then task is removed from DOM.", ->
            #@browser.length("#task-list .task").should.equal 2

    describe "Modify task description", (done) ->
        it "When I modify first task description", ->
            @browser.length(".task").should.equal 4
            @browser.html ".task .description:first", "change task"
            @browser.evaluate '$(".task .description:first").blur()'

        it "Then task data are saved.", ->
            #@browser.reload ->
            #done()

        it "Then task data are saved.", ->
            #@browser.html('.task .description').should.equal "change task"

