Client = require("../../common/test/client").Client
client = new Client("http://localhost:8888/")

exports.cleandb = (callback) ->
    Task.destroyAll ->
        callback()

exports.initdb = (callback) ->
    client.post "tasks/", { description: "My first task" }, ->
        client.post "tasks/", { description: "My second task" }, ->
            client.post "tasks/", { description: "My third task" }, ->
                client.post "tasks/", \
                    { done: true, description: "My third task" }, ->
                    callback()
    
