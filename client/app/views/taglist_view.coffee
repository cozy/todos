# Simple widget used to display tag lists
class exports.TagListView extends Backbone.View
    id: 'tags'

    constructor: (@tagList) ->
        super()

    render: ->
        @el = $("#tags")
        @el.html null
        for tag in @tagList
            @addTagLine tag

    # Add tag to the DOM tag list.
    addTagLine: (tag) ->
        @el.append("<div><a href=\"#tag/#{tag}\">#{tag}</a></div>")

    # Mark visually selected tag
    selectTag: (tag) ->
        $("#tags a").each (index, el) ->
            if $(el).html() is tag
                $(el).addClass "selected"
            else
                $(el).removeClass "selected"

    # Remove selected style from all tags
    deselectAll: ->
        $("#tags a").removeClass "selected"

    # Add given tags if it does not appear in the list
    addTags: (tags) ->
        for tag in tags
            if not _.find(@tagList, (ctag) -> tag is ctag)?
                @tagList.push tag
                @addTagLine tag
