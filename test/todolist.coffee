should = require('chai').Should()
async = require('async')
Client = require('request-json').JsonClient
DataTree = require("../common/tree/tree_object").Tree
app = require('../server')
helpers = require("./helpers")

client = new Client("http://localhost:8888/")


describe "/todolists", ->

    before (done) ->
        app.listen 8888
        helpers.cleanDb done

    after (done) ->
        app.close()
        helpers.cleanDb done


    describe "POST /todolists Creates a todolist and update tree.", ->

        it "When I create several todolists", (done) ->
            async.series [
                helpers.createFullTodoListFunction "Recipe", "/all/recipe"
                helpers.createFullTodoListFunction "Dessert","/all/recipe/dessert"
                helpers.createFullTodoListFunction "Todo", "/all/todo"
            ], ->
                done()

        it "Then it should have 3 todolists created", (done) ->
            client.get "todolists/", (error, response, body) =>
                response.statusCode.should.equal 200
                todolists = body.rows
                todolists.length.should.equal 3
                todolists[0].title.should.equal "Recipe"
                todolists[0].path.should.equal "/all/recipe"
                todolists[0].humanPath.should.equal "All,Recipe"
                @recipeTodoList = todolists[0]
                done()

        it "And it should have updated tree structure properly", (done) ->
            client.get "tree/", (error, response, body) =>
                tree = new DataTree body
                should.exist tree.all.recipe.dessert
                should.exist tree.all.recipe
                should.exist tree.all.todo
                done()


    describe "PUT /todolists/:id Rename a todolist and update tree.", ->
        
        it "When I rename a todolist", (done) ->
            client.put "todolists/#{@recipeTodoList.id}", title: "Recipes", done


        it "Then it should have rename recipe todolist and its children", (done) ->
            client.get "todolists/", (error, response, body) =>
                response.statusCode.should.equal 200
                todolists = body
                todolists.rows.length.should.equal 3

                for list in todolists.rows
                    if list.title == "Recipes"
                       recipeList = list
                    else if list.title == "Dessert"
                        dessertList = list

                should.exist recipeList
                should.exist dessertList
                recipeList.path.should.equal "/all/recipes"
                recipeList.humanPath.should.equal "All,Recipes"
                dessertList.path.should.equal "/all/recipes/dessert"
                dessertList.humanPath.should.equal "All,Recipes,Dessert"
                done()

        it "And it should have updated tree structure properly", (done) ->
            client.get "tree/", (error, response, body) =>
                tree = new DataTree body
                should.exist tree.all.recipes
                should.exist tree.all.recipes.dessert
                should.exist tree.all.todo
                done()


    describe "PUT /todolists/:id Move a todolist", ->
        
        it "When I add two new todolists", (done) ->
            async.series [
                helpers.createFullTodoListFunction "Travel", "/all/travel"
                helpers.createFullTodoListFunction "Cambodia", \
                                               "/all/travel/cambodia"
            ], ->
                done()

        it "And I move recipe to travel", (done) ->
            client.put "todolists/#{@recipeTodoList.id}", path: "/all/travel/recipes", done

        it "Then it should have move recipe todolist and its children", (done) ->
            client.get "todolists/", (error, response, body) =>
                response.statusCode.should.equal 200
                todolists = body
                todolists.rows.length.should.equal 5

                for list in todolists.rows
                    if list.title == "Recipes"
                        recipeList = list
                    else if list.title == "Dessert"
                        dessertList = list

                should.exist recipeList
                should.exist dessertList
                recipeList.path.should.equal "/all/travel/recipes"
                recipeList.humanPath.should.equal "All,Travel,Recipes"
                dessertList.path.should.equal "/all/travel/recipes/dessert"
                dessertList.humanPath.should.equal "All,Travel,Recipes,Dessert"
                done()

        it "And it should have updated tree structure properly", (done) ->
            client.get "tree/", (error, response, body) =>
                tree = new DataTree body
                should.not.exist tree.all.recipes
                should.exist tree.all.travel.recipes
                should.exist tree.all.travel.recipes.dessert
                should.exist tree.all.todo
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
                tree = new DataTree body
                should.not.exist tree.all.recipe
                should.exist tree.all.todo
                should.exist tree.all.travel
                should.exist tree.all.travel.cambodia
                done()
