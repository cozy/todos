exports.routes = (map) ->

    # routes for tasks interactions
    map.get '/tasks/', 'tasks#all'
    map.get '/tasks/todo', 'tasks#todo'
    map.get '/tasks/archives', 'tasks#all-archives'
    map.get '/todolists/:listId/tasks', 'tasks#todo'
    map.get '/todolists/:listId/tasks/archives', 'tasks#archives'
    map.post '/todolists/:listId/tasks', 'tasks#create'
    map.get '/todolists/:listId/tasks/:id', 'tasks#show'
    map.put '/todolists/:listId/tasks/:id', 'tasks#update'
    map.del '/todolists/:listId/tasks/:id', 'tasks#destroy'
    map.get '/tasks/tags/:tag/todo', 'tasks#tagTodo'
    map.get '/tasks/tags/:tag/archives', 'tasks#tagArchives'

    # routes for todolists interactions
    map.get  '/todolists', 'todolists#all'
    map.post '/todolists', 'todolists#create'
    map.post '/todolists/path', 'todolists#allForPath'
    map.get  '/todolists/:id', 'todolists#show'
    map.put  '/todolists/:id', 'todolists#update'
    
    map.del  '/todolists/:id', 'todolists#destroy'

    # routes for tag interactions
    map.get '/tasks/tags', 'tasks#tags'
    
    # routes for tree interactions
    map.get  '/tree', 'tree#tree'
