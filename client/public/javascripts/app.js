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
    _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Task = require("../models/task").Task;

  exports.TaskCollection = (function(_super) {

    __extends(TaskCollection, _super);

    TaskCollection.prototype.model = Task;

    TaskCollection.prototype.url = 'tasks/';

    function TaskCollection(view, listId, options) {
      var _this = this;
      this.view = view;
      this.listId = listId;
      this.options = options;
      this.down = function(task) {
        return TaskCollection.prototype.down.apply(_this, arguments);
      };
      this.up = function(task) {
        return TaskCollection.prototype.up.apply(_this, arguments);
      };
      this.onTaskAdded = function(task) {
        return TaskCollection.prototype.onTaskAdded.apply(_this, arguments);
      };
      this.onReset = function(tasks) {
        return TaskCollection.prototype.onReset.apply(_this, arguments);
      };
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
      var firstTask, index, nextTask,
        _this = this;
      index = this.toArray().indexOf(previousTask);
      if ((previousTask != null) && (previousTask.get("nextTask") != null)) {
        nextTask = this.at(index + 1);
        if (nextTask != null) {
          nextTask.set("previousTask", task.id);
        }
      } else if ((firstTask = this.at(0)) != null) {
        nextTask = firstTask;
      } else {
        nextTask = null;
      }
      task.set("nextTask", nextTask);
      task.setPreviousTask(previousTask);
      task.collection = this;
      task.url = "" + this.url + "/";
      return task.save(task.attributes, {
        success: function() {
          task.url = "" + _this.url + "/" + task.id + "/";
          _this.add(task, {
            at: index + 1,
            silent: true
          });
          if (previousTask != null) {
            _this.view.insertTask(previousTask.view, task);
          } else {
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
            length: 4,
            width: 3,
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
    var hashTags, tag, tags, _i, _len;
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
        tags.push(tag.substring(1));
      }
    }
    return tags;
  };
  
});
window.require.register("initialize", function(exports, require, module) {
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
      this.initializeJQueryExtensions();
      this.router = new MainRouter;
      return this.homeView = new HomeView;
    };

    return Application;

  })(BrunchApplication);

  window.app = new exports.Application;
  
});
window.require.register("lib/request", function(exports, require, module) {
  
  exports.request = function(type, url, data, callbacks) {
    return $.ajax({
      type: type,
      url: url,
      data: data,
      success: callbacks.success,
      error: callbacks.error
    });
  };

  exports.get = function(url, callbacks) {
    return exports.request("GET", url, null, callbacks);
  };

  exports.post = function(url, data, callbacks) {
    return exports.request("POST", url, data, callbacks);
  };

  exports.put = function(url, data, callbacks) {
    return exports.request("PUT", url, data, callbacks);
  };

  exports.del = function(url, callbacks) {
    return exports.request("DELETE", url, null, callbacks);
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
window.require.register("models/models", function(exports, require, module) {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.BaseModel = (function(_super) {

    __extends(BaseModel, _super);

    function BaseModel() {
      return BaseModel.__super__.constructor.apply(this, arguments);
    }

    BaseModel.prototype.isNew = function() {
      return this.id == null;
    };

    return BaseModel;

  })(Backbone.Model);
  
});
window.require.register("models/task", function(exports, require, module) {
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
      this.url = "todolists/" + task.list + "/tasks/";
      if (this.id != null) {
        this.url += "" + this.id + "/";
      }
      this.setSimpleDate(task.completionDate);
      this.setListName();
    }

    Task.prototype.setSimpleDate = function(date) {
      if (date == null) {
        date = new Date();
      }
      this.simpleDate = moment(date).format("DD/MM/YYYY");
      return this.fullDate = moment(date).format("DD/MM/YYYY HH:mm");
    };

    Task.prototype.setListName = function() {
      var list, path, _ref;
      list = (_ref = window.app) != null ? _ref.homeView.todolists.get(this.list) : void 0;
      if (list != null) {
        this.listTitle = list.title;
        path = list.path;
        if ((path != null) && typeof path === "string") {
          path = JSON.parse(path);
        }
        if (path != null) {
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

    return Task;

  })(BaseModel);
  
});
window.require.register("models/todolist", function(exports, require, module) {
  var BaseModel, request, slugify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseModel = require("models/models").BaseModel;

  slugify = require("lib/slug");

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
      var property, slugs, title, _i, _len, _ref;
      TodoList.__super__.constructor.call(this, todolist);
      for (property in todolist) {
        this[property] = todolist[property];
      }
      if (this.path != null) {
        this.breadcrumb = this.path.join(" > ");
        slugs = [];
        _ref = this.path;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          title = _ref[_i];
          slugs.push(slugify(title));
        }
        this.urlPath = slugs.join("/");
        this.urlPath = "todolist/" + this.id + "/all/" + this.urlPath;
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

    TodoList.deleteTodoList = function(id, callback) {
      return request("DELETE", "todolists/" + id, callback);
    };

    return TodoList;

  })(BaseModel);
  
});
window.require.register("routers/main_router", function(exports, require, module) {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.MainRouter = (function(_super) {

    __extends(MainRouter, _super);

    function MainRouter() {
      return MainRouter.__super__.constructor.apply(this, arguments);
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
      return app.homeView.loadData(callback);
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
  var TagListView, TodoList, TodoListCollection, TodoListWidget, Tree, client, helpers,
    _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tree = require("./widgets/tree").Tree;

  TodoList = require("../models/todolist").TodoList;

  TagListView = require("./taglist_view").TagListView;

  TodoListCollection = require("../collections/todolists").TodoListCollection;

  TodoListWidget = require("./todolist_view").TodoListWidget;

  helpers = require("../helpers");

  client = require("../lib/request");

  exports.HomeView = (function(_super) {

    __extends(HomeView, _super);

    HomeView.prototype.id = 'home-view';

    /*
    # Initializers
    */


    HomeView.prototype.initialize = function() {};

    function HomeView() {
      var _this = this;
      this.onTaskChanged = function(tags) {
        return HomeView.prototype.onTaskChanged.apply(_this, arguments);
      };
      this.onTodoListDropped = function(nodeId, targetNodeId) {
        return HomeView.prototype.onTodoListDropped.apply(_this, arguments);
      };
      this.onTreeLoaded = function() {
        return HomeView.prototype.onTreeLoaded.apply(_this, arguments);
      };
      this.onTodoListSelected = function(path, id, data) {
        return HomeView.prototype.onTodoListSelected.apply(_this, arguments);
      };
      this.onTodoListRemoved = function(listId) {
        return HomeView.prototype.onTodoListRemoved.apply(_this, arguments);
      };
      this.onTodoListRenamed = function(listId, newName, data) {
        return HomeView.prototype.onTodoListRenamed.apply(_this, arguments);
      };
      this.onTodoListCreated = function(parentId, newName, data) {
        return HomeView.prototype.onTodoListCreated.apply(_this, arguments);
      };
      this.todolists = new TodoListCollection();
      Backbone.Mediator.subscribe('task:changed', this.onTaskChanged);
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
          resizable: true
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
      this.$("#tree").spin();
      $.get("tree/", function(data) {
        window.tree = data;
        return _this.tree = new Tree(_this.$("#nav"), data, {
          onCreate: _this.onTodoListCreated,
          onRename: _this.onTodoListRenamed,
          onRemove: _this.onTodoListRemoved,
          onSelect: _this.onTodoListSelected,
          onLoaded: _this.onTreeLoaded,
          onDrop: _this.onTodoListDropped
        });
      });
      return this.treeLoadedCallback = callback;
    };

    /*
    # Listeners
    */


    HomeView.prototype.onTodoListCreated = function(parentId, newName, data) {
      var _this = this;
      return TodoList.createTodoList({
        title: newName,
        parent_id: parentId
      }, function(todolist) {
        data.rslt.obj.data("id", todolist.id);
        data.rslt.obj[0].id = todolist.id;
        data.inst.deselect_all();
        return data.inst.select_node(data.rslt.obj);
      });
    };

    HomeView.prototype.onTodoListRenamed = function(listId, newName, data) {
      var _this = this;
      if (newName != null) {
        return TodoList.updateTodoList(listId, {
          title: newName
        }, function() {
          return _this.tree.selectNode(listId);
        });
      }
    };

    HomeView.prototype.onTodoListRemoved = function(listId) {
      if (this.currentTodolist && this.currentTodolist.id === listId) {
        this.currentTodolist.destroy();
      } else {
        TodoList.deleteTodoList(listId, function() {});
      }
      return $("#todo-list").html(null);
    };

    HomeView.prototype.onTodoListSelected = function(path, id, data) {
      var _ref,
        _this = this;
      if ((_ref = this.tagListView) != null) {
        _ref.deselectAll();
      }
      if ((id != null) && id !== "tree-node-all") {
        return TodoList.getTodoList(id, function(list) {
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
          success: function() {
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
      return client.get("tasks/tags", {
        success: function(data) {
          _this.tagListView = new TagListView(data);
          _this.tagListView.render();
          return loadLists();
        },
        error: function() {
          return loadLists();
        }
      });
    };

    HomeView.prototype.onTodoListDropped = function(nodeId, targetNodeId) {
      var _this = this;
      return TodoList.updateTodoList(nodeId, {
        parent_id: targetNodeId
      }, function() {
        return TodoList.getTodoList(nodeId, function(body) {
          _this.currentTodolist.set("path", body.path);
          return _this.currentTodolist.view.refreshBreadcrump();
        });
      });
    };

    HomeView.prototype.onTaskChanged = function(tags) {
      var _ref;
      return (_ref = this.tagListView) != null ? _ref.addTags(tags) : void 0;
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
      var todolistWidget, _ref;
      if (todolist != null) {
        todolist.url = "todolists/" + todolist.id;
      }
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
  
});
window.require.register("views/taglist_view", function(exports, require, module) {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.TagListView = (function(_super) {

    __extends(TagListView, _super);

    TagListView.prototype.id = 'tags';

    function TagListView(tagList) {
      this.tagList = tagList;
      TagListView.__super__.constructor.call(this);
    }

    TagListView.prototype.render = function() {
      var tag, _i, _len, _ref, _results;
      this.el = $("#tags");
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
      return this.el.append("<div><a href=\"#tag/" + tag + "\">" + tag + "</a></div>");
    };

    TagListView.prototype.selectTag = function(tag) {
      return $("#tags a").each(function(index, el) {
        if ($(el).html() === tag) {
          return $(el).addClass("selected");
        } else {
          return $(el).removeClass("selected");
        }
      });
    };

    TagListView.prototype.deselectAll = function() {
      return $("#tags a").removeClass("selected");
    };

    TagListView.prototype.addTags = function(tags) {
      var tag, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = tags.length; _i < _len; _i++) {
        tag = tags[_i];
        if (_.find(this.tagList, function(ctag) {
          return tag === ctag;
        }) == null) {
          this.tagList.push(tag);
          _results.push(this.addTagLine(tag));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return TagListView;

  })(Backbone.View);
  
});
window.require.register("views/task_view", function(exports, require, module) {
  var Task, helpers, template,
    _this = this,
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
      "click .task-infos a": "onListLinkClicked"
    };

    /*
    # Initializers
    */


    function TaskLine(model, list) {
      var _this = this;
      this.model = model;
      this.list = list;
      this.onDescriptionChanged = function(event, keyCode) {
        return TaskLine.prototype.onDescriptionChanged.apply(_this, arguments);
      };
      this.onDownButtonClicked = function(event) {
        return TaskLine.prototype.onDownButtonClicked.apply(_this, arguments);
      };
      this.onUpButtonClicked = function(event) {
        return TaskLine.prototype.onUpButtonClicked.apply(_this, arguments);
      };
      this.onDelButtonClicked = function(event) {
        return TaskLine.prototype.onDelButtonClicked.apply(_this, arguments);
      };
      this.onTodoButtonClicked = function(event) {
        return TaskLine.prototype.onTodoButtonClicked.apply(_this, arguments);
      };
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
      return this.el;
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
        if (keyCode === 84 && event.altKey) {
          return event.preventDefault();
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
      var _this = this;
      this.showLoading();
      this.model.url = "todolists/" + this.model.list + "/tasks/" + this.model.id;
      this.model.done = !this.model.done;
      return this.model.save({
        done: this.model.done
      }, {
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
      var isUp, persistUp,
        _this = this;
      persistUp = function() {
        _this.focusDescription();
        _this.showLoading();
        return _this.model.save(null, {
          success: function() {
            _this.todoButton = _this.$(".todo-button");
            _this.hideLoading();
            return _this.saving = false;
          },
          error: function() {
            _this.todoButton = _this.$(".todo-button");
            alert("An error occured, modifications were not saved.");
            _this.hideLoading();
            return _this.saving = false;
          }
        });
      };
      if (!this.saving) {
        this.saving = true;
        isUp = this.model.collection.up(this.model);
        if ((this.model.collection.listId != null) && !this.model.done && isUp) {
          return persistUp();
        }
      }
    };

    TaskLine.prototype.onDownButtonClicked = function(event) {
      var isDown, persistDown,
        _this = this;
      persistDown = function() {
        _this.showLoading();
        return _this.model.save(null, {
          success: function() {
            _this.todoButton = _this.$(".todo-button");
            _this.hideLoading();
            return _this.saving = false;
          },
          error: function() {
            _this.todoButton = _this.$(".todo-button");
            alert("An error occured, modifications were not saved.");
            _this.hideLoading();
            return _this.saving = false;
          }
        });
      };
      if (!this.saving) {
        this.saving = true;
        isDown = this.model.collection.down(this.model);
        if ((this.model.collection.listId != null) && !this.model.done && isDown) {
          return persistDown();
        }
      }
    };

    TaskLine.prototype.onDescriptionChanged = function(event, keyCode) {
      var _this = this;
      if (!(keyCode === 8 || this.descriptionField.val().length === 0)) {
        this.saving = true;
        this.model.description = this.descriptionField.val();
        this.showLoading();
        return this.model.save({
          description: this.model.description
        }, {
          success: function() {
            var tags;
            tags = helpers.extractTags(_this.model.description);
            Backbone.Mediator.publish('task:changed', tags);
            _this.model.set('tags', tags);
            _this.hideLoading();
            return _this.saving = false;
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

    TaskLine.prototype.onEnterKeyup = function() {
      var task,
        _this = this;
      if (this.model.collection.listId != null) {
        this.showLoading();
        task = new Task({
          description: "new task",
          list: this.model.collection.listId
        });
        return this.model.collection.insertTask(this.model, task, {
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
      var _this = this;
      this.showLoading();
      return this.model.collection.removeTask(this.model, {
        success: function() {
          if (callback) {
            callback();
          }
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
  var Task, TaskCollection, TaskLine, helpers,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskCollection = require("../collections/tasks").TaskCollection;

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
      nextDescription = taskLine.list.$(selector).prev().find(".description");
      if (nextDescription.length) {
        return this.moveFocus(taskLine.descriptionField, nextDescription, options);
      }
    };

    TaskList.prototype.moveDownFocus = function(taskLine, options) {
      var nextDescription, selector;
      selector = "#" + taskLine.model.id;
      nextDescription = taskLine.list.$(selector).next().find(".description");
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
      if (previousTaskLine != null) {
        taskLineEl.insertAfter($(previousTaskLine.el));
      } else {
        this.$el.prepend(taskLineEl);
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
  buf.push('<div id="nav" class="ui-layout-west"><div id="tags"></div><div id="tree"></div><div id="tree-loading-indicator"></div></div><div id="content" class="ui-layout-center"><div id="todo-list"></div></div><div id="confirm-delete-modal" tabindex="-1" role="dialog" aria-hidden="true" class="modal hide fade in"><div class="modal-header"><h3 id="confirm-delete-modal-label">Warning!</h3></div><div class="modal-body"><p> \nYou are about to delete this list, its tasks and its sub lists. Do\nyou want to continue?</p></div><div class="modal-footer"><button id="yes-button" data-dismiss="modal" aria-hidden="true" class="btn">Yes</button><button data-dismiss="modal" aria-hidden="true" class="btn btn-info">No</button></div></div>');
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
  buf.push('<button class="btn btn-info todo-button">todo</button><input');
  buf.push(attrs({ 'type':("text"), 'contenteditable':("true"), 'value':("" + (model.description) + ""), "class": ('description') }, {"type":true,"contenteditable":true,"value":true}));
  buf.push('/><div class="task-buttons"><button class="up-task-button btn">up</button><button class="down-task-button btn">down</button><button class="del-task-button btn">X</button></div><div class="task-infos">');
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
  buf.push('<header class="todo-list-title clearfix"><p class="breadcrumb"></p><p class="description"></p><button data-toggle="tooltip" title="Shortcut: alt+t" class="btn btn-info toggle-task-form">Loading...</button></header><div class="new-task task clearfix"><button class="btn btn-info add-task disabled">new</button><input type="text" contenteditable="true" value="" class="description"/></div><div id="task-list"></div><h2 class="archive-title">archives</h2><div id="archive-list"></div>');
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
  var Task, TaskCollection, TaskList, helpers, slugify,
    _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskCollection = require("../collections/tasks").TaskCollection;

  Task = require("../models/task").Task;

  TaskList = require("./tasks_view").TaskList;

  helpers = require("../helpers");

  slugify = require("lib/slug");

  exports.TodoListWidget = (function(_super) {

    __extends(TodoListWidget, _super);

    TodoListWidget.prototype.id = "todo-list";

    TodoListWidget.prototype.tagName = "div";

    TodoListWidget.prototype.el = "#todo-list";

    TodoListWidget.prototype.isEditMode = false;

    /* Constructor
    */


    function TodoListWidget(model) {
      var _this = this;
      this.model = model;
      this.removeCreationInfos = function() {
        return TodoListWidget.prototype.removeCreationInfos.apply(_this, arguments);
      };
      this.displayCreationInfos = function() {
        return TodoListWidget.prototype.displayCreationInfos.apply(_this, arguments);
      };
      this.creationInfosRequired = function() {
        return TodoListWidget.prototype.creationInfosRequired.apply(_this, arguments);
      };
      this.onEditClicked = function(event) {
        return TodoListWidget.prototype.onEditClicked.apply(_this, arguments);
      };
      this.onAddClicked = function(event) {
        return TodoListWidget.prototype.onAddClicked.apply(_this, arguments);
      };
      this.newTaskButtonHandler = function() {
        return TodoListWidget.prototype.newTaskButtonHandler.apply(_this, arguments);
      };
      this.hideTaskForm = function(taskForm, updatePreferences) {
        return TodoListWidget.prototype.hideTaskForm.apply(_this, arguments);
      };
      this.showTaskForm = function(taskForm, updatePreferences) {
        return TodoListWidget.prototype.showTaskForm.apply(_this, arguments);
      };
      this.toggleTaskForm = function(taskForm, updatePreferences, showOrHide) {
        return TodoListWidget.prototype.toggleTaskForm.apply(_this, arguments);
      };
      this.clearNewTask = function() {
        return TodoListWidget.prototype.clearNewTask.apply(_this, arguments);
      };
      TodoListWidget.__super__.constructor.call(this);
      if (this.model != null) {
        this.id = this.model.slug;
        this.model.view = this;
      }
    }

    TodoListWidget.prototype.remove = function() {
      return $(this.el).remove();
    };

    /* configuration
    */


    TodoListWidget.prototype.render = function() {
      var _this = this;
      $(this.el).html(require('./templates/todolist'));
      this.title = this.$(".todo-list-title .description");
      this.breadcrumb = this.$(".todo-list-title .breadcrumb");
      this.taskList = new TaskList(this, this.$("#task-list"));
      this.archiveList = new TaskList(this, this.$("#archive-list"));
      this.tasks = this.taskList.tasks;
      this.archiveTasks = this.archiveList.tasks;
      this.refreshBreadcrump();
      if (this.taskList.tasks.listId == null) {
        $('button.toggle-task-form').hide();
      }
      this.tasks.on('reset', function(collection) {
        return _this.initializeTaskManagement();
      });
      this.tasks.on('remove', function(collection) {
        return _this.toggleTaskForm(_this.newTaskForm, false, 'show');
      });
      return this.el;
    };

    TodoListWidget.prototype.initializeTaskManagement = function() {
      var isListEmpty, show_form,
        _this = this;
      this.newTaskForm = $('.new-task');
      if (this.taskList.tasks.listId == null) {
        return;
      }
      $('button.toggle-task-form').fadeTo(1000, 1);
      $('button.toggle-task-form').tooltip({
        placement: 'bottom'
      });
      this.newTaskFormButton = this.newTaskForm.find("button.add-task");
      this.newTaskFormInput = this.newTaskForm.find(".description");
      this.hasUserTyped = false;
      show_form = $.cookie('todos_prefs:show_form');
      isListEmpty = this.tasks.length === 0;
      if (show_form === 'true' || (show_form == null) || isListEmpty) {
        this.toggleTaskForm(this.newTaskForm, false, 'show');
      } else {
        this.toggleTaskForm(this.newTaskForm, false, 'hide');
      }
      this.newTaskFormInput.keydown(function(event) {
        var keyCode;
        keyCode = event.which | event.keyCode;
        if (keyCode === 84 && event.altKey) {
          return event.preventDefault();
        }
      });
      $(document).keyup(function(event) {
        var keyCode;
        keyCode = event.which | event.keyCode;
        if (keyCode === 84 && event.altKey) {
          return _this.toggleTaskForm(_this.newTaskForm, true);
        }
      });
      $('button.toggle-task-form').click(function(event) {
        return _this.toggleTaskForm(_this.newTaskForm, true);
      });
      this.newTaskFormInput.keyup(function(event) {
        var keyCode;
        _this.hasUserTyped = true;
        _this.newTaskButtonHandler();
        keyCode = event.which | event.keyCode;
        if (keyCode === 13) {
          return _this.newTaskFormButton.click();
        }
      });
      this.newTaskFormInput.focus(function(event) {
        if (!_this.hasUserTyped) {
          return _this.newTaskFormInput.val("");
        }
      });
      return this.newTaskFormInput.focusout(function(event) {
        if (_this.newTaskFormInput.val() === "") {
          _this.clearNewTask();
          return _this.hasUserTyped = false;
        }
      });
    };

    TodoListWidget.prototype.clearNewTask = function() {
      this.newTaskButtonHandler();
      return this.newTaskFormInput.val("What do you have to do next ?");
    };

    TodoListWidget.prototype.toggleTaskForm = function(taskForm, updatePreferences, showOrHide) {
      if ((taskForm.is(':visible') && (showOrHide == null)) || ((showOrHide != null) && showOrHide === 'hide')) {
        return this.hideTaskForm(taskForm, updatePreferences);
      } else {
        return this.showTaskForm(taskForm, updatePreferences);
      }
    };

    TodoListWidget.prototype.showTaskForm = function(taskForm, updatePreferences) {
      taskForm.show();
      $('button.toggle-task-form').text('Hide the form');
      if (updatePreferences) {
        return $.cookie('todos_prefs:show_form', 'true');
      }
    };

    TodoListWidget.prototype.hideTaskForm = function(taskForm, updatePreferences) {
      taskForm.hide();
      $('button.toggle-task-form').text('Show the form');
      if (updatePreferences) {
        return $.cookie('todos_prefs:show_form', 'false');
      }
    };

    TodoListWidget.prototype.newTaskButtonHandler = function() {
      var _this = this;
      if (!this.hasUserTyped || !this.newTaskFormInput.val()) {
        this.newTaskFormButton.addClass('disabled');
        this.newTaskFormButton.html('new');
        return this.newTaskFormButton.unbind('click');
      } else {
        this.newTaskFormButton.removeClass('disabled');
        this.newTaskFormButton.html('add');
        this.newTaskFormButton.unbind('click');
        return this.newTaskFormButton.click(function(event) {
          var task;
          task = new Task({
            done: false,
            description: _this.newTaskFormInput.val()
          });
          _this.newTaskFormButton.html('&nbsp;');
          _this.newTaskFormButton.spin('tiny');
          _this.hasUserTyped = false;
          return _this.taskList.tasks.insertTask(null, task, {
            success: function(data) {
              _this.clearNewTask();
              _this.newTaskFormButton.html('new');
              return _this.newTaskFormButton.spin();
            },
            error: function(data) {
              _this.newTaskFormButton.html('new');
              return _this.newTaskFormButton.spin();
            }
          });
        });
      }
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
          console.debug(data);
          _this.tasks.add(data);
          $(".task:first .description").focus();
          helpers.selectAll($(".task:first .description"));
          return _this.displayCreationInfos();
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
      if (this.model == null) {
        this.tasks.url = "tasks/todo";
        this.archiveTasks.url = "tasks/archives";
      } else {
        console.log(this.model);
        if (this.model.tag != null) {
          this.tasks.url = "tasks/tags/" + this.model.tag + "/todo";
          this.archiveTasks.url = "tasks/tags/" + this.model.tag + "/archives";
        } else {
          this.archiveTasks.url += "/archives";
        }
      }
      $(this.archiveTasks.view.el).spin();
      $(this.tasks.view.el).spin();
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
          } else {
            if ((_this.model != null) && (_this.model.id != null)) {
              _this.onAddClicked();
            }
          }
          return _this.$(_this.tasks.view.el).spin();
        },
        error: function() {
          return _this.$(_this.tasks.view.el).spin();
        }
      });
    };

    TodoListWidget.prototype.creationInfosRequired = function() {
      return this.tasks.length === 1 && (this.model.get("id") != null);
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
        if (parent != null) {
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
    _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskList = require("../tasks_view").TaskList;

  exports.HaveDoneListModal = (function(_super) {

    __extends(HaveDoneListModal, _super);

    HaveDoneListModal.prototype["class"] = "modal hide";

    HaveDoneListModal.prototype.id = "have-done-list-modal";

    HaveDoneListModal.prototype.initialize = function() {};

    function HaveDoneListModal() {
      var _this = this;
      this.hide = function() {
        return HaveDoneListModal.prototype.hide.apply(_this, arguments);
      };
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
    _this = this;

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
      var _this = this;
      this._getSlugPath = function(parent, nodeName) {
        return Tree.prototype._getSlugPath.apply(_this, arguments);
      };
      this.jstreeEl = $("#tree");
      navEl.prepend(require('../templates/tree_buttons'));
      data = JSON.parse(data);
      this.widget = this.jstreeEl.jstree({
        plugins: ["themes", "json_data", "ui", "crrm", "unique", "sort", "cookies", "types", "hotkeys", "dnd", "search"],
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
