async = require 'async'
americano = require 'americano-cozy'

Task = require 'models/task'
Tree = require 'models/tree'


module.exports = TodoList = americano.getModel 'TodoList',
    property 'title', String
    property 'tags', String
    property 'path', String
    property 'humanPath', String

TodoList.all = (callback) -> TodoList.request 'all', callback

###
# Delete all lists.
# This method doesn't update the tree. Better suited for database clearing
# or test writing.
###
TodoList.destroyAll = (callback) ->
    TodoList.requestDestroy 'all', callback


###*
 * Destroy a list and its children and update the tree.
 * @param  {string} nodeId id of the note to delete
 * @param  {function} cbk
    cbk(error) is executed at the end returning null or the error.
###
TodoList.destroy = (nodeId, callback)->

    # called in parallele to delete each todolist in the db
    _deleteTodoList = (listId, callback) ->
        TodoList.find listId, (err, list) ->
            if err
                callback err
            else
                list.destroy (err) ->
                    if err then callback err
                    else
                        data =
                            startkey: [listId]
                            endkey: [listId + '0']
                        Task.requestDestroy 'todoslist', data, callback

    # vars
    dataTree = Tree.dataTree

    # walk through dataTree to remove the node and all its children
    nodesToDelete = dataTree.removeNode nodeId
    nodesToDelete.push nodeId

    # deletion in // of all the notes in the db
    async.forEach nodesToDelete, _deleteTodoList, (err)->
        Tree.tree.updateAttributes struct: dataTree.toJson(), callback
