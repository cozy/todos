class exports.MainRouter extends Backbone.Router
    routes:
        '': 'home'

    # routes that need regexp.
    initialize: ->
        @route(/^todolist\/(.*?)$/, 'list')
    
    # Entry point, render app and select last selected list.
    home: ->
        $('body').html app.homeView.render().el
        app.homeView.setLayout()
        app.homeView.loadData()

    # Select given list (represented by its path), if tree is already
    # rendered, list is directly selected else it loads tree then it selects
    # given list.
    list: (path) ->
        selectList = ->
            app.homeView.selectList path

        if $("#tree-create").length > 0
            selectList()
        else
            @home ->
                setTimeout((->
                    selectList()), 100)
