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

      TaskCollection.prototype.insertTask = function(previousTask, task, callbacks) {
        var index,
          _this = this;
        index = this.toArray().indexOf(previousTask);
        task.set("nextTask", previousTask.nextTask);
        task.set("previousTask", previousTask.id);
        task.collection = this;
        return task.save(task.attributes, {
          success: function() {
            previousTask.set("nextTask", task.id);
            task.url = "tasks/" + task.id + "/";
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

      TaskCollection.prototype.removeTask = function(task, callbacks) {
        var nextTask, previousTask;
        previousTask = this.getPreviousTask(task);
        nextTask = this.getNextTask(task);
        if (nextTask != null) {
          nextTask.set("previousTask", (previousTask != null ? previousTask.id : void 0) | null);
        }
        if (previousTask != null) {
          previousTask.set("nextTask", (nextTask != null ? nextTask.id : void 0) | null);
        }
        return task.destroy({
          success: function() {
            task.view.remove();
            return callbacks != null ? callbacks.success() : void 0;
          },
          error: callbacks.error
        });
      };

      return TaskCollection;

    })(Backbone.Collection);

  }).call(this);
  
}});

window.require.define({"helpers": function(exports, require, module) {
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

    exports.selectAll = function(node) {
      var range, sel;
      if (node.length > 0) {
        range = rangy.createRange();
        range.selectNodeContents(node[0].childNodes[0]);
        sel = rangy.getSelection();
        sel.setSingleRange(range);
        return true;
      } else {
        return false;
      }
    };

    exports.getCursorPosition = function(node) {
      var range, sel;
      if (node.length > 0) {
        range = rangy.createRange();
        range.selectNodeContents(node[0].childNodes[0]);
        sel = rangy.getSelection();
        range = sel.getRangeAt(0);
        return range.endOffset;
      } else {
        return 0;
      }
    };

    exports.setCursorPosition = function(node, cursorPosition) {
      var range, sel;
      if (node.length > 0) {
        range = rangy.createRange();
        range.collapseToPoint(node[0].childNodes[0], cursorPosition);
        sel = rangy.getSelection();
        sel.setSingleRange(range);
        return true;
      } else {
        return false;
      }
    };

  }).call(this);
  
}});

window.require.define({"initialize": function(exports, require, module) {
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
  
}});

window.require.define({"models/models": function(exports, require, module) {
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
  
}});

window.require.define({"models/task": function(exports, require, module) {
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
        if (!(task.description != null) || task.description.length === 0 || task.description === " " || task.description === "   " || task.description === "  ") {
          this["description"] = "empty task";
        }
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
        this.setLink();
        return this.view.undone();
      };

      Task.prototype.setLink = function() {
        var firstTask, nextTask, previousTask;
        if (this.collection.view.isArchive()) {
          this.view.remove();
          this.collection.view.moveToTaskList(this);
          firstTask = this.collection.at(0);
          this.set("nextTask", firstTask.id);
          return firstTask.set("firstTask", this.id);
        } else {
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
  
}});

window.require.define({"routers/main_router": function(exports, require, module) {
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
  
}});

window.require.define({"views/home_view": function(exports, require, module) {
  (function() {
    var Task, TaskCollection, TaskList, helpers,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    TaskCollection = require("../collections/tasks").TaskCollection;

    Task = require("../models/task").Task;

    TaskList = require("./tasks_view").TaskList;

    helpers = require("../helpers");

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

      HomeView.prototype.isEditMode = false;

      function HomeView() {
        HomeView.__super__.constructor.call(this);
      }

      HomeView.prototype.render = function() {
        $(this.el).html(require('./templates/home'));
        this.taskList = new TaskList(this, this.$("#task-list"));
        this.archiveList = new TaskList(this, this.$("#archive-list"));
        this.tasks = this.taskList.tasks;
        this.archiveTasks = this.archiveList.tasks;
        this.newButton = this.$("#new-task-button");
        this.showButtonsButton = this.$("#edit-button");
        this.newButton.hide();
        this.loadData();
        return this;
      };

      HomeView.prototype.loadData = function() {
        var _this = this;
        this.tasks.fetch({
          success: function() {
            if ($(".task:not(.done)").length > 0) {
              return $(".task:first .description").focus();
            } else {
              return _this.onAddClicked();
            }
          }
        });
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

      HomeView.prototype.onEditClicked = function(event) {
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

      HomeView.prototype.moveToTaskList = function(task) {
        return this.tasks.prependTask(task);
      };

      return HomeView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/tasks_view": function(exports, require, module) {
  (function() {
    var TaskCollection, TaskLine, helpers,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    TaskCollection = require("../collections/tasks").TaskCollection;

    TaskLine = require("../views/task_view").TaskLine;

    helpers = require("../helpers");

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

      TaskList.prototype.moveUpFocus = function(taskLine, options) {
        var nextDescription, selector;
        selector = "#" + taskLine.model.id;
        nextDescription = $(selector).prev().find(".description");
        return this.moveFocus(taskLine.descriptionField, nextDescription, options);
      };

      TaskList.prototype.moveDownFocus = function(taskLine, options) {
        var nextDescription, selector;
        selector = "#" + taskLine.model.id;
        nextDescription = $(selector).next().find(".description");
        return this.moveFocus(taskLine.descriptionField, nextDescription, options);
      };

      TaskList.prototype.moveFocus = function(previousNode, nextNode, options) {
        var cursorPosition;
        cursorPosition = helpers.getCursorPosition(previousNode);
        nextNode.focus();
        if (((options != null ? options.maxPosition : void 0) != null) && options.maxPosition) {
          return helpers.setCursorPosition(nextNode, nextNode.text().length);
        } else {
          return helpers.setCursorPosition(nextNode, cursorPosition);
        }
      };

      TaskList.prototype.insertTask = function(previousTaskLine, task) {
        var taskLine, taskLineEl;
        taskLine = new TaskLine(task);
        taskLine.list = this;
        taskLineEl = $(taskLine.render());
        taskLineEl.insertAfter($(previousTaskLine.el));
        taskLine.focusDescription();
        if (this.mainView.isEditMode) taskLine.showButtons();
        return taskLine;
      };

      return TaskList;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/templates/home": function(exports, require, module) {
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
  buf.push('>show buttons\n</button><span');
  buf.push(attrs({ "class": ('description') }));
  buf.push('>To-do list</span></header><div');
  buf.push(attrs({ 'id':('task-list') }));
  buf.push('></div><h2>archives</h2><div');
  buf.push(attrs({ 'id':('archive-list') }));
  buf.push('></div></div></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/task": function(exports, require, module) {
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
  buf.push(attrs({ "class": ('up-task-button') + ' ' + ('btn') }));
  buf.push('>up</button><button');
  buf.push(attrs({ "class": ('down-task-button') + ' ' + ('btn') }));
  buf.push('>down</button><button');
  buf.push(attrs({ "class": ('del-task-button') + ' ' + ('btn') }));
  buf.push('>X</button></div>');
  }
  return buf.join("");
  };
}});

