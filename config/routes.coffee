exports.routes = (map) ->
    map.get '/', 'tasks#index'
    map.get '/tasks', 'tasks#all'
    map.get '/tasks/archives', 'tasks#archives'
    map.post '/tasks', 'tasks#create'
    map.get '/tasks/:id/', 'tasks#show'
    map.put '/tasks/:id/', 'tasks#update'
    map.del '/tasks/:id/', 'tasks#destroy'
