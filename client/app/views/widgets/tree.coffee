slugify = require("../../helpers").slugify

# Widget to easily manipulate data tree (navigation for cozy apps)
class exports.Tree

    # Initialize jsTree tree with options : sorting, create/rename/delete,
    # unique children and json data for loading.
    constructor: (navEl, @treeEl, data, callbacks) ->
        @setToolbar navEl

        tree = @_convertData data
        @widget = @treeEl.jstree
            plugins: [
                "themes", "json_data", "ui", "crrm",
                "unique", "sort", "cookies", "types",
                "hotkeys", "dnd", "search"
            ]
            json_data: tree
            types:
                "default":
                    valid_children: "default"
                "root":
                    valid_children: null
                    delete_node: false
                    rename_node: false
                    move_node: false
                    start_drag: false
            hotkeys:
                space: false
                up: false
                down: false
                left: false
                right: false
                del: false
            ui:
                select_limit: 1
                initially_select: [ "tree-node-all" ]
            themes:
                theme: "default"
                dots: false
                icons: false
            core:
                animation: 0
                initially_open: [ "tree-node-all" ]
            unique:
                error_callback: (node, p, func) ->
                    alert "A note has already that name: '#{node}'"

        @searchField = $("#tree-search-field")
        @searchButton = $("#tree-search")

        @setListeners callbacks

    # Create toolbar inside DOM.
    setToolbar: (navEl) ->
        navEl.prepend require('../templates/tree_buttons')

    # Bind listeners given in parameters with comment events (creation,
    # update, deletion, selection).
    setListeners: (callbacks) ->

        # Toolbar
        $("#tree-create").click =>
            @treeEl.jstree("create")
        $("#tree-rename").click =>
            @treeEl.jstree("rename")
        $("#tree-remove").click =>
            @treeEl.jstree("remove")
        @searchButton.click @_onSearchClicked
        @searchField.keyup @_onSearchChanged

        # Tree
        @widget.bind "create.jstree", (e, data) =>
            nodeName = data.inst.get_text data.rslt.obj
            parent = data.rslt.parent
            path = @_getPath parent, nodeName
            path.pop()
            idPath = "tree-node#{@_getPath(parent, nodeName).join("-")}"
            data.rslt.obj.attr "id", idPath
            callbacks.onCreate path.join("/"), data.rslt.name, data

        @widget.bind "rename.jstree", (e, data) =>
            nodeName = data.inst.get_text data.rslt.obj
            parent = data.inst._get_parent data.rslt.parent
            path = @_getStringPath parent, data.rslt.old_name
            if path == "all"
                $.jstree.rollback data.rlbk
            else if data.rslt.old_name != data.rslt.new_name
                idPath = "tree-node#{@_getPath(parent, nodeName).join("-")}"
                data.rslt.obj.attr "id", idPath
                @rebuildIds data, data.rslt.obj, idPath
                callbacks.onRename path, data.rslt.new_name, data

        @widget.bind "remove.jstree", (e, data) =>
            nodeName = data.inst.get_text data.rslt.obj
            parent = data.rslt.parent
            path = @_getStringPath parent, nodeName
            if path == "all"
                $.jstree.rollback data.rlbk
            else
                callbacks.onRemove path

        @widget.bind "select_node.jstree", (e, data) =>
            nodeName = data.inst.get_text data.rslt.obj
            parent = data.inst._get_parent data.rslt.parent
            path = @_getStringPath parent, nodeName
            callbacks.onSelect path, data.rslt.obj.data("id")

        @widget.bind "move_node.jstree", (e, data) =>
            nodeName = data.inst.get_text data.rslt.o
            parent = data.inst._get_parent data.rslt.o
            newPath = @_getPath parent, nodeName
            newPath.pop()
            oldParent = data.inst.get_text data.rslt.op
            parent = data.inst._get_parent data.rslt.op
            oldPath = @_getPath parent, oldParent
            oldPath.push(slugify nodeName)
            if newPath.length == 0
                $.jstree.rollback data.rlbk
            else
                callbacks.onDrop newPath.join("/"), oldPath.join("/"), \
                                 nodeName, data

        @widget.bind "loaded.jstree", (e, data) =>
            callbacks.onLoaded()

    # Rebuild ids of obj children. 
    rebuildIds: (data, obj, idPath) ->
        for child in data.inst._get_children obj
            newIdPath = idPath + "-" + slugify($(child).children("a:eq(0)").text())
            $(child).attr "id", newIdPath
            @rebuildIds data, child, newIdPath


    # Select node corresponding to given path
    selectNode: (path) ->
        nodePath = path.replace(/\//g, "-")
        node = $("#tree-node-#{nodePath}")
        
        tree = $("#tree").jstree("deselect_all", null)
        tree = $("#tree").jstree("select_node", node)


    # Returns path to a node for a given node.
    # data.inst is the js tree instance
    _getPath: (parent, nodeName) ->
        nodes = [slugify nodeName] if nodeName?

        name = "all"
        while name and parent != undefined and parent.children != undefined
            name = parent.children("a:eq(0)").text()
            nodes.unshift slugify(name)
            parent = parent.parent().parent()
        nodes

    # Return path for a node at string format.
    _getStringPath: (parent, nodeName) =>
        @_getPath(parent, nodeName).join("/")
       
    # Convert tree coming from server to jstree format.
    # It builds the root of the tree then recursively add node to it.
    _convertData: (data) =>
        # root node
        tree =
            data:
                data: "all"
                attr:
                    id: "tree-node-all"
                    rel: "root"
                children: []

        @_convertNode tree.data, data.all, "-all"
        tree.data = "loading..." if tree.data.length == 0
        tree

    # Convert a node coming from node server to jstree format. Then convertNode
    # is called recursively on node children.
    # * parentNode is the node on which converted node will be set.
    # * noteToConvert is the node that is going to be converted
    # * idpath is the current path used to build the node DOM id. 
    _convertNode: (parentNode, nodeToConvert, idpath) ->
        for property of nodeToConvert when \
                property isnt "name" and property isnt "id"
            nodeIdPath = "#{idpath}-#{property.replace(/_/g, "-")}"
            newNode =
                data: nodeToConvert[property].name
                metadata:
                    id: nodeToConvert[property].id
                attr:
                    id: "tree-node#{nodeIdPath}"
                    rel: "default"
                children: []

            if parentNode.children == undefined
                parentNode.data.push newNode
            else
                parentNode.children.push newNode

            @_convertNode newNode, nodeToConvert[property], nodeIdPath


    # When search button is clicked, quick search input is displayed or hidden
    # (reverse state). If quick search is displayed, the focus goes on it.
    _onSearchClicked: (event) =>
        if @searchField.is(":hidden")
            @searchField.show()
            @searchField.focus()
            @searchButton.addClass("button-active")
        else
            @searchField.hide()
            @searchButton.removeClass("button-active")

    # When quick search changes, the jstree quick search function is run with
    # input val as argument.
    _onSearchChanged: (event) =>
        searchString = @searchField.val()
        @treeEl.jstree("search", searchString)
