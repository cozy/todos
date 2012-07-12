{HomeView} = require 'views/home_view'
helpers = require "../helpers"

describe 'HomeView', ->
  before (done) ->
    @view = new HomeView
    @view.render()
    @view.loadData()
    helpers.waits done, 1000

  it 'When I wait for data to load', (done) ->
    expect(@view.$el.find '.task').to.have.length 1
    done()
