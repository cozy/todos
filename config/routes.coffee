exports.routes = (map) ->
    map.get '/', 'tasks#index'
    map.get '/tasks', 'tasks#all'
    map.post '/tasks', 'tasks#create'
    map.get '/tasks/:id/', 'tasks#show'
    map.put '/tasks/:id/', 'tasks#update'
