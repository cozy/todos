class exports.MainRouter extends Backbone.Router
    routes:
        '': 'home'
        "todolist/:id/all/:path" : "list"
        "todolist/all" : "list"
        "tag/:tag" : "tag"

    initialize: ->
        @route(/^todolist\/(.*?)\/(.*?)$/, 'list')

    # Entry point, render app and select last selected list.
    home: (callback) ->
        $('body').html app.homeView.render().el
        app.homeView.setLayout()
        app.homeView.loadData ->
            if callback then callback()
            else app.homeView.selectList 'all'


    # Select given list (represented by its path), if tree is already
    # rendered, list is directly selected else it loads tree then it selects
    # given list.
    list: (id) ->
        @generateHomeView ->
            app.homeView.selectList id

    # Select given tag (represented by its slug), if tree is already
    # rendered, list is directly selected else it loads tree then it selects
    # given list.
    tag: (tag) ->
        @generateHomeView ->
            app.homeView.selectTag tag

    # Generate Home View if it's first loading.
    generateHomeView: (callback) ->
        if $("#tree-create").length > 0
            callback()
        else
            @home ->
                setTimeout((->
                    callback()), 100)
