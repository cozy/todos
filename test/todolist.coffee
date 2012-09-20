should = require('chai').Should()
async = require('async')
Client = require('request-json').JsonClient
DataTree = require("../common/data-tree").DataTree
app = require('../server')
helpers = require("./helpers")

client = new Client("http://localhost:8888/")


describe "/todolists", ->

    before (done) ->
        app.listen 8888
        helpers.cleanDb done

    after (done) ->
        app.close()
        #helpers.cleanDb done
        done()


    describe "POST /todolists Creates a todolist and update tree.", ->

        it "When I create several todolists", (done) ->
            client.post "todolists/", title: "Recipe", (err, res, body) ->
                data =
                    title: "Dessert"
                    parent_id: body.id
                client.post "todolists/", data, (err, recipeList) ->
                    client.post "todolists/", title: "Todo", ->
                        done()

        it "Then it should have 3 todolists created", (done) ->
            client.get "todolists/", (error, response, body) =>
                response.statusCode.should.equal 200
                todolists = body
                todolists.rows.length.should.equal 3
                todolists.rows[0].title.should.equal "Recipe"
                todolists.rows[0].path[0].should.equal "Recipe"
                todolists.rows[1].path[0].should.equal "Recipe"
                todolists.rows[1].path[1].should.equal "Dessert"
                @recipeTodoList = todolists.rows[0]
                done()

        it "And it should have updated tree structure properly", (done) ->
            client.get "tree/", (error, response, body) =>
                tree = new DataTree JSON.stringify body
                
                tree.root.data.should.equal "All"
                tree.root.children[0].data.should.equal "Recipe"
                tree.root.children[0].children[0].data.should.equal "Dessert"
                tree.root.children[1].data.should.equal "Todo"
                
                done()


    describe "PUT /todolists/:id Rename a todolist and update tree.", ->
        
        it "When I rename a todolist", (done) ->
            client.put "todolists/#{@recipeTodoList.id}", title: "Recipes", done


        it "Then it should have rename recipe todolist and its children", (done) ->
            client.get "todolists/", (error, response, body) =>
                response.statusCode.should.equal 200
                todolists = body
                todolists.rows.length.should.equal 3
                todolists.rows[0].title.should.equal "Recipes"

                todolists.rows[0].path[0].should.equal "Recipes"
                todolists.rows[1].title.should.equal "Dessert"
                
                todolists.rows[1].path[0].should.equal "Recipes"
                todolists.rows[1].path[1].should.equal "Dessert"
                done()

        it "And it should have updated tree structure properly", (done) ->
            client.get "tree/", (error, response, body) =>
                tree = new DataTree JSON.stringify(body)
                tree.root.children[0].data.should.equal "Recipes"
                tree.root.children[0].children[0].data.should.equal "Dessert"
                tree.root.children[1].data.should.equal "Todo"
                done()


    describe "PUT /todolists/:id Move a todolist", ->
        
        it "When I add two new todolists", (done) ->
            client.post "todolists/", title: "Travel", (err, res, body) =>
                data =
                    title: "Cambodia"
                    parent_id: body.id
                @travelListId = body.id
                client.post "todolists/", data, done

        it "And I move recipe to travel", (done) ->
            client.put "todolists/#{@recipeTodoList.id}", \
                        { parent_id: @travelListId }, done

        it "Then it should have move recipe todolist and its children", (done) ->
            client.get "todolists/", (error, response, body) =>
                response.statusCode.should.equal 200
                todolists = body
                todolists.rows.length.should.equal 5
                todolists.rows[0].title.should.equal "Recipes"
                todolists.rows[0].path[0].should.equal "Travel"
                todolists.rows[0].path[1].should.equal "Recipes"

                todolists.rows[1].title.should.equal "Dessert"
                todolists.rows[1].path[0].should.equal "Travel"
                todolists.rows[1].path[1].should.equal "Recipes"
                todolists.rows[1].path[2].should.equal "Dessert"
                done()

        it "And it should have updated tree structure properly", (done) ->
            client.get "tree/", (error, response, body) =>
                tree = new DataTree JSON.stringify body
                tree.root.children[1].data.should.equal "Travel"
                tree.root.children[1].children[0].data.should.equal "Cambodia"
                tree.root.children[1].children[1].data.should.equal "Recipes"
                tree.root.children[1].children[1].children[0].data.should.equal "Dessert"
                done()


    describe "DELETE /todolists/:id Deletes a todolist and update tree.", ->
        
        it "When I delete Recipe todolist", (done) ->
            client.del "todolists/#{@recipeTodoList.id}", done

        it "Then it should have delete recipe todolist and its children", (done) ->
            client.get "todolists/", (error, response, body) =>
                response.statusCode.should.equal 200
                todolists = body
                todolists.rows.length.should.equal 3
                done()

        it "And it should have updated tree structure properly", (done) ->
            client.get "tree/", (error, response, body) =>
                tree = new DataTree JSON.stringify body
                tree.root.children[1].data.should.equal "Travel"
                tree.root.children[1].children.length.should.equal 1
                tree.root.children[1].children[0].data.should.equal "Cambodia"
                done()
