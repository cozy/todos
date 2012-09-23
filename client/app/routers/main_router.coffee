class exports.MainRouter extends Backbone.Router
    routes:
        '': 'home'
        "todolist/:id/:path" : "list"

    # Entry point, render app and select last selected list.
    home: (callback) ->
        $('body').html app.homeView.render().el
        app.homeView.setLayout()
        app.homeView.loadData callback

    # Select given list (represented by its path), if tree is already
    # rendered, list is directly selected else it loads tree then it selects
    # given list.
    list: (id, path) ->
        selectList = ->
            app.homeView.selectList id

        if $("#tree-create").length > 0
            selectList()
        else
            @home ->
                setTimeout((->
                    selectList()), 100)
