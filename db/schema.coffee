Task = define 'Task', ->
    property 'done', Boolean, default: false
    property 'creationDate', Date, default: Date.now
    property 'completionDate', Date
    property 'description', String
    property 'previousTask', String
    property 'nextTask', String

# User defines user that interacts with the Cozy instance.
# This schema is required for authentication.
User = define 'User', ->
    property 'email', String, index: true
    property 'password', String
    property 'owner', Boolean, default: false
    property 'activated', Boolean, default: false
