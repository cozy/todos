class exports.BrunchApplication
  constructor: ->
    $ =>
      @initialize this
      Backbone.history.start()

  initialize: ->
    null


exports.selectAll = (node) ->
    range = rangy.createRange()
    range.selectNodeContents(node[0].childNodes[0])
    sel = rangy.getSelection()
    sel.setSingleRange(range)
