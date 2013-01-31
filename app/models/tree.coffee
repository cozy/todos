async = require("async")
DataTree = require('../../common/data-tree').DataTree


module.exports = (compound, Tree) ->

    # Return all tree grouped by type.
    Tree.all = (params, callback) -> Tree.request "all", params, callback

    ###
    # Add a node corresponding to the note in the dataTree.
    # Save the tree
    # The id of the created note is in the note itself
    ###
    Tree.addNode = (note, parent_id, cbk)->
        Tree.dataTree.addNode(note,parent_id)
        Tree.tree.updateAttributes struct: Tree.dataTree.toJson(), (err) ->
            if err
                cbk(err)
            else
                cbk(null)

    ###
    # Moves or rename a node.
    # Update the title in the dataTree.
    # update the path of the note and propagates to its children.
    # Save the tree
    ###
    Tree.moveOrRenameNode = (noteId, newTitle, newParentId, cbk) ->

        # params : noteDataItem = {id:"note id", path: "[note path, an array]"}
        _updateTodoListPath = (dataItem, cbk) ->
            dataItem.path = JSON.stringify(dataItem.path)
            
            list = new TodoList dataItem
            list.updateAttributes dataItem, cbk

        # update the dataTree
        dataTree = Tree.dataTree
        if newTitle
            dataTree.updateTitle(noteId, newTitle) # synchronous operation
        if newParentId
            dataTree.moveNode(noteId, newParentId) # synchronous method

        # get all the children and their paths in an array to update them
        notes4pathUpdate = dataTree.getPaths(noteId)

        # synchronisation of the update of all the notes
        async.forEach notes4pathUpdate, _updateTodoListPath, ->
            # then we can save the tree
            Tree.tree.updateAttributes struct: dataTree.toJson(), (err) ->
                if err
                    cbk(err)
                else
                    newPath = dataTree.getPath(noteId)
                    cbk(null)

    ###
    # Remove all tree of type TodoList from database.
    ###
    Tree.destroyAll = (callback) ->
        Tree.requestDestroy "all", key:"TodoList", callback

    ###
    # Normally only one tree should be stored for this app. This function return
    # that tree if it exists. If is does note exist a new empty tree is created
    # and returned.
    # returns callback(err,tree)
    ###
    Tree.getOrCreate = (callback) ->
        Tree.all key:"TodoList", (err, trees) ->
            if err
                callback err
            else if trees.length == 0
                newDataTree =  new DataTree()
                data =
                    struct: newDataTree.toJson()
                    type: "TodoList"
                Tree.create data, (err,tree)->
                    Tree.dataTree = newDataTree
                    Tree.tree     = tree
                    callback(null, tree)
            else
                Tree.tree = trees[0]
                Tree.dataTree = new DataTree(trees[0].struct)
                callback(null, trees[0])

    ###
    # retuns the path of the note in the cbk(err, path)
    ###
    Tree.getPath = (note_id, cbk)->
        return Tree.dataTree.getPath(note_id)
