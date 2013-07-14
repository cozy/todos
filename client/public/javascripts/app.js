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

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("collections/tasks", function(exports, require, module) {
  var Task,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Task = require("../models/task").Task;

  exports.TaskCollection = (function(_super) {
    __extends(TaskCollection, _super);

    TaskCollection.prototype.model = Task;

    function TaskCollection(view, listId, options) {
      this.view = view;
      this.listId = listId;
      this.options = options;
      this.onTaskAdded = __bind(this.onTaskAdded, this);
      this.onReset = __bind(this.onReset, this);
      TaskCollection.__super__.constructor.call(this, {
        id: this.listId
      }, this.options);
      this.url = "todolists/" + this.listId + "/tasks/";
      this.bind("add", this.onTaskAdded);
      this.bind("reset", this.onReset);
    }

    TaskCollection.prototype.parse = function(response) {
      return response.rows;
    };

    TaskCollection.prototype.onReset = function(tasks) {
      var previousTask,
        _this = this;
      previousTask = null;
      tasks.forEach(function(task) {
        var _ref, _ref1;
        task.collection = _this;
        if (previousTask != null) {
          task.setPreviousTask(previousTask);
        }
        previousTask = task;
        if ((_ref = _this.options) != null ? _ref.grouping : void 0) {
          if (((_ref1 = _this.lastTask) != null ? _ref1.simpleDate : void 0) !== task.simpleDate) {
            _this.view.addDateLine(task.simpleDate);
          }
          _this.lastTask = task;
        }
        return _this.view.addTaskLine(task);
      });
      return this.lastTask = null;
    };

    TaskCollection.prototype.onTaskAdded = function(task) {
      if (this.length > 1) {
        task.setPreviousTask(this.at(this.length - 2));
      }
      return this.view.addTaskLine(task);
    };

    TaskCollection.prototype.insertTask = function(previousTask, task, callbacks) {
      var firstTask, index, nextTask,
        _this = this;
      index = this.toArray().indexOf(previousTask);
      nextTask = null;
      if ((previousTask != null) && index > -1 && index < this.length - 1) {
        nextTask = this.at(index + 1);
        if (nextTask != null) {
          nextTask.set("previousTask", task.id);
        }
      } else {
        firstTask = this.at(0);
        if (firstTask != null) {
          nextTask = firstTask;
        }
      }
      task.set("list", this.listId);
      if (nextTask != null) {
        task.set("nextTask", nextTask.id);
      }
      if (previousTask != null) {
        task.set("previousTask", previousTask.id);
      }
      this.socketListener.watchOne(task);
      return task.save(task.attributes, {
        ignoreMySocketNotification: true,
        success: function(data) {
          if (previousTask != null) {
            previousTask.set("nextTask", task.id);
          }
          if (nextTask != null) {
            nextTask.set("previousTask", task.id);
          }
          _this.add(task, {
            at: index + 1,
            silent: true
          });
          if ((previousTask != null) && (_this.view != null)) {
            _this.view.insertTask(previousTask.view, task);
          } else if (_this.view != null) {
            _this.view.insertTask(null, task);
          }
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

    TaskCollection.prototype.reorder = function(task, newIndex) {
      var index, newNextTask, newPreviousTask, oldNextTask, oldPreviousTask;
      index = this.toArray().indexOf(task);
      oldPreviousTask = this.getPreviousTask(task);
      oldNextTask = this.getNextTask(task);
      if (oldPreviousTask != null) {
        oldPreviousTask.setNextTask(oldNextTask);
      } else {
        oldNextTask.setPreviousTask(oldPreviousTask);
      }
      newPreviousTask = null;
      if (newIndex > 0) {
        newPreviousTask = this.at(newIndex - 1);
      }
      if (newIndex >= this.length) {
        newNextTask = null;
      } else {
        newNextTask = this.at(newIndex);
      }
      task.setPreviousTask(newPreviousTask);
      task.setNextTask(newNextTask);
      if (index < newIndex) {
        newIndex--;
      }
      this.remove(task);
      this.add(task, {
        at: newIndex,
        silent: true
      });
      return true;
    };

    TaskCollection.prototype.removeTask = function(task, callbacks) {
      var nextTask, previousTask,
        _this = this;
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
        ignoreMySocketNotification: true,
        success: function() {
          task.view.remove();
          return callbacks != null ? callbacks.success() : void 0;
        },
        error: callbacks != null ? callbacks.error : void 0
      });
    };

    return TaskCollection;

  })(Backbone.Collection);
  
});
window.require.register("collections/todolists", function(exports, require, module) {
  var TodoList,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TodoList = require("../models/todolist").TodoList;

  exports.TodoListCollection = (function(_super) {
    __extends(TodoListCollection, _super);

    TodoListCollection.prototype.model = TodoList;

    TodoListCollection.prototype.url = 'todolists/';

    function TodoListCollection() {
      TodoListCollection.__super__.constructor.call(this);
    }

    TodoListCollection.prototype.parse = function(response) {
      return response.rows;
    };

    return TodoListCollection;

  })(Backbone.Collection);
  
});
window.require.register("helpers", function(exports, require, module) {
  exports.BrunchApplication = (function() {
    function BrunchApplication() {
      var _this = this;
      $(function() {
        _this.initialize(_this);
        return Backbone.history.start();
      });
    }

    BrunchApplication.prototype.initializeJQueryExtensions = function() {
      return $.fn.spin = function(opts, color) {
        var presets;
        presets = {
          tiny: {
            lines: 8,
            length: 2,
            width: 2,
            radius: 3
          },
          small: {
            lines: 8,
            length: 1,
            width: 2,
            radius: 5
          },
          large: {
            lines: 10,
            length: 8,
            width: 4,
            radius: 8
          }
        };
        if (Spinner) {
          return this.each(function() {
            var $this, spinner;
            $this = $(this);
            spinner = $this.data("spinner");
            if (spinner != null) {
              spinner.stop();
              return $this.data("spinner", null);
            } else if (opts !== false) {
              if (typeof opts === "string") {
                if (opts in presets) {
                  opts = presets[opts];
                } else {
                  opts = {};
                }
                if (color) {
                  opts.color = color;
                }
              }
              spinner = new Spinner($.extend({
                color: $this.css("color")
              }, opts));
              spinner.spin(this);
              return $this.data("spinner", spinner);
            }
          });
        } else {
          console.log("Spinner class not available.");
          return null;
        }
      };
    };

    BrunchApplication.prototype.initialize = function() {
      return null;
    };

    return BrunchApplication;

  })();

  exports.selectAll = function(input) {
    return input.setSelection(0, input.val().length);
  };

  exports.slugify = require("./lib/slug");

  exports.getPathRegExp = function(path) {
    var slashReg;
    slashReg = new RegExp("/", "g");
    return "^" + (path.replace(slashReg, "\/"));
  };

  exports.extractTags = function(description) {
    var hashTags, tag, tagSlug, tags, _i, _len;
    hashTags = description.match(/#(\w)*/g);
    tags = [];
    if (hashTags != null) {
      for (_i = 0, _len = hashTags.length; _i < _len; _i++) {
        tag = hashTags[_i];
        if (tag === "#t") {
          tag = "#today";
        }
        if (tag === "#w") {
          tag = "#week";
        }
        if (tag === "#m") {
          tag = "#month";
        }
        if (tag !== "#") {
          tagSlug = tag.substring(1);
          tagSlug = this.slugify(tagSlug);
          tags.push(tagSlug);
        }
      }
    }
    return tags;
  };
  
});
window.require.register("initialize", function(exports, require, module) {
  var BrunchApplication, HomeView, MainRouter, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BrunchApplication = require('helpers').BrunchApplication;

  MainRouter = require('routers/main_router').MainRouter;

  HomeView = require('views/home_view').HomeView;

  exports.Application = (function(_super) {
    __extends(Application, _super);

    function Application() {
      _ref = Application.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Application.prototype.initialize = function() {
      this.initializeJQueryExtensions();
      this.router = new MainRouter;
      return this.homeView = new HomeView;
    };

    return Application;

  })(BrunchApplication);

  window.app = new exports.Application;
  
});
window.require.register("lib/request", function(exports, require, module) {
  exports.request = function(type, url, data, callback) {
    var options;
    options = {
      type: type,
      url: url,
      data: data != null ? JSON.stringify(data) : null,
      dataType: "json",
      success: function(data) {
        if (callback != null) {
          return callback(null, data);
        }
      },
      error: function() {
        if ((data != null) && (data.msg != null) && (callback != null)) {
          return callback(new Error(data.msg));
        } else if (callback != null) {
          return callback(new Error("Server error occured"));
        }
      }
    };
    if (type === "POST" || type === "PUT") {
      options.contentType = "application/json";
    }
    return $.ajax(options);
  };

  exports.get = function(url, callback) {
    return exports.request("GET", url, null, callback);
  };

  exports.post = function(url, data, callback) {
    return exports.request("POST", url, data, callback);
  };

  exports.put = function(url, data, callback) {
    return exports.request("PUT", url, data, callback);
  };

  exports.del = function(url, callback) {
    return exports.request("DELETE", url, null, callback);
  };
  
});
window.require.register("lib/slug", function(exports, require, module) {
  var char_map, removelist, slug, word;

  removelist = ['sign', 'cross', 'of', 'symbol', 'staff'];

  removelist = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = removelist.length; _i < _len; _i++) {
      word = removelist[_i];
      _results.push(new RegExp(word, 'gi'));
    }
    return _results;
  })();

  char_map = {
    'À': 'A',
    'Á': 'A',
    'Â': 'A',
    'Ã': 'A',
    'Ä': 'A',
    'Å': 'A',
    'Æ': 'AE',
    'Ç': 'C',
    'È': 'E',
    'É': 'E',
    'Ê': 'E',
    'Ë': 'E',
    'Ì': 'I',
    'Í': 'I',
    'Î': 'I',
    'Ï': 'I',
    'Ð': 'D',
    'Ñ': 'N',
    'Ò': 'O',
    'Ó': 'O',
    'Ô': 'O',
    'Õ': 'O',
    'Ö': 'O',
    'Ő': 'O',
    'Ø': 'O',
    'Ù': 'U',
    'Ú': 'U',
    'Û': 'U',
    'Ü': 'U',
    'Ű': 'U',
    'Ý': 'Y',
    'Þ': 'TH',
    'ß': 'ss',
    'à': 'a',
    'á': 'a',
    'â': 'a',
    'ã': 'a',
    'ä': 'a',
    'å': 'a',
    'æ': 'ae',
    'ç': 'c',
    'è': 'e',
    'é': 'e',
    'ê': 'e',
    'ë': 'e',
    'ì': 'i',
    'í': 'i',
    'î': 'i',
    'ï': 'i',
    'ð': 'd',
    'ñ': 'n',
    'ò': 'o',
    'ó': 'o',
    'ô': 'o',
    'õ': 'o',
    'ö': 'o',
    'ő': 'o',
    'ø': 'o',
    'ù': 'u',
    'ú': 'u',
    'û': 'u',
    'ü': 'u',
    'ű': 'u',
    'ý': 'y',
    'þ': 'th',
    'ÿ': 'y',
    'ẞ': 'SS',
    'α': 'a',
    'β': 'b',
    'γ': 'g',
    'δ': 'd',
    'ε': 'e',
    'ζ': 'z',
    'η': 'h',
    'θ': '8',
    'ι': 'i',
    'κ': 'k',
    'λ': 'l',
    'μ': 'm',
    'ν': 'n',
    'ξ': '3',
    'ο': 'o',
    'π': 'p',
    'ρ': 'r',
    'σ': 's',
    'τ': 't',
    'υ': 'y',
    'φ': 'f',
    'χ': 'x',
    'ψ': 'ps',
    'ω': 'w',
    'ά': 'a',
    'έ': 'e',
    'ί': 'i',
    'ό': 'o',
    'ύ': 'y',
    'ή': 'h',
    'ώ': 'w',
    'ς': 's',
    'ϊ': 'i',
    'ΰ': 'y',
    'ϋ': 'y',
    'ΐ': 'i',
    'Α': 'A',
    'Β': 'B',
    'Γ': 'G',
    'Δ': 'D',
    'Ε': 'E',
    'Ζ': 'Z',
    'Η': 'H',
    'Θ': '8',
    'Ι': 'I',
    'Κ': 'K',
    'Λ': 'L',
    'Μ': 'M',
    'Ν': 'N',
    'Ξ': '3',
    'Ο': 'O',
    'Π': 'P',
    'Ρ': 'R',
    'Σ': 'S',
    'Τ': 'T',
    'Υ': 'Y',
    'Φ': 'F',
    'Χ': 'X',
    'Ψ': 'PS',
    'Ω': 'W',
    'Ά': 'A',
    'Έ': 'E',
    'Ί': 'I',
    'Ό': 'O',
    'Ύ': 'Y',
    'Ή': 'H',
    'Ώ': 'W',
    'Ϊ': 'I',
    'Ϋ': 'Y',
    'ş': 's',
    'Ş': 'S',
    'ı': 'i',
    'İ': 'I',
    'ğ': 'g',
    'Ğ': 'G',
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'yo',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'j',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'h',
    'ц': 'c',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sh',
    'ъ': 'u',
    'ы': 'y',
    'ь': '',
    'э': 'e',
    'ю': 'yu',
    'я': 'ya',
    'А': 'A',
    'Б': 'B',
    'В': 'V',
    'Г': 'G',
    'Д': 'D',
    'Е': 'E',
    'Ё': 'Yo',
    'Ж': 'Zh',
    'З': 'Z',
    'И': 'I',
    'Й': 'J',
    'К': 'K',
    'Л': 'L',
    'М': 'M',
    'Н': 'N',
    'О': 'O',
    'П': 'P',
    'Р': 'R',
    'С': 'S',
    'Т': 'T',
    'У': 'U',
    'Ф': 'F',
    'Х': 'H',
    'Ц': 'C',
    'Ч': 'Ch',
    'Ш': 'Sh',
    'Щ': 'Sh',
    'Ъ': 'U',
    'Ы': 'Y',
    'Ь': '',
    'Э': 'E',
    'Ю': 'Yu',
    'Я': 'Ya',
    'Є': 'Ye',
    'І': 'I',
    'Ї': 'Yi',
    'Ґ': 'G',
    'є': 'ye',
    'і': 'i',
    'ї': 'yi',
    'ґ': 'g',
    'č': 'c',
    'ď': 'd',
    'ě': 'e',
    'ň': 'n',
    'ř': 'r',
    'š': 's',
    'ť': 't',
    'ů': 'u',
    'ž': 'z',
    'Č': 'C',
    'Ď': 'D',
    'Ě': 'E',
    'Ň': 'N',
    'Ř': 'R',
    'Š': 'S',
    'Ť': 'T',
    'Ů': 'U',
    'Ž': 'Z',
    'ą': 'a',
    'ć': 'c',
    'ę': 'e',
    'ł': 'l',
    'ń': 'n',
    'ś': 's',
    'ź': 'z',
    'ż': 'z',
    'Ą': 'A',
    'Ć': 'C',
    'Ę': 'e',
    'Ł': 'L',
    'Ń': 'N',
    'Ś': 'S',
    'Ź': 'Z',
    'Ż': 'Z',
    'ā': 'a',
    'ē': 'e',
    'ģ': 'g',
    'ī': 'i',
    'ķ': 'k',
    'ļ': 'l',
    'ņ': 'n',
    'ū': 'u',
    'Ā': 'A',
    'Ē': 'E',
    'Ģ': 'G',
    'Ī': 'i',
    'Ķ': 'k',
    'Ļ': 'L',
    'Ņ': 'N',
    'Ū': 'u',
    '€': 'euro',
    '₢': 'cruzeiro',
    '₣': 'french franc',
    '£': 'pound',
    '₤': 'lira',
    '₥': 'mill',
    '₦': 'naira',
    '₧': 'peseta',
    '₨': 'rupee',
    '₩': 'won',
    '₪': 'new shequel',
    '₫': 'dong',
    '₭': 'kip',
    '₮': 'tugrik',
    '₯': 'drachma',
    '₰': 'penny',
    '₱': 'peso',
    '₲': 'guarani',
    '₳': 'austral',
    '₴': 'hryvnia',
    '₵': 'cedi',
    '¢': 'cent',
    '¥': 'yen',
    '元': 'yuan',
    '円': 'yen',
    '﷼': 'rial',
    '₠': 'ecu',
    '¤': 'currency',
    '฿': 'baht',
    "$": 'dollar',
    '©': '(c)',
    'œ': 'oe',
    'Œ': 'OE',
    '∑': 'sum',
    '®': '(r)',
    '†': '+',
    '“': '"',
    '”': '"',
    '‘': "'",
    '’': "'",
    '∂': 'd',
    'ƒ': 'f',
    '™': 'tm',
    '℠': 'sm',
    '…': '...',
    '˚': 'o',
    'º': 'o',
    'ª': 'a',
    '•': '*',
    '∆': 'delta',
    '∞': 'infinity',
    '♥': 'love',
    '&': 'and',
    '|': 'or',
    '<': 'less',
    '>': 'greater'
  };

  module.exports = slug = function(string, replacement) {
    var char, code, i, result, _i, _len;
    if (replacement == null) {
      replacement = '-';
    }
    result = "";
    for (i = _i = 0, _len = string.length; _i < _len; i = ++_i) {
      char = string[i];
      code = string.charCodeAt(i);
      if (char_map[char]) {
        char = char_map[char];
        code = char.charCodeAt(0);
      }
      char = char.replace(/[^\w\s$\*\_\+~\.\(\)\'\"\!\-:@]/g, '');
      result += char;
    }
    result = result.replace(/^\s+|\s+$/g, '');
    result = result.replace(/[-\s]+/g, replacement);
    result.replace("" + replacement + "$", '');
    return result.toLowerCase();
  };
  
});
window.require.register("lib/socket_listener", function(exports, require, module) {
  var SocketListener, Task, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Task = require('models/task').Task;

  SocketListener = (function(_super) {
    __extends(SocketListener, _super);

    function SocketListener() {
      this.onRemoteUpdate = __bind(this.onRemoteUpdate, this);
      this.onRemoteCreate = __bind(this.onRemoteCreate, this);
      _ref = SocketListener.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SocketListener.prototype.models = {
      'task': Task
    };

    SocketListener.prototype.events = ['task.create', 'task.update', 'task.delete'];

    SocketListener.prototype.onRemoteCreate = function(task) {
      var k, v, _ref1,
        _this = this;
      _ref1 = task.attributes;
      for (k in _ref1) {
        v = _ref1[k];
        task[k] = v;
      }
      return this.collections.forEach(function(collection) {
        var index, nextTask, previousTask;
        if (collection === _this.tmpcollection) {
          return;
        }
        if (_this.shouldBeAdded(task, collection)) {
          previousTask = collection.getPreviousTask(task);
          nextTask = collection.getNextTask(task);
          index = collection.toArray().indexOf(previousTask);
          collection.add(task, {
            at: index + 1,
            silent: true
          });
          if (previousTask != null) {
            previousTask.set("nextTask", task.id);
          }
          if (nextTask != null) {
            nextTask.set("previousTask", task.id);
          }
          return collection.view.insertTask(previousTask != null ? previousTask.view : void 0, task);
        }
      });
    };

    SocketListener.prototype.onRemoteUpdate = function(task, collection) {
      var changed, nextTask, previousTask;
      if (collection === this.tmpcollection) {
        return null;
      }
      changed = task.changedAttributes();
      if (changed.done != null) {
        if (changed.done) {
          task.setDone();
        } else {
          task.setUndone();
        }
      }
      if (changed.description != null) {
        task.view.descriptionField.val(changed.description);
        task.view.displayTagsNicely();
      }
      if (changed.list != null) {
        previousTask = collection.getPreviousTask(task);
        nextTask = collection.getNextTask(task);
        if (nextTask != null) {
          nextTask.setPreviousTask(previousTask || null);
        }
        if (previousTask != null) {
          previousTask.setNextTask(nextTask || null);
        }
        collection.remove(task);
        return task.view.remove();
      }
    };

    SocketListener.prototype.onRemoteDelete = function(id) {
      return this.collections.forEach(function(collection) {
        var nextTask, previousTask, task;
        task = collection.get(id);
        if (task != null) {
          previousTask = collection.getPreviousTask(task);
          nextTask = collection.getNextTask(task);
          if (nextTask != null) {
            nextTask.setPreviousTask(previousTask || null);
          }
          if (previousTask != null) {
            previousTask.setNextTask(nextTask || null);
          }
          collection.remove(task);
          return task.view.remove();
        }
      });
    };

    SocketListener.prototype.shouldBeAdded = function(task, collection) {
      var doesnotexist, samedone, samelist, _ref1;
      doesnotexist = !collection.get(task.id);
      samelist = collection.listId === task.get('list');
      samedone = ((_ref1 = collection.view) != null ? _ref1.isArchive() : void 0) === task.get('done');
      return doesnotexist && samelist && samedone;
    };

    return SocketListener;

  })(CozySocketListener);

  module.exports = new SocketListener();
  
});
window.require.register("models/models", function(exports, require, module) {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.BaseModel = (function(_super) {
    __extends(BaseModel, _super);

    function BaseModel() {
      _ref = BaseModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseModel.prototype.isNew = function() {
      return this.id == null;
    };

    return BaseModel;

  })(Backbone.Model);
  
});
window.require.register("models/task", function(exports, require, module) {
  var BaseModel, helpers,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseModel = require("./models").BaseModel;

  helpers = require("../helpers");

  exports.Task = (function(_super) {
    __extends(Task, _super);

    function Task(task) {
      var property;
      Task.__super__.constructor.apply(this, arguments);
      for (property in task) {
        this[property] = task[property];
      }
      this.setSimpleDate(task.completionDate);
      this.setListName();
    }

    Task.prototype.url = function() {
      if (this.isNew()) {
        return "todolists/" + (this.get('list')) + "/tasks";
      } else {
        return "tasks/" + this.id;
      }
    };

    Task.prototype.parse = function(data) {
      if (data.rows) {
        return data.rows[0];
      }
      return data;
    };

    Task.prototype.setSimpleDate = function(date) {
      if (date == null) {
        date = new Date();
      }
      this.simpleDate = moment(date).format("DD/MM/YYYY");
      return this.fullDate = moment(date).format("DD/MM/YYYY HH:mm");
    };

    Task.prototype.setListName = function() {
      var list, _ref;
      list = (_ref = window.app) != null ? _ref.homeView.todolists.get(this.list) : void 0;
      if (list != null) {
        this.listTitle = list.title;
        if (list.path != null) {
          this.listBreadcrumb = list.breadcrumb;
          return this.listPath = list.urlPath;
        }
      }
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

    Task.prototype.extractTags = function() {
      return helpers.extractTags(this.get('description'));
    };

    return Task;

  })(BaseModel);
  
});
window.require.register("models/todolist", function(exports, require, module) {
  var BaseModel, request, slugify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseModel = require("models/models").BaseModel;

  slugify = require("lib/slug");

  request = require("lib/request");

  exports.TodoList = (function(_super) {
    __extends(TodoList, _super);

    TodoList.prototype.url = 'todolists/';

    function TodoList(todolist) {
      var path, property, slugs, title, _i, _len;
      TodoList.__super__.constructor.call(this, todolist);
      for (property in todolist) {
        this[property] = todolist[property];
      }
      path = this.get("path");
      if (path != null) {
        this.breadcrumb = path.join(" > ");
        slugs = [];
        for (_i = 0, _len = path.length; _i < _len; _i++) {
          title = path[_i];
          slugs.push(slugify(title));
        }
        this.urlPath = slugs.join("/");
        this.urlPath = "todolist/" + this.id + "/all/" + this.urlPath;
      }
    }

    TodoList.createTodoList = function(data, callback) {
      return request.post("todolists", data, callback);
    };

    TodoList.updateTodoList = function(id, data, callback) {
      return request.put("todolists/" + id, data, callback);
    };

    TodoList.getTodoList = function(id, callback) {
      var _this = this;
      return request.get("todolists/" + id, function(err, data) {
        var todolist;
        if (err) {
          return callback(err);
        } else {
          todolist = new TodoList(data);
          return callback(null, todolist);
        }
      });
    };

    TodoList.deleteTodoList = function(id, callback) {
      return request.del("todolists/" + id, callback);
    };

    return TodoList;

  })(BaseModel);
  
});
window.require.register("routers/main_router", function(exports, require, module) {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.MainRouter = (function(_super) {
    __extends(MainRouter, _super);

    function MainRouter() {
      _ref = MainRouter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MainRouter.prototype.routes = {
      '': 'home',
      "todolist/:id/all/:path": "list",
      "todolist/all": "list",
      "tag/:tag": "tag"
    };

    MainRouter.prototype.initialize = function() {
      return this.route(/^todolist\/(.*?)\/(.*?)$/, 'list');
    };

    MainRouter.prototype.home = function(callback) {
      $('body').html(app.homeView.render().el);
      app.homeView.setLayout();
      return app.homeView.loadData(function() {
        if (callback) {
          return callback();
        } else {
          return app.homeView.selectList('all');
        }
      });
    };

    MainRouter.prototype.list = function(id) {
      return this.generateHomeView(function() {
        return app.homeView.selectList(id);
      });
    };

    MainRouter.prototype.tag = function(tag) {
      return this.generateHomeView(function() {
        return app.homeView.selectTag(tag);
      });
    };

    MainRouter.prototype.generateHomeView = function(callback) {
      if ($("#tree-create").length > 0) {
        return callback();
      } else {
        return this.home(function() {
          return setTimeout((function() {
            return callback();
          }), 100);
        });
      }
    };

    return MainRouter;

  })(Backbone.Router);
  
});
window.require.register("views/home_view", function(exports, require, module) {
  var TagListView, Task, TodoList, TodoListCollection, TodoListWidget, Tree, helpers, request,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tree = require("./widgets/tree").Tree;

  TodoList = require("../models/todolist").TodoList;

  TagListView = require("./taglist_view").TagListView;

  TodoListCollection = require("../collections/todolists").TodoListCollection;

  TodoListWidget = require("./todolist_view").TodoListWidget;

  Task = require("../models/task").Task;

  helpers = require("../helpers");

  request = require("../lib/request");

  exports.HomeView = (function(_super) {
    __extends(HomeView, _super);

    HomeView.prototype.id = 'home-view';

    /*
    # Initializers
    */


    HomeView.prototype.events = {
      "click #nav-toggler": "onNavTogglerClicked"
    };

    HomeView.prototype.initialize = function() {};

    function HomeView() {
      this.onTaskMoved = __bind(this.onTaskMoved, this);
      this.onTaskDeleted = __bind(this.onTaskDeleted, this);
      this.onTaskChanged = __bind(this.onTaskChanged, this);
      this.onTodoListDropped = __bind(this.onTodoListDropped, this);
      this.onTreeLoaded = __bind(this.onTreeLoaded, this);
      this.onTodoListSelected = __bind(this.onTodoListSelected, this);
      this.onTodoListRemoved = __bind(this.onTodoListRemoved, this);
      this.onTodoListRenamed = __bind(this.onTodoListRenamed, this);
      this.onTodoListCreated = __bind(this.onTodoListCreated, this);
      this.onNavTogglerClicked = __bind(this.onNavTogglerClicked, this);
      this.todolists = new TodoListCollection();
      Backbone.Mediator.subscribe('task:changed', this.onTaskChanged);
      Backbone.Mediator.subscribe('task:deleted', this.onTaskDeleted);
      this.todoViews = {};
      HomeView.__super__.constructor.call(this);
    }

    HomeView.prototype.render = function() {
      $(this.el).html(require('./templates/home'));
      this.todolist = this.$("#todo-list");
      return this;
    };

    HomeView.prototype.setLayout = function() {
      var size,
        _this = this;
      size = $(window).width();
      if (size < 700) {
        this.layout = $(this.el).layout({
          size: "250",
          minSize: "250",
          resizable: true,
          togglerLength_closed: "0",
          togglerLength_opened: "0"
        });
        this.layout.toggle("west");
      } else {
        this.layout = $(this.el).layout({
          size: "250",
          minSize: "250",
          resizable: true,
          spacing_open: 10,
          spacing_closed: 10
        });
      }
      this.previousSize = size;
      return $(window).resize(function() {
        var isBig, isSmall;
        size = $(window).width();
        isSmall = size < 700 && _this.previousSize > 700;
        isBig = size > 700 && _this.previousSize < 700;
        if (isSmall || isBig) {
          _this.layout.toggle("west");
        }
        return _this.previousSize = size;
      });
    };

    HomeView.prototype.loadData = function(callback) {
      var _this = this;
      this.$("#tree").spin("small");
      request.get("tree/", function(err, data) {
        window.tree = data;
        return _this.tree = new Tree(_this.$("#nav"), data, {
          onCreate: _this.onTodoListCreated,
          onRename: _this.onTodoListRenamed,
          onRemove: _this.onTodoListRemoved,
          onSelect: _this.onTodoListSelected,
          onLoaded: _this.onTreeLoaded,
          onDrop: _this.onTodoListDropped,
          onTaskMoved: _this.onTaskMoved
        });
      });
      return this.treeLoadedCallback = callback;
    };

    /*
    # Listeners
    */


    HomeView.prototype.onNavTogglerClicked = function(event) {
      return this.layout.toggle('west');
    };

    HomeView.prototype.onTodoListCreated = function(parentId, newName, dataTree) {
      var data;
      data = {
        title: newName,
        parent_id: parentId
      };
      return TodoList.createTodoList(data, function(err, todolist) {
        dataTree.rslt.obj.data("id", todolist.id);
        dataTree.rslt.obj[0].id = todolist.id;
        dataTree.inst.deselect_all();
        return dataTree.inst.select_node(dataTree.rslt.obj);
      });
    };

    HomeView.prototype.onTodoListRenamed = function(listId, newName, data) {
      var _this = this;
      if (newName != null) {
        data = {
          title: newName
        };
        return TodoList.updateTodoList(listId, data, function() {
          return _this.tree.selectNode(listId);
        });
      }
    };

    HomeView.prototype.onTodoListRemoved = function(listId) {
      if (this.currentTodolist && this.currentTodolist.id === listId) {
        this.currentTodolist.destroy();
        return $("#todo-list").html(null);
      } else {
        return TodoList.deleteTodoList(listId, function() {});
      }
    };

    HomeView.prototype.onTodoListSelected = function(path, id, data) {
      var _ref,
        _this = this;
      if ((_ref = this.tagListView) != null) {
        _ref.deselectAll();
      }
      if ((id != null) && id !== "tree-node-all") {
        return TodoList.getTodoList(id, function(err, list) {
          app.router.navigate("todolist" + path, {
            trigger: false
          });
          _this.renderTodolist(list);
          return _this.todolist.show();
        });
      } else {
        app.router.navigate("todolist/all", {
          trigger: false
        });
        this.renderTodolist(null);
        return this.todolist.show();
      }
    };

    HomeView.prototype.onTreeLoaded = function() {
      var loadLists,
        _this = this;
      loadLists = function() {
        return _this.todolists.fetch({
          success: function(data) {
            var list, listView, _i, _len, _ref;
            _ref = data.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              list = _ref[_i];
              listView = new TodoListWidget(list);
              listView.render();
              _this.todoViews[list.id] = listView;
            }
            if (_this.treeLoadedCallback != null) {
              return _this.treeLoadedCallback();
            }
          },
          error: function() {
            if (_this.treeLoadedCallback != null) {
              return _this.treeLoadedCallback();
            }
          }
        });
      };
      this.$("#tree").spin();
      return request.get("tasks/tags", function(err, data) {
        if (err) {
          return loadLists();
        } else {
          _this.tagListView = new TagListView(data);
          _this.tagListView.render();
          return loadLists();
        }
      });
    };

    HomeView.prototype.onTodoListDropped = function(nodeId, targetNodeId) {
      var _this = this;
      return TodoList.updateTodoList(nodeId, {
        parent_id: targetNodeId
      }, function() {
        return TodoList.getTodoList(nodeId, function(err, list) {
          _this.currentTodolist.set("path", list.path);
          return _this.currentTodolist.view.refreshBreadcrump();
        });
      });
    };

    HomeView.prototype.onTaskChanged = function(tags) {
      var _ref;
      if ((_ref = this.tagListView) != null) {
        _ref.addTags(tags);
      }
      return this.tagListView.checkForDeletion();
    };

    HomeView.prototype.onTaskDeleted = function() {
      return this.tagListView.checkForDeletion();
    };

    HomeView.prototype.onTaskMoved = function(taskID, sourceID, targetID) {
      var newList, oldList, task;
      oldList = this.todoViews[sourceID].tasks;
      newList = this.todoViews[targetID].tasks;
      task = oldList.get(taskID);
      task.view.showLoading();
      return task.save({
        list: newList.listId
      }, {
        ignoreMySocketNotification: true,
        success: function() {
          oldList.remove(task);
          task.view.remove();
          return newList.add(task);
        },
        error: function() {
          return task.view.hideLoading();
        }
      });
    };

    /*
    # Functions
    */


    HomeView.prototype.selectList = function(id) {
      if (id === "all" || (id == null)) {
        id = 'tree-node-all';
      }
      return this.tree.selectNode(id);
    };

    HomeView.prototype.selectTag = function(tag) {
      var list;
      this.tree.deselectAll();
      this.tagListView.selectTag(tag);
      list = new TodoList({
        title: tag,
        tag: tag
      });
      return this.renderTodolist(list);
    };

    HomeView.prototype.renderTodolist = function(todolist) {
      var todoView, _ref;
      if (this.todoViews[todolist != null ? todolist.id : void 0] != null) {
        todoView = this.todoViews[todolist.id];
      } else {
        if (todolist != null) {
          todolist.url = "todolists/" + todolist.id;
        }
        if ((_ref = this.currentTodolist) != null) {
          _ref.view.blurAllTaskDescriptions();
        }
        this.currentTodolist = todolist;
        todoView = new TodoListWidget(this.currentTodolist);
      }
      todoView.render();
      return todoView.loadData();
    };

    return HomeView;

  })(Backbone.View);
  
});
window.require.register("views/new_task_form", function(exports, require, module) {
  var Task,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Task = require("../models/task").Task;

  exports.NewTaskForm = (function(_super) {
    __extends(NewTaskForm, _super);

    function NewTaskForm(taskList) {
      this.taskList = taskList;
      this.taskCreationHandler = __bind(this.taskCreationHandler, this);
      NewTaskForm.__super__.constructor.call(this);
    }

    NewTaskForm.prototype.initialize = function() {
      this.newTaskForm = $('.new-task');
      this.newTaskFormButton = this.newTaskForm.find("button.add-task");
      this.newTaskFormInput = this.newTaskForm.find(".description");
      this.initializeForm();
      return this.hasUserTyped = false;
    };

    NewTaskForm.prototype.initializeForm = function() {
      this.handleDefaultFormState();
      return this.inputHandler();
    };

    NewTaskForm.prototype.inputHandler = function() {
      var _this = this;
      this.newTaskFormInput.keyup(function(event) {
        var keyCode;
        _this.hasUserTyped = true;
        _this.newTaskButtonHandler();
        keyCode = event.which | event.keyCode;
        if (keyCode === 13) {
          _this.taskCreationHandler(event);
        }
        if (keyCode === 40) {
          return _this.taskList.focusFirstTask();
        }
      });
      this.newTaskFormInput.focus(function(event) {
        if (!_this.hasUserTyped) {
          return _this.newTaskFormInput.val("");
        }
      });
      return this.newTaskFormInput.focusout(function(event) {
        if (_this.newTaskFormInput.val() === "") {
          _this.clearNewTaskInput();
          return _this.hasUserTyped = false;
        }
      });
    };

    NewTaskForm.prototype.clearNewTaskInput = function() {
      return this.newTaskButtonHandler();
    };

    NewTaskForm.prototype.newTaskButtonHandler = function() {
      if (!this.hasUserTyped) {
        this.newTaskFormButton.addClass('disabled');
        this.newTaskFormButton.html('new');
        return this.newTaskFormButton.unbind('click');
      } else {
        this.newTaskFormButton.removeClass('disabled');
        this.newTaskFormButton.html('add');
        this.newTaskFormButton.unbind('click');
        return this.newTaskFormButton.click(this.taskCreationHandler);
      }
    };

    NewTaskForm.prototype.taskCreationHandler = function(event) {
      var task,
        _this = this;
      this.newTaskFormButton.html('&nbsp;');
      this.newTaskFormButton.spin('tiny');
      this.hasUserTyped = false;
      task = new Task({
        done: false,
        description: this.newTaskFormInput.val()
      });
      return this.taskList.tasks.insertTask(null, task, {
        success: function(data) {
          var tags;
          _this.clearNewTaskInput();
          _this.newTaskFormButton.html('new');
          _this.newTaskFormButton.spin();
          tags = task.extractTags();
          Backbone.Mediator.publish('task:changed', tags);
          return _this.newTaskFormInput.focus();
        },
        error: function(data) {
          _this.newTaskFormButton.html('new');
          return _this.newTaskFormButton.spin();
        }
      });
    };

    NewTaskForm.prototype.handleDefaultFormState = function() {
      var _ref;
      if (((_ref = this.taskList.todoListView.model) != null ? _ref.get('id') : void 0) != null) {
        return this.showTaskForm();
      } else {
        return this.hideTaskForm();
      }
    };

    NewTaskForm.prototype.showTaskForm = function(updatePreferences, mustFade) {
      if ((mustFade != null) && mustFade) {
        return this.newTaskForm.fadeIn(1000);
      } else {
        return this.newTaskForm.show();
      }
    };

    NewTaskForm.prototype.hideTaskForm = function(updatePreferences, mustFade) {
      if ((mustFade != null) && mustFade) {
        return this.newTaskForm.fadeOut(1000);
      } else {
        return this.newTaskForm.hide();
      }
    };

    return NewTaskForm;

  })(Backbone.View);
  
});
window.require.register("views/taglist_view", function(exports, require, module) {
  var request,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  request = require('../lib/request');

  exports.TagListView = (function(_super) {
    __extends(TagListView, _super);

    TagListView.prototype.id = 'tags';

    function TagListView(tagList) {
      this.tagList = tagList;
      TagListView.__super__.constructor.call(this);
    }

    TagListView.prototype.render = function() {
      var tag, _i, _len, _ref, _results;
      this.$el = this.el = $("#tags");
      this.el.html(null);
      _ref = this.tagList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        _results.push(this.addTagLine(tag));
      }
      return _results;
    };

    TagListView.prototype.addTagLine = function(tag) {
      return this.el.append(require('./templates/tag')({
        tag: tag
      }));
    };

    TagListView.prototype.selectTag = function(tag) {
      this.$("a").removeClass("selected");
      return this.$(".tag-" + tag + " a").addClass("selected");
    };

    TagListView.prototype.deselectAll = function() {
      return this.$("a").removeClass("selected");
    };

    TagListView.prototype.addTags = function(tags) {
      var tag, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = tags.length; _i < _len; _i++) {
        tag = tags[_i];
        if (!(tag === "" || (_.find(this.tagList, function(ctag) {
          return tag === ctag;
        }) != null))) {
          this.tagList.push(tag);
          _results.push(this.addTagLine(tag));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    TagListView.prototype.checkForDeletion = function() {
      var _this = this;
      return request.get('tasks/tags', function(err, remoteTags) {
        var tag, _i, _len, _ref, _results;
        _ref = _this.tagList;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tag = _ref[_i];
          if (__indexOf.call(remoteTags, tag) < 0) {
            _results.push(_this.$(".tag-" + tag).remove());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    };

    return TagListView;

  })(Backbone.View);
  
});
window.require.register("views/task_view", function(exports, require, module) {
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
      "click .down-task-button": "onDownButtonClicked",
      "click .task-infos a": "onListLinkClicked",
      "dragstart": "onDragStart",
      "dragover": "onDragOver",
      "drop": "onDrop",
      "dragend": "onDragEnd",
      "hover": "onMouseOver"
    };

    /*
    # Initializers
    */


    /*
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
      var _this = this;
      template = require('./templates/task');
      $(this.el).html(template({
        model: this.model
      }));
      this.el.id = this.model.id;
      if (this.model.done) {
        this.done();
      }
      this.descriptionField = this.$("input.description");
      this.descriptionField.show();
      this.descriptionFieldFormatted = this.$("span.description");
      this.buttons = this.$(".task-buttons");
      this.setListeners();
      this.$(".task-buttons").hide();
      this.descriptionField.data('before', this.descriptionField.val());
      this.todoButton = this.$(".todo-button");
      this.todoButton.hover(function() {
        if (_this.model.done) {
          return _this.todoButton.html("todo?");
        } else {
          return _this.todoButton.html("done?");
        }
      });
      this.todoButton.mouseout(function() {
        if (_this.model.done) {
          return _this.todoButton.html("done");
        } else {
          return _this.todoButton.html("todo");
        }
      });
      if (this.list.tasks.listId == null) {
        this.$el.unbind('dragstart');
        this.$el.unbind('dragover');
        this.$el.unbind('drop');
        this.$el.unbind('dragend');
        this.$(".handle").addClass('disabled');
      } else {
        this.$(".handle").prop('draggable', true);
        this.$('.handle').tooltip({
          placement: "left",
          title: "You can sort the tasks by dragging and dropping " + "them. Hint: if you press shift, you can move a " + "task to another list."
        });
      }
      this.handleFieldSwapManagement();
      return this.el;
    };

    /*
        Nice tag displaying management
    */


    TaskLine.prototype.handleFieldSwapManagement = function() {
      var _this = this;
      this.displayTagsNicely();
      this.descriptionField.focus(function() {
        return _this.descriptionField.show();
      });
      this.descriptionField.focusout(function() {
        return _this.descriptionField.show();
      });
      return this.descriptionField.keyup(function() {
        return _this.displayTagsNicely();
      });
    };

    TaskLine.prototype.displayTagsNicely = function() {
      var pattern, replacement, taggedDescription;
      pattern = /(#[a-z]+)/ig;
      replacement = '<span class="inline-tag">$1</span>';
      taggedDescription = this.descriptionField.val();
      taggedDescription = taggedDescription.replace(pattern, replacement);
      return this.descriptionFieldFormatted.html(taggedDescription);
    };

    /*
        Drag'n'Drop management
    */


    TaskLine.prototype.onDragStart = function(event) {
      this.$el.css('opacity', '0.4');
      event.originalEvent.dataTransfer.effectAllowed = 'all';
      this.list.draggedItem = this;
      return event.originalEvent.dataTransfer.setData('text/plain', this.model.id);
    };

    TaskLine.prototype.onDragOver = function(event) {
      var index, limit, offsetY, pageY, targetOffsetTop, y;
      if (event.preventDefault) {
        event.preventDefault();
      }
      event.originalEvent.dataTransfer.dropEffect = 'move';
      $('.separator').css('visibility', 'hidden');
      index = this.list.$el.children().index(this.$el);
      pageY = event.originalEvent.pageY;
      targetOffsetTop = event.target.offsetTop;
      offsetY = event.originalEvent.offsetY;
      y = pageY - targetOffsetTop | offsetY;
      limit = this.$el.height() / 2;
      if (y <= limit) {
        $(this.list.$el.children()[index - 1]).css('visibility', 'visible');
      } else {
        $(this.list.$el.children()[index + 1]).css('visibility', 'visible');
      }
      return false;
    };

    TaskLine.prototype.onDrop = function(event) {
      var condition, draggedItemID, index, limit, newIndex, nextTask, nextTaskID, offsetY, pageY, previousTask, previousTaskID, targetOffsetTop, y;
      if (event.stopPropagation) {
        event.stopPropagation();
      }
      pageY = event.originalEvent.pageY;
      targetOffsetTop = event.target.offsetTop;
      offsetY = event.originalEvent.offsetY;
      y = pageY - targetOffsetTop | offsetY;
      limit = this.$el.height() / 2;
      index = this.list.$el.children('.task').index(this.$el);
      newIndex = index;
      if (y > limit) {
        newIndex = index + 1;
        nextTask = $(this.list.$el.children('.task')[index + 1]);
        nextTaskID = nextTask != null ? nextTask.prop('id') : void 0;
      } else {
        previousTask = $(this.list.$el.children('.task')[index - 1]);
        previousTaskID = previousTask != null ? previousTask.prop('id') : void 0;
      }
      draggedItemID = this.list.draggedItem.model.id;
      condition = ((nextTaskID != null) && nextTaskID === draggedItemID) || ((previousTaskID != null) && previousTaskID === draggedItemID);
      if (!(draggedItemID === this.model.id || condition)) {
        this.onReorder(this.list.draggedItem, newIndex);
      }
      return false;
    };

    TaskLine.prototype.onDragEnd = function(event) {
      $('.separator').css('visibility', 'hidden');
      this.$el.css('opacity', '1');
      return this.list.draggedItem = null;
    };

    TaskLine.prototype.onReorder = function(draggedItem, newIndex) {
      var children, childrenTasks, index, isReordered, oldIndex, separator,
        _this = this;
      if (!this.list.isSaving) {
        isReordered = this.model.collection.reorder(draggedItem.model, newIndex);
        if ((this.model.collection.listId != null) && isReordered) {
          this.list.isSaving = true;
          draggedItem.saving = true;
          draggedItem.showLoading();
          childrenTasks = this.list.$el.children('.task');
          oldIndex = childrenTasks.index(draggedItem.$el);
          children = this.list.$el.children();
          index = children.index(draggedItem.$el);
          separator = children.eq(index + 1);
          if (newIndex >= childrenTasks.length) {
            this.list.$el.append(draggedItem.$el);
          } else {
            childrenTasks.eq(newIndex).before(draggedItem.$el);
          }
          separator.insertAfter(draggedItem.$el);
          draggedItem.descriptionField.focus();
          return draggedItem.model.save(null, {
            ignoreMySocketNotification: true,
            success: function() {
              _this.list.isSaving = false;
              draggedItem.saving = false;
              return draggedItem.hideLoading();
            },
            error: function() {
              console.log("An error while saving the task.");
              _this.list.isSaving = false;
              draggedItem.saving = false;
              return draggedItem.hideLoading();
            }
          });
        }
      }
    };

    TaskLine.prototype.setListeners = function() {
      var _this = this;
      this.descriptionField.keypress(function(event) {
        var keyCode;
        keyCode = event.which | event.keyCode;
        return keyCode !== 13 && keyCode !== 9;
      });
      this.descriptionField.keydown(function(event) {
        var keyCode;
        keyCode = event.which | event.keyCode;
        if (keyCode === 38 && event.metaKey) {
          _this.onCtrlUpKeyup();
        }
        if (keyCode === 40 && event.metaKey) {
          return _this.onCtrlDownKeyup();
        }
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
            _this.onEnterKeyup(event.shiftKey);
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
        if (el.data('before') !== el.val() && !_this.isDeleting && !_this.saving) {
          el.data('before', el.val());
          _this.onDescriptionChanged(event, event.which | event.keyCode);
        }
        return el;
      });
    };

    /*
    # Listeners
    */


    TaskLine.prototype.onMouseOver = function(event) {};

    TaskLine.prototype.onTodoButtonClicked = function(event) {
      var _this = this;
      this.showLoading();
      this.model.url = "todolists/" + this.model.list + "/tasks/" + this.model.id;
      this.model.done = !this.model.done;
      return this.model.save({
        done: this.model.done
      }, {
        ignoreMySocketNotification: true,
        success: function() {
          _this.hideLoading();
          if (!_this.model.done) {
            return _this.model.setUndone();
          } else {
            return _this.model.setDone();
          }
        },
        error: function() {
          alert("An error occured, modifications were not saved.");
          return _this.hideLoading();
        }
      });
    };

    TaskLine.prototype.onDelButtonClicked = function(event) {
      return this.delTask();
    };

    TaskLine.prototype.onUpButtonClicked = function(event) {
      var _this = this;
      return this.onDescriptionChanged(null, -1, {
        success: function() {
          var newIndex;
          newIndex = (_this.list.$el.children('.task').index(_this.$el)) - 1;
          if ((newIndex != null) && newIndex >= 0) {
            return _this.onReorder(_this, newIndex);
          }
        }
      });
    };

    TaskLine.prototype.onDownButtonClicked = function(event) {
      var _this = this;
      return this.onDescriptionChanged(null, -1, {
        success: function() {
          var newIndex, taskListLength, tasks;
          tasks = _this.list.$el.children('.task');
          taskListLength = tasks.length;
          newIndex = (tasks.index(_this.$el)) + 2;
          if ((newIndex != null) && newIndex <= taskListLength) {
            return _this.onReorder(_this, newIndex);
          }
        }
      });
    };

    TaskLine.prototype.onDescriptionChanged = function(event, keyCode, callback) {
      var _this = this;
      if (!(keyCode === 8 || this.descriptionField.val().length === 0)) {
        this.saving = true;
        this.model.description = this.descriptionField.val();
        this.showLoading();
        return this.model.save({
          description: this.model.description
        }, {
          patch: true,
          type: 'PUT',
          ignoreMySocketNotification: true,
          success: function() {
            var tags;
            tags = _this.model.extractTags();
            Backbone.Mediator.publish('task:changed', tags);
            _this.model.set('tags', tags);
            _this.hideLoading();
            _this.saving = false;
            return callback != null ? callback.success() : void 0;
          },
          error: function() {
            alert("An error occured, modifications were not saved.");
            _this.hideLoading();
            return _this.saving = false;
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

    TaskLine.prototype.onEnterKeyup = function(isShiftKeyPressed) {
      var insertAfter, task,
        _this = this;
      if (this.model.collection.listId != null) {
        this.showLoading();
        task = new Task({
          description: "new task",
          list: this.model.collection.listId
        });
        if (isShiftKeyPressed) {
          insertAfter = this.model.collection.getPreviousTask(this.model);
        } else {
          insertAfter = this.model;
        }
        return this.model.collection.insertTask(insertAfter, task, {
          success: function(task) {
            helpers.selectAll(task.view.descriptionField);
            return _this.hideLoading();
          },
          error: function() {
            alert("Saving failed, an error occured.");
            return _this.hideLoading();
          }
        });
      }
    };

    TaskLine.prototype.onBackspaceKeyup = function() {
      var description, previous;
      description = this.descriptionField.val();
      if (description.length === 0 && this.firstDel) {
        this.isDeleting = true;
        previous = $("#" + this.model.id).prev().prev();
        if (previous.find(".description").length) {
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

    TaskLine.prototype.onListLinkClicked = function(event) {
      window.app.router.navigate(this.model.listPath, true);
      return event.preventDefault();
    };

    /*
    # Functions
    */


    TaskLine.prototype.done = function() {
      this.$(".todo-button").html("done");
      this.$(".todo-button").removeClass("btn-info");
      return this.$el.addClass("done");
    };

    TaskLine.prototype.undone = function() {
      this.$(".todo-button").html("todo");
      this.$(".todo-button").addClass("btn-info");
      return $(this.el).removeClass("done");
    };

    TaskLine.prototype.remove = function() {
      this.unbind();
      if (this.$el.prev().hasClass('separator')) {
        this.$el.prev().remove();
      }
      return this.$el.remove();
    };

    TaskLine.prototype.focusDescription = function() {
      this.descriptionField.focus();
      return helpers.selectAll(this.descriptionField);
    };

    TaskLine.prototype.delTask = function(callback) {
      var _this = this;
      this.showLoading();
      return this.model.collection.removeTask(this.model, {
        success: function() {
          if (callback) {
            callback();
          }
          Backbone.Mediator.publish('task:deleted', _this.model);
          return _this.hideLoading();
        },
        error: function() {
          alert("An error occured, deletion was not saved.");
          return _this.hideLoading();
        }
      });
    };

    TaskLine.prototype.showButtons = function() {
      return this.buttons.show();
    };

    TaskLine.prototype.hideButtons = function() {
      return this.buttons.hide();
    };

    TaskLine.prototype.showLoading = function() {
      this.todoButton.html("&nbsp;");
      return this.todoButton.spin("tiny");
    };

    TaskLine.prototype.hideLoading = function() {
      this.todoButton.spin();
      if (this.model.done) {
        return this.todoButton.html("done");
      } else {
        return this.todoButton.html("todo");
      }
    };

    return TaskLine;

  })(Backbone.View);
  
});
window.require.register("views/tasks_view", function(exports, require, module) {
  var SocketListener, Task, TaskCollection, TaskLine, helpers,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskCollection = require("../collections/tasks").TaskCollection;

  SocketListener = require("lib/socket_listener");

  Task = require("../models/task").Task;

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
      id = null;
      if ((this.todoListView != null) && (this.todoListView.model != null)) {
        id = this.todoListView.model.id;
      }
      this.tasks = new TaskCollection(this, id, options);
      SocketListener.watch(this.tasks);
      this.isSaving = false;
    }

    TaskList.prototype.addTaskLine = function(task) {
      var taskLine;
      taskLine = new TaskLine(task, this);
      this.$el.append(taskLine.render());
      return this.$el.append($('<div class="separator"></div>'));
    };

    TaskList.prototype.addDateLine = function(date) {
      return this.$el.append('<div class="completion-date">' + date + '</div>');
    };

    TaskList.prototype.addTaskLineAsFirstRow = function(task) {
      var taskLine;
      taskLine = new TaskLine(task, this);
      return this.$el.prepend(taskLine.render());
    };

    TaskList.prototype.isArchive = function() {
      return this.$el.attr("id") === "archive-list";
    };

    TaskList.prototype.moveToTaskList = function(task) {
      var _ref;
      return (_ref = this.todoListView) != null ? _ref.moveToTaskList(task) : void 0;
    };

    TaskList.prototype.moveUpFocus = function(taskLine, options) {
      var nextDescription, selector;
      selector = "#" + taskLine.model.id;
      nextDescription = taskLine.list.$(selector).prev().prev().find(".description");
      if (nextDescription.length) {
        return this.moveFocus(taskLine.descriptionField, nextDescription, options);
      } else {
        return this.todoListView.focusNewTask();
      }
    };

    TaskList.prototype.moveDownFocus = function(taskLine, options) {
      var nextDescription, selector;
      selector = "#" + taskLine.model.id;
      nextDescription = taskLine.list.$(selector).next().next().find(".description");
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

    TaskList.prototype.focusFirstTask = function() {
      var firstTask;
      if (this.tasks.length > 0) {
        firstTask = this.tasks.at(0);
        return this.$("#" + (firstTask.get('id')) + " .description").focus();
      }
    };

    TaskList.prototype.insertTask = function(previousTaskLine, task) {
      var previousSeparator, taskLine, taskLineEl, _ref;
      taskLine = new TaskLine(task);
      taskLine.list = this;
      taskLineEl = $(taskLine.render());
      if (previousTaskLine != null) {
        previousSeparator = $(previousTaskLine.el).next(".separator");
        taskLineEl.insertAfter(previousSeparator);
        taskLineEl.after($('<div class="separator"></div>'));
      } else {
        this.$el.prepend(taskLineEl);
        taskLineEl.before($('<div class="separator"></div>'));
      }
      taskLine.focusDescription();
      if ((_ref = this.todoListView) != null ? _ref.isEditMode : void 0) {
        taskLine.showButtons();
      }
      return taskLine;
    };

    return TaskList;

  })(Backbone.View);
  
});
window.require.register("views/templates/have_done_list", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="modal-header"><button data-dismiss="modal" class="close">x</button><h3>Have Done List</h3></div><div class="modal-body"><div id="have-done-task-list"></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="nav" class="ui-layout-west"><div id="tags"></div><div class="title"><img src="img/my-tasks.png"/></div><div id="tree"></div><div id="tree-loading-indicator"></div></div><div id="content" class="ui-layout-center"><button id="nav-toggler">nav</button><div id="todo-list"></div></div><div id="confirm-delete-modal" tabindex="-1" role="dialog" aria-hidden="true" class="modal hide fade in"><div class="modal-header"><h3 id="confirm-delete-modal-label">Warning!</h3></div><div class="modal-body"><p> \nYou are about to delete this list, its tasks and its sub lists. Do\nyou want to continue?</p></div><div class="modal-footer"><button id="yes-button" data-dismiss="modal" aria-hidden="true" class="btn">Yes</button><button data-dismiss="modal" aria-hidden="true" class="no-button btn btn-info">No</button></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/tag", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ("tag-" + (tag) + "") }, {"class":true}));
  buf.push('><i class="icon-tag">&nbsp;</i><a');
  buf.push(attrs({ 'href':("#tag/" + (tag) + "") }, {"href":true}));
  buf.push('>' + escape((interp = tag) == null ? '' : interp) + '</a></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/task", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<button class="btn btn-info todo-button">todo</button><span class="description">' + escape((interp = model.description) == null ? '' : interp) + '</span><input');
  buf.push(attrs({ 'type':("text"), 'value':("" + (model.description) + ""), "class": ('description') }, {"type":true,"value":true}));
  buf.push('/><div class="handle">&nbsp;</div><div class="task-infos">');
  if ( model.done)
  {
  buf.push('<span class="task-date">' + escape((interp = model.fullDate) == null ? '' : interp) + '</span>');
  }
  if ( model.done && !model.collection.listId)
  {
  buf.push('&nbsp;|&nbsp;');
  }
  if ( !model.collection.listId)
  {
  buf.push('<a');
  buf.push(attrs({ 'href':("#" + (model.listPath) + ""), "class": ('task-list-infos') }, {"href":true}));
  buf.push('>' + escape((interp = model.listBreadcrumb) == null ? '' : interp) + '</a>');
  }
  buf.push('</div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/todolist", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<header class="todo-list-title clearfix"><p class="breadcrumb"></p><p class="description"></p></header><div class="new-task task clearfix"><button class="btn btn-info add-task disabled">new</button><input type="text" contenteditable="true" placeholder="What do you have to do next ?" value="" class="description"/></div><div id="task-list"><div class="separator"></div></div><h2 class="archive-title">archives</h2><div id="archive-list"></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/tree_buttons", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="tree-buttons-root"><div id="tree-create-root" class="button"><i class="icon-plus"></i></div></div><div id="tree-buttons"><div id="tree-create" class="button"><i class="icon-plus"></i></div><div id="tree-rename" class="button"><i class="icon-pencil"></i></div><div id="tree-remove" class="button"><i class="icon-remove"></i></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/todolist_view", function(exports, require, module) {
  var NewTaskForm, Task, TaskCollection, TaskList, helpers, slugify,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskCollection = require("../collections/tasks").TaskCollection;

  Task = require("../models/task").Task;

  TaskList = require("./tasks_view").TaskList;

  NewTaskForm = require("./new_task_form").NewTaskForm;

  helpers = require("../helpers");

  slugify = require("lib/slug");

  exports.TodoListWidget = (function(_super) {
    __extends(TodoListWidget, _super);

    TodoListWidget.prototype.tagName = "div";

    TodoListWidget.prototype.id = "todo-list";

    TodoListWidget.prototype.el = "#todo-list";

    /* Constructor*/


    function TodoListWidget(model) {
      this.model = model;
      this.removeCreationInfos = __bind(this.removeCreationInfos, this);
      this.displayCreationInfos = __bind(this.displayCreationInfos, this);
      this.creationInfosRequired = __bind(this.creationInfosRequired, this);
      TodoListWidget.__super__.constructor.call(this);
      if (this.model != null) {
        this.id = this.model.slug;
        this.model.view = this;
      }
    }

    TodoListWidget.prototype.remove = function() {
      return $(this.el).remove();
    };

    /* configuration*/


    TodoListWidget.prototype.render = function() {
      var _ref, _ref1;
      $(this.el).html(require('./templates/todolist'));
      this.title = this.$(".todo-list-title .description");
      this.breadcrumb = this.$(".todo-list-title .breadcrumb");
      if ((_ref = this.taskList) != null) {
        _ref.tasks.socketListener.stopWatching(this.taskList.tasks);
      }
      if ((_ref1 = this.archiveList) != null) {
        _ref1.tasks.socketListener.stopWatching(this.archiveList.tasks);
      }
      this.taskList = new TaskList(this, this.$("#task-list"));
      this.archiveList = new TaskList(this, this.$("#archive-list"));
      this.tasks = this.taskList.tasks;
      this.archiveTasks = this.archiveList.tasks;
      this.refreshBreadcrump();
      this.newTaskForm = new NewTaskForm(this.taskList);
      $(document).unbind('keydown').keydown(function(event) {
        var keyCode;
        keyCode = event.which | event.keyCode;
        if (keyCode === 16) {
          return $('.handle').addClass('jstree-draggable');
        }
      });
      $(document).unbind('keyup').keyup(function(event) {
        var keyCode;
        keyCode = event.which | event.keyCode;
        if (keyCode === 16) {
          return $('.handle').removeClass('jstree-draggable');
        }
      });
      return this.el;
    };

    /*
    # Functions
    */


    TodoListWidget.prototype.loadData = function() {
      var _this = this;
      if (this.model == null) {
        this.tasks.url = "tasks/todo";
        this.archiveTasks.url = "tasks/archives";
      } else {
        if (this.model.tag != null) {
          this.tasks.url = "tasks/tags/" + this.model.tag + "/todo";
          this.archiveTasks.url = "tasks/tags/" + this.model.tag + "/archives";
        } else {
          this.archiveTasks.url += "archives";
        }
      }
      $(this.archiveTasks.view.el).spin("small");
      $(this.tasks.view.el).spin("small");
      this.archiveTasks.fetch({
        success: function() {
          return $(_this.archiveTasks.view.el).spin();
        },
        error: function() {
          return $(_this.archiveTasks.view.el).spin();
        }
      });
      return this.tasks.fetch({
        success: function() {
          if (_this.$(".task:not(.done)").length > 0) {
            _this.$(".task:first .description").focus();
            _this.displayCreationInfos();
          }
          return _this.$(_this.tasks.view.el).spin();
        },
        error: function() {
          return _this.$(_this.tasks.view.el).spin();
        }
      });
    };

    TodoListWidget.prototype.creationInfosRequired = function() {
      return this.tasks.length === 1 && (this.model != null) && (this.model.get("id") != null);
    };

    TodoListWidget.prototype.displayCreationInfos = function() {
      if (this.creationInfosRequired()) {
        return this.taskList.$el.append('<p class="info">To add a new ' + 'task, focus on a task then type enter.</p>');
      }
    };

    TodoListWidget.prototype.removeCreationInfos = function() {
      return this.$el.remove('.info');
    };

    TodoListWidget.prototype.moveToTaskList = function(task) {
      return this.tasks.onTaskAdded(task);
    };

    TodoListWidget.prototype.blurAllTaskDescriptions = function() {
      return this.$(".task .description").trigger("blur");
    };

    TodoListWidget.prototype.focusNewTask = function() {
      return this.newTaskForm.newTaskFormInput.focus();
    };

    TodoListWidget.prototype.refreshBreadcrump = function() {
      var _ref;
      this.$(".breadcrumb a").unbind();
      if ((this.model != null) && (this.model.id != null)) {
        this.breadcrumb.html(this.createBreadcrumb());
        this.$(".breadcrumb a").click(function(event) {
          var hash, id, path;
          event.preventDefault();
          hash = event.target.hash.substring(1);
          path = hash.split("/");
          id = path[1];
          return app.homeView.selectList(id);
        });
        return this.title.html(this.model.title);
      } else {
        this.breadcrumb.html("");
        if (((_ref = this.model) != null ? _ref.tag : void 0) != null) {
          return this.title.html(this.model.tag);
        } else {
          return this.title.html("All tasks");
        }
      }
    };

    TodoListWidget.prototype.createBreadcrumb = function() {
      var breadcrumb, href, link, listName, parent, path, paths, slugs, _i, _len;
      paths = this.model.path;
      listName = paths.pop();
      slugs = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        slugs.push(slugify(path));
      }
      breadcrumb = "";
      parent = app.homeView.tree.getSelectedNode();
      while (paths.length > 0) {
        parent = app.homeView.tree.getParent(parent);
        if ((parent != null) && (parent[0] != null)) {
          href = "#todolist/" + parent[0].id + "/" + (slugs.join("/"));
          slugs.pop();
          listName = paths.pop();
          link = "<a href='" + href + "'>" + listName + "</a> ";
          breadcrumb = "" + link + " > " + breadcrumb;
        } else {
          listName = paths.pop();
        }
      }
      breadcrumb = "<a href='#todolist/all'> All</a> > " + breadcrumb;
      return breadcrumb;
    };

    return TodoListWidget;

  })(Backbone.View);
  
});
window.require.register("views/widgets/have_done_list", function(exports, require, module) {
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
  
});
window.require.register("views/widgets/tree", function(exports, require, module) {
  var slugify,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  slugify = require("helpers").slugify;

  /* Widget to easily manipulate data tree (navigation for cozy apps)
  Properties :
      currentPath      = ex : /all/coutries/great_britain
      currentData      = data : jstree data obj sent by the select
      currentNote_uuid : uuid of the currently selected note
      widget           = @jstreeEl.jstree
      searchField      = $("#tree-search-field")
      searchButton     = $("#tree-search")
      noteFull
      jstreeEl         = $("#tree")
  */


  exports.Tree = (function() {
    /**
    # Initialize jsTree tree with options : sorting, create/rename/delete,
    # unique children and json data for loading.
    */

    function Tree(navEl, data, homeViewCbk) {
      this._getSlugPath = __bind(this._getSlugPath, this);
      var _this = this;
      this.jstreeEl = $("#tree");
      navEl.prepend(require('../templates/tree_buttons'));
      this.widget = this.jstreeEl.jstree({
        plugins: ["themes", "json_data", "ui", "crrm", "sort", "cookies", "types", "hotkeys", "dnd", "search"],
        json_data: {
          data: data
        },
        types: {
          "default": {
            valid_children: "default"
          },
          root: {
            valid_children: null,
            delete_node: false,
            rename_node: false,
            move_node: false,
            start_drag: false
          }
        },
        crrm: {
          move: {
            check_move: function(data) {
              if (data.r.attr("id") === "tree-node-all") {
                return false;
              } else {
                return true;
              }
            }
          }
        },
        cookies: {
          save_selected: false
        },
        ui: {
          select_limit: 1
        },
        hotkeys: {
          del: false
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
        search: {
          search_method: "jstree_contains_multi",
          show_only_matches: true
        },
        dnd: {
          "drag_finish": function(data) {
            var draggedTaskID, sourceID, targetID;
            draggedTaskID = $(data.o.parentNode).prop('id');
            targetID = data.r[0].id;
            sourceID = _this.getSelectedNode().prop('id');
            return homeViewCbk.onTaskMoved(draggedTaskID, sourceID, targetID);
          },
          "drag_check": function(data) {
            var canDrop, draggedTask, isSameList, sourceID, targetID;
            draggedTask = $(data.o.parentNode);
            targetID = data.r[0].id;
            sourceID = _this.getSelectedNode().prop('id');
            canDrop = {
              after: false,
              before: false,
              inside: false
            };
            isSameList = sourceID === targetID;
            if (!isSameList && draggedTask.hasClass('task')) {
              canDrop.inside = true;
            }
            return canDrop;
          }
        }
      });
      this.setListeners(homeViewCbk);
    }

    /**
    # Bind listeners given in parameters with comment events (creation,
    # update, deletion, selection). Called by the constructor once.
    */


    Tree.prototype.setListeners = function(homeViewCbk) {
      var jstreeEl, textPrompt, tree_buttons, tree_buttons_root, tree_buttons_target,
        _this = this;
      tree_buttons = $("#tree-buttons");
      tree_buttons_root = $("#tree-buttons-root");
      jstreeEl = this.jstreeEl;
      $("#tree-create").tooltip({
        placement: "bottom",
        title: "Add a sub-list"
      });
      $("#tree-create").on("click", function(e) {
        jstreeEl.jstree("create", this.parentElement.parentElement, 0, "New list");
        $(this).tooltip('hide');
        e.stopPropagation();
        return e.preventDefault();
      });
      $("#tree-create-root").tooltip({
        placement: "bottom",
        title: "Add a list"
      });
      $("#tree-create-root").on("click", function(e) {
        jstreeEl.jstree("create", this.parentElement.parentElement, 0, "New list");
        $(this).tooltip('hide');
        e.stopPropagation();
        return e.preventDefault();
      });
      $("#tree-rename").tooltip({
        placement: "bottom",
        title: "Rename a list"
      });
      $("#tree-rename").on("click", function(e) {
        jstreeEl.jstree("rename", this.parentElement.parentElement);
        $(this).tooltip('hide');
        e.preventDefault();
        return e.stopPropagation();
      });
      $("#tree-remove").tooltip({
        placement: "bottom",
        title: "Remove a list"
      });
      $("#tree-remove").on("click", function(e) {
        var nodeToDelete,
          _this = this;
        nodeToDelete = this.parentElement.parentElement.parentElement;
        $(this).tooltip('hide');
        $('#confirm-delete-modal').modal('show');
        $("#yes-button").on("click", function(e) {
          var noteToDelete_id;
          noteToDelete_id = nodeToDelete.id;
          if (noteToDelete_id !== 'tree-node-all') {
            jstreeEl.jstree("remove", nodeToDelete);
            return homeViewCbk.onRemove(noteToDelete_id);
          }
        });
        e.preventDefault();
        return e.stopPropagation();
      });
      tree_buttons_target = $("#nav");
      this.widget.on("hover_node.jstree", function(event, data) {
        if (data.rslt.obj[0].id === "tree-node-all") {
          tree_buttons_root.appendTo(data.args[0]);
          return tree_buttons_root.css("display", "block");
        } else {
          tree_buttons.appendTo(data.args[0]);
          return tree_buttons.css("display", "block");
        }
      });
      this.widget.on("dehover_node.jstree", function(event, data) {
        if (data.rslt.obj[0].id === "tree-node-all") {
          tree_buttons_root.css("display", "none");
          return tree_buttons_root.appendTo(tree_buttons_target);
        } else {
          tree_buttons.css("display", "none");
          return tree_buttons.appendTo(tree_buttons_target);
        }
      });
      textPrompt = $(".text-prompt");
      this.widget.on("create.jstree", function(e, data) {
        var nodeName, parentId;
        nodeName = data.inst.get_text(data.rslt.obj);
        parentId = data.rslt.parent[0].id;
        return homeViewCbk.onCreate(parentId, data.rslt.name, data);
      });
      this.widget.on("rename.jstree", function(e, data) {
        var newNodeName, oldNodeName;
        newNodeName = data.rslt.new_name;
        oldNodeName = data.rslt.old_name;
        if (oldNodeName !== newNodeName) {
          return homeViewCbk.onRename(data.rslt.obj[0].id, newNodeName, data.inst);
        }
      });
      this.widget.on("select_node.jstree", function(e, data) {
        var nodeName, note_uuid, parent, path;
        note_uuid = data.rslt.obj[0].id;
        if (note_uuid === "tree-node-all") {
          path = "/all";
        } else {
          nodeName = data.inst.get_text(data.rslt.obj);
          parent = data.inst._get_parent();
          path = "/" + data.rslt.obj[0].id + _this._getSlugPath(parent, nodeName);
        }
        _this.currentPath = path;
        _this.currentData = data;
        _this.currentNote_uuid = note_uuid;
        _this.jstreeEl[0].focus();
        return homeViewCbk.onSelect(path, note_uuid, data);
      });
      this.widget.on("move_node.jstree", function(e, data) {
        var nodeId, targetNodeId;
        nodeId = data.rslt.o[0].id;
        targetNodeId = data.rslt.o[0].parentElement.parentElement.id;
        return homeViewCbk.onDrop(nodeId, targetNodeId);
      });
      return this.widget.on("loaded.jstree", function(e, data) {
        return homeViewCbk.onLoaded();
      });
    };

    /**
    #Select node corresponding to given path
    #if note_uuid exists in the jstree it is selected
    #otherwise if there is no selected node, we select the root
    */


    Tree.prototype.selectNode = function(note_uuid) {
      var node;
      node = $("#" + note_uuid);
      if (node[0]) {
        this.jstreeEl.jstree("deselect_all", null);
        return this.jstreeEl.jstree("select_node", node);
      } else if (!this.jstreeEl.jstree("get_selected")[0]) {
        return this.jstreeEl.jstree("select_node", "#tree-node-all");
      }
    };

    Tree.prototype.deselectAll = function() {
      return this.jstreeEl.jstree("deselect_all", null);
    };

    Tree.prototype.getSelectedNode = function() {
      return this.jstreeEl.jstree("get_selected");
    };

    Tree.prototype.getParent = function(child) {
      return child.parent().parent();
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

    Tree.prototype._getSlugPath = function(parent, nodeName) {
      return this._getPath(parent, nodeName).join("/");
    };

    return Tree;

  })();
  
});
