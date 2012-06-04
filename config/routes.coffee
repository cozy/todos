exports.routes = (map) ->
    map.get '/', 'tasks#index'
    map.get '/tasks', 'tasks#all'
    map.post '/tasks', 'tasks#create'
