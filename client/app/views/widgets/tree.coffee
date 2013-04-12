slugify = require("helpers").slugify


### Widget to easily manipulate data tree (navigation for cozy apps)
Properties :
    currentPath      = ex : /all/coutries/great_britain
    currentData      = data : jstree data obj sent by the select
    currentNote_uuid : uuid of the currently selected note
    widget           = @jstreeEl.jstree
    searchField      = $("#tree-search-field")
    searchButton     = $("#tree-search")
    noteFull
    jstreeEl         = $("#tree")
###

class exports.Tree


    ###*
    # Initialize jsTree tree with options : sorting, create/rename/delete,
    # unique children and json data for loading.
    ###
    constructor: (navEl, data, homeViewCbk) ->

        # Var
        @jstreeEl = $("#tree")

        # Create toolbar inside DOM.
        navEl.prepend require('../templates/tree_buttons')

        # Tree creation
        @widget = @jstreeEl.jstree(
            plugins: [
                "themes", "json_data", "ui", "crrm",
                "sort", "cookies", "types",
                "hotkeys", "dnd", "search"
            ]
            json_data:
                data: data
            types:
                default:
                    valid_children: "default"
                root:
                    valid_children: null
                    delete_node: false
                    rename_node: false
                    move_node: false
                    start_drag: false
            crrm:
                move:
                    check_move: (data)->  # Drop over root is forbidden
                        if data.r.attr("id") is "tree-node-all"
                            return false
                        else
                            return true
            cookies:
                save_selected: false
            ui:
                select_limit: 1
                # initially_select: [ "tree-node-all" ]
            hotkeys:
                del: false
            themes:
                theme: "default"
                dots: false
                icons: false
            core:
                animation: 0
                initially_open: [ "tree-node-all" ]
            search:
                search_method: "jstree_contains_multi"
                show_only_matches: true
            dnd:
                "drag_finish": (data) =>
                    draggedTaskID = $(data.o.parentNode).prop 'id'
                    targetID = data.r[0].id
                    sourceID = @getSelectedNode().prop 'id'
                    homeViewCbk.onTaskMoved draggedTaskID, sourceID, targetID

                "drag_check": (data) =>
                    draggedTask = $(data.o.parentNode)
                    targetID = data.r[0].id
                    sourceID = @getSelectedNode().prop 'id'

                    canDrop =
                        after: false
                        before: false
                        inside: false

                    isSameList = sourceID is targetID

                    # if the action is: drag task to list
                    if not isSameList and draggedTask.hasClass 'task'
                        canDrop.inside = true

                    return canDrop
        )

        @setListeners homeViewCbk

    ###*
    # Bind listeners given in parameters with comment events (creation,
    # update, deletion, selection). Called by the constructor once.
    ###
    setListeners: (homeViewCbk) ->

        tree_buttons = $("#tree-buttons")
        # the jstree root has only an add button
        tree_buttons_root = $("#tree-buttons-root")

        jstreeEl = @jstreeEl
        $("#tree-create").tooltip
            placement: "bottom"
            title: "Add a sub-list"

        $("#tree-create").on "click", (e) ->
            jstreeEl.jstree(
                "create", this.parentElement.parentElement , 0 , "New list")
            $(this).tooltip('hide')
            e.stopPropagation()
            e.preventDefault()

        $("#tree-create-root").tooltip
            placement: "bottom"
            title: "Add a list"

        $("#tree-create-root").on "click", (e) ->
            jstreeEl.jstree(
                "create", this.parentElement.parentElement , 0 , "New list")
            $(this).tooltip('hide')
            e.stopPropagation()
            e.preventDefault()

        $("#tree-rename").tooltip
            placement: "bottom"
            title: "Rename a list"

        $("#tree-rename").on "click", (e) ->
            jstreeEl.jstree("rename", this.parentElement.parentElement)
            $(this).tooltip('hide')
            e.preventDefault()
            e.stopPropagation()

        $("#tree-remove").tooltip
            placement: "bottom"
            title: "Remove a list"

        $("#tree-remove").on "click", (e) ->
            nodeToDelete = @parentElement.parentElement.parentElement
            $(this).tooltip('hide')
            $('#confirm-delete-modal').modal('show')
            $("#yes-button").on "click", (e) =>
                noteToDelete_id = nodeToDelete.id
                if noteToDelete_id != 'tree-node-all'
                    jstreeEl.jstree("remove" , nodeToDelete)
                    homeViewCbk.onRemove noteToDelete_id
            e.preventDefault()
            e.stopPropagation()

        # add listeners for the tree-buttons appear & disappear when mouse
        # is over/out
        tree_buttons_target = $("#nav")

        @widget.on "hover_node.jstree", (event, data) ->
            # event & data - check the core doc of jstree for a
            # detailed description
            if data.rslt.obj[0].id is "tree-node-all"
                tree_buttons_root.appendTo(data.args[0])
                tree_buttons_root.css("display","block")
            else
                tree_buttons.appendTo(data.args[0])
                tree_buttons.css("display","block")

        @widget.on "dehover_node.jstree", (event, data) ->
            # event & data - check the core doc of jstree for
            # a detailed description
            if data.rslt.obj[0].id is "tree-node-all"
                tree_buttons_root.css("display","none")
                tree_buttons_root.appendTo(tree_buttons_target)
            else
                tree_buttons.css("display","none")
                tree_buttons.appendTo(tree_buttons_target)

        #repositionning the input field, tree and suggestion list
        #when the suppression
        # button is used
        textPrompt = $(".text-prompt")

        # Tree
        @widget.on "create.jstree", (e, data) =>
            nodeName = data.inst.get_text data.rslt.obj
            parentId = data.rslt.parent[0].id
            homeViewCbk.onCreate parentId, data.rslt.name, data

        @widget.on "rename.jstree", (e, data) =>
            newNodeName = data.rslt.new_name
            oldNodeName = data.rslt.old_name
            if oldNodeName != newNodeName
                homeViewCbk.onRename data.rslt.obj[0].id, newNodeName, data.inst

        @widget.on "select_node.jstree", (e, data) =>
            note_uuid = data.rslt.obj[0].id
            if note_uuid == "tree-node-all"
                path = "/all"
            else
                nodeName = data.inst.get_text data.rslt.obj
                parent = data.inst._get_parent()
                path = "/"+ data.rslt.obj[0].id + @_getSlugPath parent, nodeName
            @currentPath = path
            @currentData = data
            @currentNote_uuid = note_uuid
            @jstreeEl[0].focus()
            homeViewCbk.onSelect path, note_uuid, data

        @widget.on "move_node.jstree", (e, data) =>
            nodeId = data.rslt.o[0].id
            targetNodeId = data.rslt.o[0].parentElement.parentElement.id
            homeViewCbk.onDrop nodeId, targetNodeId

        @widget.on "loaded.jstree", (e, data) =>
            homeViewCbk.onLoaded()

    ###*
    #Select node corresponding to given path
    #if note_uuid exists in the jstree it is selected
    #otherwise if there is no selected node, we select the root
    ###
    selectNode: (note_uuid) ->
        node = $("##{note_uuid}")
        if node[0]
            @jstreeEl.jstree("deselect_all", null)
            @jstreeEl.jstree("select_node", node)
        else if not @jstreeEl.jstree("get_selected")[0]
            @jstreeEl.jstree("select_node", "#tree-node-all")

    # Deselect currently selected node.
    deselectAll: ->
        @jstreeEl.jstree("deselect_all", null)

    # Return Currently selected node.
    getSelectedNode: ->
        @jstreeEl.jstree("get_selected")

    # Return parent of given child
    getParent: (child) ->
        child.parent().parent()

    #Returns path to a node for a given node.
    #data.inst is the jstree instance

    _getPath: (parent, nodeName) ->
        nodes = [slugify nodeName] if nodeName?

        name = "all"
        while name and parent != undefined and parent.children != undefined
            name = parent.children("a:eq(0)").text()
            nodes.unshift slugify(name)
            parent = parent.parent().parent()
        nodes

    #Return path for a node at string format.
    _getSlugPath: (parent, nodeName) =>
        @_getPath(parent, nodeName).join("/")

