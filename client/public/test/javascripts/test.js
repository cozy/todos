(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"test/task_collection_test": function(exports, require, module) {
  var HomeView, Task, TaskCollection, TaskLine, TaskList, TodoList, TodoListWidget;

  Task = require('models/task').Task;

  TaskCollection = require('collections/tasks').TaskCollection;

  TaskLine = require('views/task_view').TaskLine;

  TaskList = require('views/tasks_view').TaskList;

  TodoListWidget = require('views/todolist_view').TodoListWidget;

  TodoList = require('models/todolist').TodoList;

  HomeView = require('views/home_view').HomeView;

  TaskCollection.prototype.addNewTask = function(id, list, description) {
    var task;
    task = new Task({
      id: id,
      list: list,
      description: description
    });
    return this.add(task);
  };

  describe('Task Collection', function() {
    before(function() {
      var todoList, todoListView;
      window.app = {};
      window.app.homeView = new HomeView();
      todoList = new TodoList({
        id: 123,
        title: "list 01"
      });
      todoListView = new TodoListWidget(todoList);
      this.view = new TaskList(todoListView);
      this.view.render();
      this.collection = this.view.tasks;
      this.collection.addNewTask(1, 123, "task 01");
      this.collection.addNewTask(2, 123, "task 02");
      this.collection.addNewTask(3, 123, "task 03");
      return this.collection.addNewTask(4, 123, "task 04");
    });
    after(function() {});
    describe("Creation", function() {
      it("when I create a collection", function() {});
      return it("Then URL is automatically set", function() {
        return expect(this.collection.url).to.equal("todolists/" + this.collection.listId + "/tasks");
      });
    });
    describe("onReset", function() {
      it("when collection is reset with a list of tasks", function() {
        var task, _i, _len, _ref, _results;
        this.tasks = [
          new Task({
            id: 5,
            list: 123,
            description: "task 05",
            done: false
          }), new Task({
            id: 6,
            list: 123,
            description: "task 06",
            done: true
          }), new Task({
            id: 7,
            list: 123,
            description: "task 07",
            done: false
          })
        ];
        this.collection.onReset(this.tasks);
        _ref = this.tasks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          task = _ref[_i];
          _results.push(this.collection.add(task, {
            silent: true
          }));
        }
        return _results;
      });
      it("then their links are correctly set", function() {
        expect(this.tasks[0].get("previousTask")).to.equal(4);
        expect(this.tasks[1].get("previousTask")).to.equal(5);
        expect(this.tasks[2].get("previousTask")).to.equal(6);
        expect(this.tasks[1].get("nextTask")).to.equal(7);
        expect(this.tasks[0].get("nextTask")).to.equal(6);
        return expect(this.tasks[2].get("nextTask")).to.equal(void 0);
      });
      it("and each tasks are linked to the collection", function() {
        var task, _i, _len, _ref, _results;
        _ref = this.tasks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          task = _ref[_i];
          _results.push(expect(task.collection).to.equal(this.collection));
        }
        return _results;
      });
      return it("and lines are correctly added to the list widget", function() {
        return expect(this.view.$(".task").length).to.equal(7);
      });
    });
    describe("onTaskAdded", function() {
      it("when a task is added to the collection", function() {
        this.task = new Task({
          id: 8,
          list: 123,
          description: "task 08"
        });
        return this.collection.add(this.task);
      });
      it("Then its url is updated ", function() {
        return expect(this.task.url).to.equal("todolists/123/tasks/8/");
      });
      it("and its links too", function() {
        expect(this.task.get("previousTask")).to.equal(7);
        return expect(this.task.get("nextTask")).to.equal(void 0);
      });
      return it("and a task line is added as last row", function() {
        return expect(this.view.$(".task .description:last").val()).to.equal("task 08");
      });
    });
    describe("get tasks", function() {
      it("getPreviousTask", function() {
        this.previousTask = this.collection.getPreviousTask(this.task);
        return expect(this.previousTask.id).to.equal(7);
      });
      it("getNextTask", function() {
        this.nextTask = this.collection.getNextTask(this.previousTask);
        return expect(this.nextTask.id).to.equal(8);
      });
      it("getPreviousTodoTask", function() {
        this.previousTask = this.collection.getPreviousTodoTask(this.tasks[2]);
        return expect(this.previousTask.id).to.equal(5);
      });
      return it("getNextTodoTask", function() {
        this.nextTask = this.collection.getNextTodoTask(this.tasks[0]);
        return expect(this.nextTask.id).to.equal(7);
      });
    });
    describe("insert/remove", function() {
      it("insertTask", function() {
        this.task = new Task({
          id: 9,
          list: 123,
          description: "task 09"
        });
        this.task.save = function(attributes, callbacks) {
          return callbacks.success();
        };
        this.collection.insertTask(this.tasks[1], this.task);
        expect(this.collection.at(4).get("previousTask")).to.equal(4);
        expect(this.collection.at(5).get("previousTask")).to.equal(5);
        expect(this.collection.at(6).get("previousTask")).to.equal(6);
        expect(this.collection.at(7).get("previousTask")).to.equal(9);
        expect(this.collection.at(8).get("previousTask")).to.equal(7);
        expect(this.collection.at(4).get("nextTask")).to.equal(6);
        expect(this.collection.at(5).get("nextTask")).to.equal(9);
        expect(this.collection.at(6).get("nextTask")).to.equal(7);
        expect(this.collection.at(7).get("nextTask")).to.equal(8);
        expect(this.collection.at(8).get("nextTask")).to.equal(void 0);
        expect(this.task.url).to.equal("todolists/123/tasks/9/");
        return expect(this.view.$(".task").length).to.equal(9);
      });
      return it("removeTask", function() {
        this.tasks[1].destroy(function(callbacks) {
          return callbacks.success();
        });
        this.collection.removeTask(this.tasks[1]);
        expect(this.collection.at(4).get("previousTask")).to.equal(4);
        expect(this.collection.at(5).get("previousTask")).to.equal(5);
        expect(this.collection.at(6).get("previousTask")).to.equal(9);
        expect(this.collection.at(7).get("previousTask")).to.equal(7);
        expect(this.collection.at(4).get("nextTask")).to.equal(9);
        expect(this.collection.at(5).get("nextTask")).to.equal(7);
        expect(this.collection.at(6).get("nextTask")).to.equal(8);
        return expect(this.collection.at(7).get("nextTask")).to.equal(void 0);
      });
    });
    return describe("up/down", function() {
      it("up", function() {
        this.collection.up(this.task);
        expect(this.collection.at(4).get("previousTask")).to.equal(4);
        expect(this.collection.at(5).get("previousTask")).to.equal(9);
        expect(this.collection.at(6).get("previousTask")).to.equal(5);
        expect(this.collection.at(7).get("previousTask")).to.equal(7);
        expect(this.collection.at(4).get("nextTask")).to.equal(5);
        expect(this.collection.at(5).get("nextTask")).to.equal(7);
        expect(this.collection.at(6).get("nextTask")).to.equal(8);
        return expect(this.collection.at(7).get("nextTask")).to.equal(void 0);
      });
      return it("down", function() {
        this.collection.down(this.task);
        expect(this.collection.at(4).get("previousTask")).to.equal(4);
        expect(this.collection.at(5).get("previousTask")).to.equal(5);
        expect(this.collection.at(6).get("previousTask")).to.equal(9);
        expect(this.collection.at(7).get("previousTask")).to.equal(7);
        expect(this.collection.at(4).get("nextTask")).to.equal(9);
        expect(this.collection.at(5).get("nextTask")).to.equal(7);
        expect(this.collection.at(6).get("nextTask")).to.equal(8);
        return expect(this.collection.at(7).get("nextTask")).to.equal(void 0);
      });
    });
  });
  
}});

window.require.define({"test/task_model_test": function(exports, require, module) {
  var HomeView, Task, TaskCollection, TaskLine, TaskList, TodoList, TodoListWidget;

  Task = require('models/task').Task;

  TaskCollection = require('collections/tasks').TaskCollection;

  TaskLine = require('views/task_view').TaskLine;

  TaskList = require('views/tasks_view').TaskList;

  TodoListWidget = require('views/todolist_view').TodoListWidget;

  TodoList = require('models/todolist').TodoList;

  HomeView = require('views/home_view').HomeView;

  TaskCollection.prototype.addNewTask = function(id, list, description) {
    var task;
    task = new Task({
      id: id,
      list: list,
      description: description
    });
    return this.add(task);
  };

  describe('Task Model', function() {
    before(function() {
      var todoList, todoListView;
      window.app = {};
      window.app.homeView = new HomeView();
      todoList = new TodoList({
        id: 123,
        title: "list 01",
        path: ["parent", "list 01"]
      });
      window.app.homeView.todolists.add(todoList);
      this.model = new Task({
        list: 123,
        description: "task 02",
        id: 2
      });
      todoListView = new TodoListWidget(todoList);
      this.collectionView = new TaskList(todoListView);
      this.collection = this.collectionView.tasks;
      this.collection.addNewTask(1, 123, "task 01");
      this.collection.add(this.model);
      this.collection.addNewTask(3, 123, "task 03");
      this.collection.addNewTask(4, 123, "task 04");
      return this.view = this.model.view;
    });
    after(function() {});
    describe("Creation", function() {
      it("when I create a model", function() {});
      it("its url is automatically set", function() {
        return expect(this.model.url).to.equal("todolists/" + this.model.list + "/tasks/2/");
      });
      return it("just like list data", function() {
        expect(this.model.listTitle).to.equal("list 01");
        return expect(this.model.listPath).to.equal("parent > list 01");
      });
    });
    describe("Done", function() {
      it("When task state is changed to done.", function() {
        return this.model.setDone();
      });
      it("Then task line has done class", function() {
        expect(this.model.done).to.equal(true);
        return expect($(this.view.el).hasClass("done")).to.be.ok;
      });
      it("And links are cleaned", function() {
        var nextTask, previousTask;
        expect(this.model.get("previousTask")).to.equal(null);
        expect(this.model.get("nextTask")).to.equal(null);
        previousTask = this.collection.at(0);
        nextTask = this.collection.at(2);
        expect(previousTask.get("nextTask")).to.equal(nextTask.id);
        return expect(nextTask.get("previousTask")).to.equal(previousTask.id);
      });
      return it("And its completion date is copied to an easily displayable date", function() {
        var completionDate;
        completionDate = moment(this.model.completionDate);
        return expect(this.model.simpleDate).to.equal(completionDate.format("DD/MM/YYYY"));
      });
    });
    describe("Undone", function() {
      it("When task state is changed to undone.", function() {
        return this.model.setUndone();
      });
      it("Then task line has not done class anymore", function() {
        expect(this.model.done).to.equal(false);
        return expect($(this.view.el).hasClass("done")).to.be.not.ok;
      });
      it("And links are back", function() {
        var nextTask, previousTask;
        expect(this.model.get("previousTask")).to.equal(1);
        expect(this.model.get("nextTask")).to.equal(3);
        previousTask = this.collection.at(0);
        nextTask = this.collection.at(2);
        expect(previousTask.get("nextTask")).to.equal(this.model.id);
        return expect(nextTask.get("previousTask")).to.equal(this.model.id);
      });
      return it("And its completion date is set to null", function() {
        return expect(this.model.simpleDate).to.equal(null);
      });
    });
    describe("setSimpleDate", function() {
      it("When I set simple date", function() {
        this.date = new Date();
        return this.model.setSimpleDate(this.date);
      });
      return it("Then this date is available in a readable string", function() {
        expect(this.model.simpleDate).to.equal(moment(this.date).format("DD/MM/YYYY"));
        return this.model.simpleDate = null;
      });
    });
    describe("setPreviousTask", function() {
      it("When I set model previous task", function() {
        this.previousTask = this.collection.at(this.collection.length - 1);
        return this.model.setPreviousTask(this.previousTask);
      });
      return it("Then both task have their fields rightly set", function() {
        expect(this.model.get("previousTask")).to.equal(4);
        return expect(this.previousTask.get("nextTask")).to.equal(this.model.id);
      });
    });
    describe("setNextTask", function() {
      it("When I set model next task", function() {
        this.nextTask = this.collection.at(this.collection.length - 1);
        return this.model.setNextTask(this.nextTask);
      });
      return it("Then both task have their fields rightly set", function() {
        expect(this.model.get("nextTask")).to.equal(4);
        expect(this.nextTask.get("previousTask")).to.equal(this.model.id);
        this.model.setPreviousTask(this.collection.at(0));
        this.model.setNextTask(this.collection.at(2));
        return this.nextTask.setPreviousTask(this.collection.at(2));
      });
    });
    describe("cleanLinks", function() {
      it("When I clean task links", function() {
        return this.model.cleanLinks();
      });
      it("Then task has no more links", function() {
        expect(this.model.get("previousTask")).to.equal(null);
        return expect(this.model.get("nextTask")).to.equal(null);
      });
      return it("And previously set links are updated.", function() {
        var nextTask, previousTask;
        previousTask = this.collection.at(0);
        nextTask = this.collection.at(2);
        expect(previousTask.get("nextTask")).to.equal(nextTask.id);
        return expect(nextTask.get("previousTask")).to.equal(previousTask.id);
      });
    });
    return describe("setLinks", function() {
      it("When I set links back", function() {
        return this.model.setLink();
      });
      it("Then task has its links back (depending on position in list)", function() {
        expect(this.model.get("previousTask")).to.equal(1);
        return expect(this.model.get("nextTask")).to.equal(3);
      });
      return it("And previously set links are back too.", function() {
        var nextTask, previousTask;
        previousTask = this.collection.at(0);
        nextTask = this.collection.at(2);
        expect(previousTask.get("nextTask")).to.equal(this.model.id);
        return expect(nextTask.get("previousTask")).to.equal(this.model.id);
      });
    });
  });
  
}});

window.require.define({"test/test-helpers": function(exports, require, module) {
  
  module.exports = {
    expect: require('chai').expect,
    should: require('chai').should,
    sinon: require('sinon'),
    $: require('jquery'),
    moment: require('moment')
  };
  
}});

window.require('test/task_collection_test');
window.require('test/task_model_test');
