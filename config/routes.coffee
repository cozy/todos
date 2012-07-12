exports.routes = (map) ->
    map.get '/', 'tasks#index'
    map.get '/tasks', 'tasks#todo'
    map.get '/tasks/archives', 'tasks#archives'
    map.get '/tasks/all', 'tasks#all'
    map.post '/tasks', 'tasks#create'
    map.get '/tasks/:id/', 'tasks#show'
    map.put '/tasks/:id/', 'tasks#update'
    map.del '/tasks/:id/', 'tasks#destroy'

    map.get '/todolists', 'todolists#all'
    map.post '/todolists', 'todolists#create'
    map.post '/todolists/path', 'todolists#allForPath'
    map.get '/todolists/:id', 'todolists#show'
    map.put '/todolists/:id', 'todolists#update'
    map.del '/todolists/:id', 'todolists#destroy'

    map.get '/tree', 'tree#tree'
