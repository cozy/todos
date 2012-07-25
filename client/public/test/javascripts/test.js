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

window.require.define({"test/test-helpers": function(exports, require, module) {
  
  module.exports = {
    expect: require('chai').expect,
    should: require('chai').should,
    sinon: require('sinon')
  };
  
}});

window.require.define({"test/todo_model_test": function(exports, require, module) {
  var Task, TaskCollection, TaskLine;

  Task = require('models/task').Task;

  TaskCollection = require('collections/tasks').TaskCollection;

  TaskLine = require('views/task_view').TaskLine;

  describe('TaskLine', function() {
    beforeEach(function() {
      this.model = new Task({
        list: 123,
        description: "test"
      });
      this.view = new TaskLine(this.model);
      return this.model.collection = new TaskCollection;
    });
    afterEach(function() {});
    it("when I create a model", function() {});
    it("its url is automatically set", function() {
      return expect(this.model.url).to.equal("/todolists/" + this.model.list + "/tasks/");
    });
    it("When task is change its state to done", function() {
      return this.model.setDone();
    });
    it("Then its completion date is converted to an easily displayable date", function() {
      return expect(this.model.simpleDate).to.equal("DD/MM/YYYY");
    });
    return it("And task line has done class", function() {
      console.log(this.view.el.className);
      return expect(this.view.el.hasClass("done")).to.be.ok;
    });
  });
  
}});

window.require('test/todo_model_test');
