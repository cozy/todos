request = require '../lib/request'

# Simple widget used to display tag lists
class exports.TagListView extends Backbone.View
    id: 'tags'

    constructor: (@tagList) ->
        super()

    render: ->
        @$el = @el = $("#tags")
        @el.html null
        for tag in @tagList
            @addTagLine tag

    # Add tag to the DOM tag list.
    addTagLine: (tag) ->
        @el.append require('./templates/tag')(tag: tag)

    # Mark visually selected tag
    selectTag: (tag) ->
        @$("a").removeClass "selected"
        @$(".tag-#{tag} a").addClass "selected"

    # Remove selected style from all tags
    deselectAll: ->
        @$("a").removeClass "selected"

    # Add given tags if it does not appear in the list
    addTags: (tags) ->
        for tag in tags
            if not _.find(@tagList, (ctag) -> tag is ctag)?
                @tagList.push tag
                @addTagLine tag

    # Check if a tag is no more listed.
    checkForDeletion: ->
        request.get 'tasks/tags', (err, remoteTags) =>
            for tag in @tagList
                if tag not in remoteTags
                    @$(".tag-#{tag}").remove()
