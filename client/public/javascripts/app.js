(function(/*! Brunch !*/) {
  'use strict';

  if (!this.require) {
    var modules = {};
    var cache = {};
    var __hasProp = ({}).hasOwnProperty;

    var expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var getFullPath = function(path, fromCache) {
      var store = fromCache ? cache : modules;
      var dirIndex;
      if (__hasProp.call(store, path)) return path;
      dirIndex = expand(path, './index');
      if (__hasProp.call(store, dirIndex)) return dirIndex;
    };
    
    var cacheModule = function(name, path, contentFn) {
      var module = {id: path, exports: {}};
      try {
        cache[path] = module.exports;
        contentFn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        cache[path] = module.exports;
      } catch (err) {
        delete cache[path];
        throw err;
      }
      return cache[path];
    };

    var require = function(name, root) {
      var path = expand(root, name);
      var fullPath;

      if (fullPath = getFullPath(path, true)) {
        return cache[fullPath];
      } else if (fullPath = getFullPath(path, false)) {
        return cacheModule(name, fullPath, modules[fullPath]);
      } else {
        throw new Error("Cannot find module '" + name + "'");
      }
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle) {
        if (__hasProp.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    };
  }
}).call(this);
(this.require.define({
  "collections/tasks": function(exports, require, module) {
    (function() {
  var Task,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Task = require("../models/task").Task;

  exports.TaskCollection = (function(_super) {

    __extends(TaskCollection, _super);

    TaskCollection.prototype.model = Task;

    TaskCollection.prototype.url = 'tasks/';

    function TaskCollection(view) {
      this.down = __bind(this.down, this);
      this.up = __bind(this.up, this);
      this.prependTask = __bind(this.prependTask, this);
      this.addTasks = __bind(this.addTasks, this);      TaskCollection.__super__.constructor.call(this);
      this.view = view;
      this.bind("add", this.prependTask);
      this.bind("reset", this.addTasks);
    }

    TaskCollection.prototype.parse = function(response) {
      return response.rows;
    };

    TaskCollection.prototype.addTasks = function(tasks) {
      var _this = this;
      return tasks.forEach(function(task) {
        task.collection = _this;
        return _this.view.addTaskLine(task);
      });
    };

    TaskCollection.prototype.prependTask = function(task) {
      var nextTask;
      task.collection = this;
      nextTask = this.at(0);
      if (nextTask != null) {
        nextTask.set("previousTask", task.id);
        task.set("nextTask", nextTask.id);
      }
      return this.view.addTaskLineAsFirstRow(task);
    };

    TaskCollection.prototype.getPreviousTask = function(task) {
      return this.get(task.previousTask);
    };

    TaskCollection.prototype.getNextTask = function(task) {
      return this.get(task.nextTask);
    };

    TaskCollection.prototype.getPreviousTodoTask = function(task) {
      task = this.getPreviousTask(task);
      while ((task != null) && task.done) {
        task = this.getPreviousTask(task);
      }
      return task;
    };

    TaskCollection.prototype.getNextTodoTask = function(task) {
      task = this.getNextTask(task);
      while ((task != null) && task.done) {
        task = this.getNextTask(task);
      }
      return task;
    };

    TaskCollection.prototype.up = function(task) {
      var index, nextTask, oldPreviousTask, previousTask;
      index = this.toArray().indexOf(task);
      if (index === 0) return false;
      if (index > 0) oldPreviousTask = this.at(index - 1);
      if (index > 1) previousTask = this.at(index - 2);
      nextTask = this.at(index + 1);
      if (nextTask != null) {
        nextTask.set("previousTask", oldPreviousTask.id);
        oldPreviousTask.set("nextTask", nextTask.id);
      } else {
        oldPreviousTask.set("nextTask", null);
      }
      if (previousTask != null) {
        previousTask.set("nextTask", task.id);
        task.set("previousTask", previousTask.id);
      } else {
        task.set("previousTask", null);
      }
      task.set("nextTask", oldPreviousTask.id);
      this.remove(task);
      this.add(task, {
        at: index - 1,
        silent: true
      });
      task.view.up(oldPreviousTask.id);
      return true;
    };

    TaskCollection.prototype.down = function(task) {
      var index, nextTask, oldNextTask, previousTask, tasksLength;
      index = this.toArray().indexOf(task);
      tasksLength = this.size();
      if (index === tasksLength - 1) return false;
      if (index < tasksLength - 1) oldNextTask = this.at(index + 1);
      if (index < tasksLength - 1) nextTask = this.at(index + 2);
      previousTask = this.at(index - 1);
      if (previousTask != null) {
        previousTask.set("nextTask", oldNextTask.id);
        oldNextTask.set("previousTask", previousTask.id);
      } else {
        oldNextTask.set("previousTask", null);
      }
      if (nextTask != null) {
        nextTask.set("previousTask", task.id);
        task.set("nextTask", nextTask.id);
      } else {
        task.set("nextTask", null);
      }
      task.set("previousTask", oldNextTask.id);
      this.remove(task);
      this.add(task, {
        at: index + 1,
        silent: true
      });
      task.view.down(oldNextTask.id);
      return true;
    };

    return TaskCollection;

  })(Backbone.Collection);

}).call(this);

  }
}));
(this.require.define({
  "helpers": function(exports, require, module) {
    (function() {

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

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var BrunchApplication, HomeView, MainRouter,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BrunchApplication = require('helpers').BrunchApplication;

  MainRouter = require('routers/main_router').MainRouter;

  HomeView = require('views/home_view').HomeView;

  exports.Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.initialize = function() {
      this.router = new MainRouter;
      return this.homeView = new HomeView;
    };

    return Application;

  })(BrunchApplication);

  window.app = new exports.Application;

}).call(this);

  }
}));
(this.require.define({
  "models/models": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.BaseModel = (function(_super) {

    __extends(BaseModel, _super);

    function BaseModel() {
      BaseModel.__super__.constructor.apply(this, arguments);
    }

    BaseModel.prototype.isNew = function() {
      return !(this.id != null);
    };

    return BaseModel;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "models/task": function(exports, require, module) {
    (function() {
  var BaseModel,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseModel = require("./models").BaseModel;

  exports.Task = (function(_super) {

    __extends(Task, _super);

    Task.prototype.url = 'tasks/';

    function Task(task) {
      var property;
      Task.__super__.constructor.call(this, task);
      for (property in task) {
        this[property] = task[property];
      }
      if (this.id) this.url = "tasks/" + this.id + "/";
    }

    Task.prototype.setDone = function() {
      this.done = true;
      this.set("previousTask", null);
      this.set("nextTask", null);
      this.cleanLinks();
      return this.view.done();
    };

    Task.prototype.setUndone = function() {
      this.done = false;
      console.log("undone");
      this.setLink();
      return this.view.undone();
    };

    Task.prototype.setLink = function() {
      var nextTask, previousTask;
      if (this.collection.view.isArchive()) {
        this.view.remove();
        return this.collection.view.moveToTaskList(this);
      } else {
        console.log("ok");
        previousTask = this.collection.getPreviousTodoTask(this);
        nextTask = this.collection.getNextTodoTask(this);
        if (previousTask != null) {
          this.set("previousTask", previousTask.id);
          previousTask.set("nextTask", this.id);
        } else {
          this.set("previousTask", null);
        }
        if (nextTask != null) {
          this.set("nextTask", nextTask.id);
          return nextTask.set("previousTask", this.id);
        } else {
          return this.set("nextTask", null);
        }
      }
    };

    Task.prototype.cleanLinks = function() {
      var nextTask, previousTask;
      previousTask = this.collection.getPreviousTask(this);
      nextTask = this.collection.getNextTask(this);
      if ((nextTask != null) && (previousTask != null)) {
        previousTask.set("nextTask", nextTask.id);
        return nextTask.set("previousTask", previousTask.id);
      } else if (previousTask != null) {
        return previousTask.set("nextTask", null);
      } else if (nextTask != null) {
        return nextTask.set("previousTask", null);
      }
    };

    return Task;

  })(BaseModel);

}).call(this);

  }
}));
(this.require.define({
  "routers/main_router": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.MainRouter = (function(_super) {

    __extends(MainRouter, _super);

    function MainRouter() {
      MainRouter.__super__.constructor.apply(this, arguments);
    }

    MainRouter.prototype.routes = {
      '': 'home'
    };

    MainRouter.prototype.home = function() {
      return $('body').html(app.homeView.render().el);
    };

    return MainRouter;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "views/home_view": function(exports, require, module) {
    (function() {
  var Task, TaskCollection, TaskList,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TaskCollection = require("../collections/tasks").TaskCollection;

  Task = require("../models/task").Task;

  TaskList = require("./tasks_view").TaskList;

  exports.HomeView = (function(_super) {

    __extends(HomeView, _super);

    HomeView.prototype.id = 'home-view';

    HomeView.prototype.events = {
      "click #new-task-button": "onAddClicked",
      "click #edit-button": "onEditClicked"
    };

    /*
        # Initializers
    */

    function HomeView() {
      HomeView.__super__.constructor.call(this);
      this.isEditMode = false;
    }

    HomeView.prototype.render = function() {
      $(this.el).html(require('./templates/home'));
      this.taskList = new TaskList(this, this.$("#task-list"));
      this.archiveList = new TaskList(this, this.$("#archive-list"));
      this.tasks = this.taskList.tasks;
      this.archiveTasks = this.archiveList.tasks;
      this.loadData();
      return this;
    };

    HomeView.prototype.loadData = function() {
      this.tasks.fetch();
      this.archiveTasks.url = "tasks/archives/";
      return this.archiveTasks.fetch();
    };

    /*
        # Listeners
    */

    HomeView.prototype.onAddClicked = function(event) {
      var task,
        _this = this;
      task = new Task({
        done: false,
        description: "new task"
      });
      return task.save(null, {
        success: function(data) {
          data.url = "tasks/" + data.id + "/";
          _this.tasks.add(data);
          return $("" + data.id + " span.description").contents().focus();
        },
        error: function() {
          return alert("An error occured while saving data");
        }
      });
    };

    HomeView.prototype.onEditClicked = function(event) {
      if (!this.isEditMode) {
        this.$(".task-buttons").show();
        return this.isEditMode = true;
      } else {
        this.$(".task-buttons").hide();
        return this.isEditMode = false;
      }
    };

    /*
        # Functions
    */

    HomeView.prototype.moveToTaskList = function(task) {
      return this.tasks.prependTask(task);
    };

    return HomeView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/task_view": function(exports, require, module) {
    (function() {
  var template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('./templates/task');

  exports.TaskLine = (function(_super) {

    __extends(TaskLine, _super);

    TaskLine.prototype.className = "task clearfix";

    TaskLine.prototype.tagName = "div";

    TaskLine.prototype.events = {
      "click .todo-button": "onTodoButtonClicked",
      "click .del-task-button": "onDelButtonClicked",
      "click .up-task-button": "onUpButtonClicked",
      "click .down-task-button": "onDownButtonClicked",
      "keyup span": "onDescriptionChanged"
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
      this.list;
    }

    TaskLine.prototype.render = function() {
      template = require('./templates/task');
      $(this.el).html(template({
        "model": this.model
      }));
      this.el.id = this.model.id;
      if (this.model.done) this.done();
      this.setListeners();
      this.$(".task-buttons").hide();
      return this.el;
    };

    TaskLine.prototype.setListeners = function() {
      this.$("span.description").keypress(function(event) {
        return event.which !== 13;
      });
      this.$("span.description").live('blur keyup paste', function(event) {
        var el;
        el = $(this);
        if (el.data('before') !== el.html()) {
          el.data('before', el.html());
          el.trigger('change', event.which);
        }
        return el;
      });
      return this.$("span.description").bind("change", this.onDescriptionChanged);
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
      var _this = this;
      return this.model.destroy({
        success: function() {
          return _this.remove();
        },
        error: function() {
          return alert("An error occured, deletion was not saved.");
        }
      });
    };

    TaskLine.prototype.onUpButtonClicked = function(event) {
      if (this.model.collection.up(this.model)) {
        return this.model.save({
          success: function() {},
          error: function() {
            return alert("An error occured, modifications were not saved.");
          }
        });
      }
    };

    TaskLine.prototype.onDownButtonClicked = function(event) {
      if (this.model.collection.down(this.model)) {
        return this.model.save({
          success: function() {},
          error: function() {
            return alert("An error occured, modifications were not saved.");
          }
        });
      }
    };

    TaskLine.prototype.onDescriptionChanged = function(event, keyCode) {
      var saveDescription,
        _this = this;
      saveDescription = function() {
        _this.saving = false;
        _this.model.description = _this.$("span.description").html();
        return _this.model.save({
          description: _this.model.description
        }, {
          success: function() {},
          error: function() {
            return alert("An error occured, modifications were not saved.");
          }
        });
      };
      if (keyCode === 13) {
        return event.preventDefault();
      } else if (!this.saving) {
        this.saving = true;
        return setTimeout(saveDescription, 2000);
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
      return $(this.el).insertBefore($("#" + previousLineId));
    };

    TaskLine.prototype.down = function(nextLineId) {
      return $(this.el).insertAfter($("#" + nextLineId));
    };

    TaskLine.prototype.remove = function() {
      this.unbind();
      return $(this.el).remove();
    };

    return TaskLine;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/tasks_view": function(exports, require, module) {
    (function() {
  var TaskCollection, TaskLine,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TaskCollection = require("../collections/tasks").TaskCollection;

  TaskLine = require("../views/task_view").TaskLine;

  exports.TaskList = (function(_super) {

    __extends(TaskList, _super);

    TaskList.prototype.className = "task clearfix";

    TaskList.prototype.tagName = "div";

    function TaskList(mainView, el) {
      this.mainView = mainView;
      this.el = el;
      TaskList.__super__.constructor.call(this);
      this.tasks = new TaskCollection(this);
    }

    TaskList.prototype.addTaskLine = function(task) {
      var taskLine;
      taskLine = new TaskLine(task, this);
      return $(this.el).append(taskLine.render());
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
      return this.mainView.moveToTaskList(task);
    };

    return TaskList;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/home": function(exports, require, module) {
    module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<nav></nav><div');
buf.push(attrs({ 'id':('content') }));
buf.push('><div');
buf.push(attrs({ 'id':('todo-list') }));
buf.push('><header');
buf.push(attrs({ "class": ('todo-list-title') + ' ' + ('clearfix') }));
buf.push('><button');
buf.push(attrs({ 'id':("new-task-button"), "class": ("btn btn-large btn-success") }));
buf.push('>new task\n</button><button');
buf.push(attrs({ 'id':("edit-button"), "class": ("btn btn-large") }));
buf.push('>edit mode\n</button><span');
buf.push(attrs({ "class": ('description') }));
buf.push('>To-do list</span></header><div');
buf.push(attrs({ 'id':('task-list') }));
buf.push('></div><h2>archives</h2><div');
buf.push(attrs({ 'id':('archive-list') }));
buf.push('></div></div></div>');
}
return buf.join("");
};
  }
}));
(this.require.define({
  "views/templates/task": function(exports, require, module) {
    module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<button');
buf.push(attrs({ "class": ('btn') + ' ' + ('btn-info') + ' ' + ('todo-button') }));
buf.push('>todo</button><span');
buf.push(attrs({ 'contenteditable':("true"), "class": ('description') }));
buf.push('>' + escape((interp = model.description) == null ? '' : interp) + ' </span><div');
buf.push(attrs({ "class": ('task-buttons') }));
buf.push('><button');
buf.push(attrs({ "class": ('up-task-button') }));
buf.push('>up</button><button');
buf.push(attrs({ "class": ('down-task-button') }));
buf.push('>down</button><button');
buf.push(attrs({ "class": ('del-task-button') }));
buf.push('>X</button></div>');
}
return buf.join("");
};
  }
}));
