
# Remove all todolists and tree from DB.
exports.cleanDb = (callback) ->
    TodoList.destroyAll ->
        Tree.destroyAll callback
