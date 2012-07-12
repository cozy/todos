# Base object, user manage tasks
Task = define 'Task', ->
    property 'done', Boolean, default: false
    property 'creationDate', Date, default: Date.now
    property 'completionDate', Date
    property 'description', String
    property 'previousTask', String
    property 'nextTask', String
    property 'list', String

# Todo list contains tasks. Each tasks are linked inside todo list.
TodoList = define 'TodoList', ->
    property 'title', String
    property 'tags', [String]
    property 'path', String
    property 'humanPath', [String]

# Tree is needed to send efficiently list to ui.
Tree = define 'Tree', ->
    property 'type', String, default: "TodoList"
    property 'struct', String
    property 'lastModificationDate', Date, default: Date

# User defines user that interacts with the Cozy instance.
# This schema is required for authentication.
User = define 'User', ->
    property 'email', String, index: true
    property 'password', String
    property 'owner', Boolean, default: false
    property 'activated', Boolean, default: false
