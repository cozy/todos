class exports.BrunchApplication
  constructor: ->
    $ =>
      @initialize this
      Backbone.history.start()

  initialize: ->
    null


# Select all content of a node.
exports.selectAll = (node) ->
    node.setSelection(0, node.val().length)

exports.slugify = (string) ->
    _slugify_strip_re = /[^\w\s-]/g
    _slugify_hyphenate_re = /[-\s]+/g
    string = string.replace(_slugify_strip_re, '').trim().toLowerCase()
    string = string.replace _slugify_hyphenate_re, '-'
    string


exports.getPathRegExp = (path) ->
    slashReg = new RegExp "/", "g"
    "^#{path.replace(slashReg, "\/")}"
