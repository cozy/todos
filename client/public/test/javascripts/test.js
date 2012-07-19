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

window.require.define({"test/browsing": function(exports, require, module) {
<<<<<<< HEAD
  (function() {
    var app, phantom, should;

    should = require("should");

    app = require("../../server");

    phantom = require('phantom');

    describe("Browsing", function() {
      before(function(done) {
        app.listen(8001);
        return done();
      });
      after(function(done) {
        app.close();
        return done();
      });
      it("When I open web page", function(done) {
        var _this = this;
        return phantom.create(function(ph) {
          return ph.createPage(function(page) {
            _this.page = page;
            return page.open("http://localhost:8001", function(status) {
              return done();
            });
          });
        });
      });
      it("And I click on recipe note", function(done) {
        return this.page.evaluate(function() {
          return $("#tree-node-all-artforge").click();
        }, function(result) {
          return setTimeout(done, 1000);
        });
      });
      it("Then Recipe note title and path are displayed", function(done) {
        var _this = this;
        return this.page.evaluate(function() {
          return $(".todo-list-title").is(":visible");
        }, function(result) {
          result.should.be.ok;
          return _this.page.evaluate(function() {
            return $("#.todo-list-title .description").html();
          }, function(result) {
            result.should.be.equal("artforge");
            return done();
          });
        });
      });
      it("When I create a note", function(done) {
        return this.page.evaluate(function() {
          $("#tree-node-all").click();
          $("#tree-create").click();
          return $(".jstree-rename-input").blur();
        }, function(result) {
          return done();
        });
      });
      it("Then Todo note title and path are displayed", function() {
        return this.page.evaluate(function() {
          return $("#tree-node-all-new-node").click();
        }, function(result) {
          return setTimeout(done, 1000);
        });
      });
      return it("Then Recipe note title and path are displayed", function(done) {
        var _this = this;
        return this.page.evaluate(function() {
          return $(".todo-list-title").is(":visible");
        }, function(result) {
          result.should.be.ok;
          return _this.page.evaluate(function() {
            return $("#.todo-list-title .description").html();
          }, function(result) {
            result.should.be.equal("New node");
            return done();
          });
        });
      });
    });

  }).call(this);
  
}});

window.require.define({"test/common/test/client": function(exports, require, module) {
=======
>>>>>>> experimentation/phantom-mocha-tests
  (function() {
    var app, phantom, should;

    should = require("should");

    app = require("../../server");

    phantom = require('phantom');

    describe("Browsing", function() {
      before(function(done) {
        app.listen(8001);
        return done();
      });
      after(function(done) {
        app.close();
        return done();
      });
      it("When I open web page", function(done) {
        var _this = this;
        return phantom.create(function(ph) {
          return ph.createPage(function(page) {
            _this.page = page;
            return page.open("http://localhost:8001", function(status) {
              return done();
            });
          });
        });
      });
      it("And I click on recipe note", function(done) {
        return this.page.evaluate(function() {
          return $("#tree-node-all-artforge").click();
        }, function(result) {
          return setTimeout(done, 1000);
        });
      });
      it("Then Recipe note title and path are displayed", function(done) {
        var _this = this;
        return this.page.evaluate(function() {
          return $(".todo-list-title").is(":visible");
        }, function(result) {
          result.should.be.ok;
          return _this.page.evaluate(function() {
            return $("#.todo-list-title .description").html();
          }, function(result) {
            result.should.be.equal("artforge");
            return done();
          });
        });
      });
      it("When I create a note", function(done) {
        return this.page.evaluate(function() {
          $("#tree-node-all").click();
          $("#tree-create").click();
          return $(".jstree-rename-input").blur();
        }, function(result) {
          return done();
        });
      });
      it("Then Todo note title and path are displayed", function() {
        return this.page.evaluate(function() {
          return $("#tree-node-all-new-node").click();
        }, function(result) {
          return setTimeout(done, 1000);
        });
      });
      return it("Then Recipe note title and path are displayed", function(done) {
        var _this = this;
        return this.page.evaluate(function() {
          return $(".todo-list-title").is(":visible");
        }, function(result) {
          result.should.be.ok;
          return _this.page.evaluate(function() {
            return $("#.todo-list-title .description").html();
          }, function(result) {
            result.should.be.equal("New node");
            return done();
          });
        });
      });
    });

  }).call(this);
  
}});


