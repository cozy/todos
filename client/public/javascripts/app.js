(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return hasOwnProperty.call(object, name);
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
      return require(absolute);
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

window.require.define({"collections/tasks": function(exports, require, module) {
  var Task,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Task = require("../models/task").Task;

  exports.TaskCollection = (function(_super) {

    __extends(TaskCollection, _super);

    TaskCollection.prototype.model = Task;

    TaskCollection.prototype.url = 'tasks/';

    function TaskCollection(view, listId, options) {
      this.view = view;
      this.listId = listId;
      this.options = options;
      this.down = __bind(this.down, this);

      this.up = __bind(this.up, this);

      this.onTaskAdded = __bind(this.onTaskAdded, this);

      this.onReset = __bind(this.onReset, this);

      TaskCollection.__super__.constructor.call(this);
      this.url = "todolists/" + this.listId + "/tasks";
      this.bind("add", this.onTaskAdded);
      this.bind("reset", this.onReset);
    }

    TaskCollection.prototype.parse = function(response) {
      return response.rows;
    };

    TaskCollection.prototype.onReset = function(tasks) {
      var previousTask,
        _this = this;
      if (this.length > 0) {
        previousTask = this.at(this.length - 1);
      }
      tasks.forEach(function(task) {
        var _ref, _ref1;
        task.collection = _this;
        if (previousTask != null) {
          task.setPreviousTask(previousTask);
        }
        if ((_ref = _this.options) != null ? _ref.grouping : void 0) {
          if (((_ref1 = _this.lastTask) != null ? _ref1.simpleDate : void 0) !== task.simpleDate) {
            _this.view.addDateLine(task.simpleDate);
          }
          _this.lastTask = task;
        }
        _this.view.addTaskLine(task);
        return previousTask = task;
      });
      return this.lastTask = null;
    };

    TaskCollection.prototype.onTaskAdded = function(task) {
      if (task.id != null) {
        task.url = "" + this.url + "/" + task.id + "/";
      }
      task.collection = this;
      if (this.length > 1) {
        task.setPreviousTask(this.at(this.length - 2));
      }
      return this.view.addTaskLine(task);
    };

    TaskCollection.prototype.insertTask = function(previousTask, task, callbacks) {
      var index,
        _this = this;
      index = this.toArray().indexOf(previousTask);
      task.set("nextTask", previousTask.nextTask);
      task.setPreviousTask(previousTask);
      task.collection = this;
      task.url = "" + this.url + "/";
      return task.save(task.attributes, {
        success: function() {
          task.url = "" + _this.url + "/" + task.id + "/";
          _this.add(task, {
            at: index,
            silent: true
          });
          _this.view.insertTask(previousTask.view, task);
          return callbacks != null ? callbacks.success(task) : void 0;
        },
        error: function() {
          return callbacks != null ? callbacks.error : void 0;
        }
      });
    };

    TaskCollection.prototype.getPreviousTask = function(task) {
      return this.get(task.get("previousTask"));
    };

    TaskCollection.prototype.getNextTask = function(task) {
      return this.get(task.get("nextTask"));
    };

    TaskCollection.prototype.getPreviousTodoTask = function(task) {
      var index;
      index = this.indexOf(task);
      if (index > 0) {
        index--;
        task = this.at(index);
        while ((task != null ? task.done : void 0) && index > 0) {
          index--;
          task = this.at(index);
        }
        return task;
      } else {
        return null;
      }
    };

    TaskCollection.prototype.getNextTodoTask = function(task) {
      var index;
      index = this.indexOf(task);
      if (index < this.length - 2) {
        index++;
        task = this.at(index);
        while ((task != null ? task.done : void 0) && index < this.length - 2) {
          index++;
          task = this.at(index);
        }
        return task;
      } else {
        return null;
      }
    };

    TaskCollection.prototype.up = function(task) {
      var index, newPreviousTask, oldNextTask, oldPreviousTask;
      index = this.toArray().indexOf(task);
      if (index === 0) {
        return false;
      }
      if (index > 0) {
        oldPreviousTask = this.at(index - 1);
      }
      oldNextTask = this.at(index + 1);
      if (index > 1) {
        newPreviousTask = this.at(index - 2);
      }
      if (oldNextTask != null) {
        oldNextTask.setPreviousTask(oldPreviousTask);
        oldPreviousTask.setNextTask(oldNextTask);
      } else {
        oldPreviousTask.setNextTask(null);
      }
      if (newPreviousTask != null) {
        newPreviousTask.setNextTask(task);
        task.setPreviousTask(newPreviousTask);
      } else {
        task.setPreviousTask(null);
      }
      task.setNextTask(oldPreviousTask);
      this.remove(task);
      this.add(task, {
        at: index - 1,
        silent: true
      });
      task.view.up(oldPreviousTask.id);
      return true;
    };

    TaskCollection.prototype.down = function(task) {
      var index, newNextTask, oldNextTask, oldPreviousTask, tasksLength;
      index = this.toArray().indexOf(task);
      tasksLength = this.size();
      if (index === tasksLength - 1) {
        return false;
      }
      if (index < tasksLength - 1) {
        oldNextTask = this.at(index + 1);
      }
      if (index < tasksLength - 2) {
        newNextTask = this.at(index + 2);
      }
      if (index > 0) {
        oldPreviousTask = this.at(index - 1);
      }
      if (oldPreviousTask != null) {
        oldPreviousTask.setNextTask(oldNextTask);
        if (oldNextTask != null) {
          oldNextTask.setPreviousTask(oldPreviousTask);
        }
      } else {
        if (oldNextTask != null) {
          oldNextTask.setPreviousTask(null);
        }
      }
      if (newNextTask != null) {
        newNextTask.setPreviousTask(task);
        task.setNextTask(newNextTask);
      } else {
        task.setNextTask(null);
      }
      task.setPreviousTask(oldNextTask);
      this.remove(task);
      this.add(task, {
        at: index + 1,
        silent: true
      });
      task.view.down(oldNextTask.id);
      return true;
    };

    TaskCollection.prototype.removeTask = function(task, callbacks) {
      var nextTask, previousTask;
      previousTask = this.getPreviousTask(task);
      nextTask = this.getNextTask(task);
      if (previousTask) {
        if (nextTask != null) {
          nextTask.setPreviousTask(previousTask);
        }
      } else {
        if (nextTask != null) {
          nextTask.setPreviousTask(null);
        }
      }
      if (nextTask) {
        if (previousTask != null) {
          previousTask.setNextTask(nextTask);
        }
      } else {
        if (previousTask != null) {
          previousTask.setNextTask(null);
        }
      }
      return task.destroy({
        success: function() {
          task.view.remove();
          return callbacks != null ? callbacks.success() : void 0;
        },
        error: callbacks != null ? callbacks.error : void 0
      });
    };

    return TaskCollection;

  })(Backbone.Collection);
  
}});

window.require.define({"helpers": function(exports, require, module) {
  
  exports.BrunchApplication = (function() {

    function BrunchApplication() {
      var _this = this;
      $(function() {
        _this.initialize(_this);
        return Backbone.history.start();
      });
    }

    BrunchApplication.prototype.initialize = function() {
      return null;
    };

    return BrunchApplication;

  })();

  exports.selectAll = function(input) {
    return input.setSelection(0, input.val().length);
  };

  exports.slugify = function(string) {
    var _slugify_hyphenate_re, _slugify_strip_re;
    _slugify_strip_re = /[^\w\s-]/g;
    _slugify_hyphenate_re = /[-\s]+/g;
    string = string.replace(_slugify_strip_re, '').trim().toLowerCase();
    string = string.replace(_slugify_hyphenate_re, '-');
    return string;
  };

  exports.getPathRegExp = function(path) {
    var slashReg;
    slashReg = new RegExp("/", "g");
    return "^" + (path.replace(slashReg, "\/"));
  };
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var BrunchApplication, HomeView, MainRouter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BrunchApplication = require('helpers').BrunchApplication;

  MainRouter = require('routers/main_router').MainRouter;

  HomeView = require('views/home_view').HomeView;

  exports.Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.initialize = function() {
      this.router = new MainRouter;
      return this.homeView = new HomeView;
    };

    return Application;

  })(BrunchApplication);

  window.app = new exports.Application;
  
}});

window.require.define({"models/models": function(exports, require, module) {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.BaseModel = (function(_super) {

    __extends(BaseModel, _super);

    function BaseModel() {
      return BaseModel.__super__.constructor.apply(this, arguments);
    }

    BaseModel.prototype.isNew = function() {
      return !(this.id != null);
    };

    return BaseModel;

  })(Backbone.Model);
  
}});

window.require.define({"models/task": function(exports, require, module) {
  var BaseModel,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseModel = require("./models").BaseModel;

  exports.Task = (function(_super) {

    __extends(Task, _super);

    function Task(task) {
      var property;
      Task.__super__.constructor.call(this, task);
      for (property in task) {
        this[property] = task[property];
      }
      this.url = "/todolists/" + task.list + "/tasks/";
      if (this.id != null) {
        this.url += "" + this.id + "/";
      }
      this.setSimpleDate(task.completionDate);
    }

    Task.prototype.setSimpleDate = function(date) {
      if (!(date != null)) {
        date = new Date();
      }
      return this.simpleDate = moment(date).format("DD/MM/YYYY");
    };

    Task.prototype.setNextTask = function(task) {
      var _ref;
      this.set("nextTask", (_ref = task != null ? task.id : void 0) != null ? _ref : null);
      return task != null ? task.set("previousTask", this.id) : void 0;
    };

    Task.prototype.setPreviousTask = function(task) {
      var _ref;
      this.set("previousTask", (_ref = task != null ? task.id : void 0) != null ? _ref : null);
      return task != null ? task.set("nextTask", this.id) : void 0;
    };

    Task.prototype.setDone = function() {
      this.done = true;
      this.setSimpleDate();
      this.cleanLinks();
      return this.view.done();
    };

    Task.prototype.setUndone = function() {
      this.done = false;
      this.setLink();
      this.completionDate = this.simpleDate = null;
      this.set("completionDate", null);
      return this.view.undone();
    };

    Task.prototype.setLink = function() {
      var nextTask, previousTask;
      if (this.collection.view.isArchive()) {
        this.view.remove();
        this.collection.view.moveToTaskList(this);
        return this.setNextTask(this.collection.at(0));
      } else {
        previousTask = this.collection.getPreviousTodoTask(this);
        nextTask = this.collection.getNextTodoTask(this);
        this.setPreviousTask(previousTask);
        return this.setNextTask(nextTask);
      }
    };

    Task.prototype.cleanLinks = function() {
      var nextTask, previousTask;
      previousTask = this.collection.getPreviousTask(this);
      nextTask = this.collection.getNextTask(this);
      if (previousTask != null) {
        previousTask.setNextTask(nextTask);
      }
      if (nextTask != null) {
        nextTask.setPreviousTask(previousTask);
      }
      this.setPreviousTask(null);
      return this.setNextTask(null);
    };

    return Task;

  })(BaseModel);
  
}});

window.require.define({"models/todolist": function(exports, require, module) {
  var BaseModel, request,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseModel = require("models/models").BaseModel;

  request = function(type, url, data, callback) {
    return $.ajax({
      type: type,
      url: url,
      data: data,
      success: callback,
      error: function(data) {
        if (data && data.msg) {
          return alert(data.msg);
        } else {
          return alert("Server error occured.");
        }
      }
    });
  };

  exports.TodoList = (function(_super) {

    __extends(TodoList, _super);

    TodoList.prototype.url = 'todolists/';

    function TodoList(todolist) {
      var property;
      TodoList.__super__.constructor.call(this);
      for (property in todolist) {
        this[property] = todolist[property];
      }
    }

    TodoList.prototype.saveContent = function(content) {
      this.content = content;
      this.url = "todolists/" + this.id;
      return this.save({
        content: this.content
      });
    };

    TodoList.createTodoList = function(data, callback) {
      return request("POST", "todolists", data, callback);
    };

    TodoList.updateTodoList = function(id, data, callback) {
      return request("PUT", "todolists/" + id, data, callback);
    };

    TodoList.getTodoList = function(id, callback) {
      var _this = this;
      return $.get("todolists/" + id, function(data) {
        var todolist;
        todolist = new TodoList(data);
        return callback(todolist);
      });
    };

    return TodoList;

  })(BaseModel);
  
}});

window.require.define({"routers/main_router": function(exports, require, module) {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.MainRouter = (function(_super) {

    __extends(MainRouter, _super);

    function MainRouter() {
      return MainRouter.__super__.constructor.apply(this, arguments);
    }

    MainRouter.prototype.routes = {
      '': 'home'
    };

    MainRouter.prototype.initialize = function() {
      return this.route(/^todolist\/(.*?)$/, 'list');
    };

    MainRouter.prototype.home = function() {
      $('body').html(app.homeView.render().el);
      app.homeView.setLayout();
      return app.homeView.loadData();
    };

    MainRouter.prototype.list = function(path) {
      var selectList;
      selectList = function() {
        return app.homeView.selectList(path);
      };
      if ($("#tree-create").length > 0) {
        return selectList();
      } else {
        return this.home(function() {
          return setTimeout((function() {
            return selectList();
          }), 100);
        });
      }
    };

    return MainRouter;

  })(Backbone.Router);
  
}});

window.require.define({"views/home_view": function(exports, require, module) {
  var HaveDoneListModal, TodoList, TodoListWidget, Tree, helpers,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tree = require("./widgets/tree").Tree;

  TodoList = require("../models/todolist").TodoList;

  TodoListWidget = require("./todolist_view").TodoListWidget;

  HaveDoneListModal = require("./widgets/have_done_list").HaveDoneListModal;

  helpers = require("../helpers");

  exports.HomeView = (function(_super) {

    __extends(HomeView, _super);

    HomeView.prototype.id = 'home-view';

    /*
        # Initializers
    */


    HomeView.prototype.initialize = function() {};

    function HomeView() {
      this.onHaveDoneButtonClicked = __bind(this.onHaveDoneButtonClicked, this);

      this.onTodoListDropped = __bind(this.onTodoListDropped, this);

      this.onTreeLoaded = __bind(this.onTreeLoaded, this);

      this.onTodoListSelected = __bind(this.onTodoListSelected, this);

      this.onTodoListRemoved = __bind(this.onTodoListRemoved, this);

      this.onTodoListRenamed = __bind(this.onTodoListRenamed, this);

      this.onTodoListCreated = __bind(this.onTodoListCreated, this);
      HomeView.__super__.constructor.call(this);
    }

    HomeView.prototype.render = function() {
      $(this.el).html(require('./templates/home'));
      this.todolist = $("#todo-list");
      this.setUpHaveDoneList();
      return this;
    };

    HomeView.prototype.setUpHaveDoneList = function() {
      this.haveDoneList = new HaveDoneListModal();
      this.haveDoneList.render();
      this.haveDoneList.hide();
      return $(this.el).append(this.haveDoneList.el);
    };

    HomeView.prototype.setLayout = function() {
      return $(this.el).layout({
        size: "350",
        minSize: "350",
        resizable: true
      });
    };

    HomeView.prototype.loadData = function() {
      var _this = this;
      return $.get("tree/", function(data) {
        _this.tree = new Tree(_this.$("#nav"), _this.$("#tree"), data, {
          onCreate: _this.onTodoListCreated,
          onRename: _this.onTodoListRenamed,
          onRemove: _this.onTodoListRemoved,
          onSelect: _this.onTodoListSelected,
          onLoaded: _this.onTreeLoaded,
          onDrop: _this.onTodoListDropped
        });
        _this.haveDoneButton = $("#have-done-list-button");
        return _this.haveDoneButton.click(_this.onHaveDoneButtonClicked);
      });
    };

    /*
        # Listeners
    */


    HomeView.prototype.onTodoListCreated = function(path, newName, data) {
      var _this = this;
      path = path + "/" + helpers.slugify(newName);
      return TodoList.createTodoList({
        path: path,
        title: newName
      }, function(todolist) {
        data.rslt.obj.data("id", todolist.id);
        data.inst.deselect_all();
        return data.inst.select_node(data.rslt.obj);
      });
    };

    HomeView.prototype.onTodoListRenamed = function(path, newName, data) {
      var _this = this;
      if (newName != null) {
        return TodoList.updateTodoList(data.rslt.obj.data("id"), {
          title: newName
        }, function() {
          data.inst.deselect_all();
          return data.inst.select_node(data.rslt.obj);
        });
      }
    };

    HomeView.prototype.onTodoListRemoved = function(path) {
      $("#todo-list").html(null);
      return this.currentTodolist.destroy();
    };

    HomeView.prototype.onTodoListSelected = function(path, id) {
      var _this = this;
      if (path.indexOf("/")) {
        path = "/" + path;
      }
      app.router.navigate("todolist" + path, {
        trigger: false
      });
      if (id != null) {
        return TodoList.getTodoList(id, function(todolist) {
          _this.renderTodolist(todolist);
          return _this.todolist.show();
        });
      } else {
        return $("#todo-list").html(null);
      }
    };

    HomeView.prototype.onTreeLoaded = function() {
      if (this.treeCreationCallback != null) {
        return this.treeCreationCallback();
      }
    };

    HomeView.prototype.onTodoListDropped = function(newPath, oldPath, todolistTitle, data) {
      var _this = this;
      newPath = newPath + "/" + helpers.slugify(todolistTitle);
      alert(newPath);
      return TodoList.updateTodoList(data.rslt.o.data("id"), {
        path: newPath
      }, function() {
        data.inst.deselect_all();
        return data.inst.select_node(data.rslt.o);
      });
    };

    HomeView.prototype.onHaveDoneButtonClicked = function() {
      if (!this.haveDoneList.isVisible()) {
        this.haveDoneList.show();
        return this.haveDoneList.loadData();
      } else {
        return this.haveDoneList.hide();
      }
    };

    /*
        # Functions
    */


    HomeView.prototype.selectList = function(path) {
      return this.tree.selectNode(path);
    };

    HomeView.prototype.renderTodolist = function(todolist) {
      var todolistWidget, _ref;
      todolist.url = "todolists/" + todolist.id;
      if ((_ref = this.currentTodolist) != null) {
        _ref.view.blurAllTaskDescriptions();
      }
      this.currentTodolist = todolist;
      todolistWidget = new TodoListWidget(this.currentTodolist);
      todolistWidget.render();
      return todolistWidget.loadData();
    };

    return HomeView;

  })(Backbone.View);
  
}});

window.require.define({"views/task_view": function(exports, require, module) {
  var Task, helpers, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require("./templates/task");

  Task = require("../models/task").Task;

  helpers = require("../helpers");

  exports.TaskLine = (function(_super) {

    __extends(TaskLine, _super);

    TaskLine.prototype.className = "task clearfix";

    TaskLine.prototype.tagName = "div";

    TaskLine.prototype.events = {
      "click .todo-button": "onTodoButtonClicked",
      "click .del-task-button": "onDelButtonClicked",
      "click .up-task-button": "onUpButtonClicked",
      "click .down-task-button": "onDownButtonClicked"
    };

    /* 
    # Initializers
    */


    function TaskLine(model, list) {
      this.model = model;
      this.list = list;
      this.onDescriptionChanged = __bind(this.onDescriptionChanged, this);

      this.onDownButtonClicked = __bind(this.onDownButtonClicked, this);

      this.onUpButtonClicked = __bind(this.onUpButtonClicked, this);

      this.onDelButtonClicked = __bind(this.onDelButtonClicked, this);

      this.onTodoButtonClicked = __bind(this.onTodoButtonClicked, this);

      TaskLine.__super__.constructor.call(this);
      this.saving = false;
      this.id = this.model._id;
      this.model.view = this;
      this.firstDel = false;
      this.isDeleting = false;
      this.list;
    }

    TaskLine.prototype.render = function() {
      template = require('./templates/task');
      $(this.el).html(template({
        "model": this.model
      }));
      this.el.id = this.model.id;
      if (this.model.done) {
        this.done();
      }
      this.descriptionField = this.$(".description");
      this.buttons = this.$(".task-buttons");
      this.setListeners();
      this.$(".task-buttons").hide();
      this.descriptionField.data('before', this.descriptionField.val());
      return this.el;
    };

    TaskLine.prototype.setListeners = function() {
      var _this = this;
      this.descriptionField.keypress(function(event) {
        var keyCode;
        keyCode = event.which | event.keyCode;
        return keyCode !== 13 && keyCode !== 9;
      });
      this.descriptionField.keyup(function(event) {
        var keyCode;
        keyCode = event.which | event.keyCode;
        if (event.ctrlKey) {
          if (keyCode === 38) {
            _this.onCtrlUpKeyup();
          }
          if (keyCode === 40) {
            _this.onCtrlDownKeyup();
          }
          if (keyCode === 32) {
            return _this.onTodoButtonClicked();
          }
        } else {
          if (keyCode === 38) {
            _this.onUpKeyup();
          }
          if (keyCode === 40) {
            _this.onDownKeyup();
          }
          if (keyCode === 13) {
            _this.onEnterKeyup();
          }
          if (keyCode === 8) {
            _this.onBackspaceKeyup();
          }
          if (keyCode === 9 && !event.shiftKey) {
            _this.onDownKeyup();
          }
          if (keyCode === 9 && event.shiftKey) {
            return _this.onUpKeyup();
          }
        }
      });
      return this.descriptionField.bind('blur paste beforeunload', function(event) {
        var el;
        el = _this.descriptionField;
        if (el.data('before') !== el.val() && !_this.isDeleting) {
          el.data('before', el.val());
          _this.onDescriptionChanged(event, event.which | event.keyCode);
        }
        return el;
      });
    };

    /*
        # Listeners
    */


    TaskLine.prototype.onTodoButtonClicked = function(event) {
      if (this.model.done) {
        this.model.setUndone();
      } else {
        this.model.setDone();
      }
      return this.model.save({
        done: this.model.done
      }, {
        success: function() {},
        error: function() {
          return alert("An error occured, modifications were not saved.");
        }
      });
    };

    TaskLine.prototype.onDelButtonClicked = function(event) {
      return this.delTask();
    };

    TaskLine.prototype.onUpButtonClicked = function(event) {
      if (!this.model.done && this.model.collection.up(this.model)) {
        this.focusDescription();
        return this.model.save({
          success: function() {},
          error: function() {
            return alert("An error occured, modifications were not saved.");
          }
        });
      }
    };

    TaskLine.prototype.onDownButtonClicked = function(event) {
      if (!this.model.done && this.model.collection.down(this.model)) {
        return this.model.save({
          success: function() {},
          error: function() {
            return alert("An error occured, modifications were not saved.");
          }
        });
      }
    };

    TaskLine.prototype.onDescriptionChanged = function(event, keyCode) {
      if (!(keyCode === 8 || this.descriptionField.val().length === 0)) {
        this.saving = false;
        this.model.description = this.descriptionField.val();
        return this.model.save({
          description: this.model.description
        }, {
          success: function() {},
          error: function() {
            return alert("An error occured, modifications were not saved.");
          }
        });
      }
    };

    TaskLine.prototype.onUpKeyup = function() {
      return this.list.moveUpFocus(this);
    };

    TaskLine.prototype.onDownKeyup = function() {
      return this.list.moveDownFocus(this);
    };

    TaskLine.prototype.onCtrlUpKeyup = function() {
      return this.onUpButtonClicked();
    };

    TaskLine.prototype.onCtrlDownKeyup = function() {
      return this.onDownButtonClicked();
    };

    TaskLine.prototype.onEnterKeyup = function() {
      return this.model.collection.insertTask(this.model, new Task({
        description: "new task"
      }), {
        success: function(task) {
          return helpers.selectAll(task.view.descriptionField);
        },
        error: function() {
          return alert("Saving failed, an error occured.");
        }
      });
    };

    TaskLine.prototype.onBackspaceKeyup = function() {
      var description;
      description = this.descriptionField.val();
      if (description.length === 0 && this.firstDel) {
        this.isDeleting = true;
        if (this.list.$("#" + this.model.id).prev().find(".description").length) {
          this.list.moveUpFocus(this, {
            maxPosition: true
          });
        } else {
          this.list.moveDownFocus(this, {
            maxPosition: true
          });
        }
        return this.delTask();
      } else if (description.length === 0 && !this.firstDel) {
        return this.firstDel = true;
      } else {
        return this.firstDel = false;
      }
    };

    /*
        # Functions
    */


    TaskLine.prototype.done = function() {
      this.$(".todo-button").html("done");
      this.$(".todo-button").addClass("disabled");
      this.$(".todo-button").removeClass("btn-info");
      return $(this.el).addClass("done");
    };

    TaskLine.prototype.undone = function() {
      this.$(".todo-button").html("todo");
      this.$(".todo-button").removeClass("disabled");
      this.$(".todo-button").addClass("btn-info");
      return $(this.el).removeClass("done");
    };

    TaskLine.prototype.up = function(previousLineId) {
      var cursorPosition;
      cursorPosition = this.descriptionField.getCursorPosition();
      $(this.el).insertBefore($("#" + previousLineId));
      return this.descriptionField.setCursorPosition(cursorPosition);
    };

    TaskLine.prototype.down = function(nextLineId) {
      var cursorPosition;
      cursorPosition = this.descriptionField.getCursorPosition();
      $(this.el).insertAfter($("#" + nextLineId));
      return this.descriptionField.setCursorPosition(cursorPosition);
    };

    TaskLine.prototype.remove = function() {
      this.unbind();
      return $(this.el).remove();
    };

    TaskLine.prototype.focusDescription = function() {
      this.descriptionField.focus();
      return helpers.selectAll(this.descriptionField);
    };

    TaskLine.prototype.delTask = function(callback) {
      return this.model.collection.removeTask(this.model, {
        success: function() {
          if (callback) {
            return callback();
          }
        },
        error: function() {
          return alert("An error occured, deletion was not saved.");
        }
      });
    };

    TaskLine.prototype.showButtons = function() {
      return this.buttons.show();
    };

    TaskLine.prototype.hideButtons = function() {
      return this.buttons.hide();
    };

    return TaskLine;

  })(Backbone.View);
  
}});

window.require.define({"views/tasks_view": function(exports, require, module) {
  var TaskCollection, TaskLine, helpers,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskCollection = require("../collections/tasks").TaskCollection;

  TaskLine = require("../views/task_view").TaskLine;

  helpers = require("../helpers");

  exports.TaskList = (function(_super) {

    __extends(TaskList, _super);

    TaskList.prototype.className = "task clearfix";

    TaskList.prototype.tagName = "div";

    function TaskList(todoListView, el, options) {
      var id;
      this.todoListView = todoListView;
      this.el = el;
      TaskList.__super__.constructor.call(this);
      id = this.todoListView != null ? this.todoListView.model.id : null;
      this.tasks = new TaskCollection(this, id, options);
    }

    TaskList.prototype.addTaskLine = function(task) {
      var taskLine;
      taskLine = new TaskLine(task, this);
      return $(this.el).append(taskLine.render());
    };

    TaskList.prototype.addDateLine = function(date) {
      return $(this.el).append('<div class="completion-date">' + date + '</div>');
    };

    TaskList.prototype.addTaskLineAsFirstRow = function(task) {
      var taskLine;
      taskLine = new TaskLine(task, this);
      return $(this.el).prepend(taskLine.render());
    };

    TaskList.prototype.isArchive = function() {
      return $(this.el).attr("id") === "archive-list";
    };

    TaskList.prototype.moveToTaskList = function(task) {
      var _ref;
      return (_ref = this.todoListView) != null ? _ref.moveToTaskList(task) : void 0;
    };

    TaskList.prototype.moveUpFocus = function(taskLine, options) {
      var nextDescription, selector;
      selector = "#" + taskLine.model.id;
      nextDescription = $(selector).prev().find(".description");
      if (nextDescription.length) {
        return this.moveFocus(taskLine.descriptionField, nextDescription, options);
      }
    };

    TaskList.prototype.moveDownFocus = function(taskLine, options) {
      var nextDescription, selector;
      selector = "#" + taskLine.model.id;
      nextDescription = $(selector).next().find(".description");
      if (nextDescription.length) {
        return this.moveFocus(taskLine.descriptionField, nextDescription, options);
      }
    };

    TaskList.prototype.moveFocus = function(previousField, nextField, options) {
      var cursorPosition;
      cursorPosition = previousField.getCursorPosition();
      nextField.focus();
      if (((options != null ? options.maxPosition : void 0) != null) && options.maxPosition) {
        return nextField.setCursorPosition(nextField.val().length);
      } else {
        return nextField.setCursorPosition(cursorPosition);
      }
    };

    TaskList.prototype.insertTask = function(previousTaskLine, task) {
      var taskLine, taskLineEl, _ref;
      taskLine = new TaskLine(task);
      taskLine.list = this;
      taskLineEl = $(taskLine.render());
      taskLineEl.insertAfter($(previousTaskLine.el));
      taskLine.focusDescription();
      if ((_ref = this.todoListView) != null ? _ref.isEditMode : void 0) {
        taskLine.showButtons();
      }
      return taskLine;
    };

    return TaskList;

  })(Backbone.View);
  
}});

window.require.define({"views/templates/have_done_list": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="modal-header"><button data-dismiss="modal" class="close">x</button><h3>Have Done List</h3></div><div class="modal-body"><div id="have-done-task-list"></div></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="nav" class="ui-layout-west"><div id="tree"></div></div><div id="todo-list" class="ui-layout-center"></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/task": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<button class="btn btn-info todo-button">todo</button><input');
  buf.push(attrs({ 'type':("text"), 'contenteditable':("true"), 'value':("" + (model.description) + ""), "class": ('description') }, {"type":true,"contenteditable":true,"value":true}));
  buf.push('/><div class="task-buttons"><button class="up-task-button btn">up</button><button class="down-task-button btn">down</button><button class="del-task-button btn">X</button></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/todolist": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<header class="todo-list-title clearfix"><button id="new-task-button" class="btn btn-info"> \nnew task</button><button id="edit-button" class="btn hidden">show buttons</button><p class="breadcrumb"> </p><p class="description"> </p></header><div id="task-list"></div><h2 class="archive-title">archives</h2><div id="archive-list"></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/tree_buttons": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="tree-buttons"><button id="tree-create" class="btn btn-info"><i class="icon-plus"></i></button><button id="tree-remove" class="btn btn-info"><i class="icon-remove"></i></button><button id="tree-rename" class="btn btn-info"><i class="icon-pencil"></i></button><button id="tree-search" class="btn btn-info"><i class="icon-search"></i></button><button id="have-done-list-button" class="btn btn-info"><i class="icon-tasks"></i></button><div class="spacer"></div><input id="tree-search-field" type="text"/></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/todolist_view": function(exports, require, module) {
  var Task, TaskCollection, TaskList, helpers,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskCollection = require("../collections/tasks").TaskCollection;

  Task = require("../models/task").Task;

  TaskList = require("./tasks_view").TaskList;

  helpers = require("../helpers");

  exports.TodoListWidget = (function(_super) {

    __extends(TodoListWidget, _super);

    TodoListWidget.prototype.id = "todo-list";

    TodoListWidget.prototype.tagName = "div";

    TodoListWidget.prototype.el = "#todo-list";

    TodoListWidget.prototype.isEditMode = false;

    /* Constructor
    */


    function TodoListWidget(model) {
      this.model = model;
      this.onEditClicked = __bind(this.onEditClicked, this);

      this.onAddClicked = __bind(this.onAddClicked, this);

      TodoListWidget.__super__.constructor.call(this);
      this.id = this.model.slug;
      this.model.view = this;
    }

    TodoListWidget.prototype.remove = function() {
      return $(this.el).remove();
    };

    /* configuration
    */


    TodoListWidget.prototype.render = function() {
      var breadcrumb;
      $(this.el).html(require('./templates/todolist'));
      this.title = this.$(".todo-list-title .description");
      this.breadcrumb = this.$(".todo-list-title .breadcrumb");
      this.taskList = new TaskList(this, this.$("#task-list"));
      this.archiveList = new TaskList(this, this.$("#archive-list"));
      this.tasks = this.taskList.tasks;
      this.archiveTasks = this.archiveList.tasks;
      this.newButton = $("#new-task-button");
      this.showButtonsButton = $("#edit-button");
      this.newButton.hide();
      this.newButton.unbind("click");
      this.newButton.click(this.onAddClicked);
      this.showButtonsButton.unbind("click");
      this.showButtonsButton.click(this.onEditClicked);
      breadcrumb = this.model.humanPath.split(",");
      breadcrumb.pop();
      this.breadcrumb.html(breadcrumb.join(" / "));
      this.title.html(this.model.title);
      return this.el;
    };

    /*
        # Listeners
    */


    TodoListWidget.prototype.onAddClicked = function(event) {
      var task,
        _this = this;
      task = new Task({
        done: false,
        description: "new task",
        list: this.model.id
      });
      return task.save(null, {
        success: function(data) {
          data.url = "tasks/" + data.id + "/";
          _this.tasks.add(data);
          $(".task:first .description").focus();
          helpers.selectAll($(".task:first .description"));
          if (!_this.isEditMode) {
            return $(".task:first .task-buttons").hide();
          } else {
            return $(".task:first .task-buttons").show();
          }
        },
        error: function() {
          return alert("An error occured while saving data");
        }
      });
    };

    TodoListWidget.prototype.onEditClicked = function(event) {
      if (!this.isEditMode) {
        this.$(".task:not(.done) .task-buttons").show();
        this.newButton.show();
        this.isEditMode = true;
        return this.showButtonsButton.html("hide buttons");
      } else {
        this.$(".task-buttons").hide();
        this.newButton.hide();
        this.isEditMode = false;
        return this.showButtonsButton.html("show buttons");
      }
    };

    /*
        # Functions
    */


    TodoListWidget.prototype.loadData = function() {
      var _this = this;
      this.archiveTasks.url += "/archives";
      this.archiveTasks.fetch();
      return this.tasks.fetch({
        success: function() {
          if ($(".task:not(.done)").length > 0) {
            return $(".task:first .description").focus();
          } else {
            return _this.onAddClicked();
          }
        }
      });
    };

    TodoListWidget.prototype.moveToTaskList = function(task) {
      return this.tasks.prependTask(task);
    };

    TodoListWidget.prototype.blurAllTaskDescriptions = function() {
      return this.$(".task .description").trigger("blur");
    };

    return TodoListWidget;

  })(Backbone.View);
  
}});

window.require.define({"views/widgets/have_done_list": function(exports, require, module) {
  var TaskList,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskList = require("../tasks_view").TaskList;

  exports.HaveDoneListModal = (function(_super) {

    __extends(HaveDoneListModal, _super);

    HaveDoneListModal.prototype["class"] = "modal hide";

    HaveDoneListModal.prototype.id = "have-done-list-modal";

    HaveDoneListModal.prototype.initialize = function() {};

    function HaveDoneListModal() {
      this.hide = __bind(this.hide, this);
      HaveDoneListModal.__super__.constructor.call(this);
    }

    HaveDoneListModal.prototype.render = function() {
      $(this.el).html(require('../templates/have_done_list'));
      $(this.el).addClass("modal");
      this.taskList = new TaskList(null, this.$("#have-done-task-list"), {
        grouping: true
      });
      this.taskList.tasks.url = "tasks/archives";
      return this.$(".close").click(this.hide);
    };

    HaveDoneListModal.prototype.show = function() {
      this.$("#have-done-task-list").html(null);
      return $(this.el).show();
    };

    HaveDoneListModal.prototype.hide = function() {
      return $(this.el).hide();
    };

    HaveDoneListModal.prototype.isVisible = function() {
      return $(this.el).is(":visible");
    };

    HaveDoneListModal.prototype.loadData = function() {
      return this.taskList.tasks.fetch();
    };

    return HaveDoneListModal;

  })(Backbone.View);
  
}});

window.require.define({"views/widgets/tree": function(exports, require, module) {
  var slugify,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  slugify = require("../../helpers").slugify;

  exports.Tree = (function() {

    function Tree(navEl, treeEl, data, callbacks) {
      var tree;
      this.treeEl = treeEl;
      this._onSearchChanged = __bind(this._onSearchChanged, this);

      this._onSearchClicked = __bind(this._onSearchClicked, this);

      this._convertData = __bind(this._convertData, this);

      this._getStringPath = __bind(this._getStringPath, this);

      this.setToolbar(navEl);
      tree = this._convertData(data);
      this.widget = this.treeEl.jstree({
        plugins: ["themes", "json_data", "ui", "crrm", "unique", "sort", "cookies", "types", "hotkeys", "dnd", "search"],
        json_data: tree,
        types: {
          "default": {
            valid_children: "default"
          },
          "root": {
            valid_children: null,
            delete_node: false,
            rename_node: false,
            move_node: false,
            start_drag: false
          }
        },
        hotkeys: {
          space: false,
          up: false,
          down: false,
          left: false,
          right: false,
          del: false
        },
        ui: {
          select_limit: 1,
          initially_select: ["tree-node-all"]
        },
        themes: {
          theme: "default",
          dots: false,
          icons: false
        },
        core: {
          animation: 0,
          initially_open: ["tree-node-all"]
        },
        unique: {
          error_callback: function(node, p, func) {
            return alert("A note has already that name: '" + node + "'");
          }
        }
      });
      this.searchField = $("#tree-search-field");
      this.searchButton = $("#tree-search");
      this.setListeners(callbacks);
    }

    Tree.prototype.setToolbar = function(navEl) {
      return navEl.prepend(require('../templates/tree_buttons'));
    };

    Tree.prototype.setListeners = function(callbacks) {
      var _this = this;
      $("#tree-create").click(function() {
        return _this.treeEl.jstree("create");
      });
      $("#tree-rename").click(function() {
        return _this.treeEl.jstree("rename");
      });
      $("#tree-remove").click(function() {
        return _this.treeEl.jstree("remove");
      });
      this.searchButton.click(this._onSearchClicked);
      this.searchField.keyup(this._onSearchChanged);
      this.widget.bind("create.jstree", function(e, data) {
        var idPath, nodeName, parent, path;
        nodeName = data.inst.get_text(data.rslt.obj);
        parent = data.rslt.parent;
        path = _this._getPath(parent, nodeName);
        path.pop();
        idPath = "tree-node" + (_this._getPath(parent, nodeName).join("-"));
        data.rslt.obj.attr("id", idPath);
        return callbacks.onCreate(path.join("/"), data.rslt.name, data);
      });
      this.widget.bind("rename.jstree", function(e, data) {
        var idPath, nodeName, parent, path;
        nodeName = data.inst.get_text(data.rslt.obj);
        parent = data.inst._get_parent(data.rslt.parent);
        path = _this._getStringPath(parent, data.rslt.old_name);
        if (path === "all") {
          return $.jstree.rollback(data.rlbk);
        } else if (data.rslt.old_name !== data.rslt.new_name) {
          idPath = "tree-node" + (_this._getPath(parent, nodeName).join("-"));
          data.rslt.obj.attr("id", idPath);
          _this.rebuildIds(data, data.rslt.obj, idPath);
          return callbacks.onRename(path, data.rslt.new_name, data);
        }
      });
      this.widget.bind("remove.jstree", function(e, data) {
        var nodeName, parent, path;
        nodeName = data.inst.get_text(data.rslt.obj);
        parent = data.rslt.parent;
        path = _this._getStringPath(parent, nodeName);
        if (path === "all") {
          return $.jstree.rollback(data.rlbk);
        } else {
          return callbacks.onRemove(path);
        }
      });
      this.widget.bind("select_node.jstree", function(e, data) {
        var nodeName, parent, path;
        nodeName = data.inst.get_text(data.rslt.obj);
        parent = data.inst._get_parent(data.rslt.parent);
        path = _this._getStringPath(parent, nodeName);
        return callbacks.onSelect(path, data.rslt.obj.data("id"));
      });
      this.widget.bind("move_node.jstree", function(e, data) {
        var newPath, nodeName, oldParent, oldPath, parent;
        nodeName = data.inst.get_text(data.rslt.o);
        parent = data.inst._get_parent(data.rslt.o);
        newPath = _this._getPath(parent, nodeName);
        newPath.pop();
        oldParent = data.inst.get_text(data.rslt.op);
        parent = data.inst._get_parent(data.rslt.op);
        oldPath = _this._getPath(parent, oldParent);
        oldPath.push(slugify(nodeName));
        if (newPath.length === 0) {
          return $.jstree.rollback(data.rlbk);
        } else {
          return callbacks.onDrop(newPath.join("/"), oldPath.join("/"), nodeName, data);
        }
      });
      return this.widget.bind("loaded.jstree", function(e, data) {
        return callbacks.onLoaded();
      });
    };

    Tree.prototype.rebuildIds = function(data, obj, idPath) {
      var child, newIdPath, _i, _len, _ref, _results;
      _ref = data.inst._get_children(obj);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        newIdPath = idPath + "-" + slugify($(child).children("a:eq(0)").text());
        $(child).attr("id", newIdPath);
        _results.push(this.rebuildIds(data, child, newIdPath));
      }
      return _results;
    };

    Tree.prototype.selectNode = function(path) {
      var node, nodePath, tree;
      nodePath = path.replace(/\//g, "-");
      node = $("#tree-node-" + nodePath);
      tree = $("#tree").jstree("deselect_all", null);
      return tree = $("#tree").jstree("select_node", node);
    };

    Tree.prototype._getPath = function(parent, nodeName) {
      var name, nodes;
      if (nodeName != null) {
        nodes = [slugify(nodeName)];
      }
      name = "all";
      while (name && parent !== void 0 && parent.children !== void 0) {
        name = parent.children("a:eq(0)").text();
        nodes.unshift(slugify(name));
        parent = parent.parent().parent();
      }
      return nodes;
    };

    Tree.prototype._getStringPath = function(parent, nodeName) {
      return this._getPath(parent, nodeName).join("/");
    };

    Tree.prototype._convertData = function(data) {
      var tree;
      tree = {
        data: {
          data: "all",
          attr: {
            id: "tree-node-all",
            rel: "root"
          },
          children: []
        }
      };
      this._convertNode(tree.data, data.all, "-all");
      if (tree.data.length === 0) {
        tree.data = "loading...";
      }
      return tree;
    };

    Tree.prototype._convertNode = function(parentNode, nodeToConvert, idpath) {
      var newNode, nodeIdPath, property, _results;
      _results = [];
      for (property in nodeToConvert) {
        if (!(property !== "name" && property !== "id")) {
          continue;
        }
        nodeIdPath = "" + idpath + "-" + (property.replace(/_/g, "-"));
        newNode = {
          data: nodeToConvert[property].name,
          metadata: {
            id: nodeToConvert[property].id
          },
          attr: {
            id: "tree-node" + nodeIdPath,
            rel: "default"
          },
          children: []
        };
        if (parentNode.children === void 0) {
          parentNode.data.push(newNode);
        } else {
          parentNode.children.push(newNode);
        }
        _results.push(this._convertNode(newNode, nodeToConvert[property], nodeIdPath));
      }
      return _results;
    };

    Tree.prototype._onSearchClicked = function(event) {
      if (this.searchField.is(":hidden")) {
        this.searchField.show();
        this.searchField.focus();
        return this.searchButton.addClass("button-active");
      } else {
        this.searchField.hide();
        return this.searchButton.removeClass("button-active");
      }
    };

    Tree.prototype._onSearchChanged = function(event) {
      var searchString;
      searchString = this.searchField.val();
      return this.treeEl.jstree("search", searchString);
    };

    return Tree;

  })();
  
}});

