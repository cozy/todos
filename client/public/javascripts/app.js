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
  var Task, TaskLine,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Task = require("../models/task").Task;

  TaskLine = require("../views/task_view").TaskLine;

  exports.TaskCollection = (function(_super) {

    __extends(TaskCollection, _super);

    TaskCollection.prototype.model = Task;

    TaskCollection.prototype.url = 'tasks/';

    function TaskCollection(view) {
      this.addTask = __bind(this.addTask, this);
      this.addTasks = __bind(this.addTasks, this);      TaskCollection.__super__.constructor.call(this);
      this.view = view;
      this.bind("add", this.addTask);
      this.bind("reset", this.addTasks);
    }

    TaskCollection.prototype.parse = function(response) {
      return response.rows;
    };

    TaskCollection.prototype.addTasks = function(tasks) {
      var _this = this;
      return tasks.forEach(function(task) {
        return _this.addTask(task);
      });
    };

    TaskCollection.prototype.addTask = function(task) {
      var taskLine;
      taskLine = new TaskLine(task);
      return this.view.prepend(taskLine.render());
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
      Task.__super__.constructor.call(this);
      for (property in task) {
        this[property] = task[property];
      }
      if (this.id) this.url = "tasks/" + this.id + "/";
    }

    Task.prototype.setDone = function() {
      this.done = true;
      return this.view.done();
    };

    Task.prototype.setUndone = function() {
      this.done = false;
      return this.view.undone();
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
  var Task, TaskCollection,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TaskCollection = require("../collections/tasks").TaskCollection;

  Task = require("../models/task").Task;

  exports.HomeView = (function(_super) {

    __extends(HomeView, _super);

    HomeView.prototype.id = 'home-view';

    HomeView.prototype.events = {
      "click #new-task-button": "onAddClicked"
    };

    function HomeView() {
      HomeView.__super__.constructor.call(this);
    }

    HomeView.prototype.onAddClicked = function(event) {
      var task;
      task = new Task({
        done: false,
        description: "my task"
      });
      this.tasks.add(task);
      return task.save();
    };

    HomeView.prototype.render = function() {
      $(this.el).html(require('./templates/home'));
      this.tasks = new TaskCollection(this.$("#task-list"));
      this.tasks.fetch();
      return this;
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
      "click button": "onButtonClicked"
    };

    /* Constructor
    */

    function TaskLine(model) {
      this.model = model;
      this.onButtonClicked = __bind(this.onButtonClicked, this);
      TaskLine.__super__.constructor.call(this);
      this.id = this.model._id;
      this.model.view = this;
    }

    TaskLine.prototype.onButtonClicked = function(event) {
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
          return alert("An error occured, modification was not saved.");
        }
      });
    };

    TaskLine.prototype.done = function() {
      this.$("button").html("done");
      this.$("button").addClass("disabled");
      this.$("button").removeClass("btn-info");
      return $(this.el).addClass("done");
    };

    TaskLine.prototype.undone = function() {
      this.$("button").html("todo");
      this.$("button").removeClass("disabled");
      this.$("button").addClass("btn-info");
      return $(this.el).removeClass("done");
    };

    TaskLine.prototype.remove = function() {
      return $(this.el).remove();
    };

    TaskLine.prototype.render = function() {
      $(this.el).html(require('./templates/task'));
      if (this.model.done) this.done();
      return this.el;
    };

    return TaskLine;

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
buf.push('>new task\n</button><span');
buf.push(attrs({ "class": ('description') }));
buf.push('>To-do list</span></header><div');
buf.push(attrs({ 'id':('task-list') }));
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
buf.push(attrs({ "class": ("btn btn-info") }));
buf.push('>todo</button><span');
buf.push(attrs({ 'contenteditable':("true"), "class": ('description') }));
buf.push('></span>');
}
return buf.join("");
};
  }
}));
