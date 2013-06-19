Task = require('models/task').Task

class SocketListener extends CozySocketListener

    models:
        'task': Task

    events: ['task.create','task.update', 'task.delete']

    onRemoteCreate: (task) =>
        task[k] = v for k, v of task.attributes
        @collections.forEach (collection) =>
            return if collection is @tmpcollection

            if @shouldBeAdded task, collection
                previousTask = collection.getPreviousTask task
                nextTask = collection.getNextTask task

                if not previousTask and not nextTask
                    previousTask = collection.last()

                index = collection.toArray().indexOf previousTask

                collection.add task, { at: (index + 1), silent: true }
                previousTask?.set "nextTask", task.id
                nextTask?.set "previousTask", task.id
                collection.view.insertTask previousTask?.view, task

    onRemoteUpdate: (task, collection) =>
        return null if collection is @tmpcollection
        changed = task.changedAttributes()

        if changed.done?
            if changed.done then task.setDone()
            else task.setUndone()

        if changed.description?
            task.view.descriptionField.val changed.description
            task.view.displayTagsNicely()

        if changed.list?
            previousTask = collection.getPreviousTask task
            nextTask = collection.getNextTask task

            nextTask?.setPreviousTask previousTask or null
            previousTask?.setNextTask nextTask or null

            collection.remove task
            task.view.remove()


        # if changed.previousTask or changed.nextTask

            # previousTask = collection.getPreviousTask task
            # nextTask = collection.getNextTask task

            # nextTask?.setPreviousTask previousTask or null
            # previousTask?.setNextTask nextTask or null

            # collection.remove task
            # task.view.remove()

            # index = collection.toArray().indexOf previousTask
            # task[key] = value for key, value of task.attributes
            # collection.add task, { at: (index + 1), silent: true }
            # collection.view.insertTask previousTask?.view, task

    onRemoteDelete: (id) ->
        @collections.forEach (collection) ->
            task = collection.get id
            if task?
                previousTask = collection.getPreviousTask task
                nextTask = collection.getNextTask task

                nextTask?.setPreviousTask previousTask or null
                previousTask?.setNextTask nextTask or null

                collection.remove task
                task.view.remove()

    shouldBeAdded: (task, collection) ->

        doesnotexist = not collection.get task.id
        samelist = collection.listId is task.get 'list'
        samedone = collection.view?.isArchive() is task.get 'done'
        return doesnotexist and samelist and samedone


module.exports = new SocketListener()