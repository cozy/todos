async = require("async")
requests = require('../../common/requests')

module.exports = (compound, TodoList) ->
    Task = compound.models.Task
    Tree = compound.models.Tree

    TodoList.all = (callback) -> TodoList.request "all", callback

    ###
    # Delete all notes.
    # This method doesn't update the tree. Better suited for database clearing
    # or test writing.
    ###
    TodoList.destroyAll = (callback) ->
        TodoList.requestDestroy "all", callback


    ###*
     * Destroy a note and its children and update the tree.
     * @param  {string} nodeId id of the note to delete
     * @param  {function} cbk    cbk(error) is executed at the end returning null
               or the error.
    ###
    TodoList.destroy = (nodeId, cbk)->

        # called in parallele to delete each note in the db
        _deleteTodoList = (listId, cbk) ->
            TodoList.find listId, (err, list) ->
                if err
                    cbk err
                else
                    list.destroy (err) ->
                        if err
                            cbk err
                        else
                            data =
                                startkey: [listId]
                                endkey: [listId + "0"]
                            Task.requestDestroy "todoslist", data, cbk

        
        # vars
        dataTree = Tree.dataTree

        # walk through dataTree to remove the node and all its children
        nodesToDelete = dataTree.removeNode(nodeId)
        nodesToDelete.push(nodeId)

        # deletion in // of all the notes in the db
        async.forEach nodesToDelete, _deleteTodoList, (err)->

            # then we can save the tree
            Tree.tree.updateAttributes struct: dataTree.toJson(), (err) ->
                if err
                    cbk err
                else
                    cbk null
