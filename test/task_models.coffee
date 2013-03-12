should = require('chai').Should()
async = require('async')
app = require('../server')
helpers = require("./helpers")



initDb = (callback) ->
    async.series [
        helpers.createTodoListFunction "list 01", "all/list-01"
        helpers.createTodoListFunction "list 02", "all/list-02"
    ], ->
        TodoList.all (err, lists) ->
            id1 = lists[0].id
            id2 = lists[1].id
            async.series [
                helpers.createTaskFunction id1, false, "task 01"
                helpers.createTaskFunction id1, false, "task 02"
                helpers.createTaskFunction id1, true, "task 03"
                helpers.createTaskFunction id1, false, "task 04"
                helpers.createTaskFunction id2, false, "task 05"
                helpers.createTaskFunction id2, false, "task 06"
                helpers.createTaskFunction id2, true, "task 07"
                helpers.createTaskFunction id2, true, "task 08"
            ], ->
                callback()



describe "Task Model", ->

    before (done) ->
        helpers.cleanDb =>
            initDb =>
                TodoList.all (err, lists) =>
                    @listId1 = lists[0].id
                    @listId2 = lists[1].id
                    done()

    describe "archives", ->
        it "should return done task for given list", (done) ->
            Task.archives @listId2, (err, tasks) ->
                tasks.length.should.equal 2
                for task in tasks
                    task.done.should.be.ok
                done()

            
        it "should return all done tasks when no list is given", (done) ->
            Task.archives null, (err, tasks) ->
                tasks.length.should.equal 3
                for task in tasks
                    task.done.should.be.ok
                done()

    
    describe "allTodo", ->
        it "should return todo task for given list", (done) ->
            Task.allTodo @listId2, (err, tasks) ->
                tasks.length.should.equal 2
                for task in tasks
                    task.done.should.not.be.ok
                done()

        it "should return all done tasks when no list is given", (done) ->
            Task.allTodo null, (err, tasks) ->
                tasks.length.should.equal 5
                for task in tasks
                    task.done.should.not.be.ok
                done()

    describe "setFirstTask", ->
        it "When I set a new task as first task", (done) ->
            task = new Task
                list: @listId1
                description: "Task 09"
                done: false

            Task.create task, (err, newTask) ->
                Task.setFirstTask newTask, ->
                    done()

        it "Then the task links are properly set", (done) ->
            Task.allTodo @listId1, (err, tasks) ->
                tasks[0].description.should.equal "Task 09"
                console.log task.description for task in tasks
                
                tasks[0].nextTask.should.equal tasks[1].id
                tasks[1].previousTask.should.equal tasks[0].id
                done()

    describe "links", ->
        before (done) ->
            Task.allTodo @listId1, (err, tasks) =>
                @tasks = tasks
                done()

         describe "setPreviousLink", ->
            it "save previous link on the other side of the link", (done) ->
                @tasks[2].previousTask = @tasks[0].id
                Task.setPreviousLink @tasks[2], (err) =>
                    should.not.exist err
                    Task.find @tasks[0].id, (err, task) =>
                        task.nextTask.should.equal @tasks[2].id
                        done()
                    
        describe "setNextLink", ->
            it "save next link on the other side of the link", (done) ->
                @tasks[0].nextTask = @tasks[2].id
                Task.setNextLink @tasks[0], (err) =>
                    should.not.exist err
                    Task.find @tasks[2].id, (err, task) =>
                        should.not.exist err
                        task.previousTask.should.equal @tasks[0].id
                        done()
         
        describe "updateLinks", ->
            it "updateLinks", (done) ->
                @tasks[1].previousTask = @tasks[0].id
                @tasks[1].nextTask = @tasks[2].id
                Task.updateLinks @tasks[1], (err) =>
                    should.not.exist err
                    Task.find @tasks[2].id, (err, task) =>
                        should.not.exist err
                        task.previousTask.should.equal @tasks[1].id
                        Task.find @tasks[0].id, (err, task) =>
                            should.not.exist err
                            task.nextTask.should.equal @tasks[1].id
                            done()

        describe "insertTasks", ->
            it "When I insert a task", (done) ->
                Task.allTodo @listId1, (err, tasks) =>
                    @tasks = tasks
                    task = new Task
                        list: @listId1
                        description: "Task 10"
                        done: false
                        previousTask: @tasks[1].id
                    Task.createNew task, (err, newTask) =>
                        @task = newTask
                        Task.insertTask newTask, ->
                            done()

            it "Then all tasks has proper links", (done) ->
                Task.allTodo @listId1, (err, tasks) =>
                    @tasks = tasks
                        
                    @tasks[1].nextTask.should.equal @task.id
                    @tasks[3].previousTask.should.equal @task.id
                    @tasks[2].description.should.equal @task.description
                    @tasks[2].previousTask.should.equal @tasks[1].id
                    @tasks[2].nextTask.should.equal @tasks[3].id
                    done()


        describe "createNew", ->

            it "Task is done", (done) ->
                task = new Task
                    list: @listId1
                    description: "Task 11"
                    done: true
                Task.createNew task, ->
                    Task.archives @listId1, (err, tasks) ->
                        tasks.length.should.equal 4
                        done()
 
            it "Task is todo with no link set", (done) ->
                task = new Task
                    list: @listId1
                    description: "Task 12"
                    done: false
                Task.createNew task, (err, newTask) =>
                    Task.allTodo @listId1, (err, tasks) =>
                        @tasks = tasks
                        tasks.length.should.equal 6
                        tasks[0].id.should.equal newTask.id
                        done()
            
            it "Task is todo with link set", (done) ->
                task = new Task
                    list: @listId1
                    description: "Task 13"
                    done: false
                    previousTask: @tasks[1].id
                Task.createNew task, (err, newTask) =>
                    Task.allTodo @listId1, (err, tasks) ->
                        tasks.length.should.equal 7
                        tasks[2].id.should.equal newTask.id
                        done()
            

        describe "Extract tags", ->

            it "Two tags are extracted.", ->
                task = new Task description: "my first #task for #today"
                task.extractTags()
                
                task.tags.length.should.eql 2
                task.tags[0].should.eql "task"
                task.tags[1].should.eql "today"

                
### Create a new task and add it to the todo task list if its state is not done.
##Task.createNew = (task, callback) ->
    ##task.nextTask = null
    ##Task.create task, (err, task) ->
        ##return callback err if err

        ##if not task.done \
           ##and not task.previousTask?
            ##Task.setFirstTask task, callback
        ##else
            ##Task.insertTask task, (err) ->
                ##callback err, task

## Change next task ID of previous task with next task ID of current task.
##Task.removePreviousLink = (task, callback) ->
    ##if task.previousTask? and not task.done
        ##Task.find task.previousTask, (err, previousTask) =>
            ##return callback err if err

            ##previousTask.nextTask = task.nextTask
            ##previousTask.save callback
    ##else
        ##callback null

## Change previous task ID of next task with previous task ID of current task.
##Task.removeNextLink = (task, callback) ->
    ##if task.nextTask? and not task.done
        ##Task.find task.nextTask, (err, nextTask) =>
            ##return callback err if err

            ##nextTask.previousTask = task.previousTask
            ##nextTask.save callback
    ##else
        ##callback null

## Remove all links set on given task.
##Task.removeLinks = (task, callback) ->
    ##Task.removePreviousLink task, (err) ->
        ##return callback err if err

        ##Task.removeNextLink task, callback

## Remove task from DB and clean links if tasks were inside todo list.
##Task.remove = (task, callback) ->
    ##Task.removeLinks task, (err) ->
        ##return callback err if err

        ##task.destroy callback

## When task is done, it is removed from todo linked list.
##Task.done = (task, attributes, callback) ->
    ##Task.removePreviousLink task, (err) ->
        ##return callback err if err

        ##Task.removeNextLink task, (err) ->
            ##return callback err if err

            ##attributes.previousTask = null
            ##attributes.nextTask = null
            
            ##task.updateAttributes attributes, callback


## When task go back to todo, it is added as first task to the todo list.
## If task previous task is specified, it is inserted after this task.
##Task.todo = (task, attributes, callback) ->
    ##if attributes.previousTask?
        ##task.previousTask = attributes.previousTask
        ##Task.insertTask task, (err) ->
            ##return callback err if err

            ##attributes.nextTask = task.nextTask
            ##attributes.previousTask = task.previousTask
            ##task.updateAttributes attributes, callback

    ## If now new link are set task become first task
    ##else
        ##Task.setFirstTask task, (err) ->
            ##return callback err if err

            ##attributes.nextTask = task.nextTask
            ##task.updateAttributes attributes, callback

## Moving a task is doing in two steps: remove links, then insert it inside
## todo linked list.
##Task.move = (task, attributes, callback) ->
    ##Task.removeLinks task, (err) ->
        ##return callback err if err

        ##if attributes.previousTask?
            ##task.previousTask = attributes.previousTask
            ##Task.insertTask task, (err) ->
                ##return callback err if err

                ##attributes.nextTask = task.nextTask
                ##attributes.previousTask = task.previousTask

                ##task.updateAttributes attributes, callback
        ##else
            ##Task.setFirstTask task, (err) ->
                ##return callback err if err

                ##attributes.nextTask = task.nextTask
                ##task.updateAttributes attributes, callback

