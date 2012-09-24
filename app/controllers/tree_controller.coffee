load 'application'

###-------------------------------------#
# Helpers
###

###
# Before each action current tree is loaded. If it does not exists it created.
###
before 'load tree', ->
    Tree.getOrCreate (err, tree) =>
        if err
            console.log err
            send error: 'An error occured while loading tree', 500
        else
            next()

###-------------------------------------#
# Actions
###

###
# Returns complete tree.
###
action 'tree', ->
    send Tree.dataTree.toJsTreeJson()
