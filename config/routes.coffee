exports.routes = (map) ->
    #    map.get '/', 'tasks#index'

    map.get '/tasks/', 'tasks#all'
    map.get '/tasks/archives', 'tasks#all-archives'
    map.get '/todolists/:listId/tasks', 'tasks#todo'
    map.get '/todolists/:listId/tasks/archives', 'tasks#archives'
    map.post '/todolists/:listId/tasks', 'tasks#create'
    map.get '/todolists/:listId/tasks/:id/', 'tasks#show'
    map.put '/todolists/:listId/tasks/:id/', 'tasks#update'
    map.del '/todolists/:listId/tasks/:id/', 'tasks#destroy'

    map.get '/todolists', 'todolists#all'
    map.post '/todolists', 'todolists#create'
    map.post '/todolists/path', 'todolists#allForPath'
    map.get '/todolists/:id', 'todolists#show'
    map.put '/todolists/:id', 'todolists#update'
    map.del '/todolists/:id', 'todolists#destroy'

    map.get '/tree', 'tree#tree'
