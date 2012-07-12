class exports.BrunchApplication
  constructor: ->
    $ =>
      @initialize this
      Backbone.history.start()

  initialize: ->
    null


# Select all content of a node.
exports.selectAll = (node) ->
    if node.length > 0
        range = rangy.createRange()
        range.selectNodeContents(node[0].childNodes[0])
        sel = rangy.getSelection()
        sel.setSingleRange(range)
        true
    else
        false

# Get cursor position inside a given node.
exports.getCursorPosition = (node) ->
    if node.length > 0
        range = rangy.createRange()
        range.selectNodeContents(node[0].childNodes[0])
        sel = rangy.getSelection()
        range = sel.getRangeAt(0)
        return range.endOffset
    else
        return 0

# Set cursor position inside a given node.
exports.setCursorPosition = (node, cursorPosition) ->
    if node.length > 0
        range = rangy.createRange()
        range.collapseToPoint(node[0].childNodes[0], cursorPosition)
        sel = rangy.getSelection()
        sel.setSingleRange(range)
        true
    else
        false

exports.slugify = (string) ->
    _slugify_strip_re = /[^\w\s-]/g
    _slugify_hyphenate_re = /[-\s]+/g
    string = string.replace(_slugify_strip_re, '').trim().toLowerCase()
    string = string.replace _slugify_hyphenate_re, '-'
    string


exports.getPathRegExp = (path) ->
    slashReg = new RegExp "/", "g"
    "^#{path.replace(slashReg, "\/")}"
