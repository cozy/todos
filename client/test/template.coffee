should = require("should")
Browser = require("../../common/test/browser").Browser

app = require("../../server")


describe "Test Section", ->

    before (done) ->
        app.listen 8888
        done()

    before (done) ->
        @browser = new Browser()
        @browser.visit "http://localhost:8888/", =>
            done()

    after (done) ->
        app.close()
        done()


    it "When I connect to root page I expect that there is a body", ->
        should.exist @browser.query("body")


        

