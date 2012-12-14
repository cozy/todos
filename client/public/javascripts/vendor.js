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

// Make it safe to do console.log() always.
(function (con) {
  var method;
  var dummy = function() {};
  var methods = ('assert,count,debug,dir,dirxml,error,exception,group,' +
     'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' + 
     'time,timeEnd,trace,warn').split(',');
  while (method = methods.pop()) {
    con[method] = con[method] || dummy;
  }
})(window.console = window.console || {});
;

/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */(function(a,b){function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?parseFloat(d):j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function J(){return!1}function K(){return!0}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function bj(a,b){if(b.nodeType!==1||!f.hasData(a))return;var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c+(i[c][d].namespace?".":"")+i[c][d].namespace,i[c][d],i[c][d].data)}h.data&&(h.data=f.extend({},h.data))}function bk(a,b){var c;if(b.nodeType!==1)return;b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bo(a){var b=c.createElement("div");return bh.appendChild(b),b.innerHTML=a.outerHTML,b.firstChild}function bp(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function bC(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bx:by,g=0,h=e.length;if(d>0){if(c!=="border")for(;g<h;g++)c||(d-=parseFloat(f.css(a,"padding"+e[g]))||0),c==="margin"?d+=parseFloat(f.css(a,c+e[g]))||0:d-=parseFloat(f.css(a,"border"+e[g]+"Width"))||0;return d+"px"}d=bz(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0;if(c)for(;g<h;g++)d+=parseFloat(f.css(a,"padding"+e[g]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+e[g]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+e[g]))||0);return d+"px"}function bZ(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bP),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function b$(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bT,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=b$(a,c,d,e,l,g)));return(k||!l)&&!g["*"]&&(l=b$(a,c,d,e,"*",g)),l}function b_(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function ca(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bE.test(a)?d(a,e):ca(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)ca(a+"["+e+"]",b[e],c,d);else d(a,b)}function cb(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j)return j!==f[0]&&f.unshift(j),d[j]}function cc(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function ci(){try{return new a.XMLHttpRequest}catch(b){}}function cj(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function cs(){return setTimeout(ct,0),cr=f.now()}function ct(){cr=b}function cu(a,b){var c={};return f.each(cq.concat.apply([],cq.slice(0,b)),function(){c[this]=a}),c}function cv(a){if(!ck[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){cl||(cl=c.createElement("iframe"),cl.frameBorder=cl.width=cl.height=0),b.appendChild(cl);if(!cm||!cl.createElement)cm=(cl.contentWindow||cl.contentDocument).document,cm.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),cm.close();d=cm.createElement(a),cm.body.appendChild(d),e=f.css(d,"display"),b.removeChild(cl)}ck[a]=e}return ck[a]}function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(e.isReady)return;try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};return e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType)return this.context=this[0]=a,this.length=1,this;if(a==="body"&&!d&&c.body)return this.context=c,this[0]=c.body,this.selector=a,this.length=1,this;if(typeof a=="string"){a.charAt(0)==="<"&&a.charAt(a.length-1)===">"&&a.length>=3?g=[null,a,null]:g=i.exec(a);if(g&&(g[1]||!d)){if(g[1])return d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes),e.merge(this,a);h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}return this.context=c,this.selector=a,this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}return e.isFunction(a)?f.ready(a):(a.selector!==b&&(this.selector=a.selector,this.context=a.context),e.makeArray(a,this))},selector:"",jquery:"1.7.1",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();return e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")"),d},each:function(a,b){return e.each(this,a,b)},ready:function(a){return e.bindReady(),A.add(a),this},eq:function(a){return a=+a,a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){return a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f),e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(A)return;A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}return(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c),d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":a.toString().replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];return a.length=d,a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};return g.guid=a.guid=a.guid||g.guid||e.guid++,g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function d(c,d){return d&&d instanceof e&&!(d instanceof a)&&(d=a(d)),e.fn.init.call(this,c,d,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())}),e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?m(g):h==="function"&&(!a.unique||!o.has(g))&&c.push(g)},n=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,l=j||0,j=0,k=c.length;for(;c&&l<k;l++)if(c[l].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}i=!1,c&&(a.once?e===!0?o.disable():c=[]:d&&d.length&&(e=d.shift(),o.fireWith(e[0],e[1])))},o={add:function(){if(c){var a=c.length;m(arguments),i?k=c.length:e&&e!==!0&&(j=a,n(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){i&&f<=k&&(k--,f<=l&&l--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){return c=[],this},disable:function(){return c=d=e=b,this},disabled:function(){return!c},lock:function(){return d=b,(!e||e===!0)&&o.disable(),this},locked:function(){return!d},fireWith:function(b,c){return d&&(i?a.once||d.push([b,c]):(!a.once||!e)&&n(b,c)),this},fire:function(){return o.fireWith(this,arguments),this},fired:function(){return!!e}};return o};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){return i.done(a).fail(b).progress(c),this},always:function(){return i.done.apply(i,arguments).fail.apply(i,arguments),this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;return i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i),i},when:function(a){function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}var b=i.call(arguments,0),c=0,d=b.length,e=new Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p,q=c.createElement("div"),r=c.documentElement;q.setAttribute("className","t"),q.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=q.getElementsByTagName("*"),e=q.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=q.getElementsByTagName("input")[0],b={leadingWhitespace:q.firstChild.nodeType===3,tbody:!q.getElementsByTagName("tbody").length,htmlSerialize:!!q.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:q.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete q.test}catch(s){b.deleteExpando=!1}!q.addEventListener&&q.attachEvent&&q.fireEvent&&(q.attachEvent("onclick",function(){b.noCloneEvent=!1}),q.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),q.appendChild(i),k=c.createDocumentFragment(),k.appendChild(q.lastChild),b.checkClone=k.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,k.removeChild(i),k.appendChild(q),q.innerHTML="",a.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",q.style.width="2px",q.appendChild(j),b.reliableMarginRight=(parseInt((a.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0);if(q.attachEvent)for(o in{submit:1,change:1,focusin:1})n="on"+o,p=n in q,p||(q.setAttribute(n,"return;"),p=typeof q[n]=="function"),b[o+"Bubbles"]=p;return k.removeChild(q),k=g=h=j=q=i=null,f(function(){var a,d,e,g,h,i,j,k,m,n,o,r=c.getElementsByTagName("body")[0];if(!r)return;j=1,k="position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",m="visibility:hidden;border:0;",n="style='"+k+"border:5px solid #000;padding:0;'",o="<div "+n+"><div></div></div>"+"<table "+n+" cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",a=c.createElement("div"),a.style.cssText=m+"width:0;height:0;position:static;top:0;margin-top:"+j+"px",r.insertBefore(a,r.firstChild),q=c.createElement("div"),a.appendChild(q),q.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",l=q.getElementsByTagName("td"),p=l[0].offsetHeight===0,l[0].style.display="",l[1].style.display="none",b.reliableHiddenOffsets=p&&l[0].offsetHeight===0,q.innerHTML="",q.style.width=q.style.paddingLeft="1px",f.boxModel=b.boxModel=q.offsetWidth===2,typeof q.style.zoom!="undefined"&&(q.style.display="inline",q.style.zoom=1,b.inlineBlockNeedsLayout=q.offsetWidth===2,q.style.display="",q.innerHTML="<div style='width:4px;'></div>",b.shrinkWrapBlocks=q.offsetWidth!==2),q.style.cssText=k+m,q.innerHTML=o,d=q.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,i={doesNotAddBorder:e.offsetTop!==5,doesAddBorderForTableAndCells:h.offsetTop===5},e.style.position="fixed",e.style.top="20px",i.fixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",i.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,i.doesNotIncludeMarginInBodyOffset=r.offsetTop!==j,r.removeChild(a),q=a=null,f.extend(b,i)}),b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){return a=a.nodeType?f.cache[a[f.expando]]:a[f.expando],!!a&&!m(a)},data:function(a,c,d,e){if(!f.acceptData(a))return;var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);return g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d),o&&!h[c]?g.events:(k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h,i)},removeData:function(a,b,c){if(!f.acceptData(a))return;var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h=null;if(typeof a=="undefined"){if(this.length){h=f.data(this[0]);if(this[0].nodeType===1&&!f._data(this[0],"parsedAttrs")){e=this[0].attributes;for(var i=0,j=e.length;i<j;i++)g=e[i].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),l(this[0],g,h[g]));f._data(this[0],"parsedAttrs",!0)}}return h}return typeof a=="object"?this.each(function(){f.data(this,a)}):(d=a.split("."),d[1]=d[1]?"."+d[1]:"",c===b?(h=this.triggerHandler("getData"+d[1]+"!",[d[0]]),h===b&&this.length&&(h=f.data(this[0],a),h=l(this[0],a,h)),h===b&&d[1]?this.data(d[0]):h):this.each(function(){var b=f(this),e=[d[0],c];b.triggerHandler("setData"+d[1]+"!",e),f.data(this,a,c),b.triggerHandler("changeData"+d[1]+"!",e)}))},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){return typeof a!="string"&&(c=a,a="fx"),c===b?f.queue(this[0],a):this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){return a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);return m(),d.promise()}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){return a=f.propFix[a]||a,this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";return f.isFunction(a)?this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)}):this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];if(!arguments.length){if(g)return c=f.valHooks[g.nodeName.toLowerCase()]||f.valHooks[g.type],c&&"get"in c&&(d=c.get(g,"value"))!==b?d:(d=g.value,typeof d=="string"?d.replace(q,""):d==null?"":d);return}return e=f.isFunction(a),this.each(function(d){var g=f(this),h;if(this.nodeType!==1)return;e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h})}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}return j&&!h.length&&i.length?f(i[g]).val():h},set:function(a,b){var c=f.makeArray(b);return f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1),c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!a||j===3||j===8||j===2)return;if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}return h&&"set"in h&&i&&(g=h.set(a,d,c))!==b?g:(a.setAttribute(c,""+d),d)}return h&&"get"in h&&i&&(g=h.get(a,c))!==null?g:(g=a.getAttribute(c),g===null?b:g)},removeAttr:function(a,b){var c,d,e,g,h=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;h<g;h++)e=d[h],e&&(c=f.propFix[e]||e,f.attr(a,e,""),a.removeAttribute(v?e:c),u.test(e)&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}},value:{get:function(a,b){return w&&f.nodeName(a,"button")?w.get(a,b):b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!a||i===3||i===8||i===2)return;return h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]),d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;return b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase())),c}},v||(y={name:!0,id:!0},w=f.valHooks.button={get:function(a,c){var d;return d=a.getAttributeNode(c),d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);return e||(e=c.createAttribute(d),a.setAttributeNode(e)),e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c==="")return a.setAttribute(b,"auto"),c}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/\bhover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(a){var b=F.exec(a);return b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)")),b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};f.event={add:function(a,c,d,e,g){var h,i,j,k,l,
m,n,o,p,q,r,s;if(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))return;d.handler&&(p=d,d=p.handler),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f=="undefined"||!!a&&f.event.triggered===a.type?b:f.event.dispatch.apply(i.elem,arguments)},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!g||!(o=g.events))return;b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();return c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n)),c.result}return},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=[],j,k,l,m,n,o,p,q,r,s,t;g[0]=c,c.delegateTarget=this;if(e&&!c.target.disabled&&(!c.button||c.type!=="click")){m=f(this),m.context=this.ownerDocument||this;for(l=c.target;l!=this;l=l.parentNode||this){o={},q=[],m[0]=l;for(j=0;j<e;j++)r=d[j],s=r.selector,o[s]===b&&(o[s]=r.quick?H(l,r.quick):m.is(s)),o[s]&&q.push(r);q.length&&i.push({elem:l,matches:q})}}d.length>e&&i.push({elem:this,matches:d.slice(e)});for(j=0;j<i.length&&!c.isPropagationStopped();j++){p=i[j],c.currentTarget=p.elem;for(k=0;k<p.matches.length&&!c.isImmediatePropagationStopped();k++){r=p.matches[k];if(h||!c.namespace&&!r.namespace||c.namespace_re&&c.namespace_re.test(r.namespace))c.data=r.data,c.handleObj=r,n=((f.event.special[r.origType]||{}).handle||r.handler).apply(p.elem,g),n!==b&&(c.result=n,n===!1&&(c.preventDefault(),c.stopPropagation()))}}return c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;return a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0),a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];return a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey),h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(this instanceof f.Event)a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0;else return new f.Event(a,b)},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;if(!a)return;a.preventDefault?a.preventDefault():a.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;if(!a)return;a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0)}),d._submit_attached=!0)})},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){return f.event.remove(this,"._change"),z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;return g===1&&(h=e,e=function(a){return f().off(a),h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++)),this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on.call(this,a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;return f(a.delegateTarget).off(e.namespace?e.type+"."+e.namespace:e.type,e.selector,e.handler),this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;return d===!1&&(d=J),this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){return f(this.context).on(a,this.selector,b,c),this},die:function(a,b){return f(this.context).off(a,this.selector||"**",b),this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;return f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault(),b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){return c==null&&(c=a,a=null),arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){return i=!1,0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length!==1||w[0]!=="~"&&w[0]!=="+"||!d.parentNode?d:d.parentNode,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);return l&&(m(l,h,e,f),m.uniqueSort(e)),e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}return d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]),{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);return a[0]=e++,a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");return!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" "),a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);return d||e.push.apply(e,g),!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){return a.unshift(!0),a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}return j=a.nodeIndex-e,c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));var s=function(a,b){return a=Array.prototype.slice.call(a,0),b?(b.push.apply(b,a),b):a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){return a===b?(h=!0,0):!a.compareDocumentPosition||!b.compareDocumentPosition?a.compareDocumentPosition?-1:1:a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b)return h=!0,0;if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(b.querySelectorAll&&b.querySelectorAll(".TEST").length===0)return;m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!a.getElementsByClassName||a.getElementsByClassName("e").length===0)return;a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.POS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}return c=c.length>1?f.unique(c):c,this.pushStack(c,"closest",a)},index:function(a){return a?typeof a=="string"?f.inArray(this[0],f(a)):f.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);return L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse()),this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){return c&&(a=":not("+a+")"),b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){return f.isFunction(a)?this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))}):typeof a!="object"&&a!==b?this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a)):f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return f.isFunction(a)?this.each(function(b){f(this).wrapInner(a.call(this,b))}):this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f.clean(arguments);return a.push.apply(a,this.toArray()),this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);return a.push.apply(a,f.clean(arguments)),a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*")
);while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){return a=a==null?!1:a,b=b==null?a:b,this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){return this[0]&&this[0].parentNode?f.isFunction(a)?this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))}):(typeof a!="string"&&(a=f(a).detach()),this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})):this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bp)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];return b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1),{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1)return e[b](this[0]),this;for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||!bc.test("<"+a.nodeName)?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}return d=e=null,h},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!_.test(k))k=b.createTextNode(k);else{k=k.replace(Y,"<$1></$2>");var l=(Z.exec(k)||["",""])[1].toLowerCase(),m=bg[l]||bg._default,n=m[0],o=b.createElement("div");b===c?bh.appendChild(o):U(b).appendChild(o),o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=$.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&X.test(k)&&o.insertBefore(b.createTextNode(X.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bn(k[i]);else bn(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||be.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bq=/alpha\([^)]*\)/i,br=/opacity=([^)]*)/,bs=/([A-Z]|^ms)/g,bt=/^-?\d+(?:px)?$/i,bu=/^-?\d/,bv=/^([\-+])=([\-+.\de]+)/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Left","Right"],by=["Top","Bottom"],bz,bA,bB;f.fn.css=function(a,c){return arguments.length===2&&c===b?this:f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bz(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!a||a.nodeType===3||a.nodeType===8||!a.style)return;var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b)return k&&"get"in k&&(g=k.get(a,!1,e))!==b?g:j[c];h=typeof d,h==="string"&&(g=bv.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bz)return bz(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c)return a.offsetWidth!==0?bC(a,b,d):(f.swap(a,bw,function(){e=bC(a,b,d)}),e)},set:function(a,b){if(!bt.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return br.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bq,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bq.test(g)?g.replace(bq,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;return f.swap(a,{display:"inline-block"},function(){b?c=bz(a,"margin-right","marginRight"):c=a.style.marginRight}),c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bA=function(a,b){var c,d,e;return b=b.replace(bs,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b))),c}),c.documentElement.currentStyle&&(bB=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;return f===null&&g&&(e=g[b])&&(f=e),!bt.test(f)&&bu.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f||0,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d)),f===""?"auto":f}),bz=bA||bB,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bD=/%20/g,bE=/\[\]$/,bF=/\r?\n/g,bG=/#.*$/,bH=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bI=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bJ=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bK=/^(?:GET|HEAD)$/,bL=/^\/\//,bM=/\?/,bN=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bO=/^(?:select|textarea)/i,bP=/\s+/,bQ=/([?&])_=[^&]*/,bR=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bS=f.fn.load,bT={},bU={},bV,bW,bX=["*/"]+["*"];try{bV=e.href}catch(bY){bV=c.createElement("a"),bV.href="",bV=bV.href}bW=bR.exec(bV.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bS)return bS.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;return f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bN,"")).find(g):c)),d&&i.each(d,[c,b,a])}}),this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bO.test(this.nodeName)||bI.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bF,"\r\n")}}):{name:b.name,value:c.replace(bF,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){return f.isFunction(d)&&(g=g||e,e=d,d=b),f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){return b?b_(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b_(a,b),a},ajaxSettings:{url:bV,isLocal:bJ.test(bW[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bX},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bZ(bT),ajaxTransport:bZ(bU),ajax:function(a,c){function w(a,c,l,m){if(s===2)return;s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?cb(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cc(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bH.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){return s||(d.mimeType=a),this},abort:function(a){return a=a||"abort",p&&p.abort(a),w(0,a),this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bG,"").replace(bL,bW[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bP),d.crossDomain==null&&(r=bR.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bW[1]&&r[2]==bW[2]&&(r[3]||(r[1]==="http:"?80:443))==(bW[3]||(bW[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),b$(bT,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bK.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bM.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bQ,"$1_="+x);d.url=y+(y===d.url?(bM.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bX+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(!d.beforeSend||d.beforeSend.call(e,v,d)!==!1&&s!==2){for(u in{success:1,error:1,complete:1})v[u](d[u]);p=b$(bU,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v}return v.abort(),!1},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)ca(g,a[g],c,e);return d.join("&").replace(bD,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cd=f.now(),ce=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cd++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ce.test(b.url)||e&&ce.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";return b.jsonp!==!1&&(j=j.replace(ce,l),b.url===j&&(e&&(k=k.replace(ce,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){return g||f.error(h+" was not called"),g[0]},b.dataTypes[0]="json","script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){return f.globalEval(a),a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cf=a.ActiveXObject?function(){for(var a in ch)ch[a](0,1)}:!1,cg=0,ch;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ci()||cj()}:ci,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cf&&delete ch[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cg,cf&&(ch||(ch={},f(a).unload(cf)),ch[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var ck={},cl,cm,cn=/^(?:toggle|show|hide)$/,co=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cp,cq=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cr;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cu("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cv(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cu("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";return f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cu("toggle",3),a,b,c),this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cv(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cn.test(h)?(o=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),o?(f._data(this,"toggle"+i,o==="show"?"hide":"show"),j[o]()):j[h]()):(k=co.exec(h),l=j.cur(),k?(m=parseFloat(k[2]),n=k[3]||(f.cssNumber[i]?"":"px"),n!=="px"&&(f.style(this,i,(m||1)+n),l=(m||1)/j.cur()*l,f.style(this,i,l+n)),k[1]&&(m=(k[1]==="-="?-1:1)*m+l),j.custom(l,m,n)):j.custom(l,h,""));return!0}var e=f.speed(b,c,d);return f.isEmptyObject(a)?this.each(e.complete,[!1]):(a=f.extend({},a),e.queue===!1?this.each(g):this.queue(e.queue,g))},stop:function(a,c,d){return typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:cu("show",1),slideUp:cu("hide",1),slideToggle:cu("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";return d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)},d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]==null||!!this.elem.style&&this.elem.style[this.prop]!=null){var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a}return this.elem[this.prop]},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cr||cs(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){e.options.hide&&f._data(e.elem,"fxshow"+e.prop)===b&&f._data(e.elem,"fxshow"+e.prop,e.start)},h()&&f.timers.push(h)&&!cp&&(cp=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cr||cs(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}return i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update(),!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cp),cp=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(["width","height"],function(a,b){f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cy(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.support.fixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;return f.support.fixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft)),{top:l,left:m}},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;return f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0),{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();return c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0,{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;return c===b?(e=this[0],e?(g=cy(e),g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]):null):this.each(function(){g=cy(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,d,"padding")):this[d]():null},f.fn["outer"+c]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,d,a?"margin":"border")):this[d]():null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNumeric(j)?j:i}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);;

//     Underscore.js 1.3.1
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.3.1';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      if (index == 0) {
        shuffled[0] = value;
      } else {
        rand = Math.floor(Math.random() * (index + 1));
        shuffled[index] = shuffled[rand];
        shuffled[rand] = value;
      }
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return slice.call(iterable);
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var result = [];
    _.reduce(initial, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) {
        memo[memo.length] = el;
        result[result.length] = array[i];
      }
      return memo;
    }, []);
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        func.apply(context, args);
      }
      whenDone();
      throttling = true;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.escape || noMatch, function(match, code) {
           return "',_.escape(" + unescape(code) + "),'";
         })
         .replace(c.interpolate || noMatch, function(match, code) {
           return "'," + unescape(code) + ",'";
         })
         .replace(c.evaluate || noMatch, function(match, code) {
           return "');" + unescape(code).replace(/[\r\n\t]/g, ' ') + ";__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', '_', tmpl);
    if (data) return func(data, _);
    return function(data) {
      return func.call(this, data, _);
    };
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var wrapped = this._wrapped;
      method.apply(wrapped, arguments);
      var length = wrapped.length;
      if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
      return result(wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);
;

//     Backbone.js 0.9.1

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `global`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to slice/splice.
  var slice = Array.prototype.slice;
  var splice = Array.prototype.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.9.1';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
  var $ = root.jQuery || root.Zepto || root.ender;

  // Set the JavaScript library that will be used for DOM manipulation and
  // Ajax calls (a.k.a. the `$` variable). By default Backbone will use: jQuery,
  // Zepto, or Ender; but the `setDomLibrary()` method lets you inject an
  // alternate JavaScript library (or a mock library for testing your views
  // outside of a browser).
  Backbone.setDomLibrary = function(lib) {
    $ = lib;
  };

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback functions
  // to an event; trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  Backbone.Events = {

    // Bind an event, specified by a string name, `ev`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    on: function(events, callback, context) {
      var ev;
      events = events.split(/\s+/);
      var calls = this._callbacks || (this._callbacks = {});
      while (ev = events.shift()) {
        // Create an immutable callback list, allowing traversal during
        // modification.  The tail is an empty object that will always be used
        // as the next node.
        var list  = calls[ev] || (calls[ev] = {});
        var tail = list.tail || (list.tail = list.next = {});
        tail.callback = callback;
        tail.context = context;
        list.tail = tail.next = {};
      }
      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `ev` is null, removes all bound callbacks for all events.
    off: function(events, callback, context) {
      var ev, calls, node;
      if (!events) {
        delete this._callbacks;
      } else if (calls = this._callbacks) {
        events = events.split(/\s+/);
        while (ev = events.shift()) {
          node = calls[ev];
          delete calls[ev];
          if (!callback || !node) continue;
          // Create a new list, omitting the indicated event/context pairs.
          while ((node = node.next) && node.next) {
            if (node.callback === callback &&
              (!context || node.context === context)) continue;
            this.on(ev, node.callback, node.context);
          }
        }
      }
      return this;
    },

    // Trigger an event, firing all bound callbacks. Callbacks are passed the
    // same arguments as `trigger` is, apart from the event name.
    // Listening for `"all"` passes the true event name as the first argument.
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) return this;
      all = calls['all'];
      (events = events.split(/\s+/)).push(null);
      // Save references to the current heads & tails.
      while (event = events.shift()) {
        if (all) events.push({next: all.next, tail: all.tail, event: event});
        if (!(node = calls[event])) continue;
        events.push({next: node.next, tail: node.tail});
      }
      // Traverse each list, stopping when the saved tail is reached.
      rest = slice.call(arguments, 1);
      while (node = events.pop()) {
        tail = node.tail;
        args = node.event ? [node.event].concat(rest) : rest;
        while ((node = node.next) !== tail) {
          node.callback.apply(node.context || this, args);
        }
      }
      return this;
    }

  };

  // Aliases for backwards compatibility.
  Backbone.Events.bind   = Backbone.Events.on;
  Backbone.Events.unbind = Backbone.Events.off;

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (options && options.parse) attributes = this.parse(attributes);
    if (defaults = getValue(this, 'defaults')) {
      attributes = _.extend({}, defaults, attributes);
    }
    if (options && options.collection) this.collection = options.collection;
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    if (!this.set(attributes, {silent: true})) {
      throw new Error("Can't create an invalid model");
    }
    delete this._changed;
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Backbone.Model.prototype, Backbone.Events, {

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function() {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.attributes[attr];
      return this._escapedAttributes[attr] = _.escape(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.attributes[attr] != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    set: function(key, value, options) {
      var attrs, attr, val;
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs instanceof Backbone.Model) attrs = attrs.attributes;
      if (options.unset) for (attr in attrs) attrs[attr] = void 0;

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      var now = this.attributes;
      var escaped = this._escapedAttributes;
      var prev = this._previousAttributes || {};
      var alreadySetting = this._setting;
      this._changed || (this._changed = {});
      this._setting = true;

      // Update attributes.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(now[attr], val)) delete escaped[attr];
        options.unset ? delete now[attr] : now[attr] = val;
        if (this._changing && !_.isEqual(this._changed[attr], val)) {
          this.trigger('change:' + attr, this, val, options);
          this._moreChanges = true;
        }
        delete this._changed[attr];
        if (!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
          this._changed[attr] = val;
        }
      }

      // Fire the `"change"` events, if the model has been changed.
      if (!alreadySetting) {
        if (!options.silent && this.hasChanged()) this.change(options);
        this._setting = false;
      }
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset: function(attr, options) {
      (options || (options = {})).unset = true;
      return this.set(attr, null, options);
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear: function(options) {
      (options || (options = {})).unset = true;
      return this.set(_.clone(this.attributes), options);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = Backbone.wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, value, options) {
      var attrs, current;
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      options = options ? _.clone(options) : {};
      if (options.wait) current = _.clone(this.attributes);
      var silentOptions = _.extend({}, options, {silent: true});
      if (attrs && !this.set(attrs, options.wait ? silentOptions : options)) {
        return false;
      }
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        var serverAttrs = model.parse(resp, xhr);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (!model.set(serverAttrs, options)) return false;
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };
      options.error = Backbone.wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
      if (options.wait) this.set(current, silentOptions);
      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var triggerDestroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      if (this.isNew()) return triggerDestroy();
      options.success = function(resp) {
        if (options.wait) triggerDestroy();
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };
      options.error = Backbone.wrapError(options.error, model, options);
      var xhr = (this.sync || Backbone.sync).call(this, 'delete', this, options);
      if (!options.wait) triggerDestroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = getValue(this.collection, 'url') || getValue(this, 'urlRoot') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Call this method to manually fire a `"change"` event for this model and
    // a `"change:attribute"` event for each changed attribute.
    // Calling this will cause all objects observing the model to update.
    change: function(options) {
      if (this._changing || !this.hasChanged()) return this;
      this._changing = true;
      this._moreChanges = true;
      for (var attr in this._changed) {
        this.trigger('change:' + attr, this, this._changed[attr], options);
      }
      while (this._moreChanges) {
        this._moreChanges = false;
        this.trigger('change', this, options);
      }
      this._previousAttributes = _.clone(this.attributes);
      delete this._changed;
      this._changing = false;
      return this;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (!arguments.length) return !_.isEmpty(this._changed);
      return this._changed && _.has(this._changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this._changed) : false;
      var val, changed = false, old = this._previousAttributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (!arguments.length || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Check if the model is currently in a valid state. It's only possible to
    // get into an *invalid* state if you're using silent changes.
    isValid: function() {
      return !this.validate(this.attributes);
    },

    // Run validation against a set of incoming attributes, returning `true`
    // if all is well. If a specific `error` callback has been passed,
    // call that instead of firing the general `"error"` event.
    _validate: function(attrs, options) {
      if (options.silent || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validate(attrs, options);
      if (!error) return true;
      if (options && options.error) {
        options.error(this, error, options);
      } else {
        this.trigger('error', this, error, options);
      }
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.comparator) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, {silent: true, parse: options.parse});
  };

  // Define the Collection's inheritable methods.
  _.extend(Backbone.Collection.prototype, Backbone.Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Backbone.Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `add` event for every new model.
    add: function(models, options) {
      var i, index, length, model, cid, id, cids = {}, ids = {};
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];

      // Begin by turning bare objects into model references, and preventing
      // invalid models or duplicate models from being added.
      for (i = 0, length = models.length; i < length; i++) {
        if (!(model = models[i] = this._prepareModel(models[i], options))) {
          throw new Error("Can't add an invalid model to a collection");
        }
        if (cids[cid = model.cid] || this._byCid[cid] ||
          (((id = model.id) != null) && (ids[id] || this._byId[id]))) {
          throw new Error("Can't add the same model to a collection twice");
        }
        cids[cid] = ids[id] = model;
      }

      // Listen to added models' events, and index models for lookup by
      // `id` and by `cid`.
      for (i = 0; i < length; i++) {
        (model = models[i]).on('all', this._onModelEvent, this);
        this._byCid[model.cid] = model;
        if (model.id != null) this._byId[model.id] = model;
      }

      // Insert models into the collection, re-sorting if needed, and triggering
      // `add` events unless silenced.
      this.length += length;
      index = options.at != null ? options.at : this.models.length;
      splice.apply(this.models, [index, 0].concat(models));
      if (this.comparator) this.sort({silent: true});
      if (options.silent) return this;
      for (i = 0, length = this.models.length; i < length; i++) {
        if (!cids[(model = this.models[i]).cid]) continue;
        options.index = i;
        model.trigger('add', model, this, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `remove` event for every model removed.
    remove: function(models, options) {
      var i, l, index, model;
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];
      for (i = 0, l = models.length; i < l; i++) {
        model = this.getByCid(models[i]) || this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byCid[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Get a model from the set by id.
    get: function(id) {
      if (id == null) return null;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid: function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      var boundComparator = _.bind(this.comparator, this);
      if (this.comparator.length == 1) {
        this.models = this.sortBy(boundComparator);
      } else {
        this.models.sort(boundComparator);
      }
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `add` or `remove` events. Fires `reset` when finished.
    reset: function(models, options) {
      models  || (models = []);
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      this._reset();
      this.add(models, {silent: true, parse: options.parse});
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === undefined) options.parse = true;
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = Backbone.wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      var coll = this;
      options = options ? _.clone(options) : {};
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!options.wait) coll.add(model, options);
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        if (options.wait) coll.add(nextModel, options);
        if (success) {
          success(nextModel, resp);
        } else {
          nextModel.trigger('sync', model, resp, options);
        }
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset: function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model or hash of attributes to be added to this collection.
    _prepareModel: function(model, options) {
      if (!(model instanceof Backbone.Model)) {
        var attrs = model;
        options.collection = this;
        model = new this.model(attrs, options);
        if (!model._validate(model.attributes, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference: function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(ev, model, collection, options) {
      if ((ev == 'add' || ev == 'remove') && collection != this) return;
      if (ev == 'destroy') {
        this.remove(model, options);
      }
      if (model && ev === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Backbone.Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Backbone.Router.prototype, Backbone.Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      Backbone.history || (Backbone.history = new Backbone.History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (!callback) callback = this[name];
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback && callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
        Backbone.history.trigger('route', this, name, args);
      }, this));
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(namedParam, '([^\/]+)')
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters: function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning leading hashes and slashes .
  var routeStripper = /^[#\/]/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  var historyStarted = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(Backbone.History.prototype, Backbone.Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
        } else {
          fragment = window.location.hash;
        }
      }
      fragment = decodeURIComponent(fragment);
      if (!fragment.indexOf(this.options.root)) fragment = fragment.substr(this.options.root.length);
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      if (historyStarted) throw new Error("Backbone.history has already been started");
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      historyStarted = true;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = loc.hash.replace(routeStripper, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      $(window).unbind('popstate', this.checkUrl).unbind('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      historyStarted = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.iframe.location.hash);
      if (current == this.fragment || current == decodeURIComponent(this.fragment)) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(window.location.hash);
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you which to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!historyStarted) return false;
      if (!options || options === true) options = {trigger: options};
      var frag = (fragment || '').replace(routeStripper, '');
      if (this.fragment == frag || this.fragment == decodeURIComponent(frag)) return;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, frag);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this.fragment = frag;
        this._updateHash(window.location, frag, options.replace);
        if (this.iframe && (frag != this.getFragment(this.iframe.location.hash))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a history entry on hash-tag change.
          // When replace is true, we don't want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, frag, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        window.location.assign(this.options.root + fragment);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        location.replace(location.toString().replace(/(javascript:|#).*$/, '') + '#' + fragment);
      } else {
        location.hash = fragment;
      }
    }
  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var eventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(Backbone.View.prototype, Backbone.Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove: function() {
      this.$el.remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make: function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      this.$el = $(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = getValue(this, 'events')))) return;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) throw new Error('Event "' + events[key] + '" does not exist');
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.bind(eventName, method);
        } else {
          this.$el.delegate(selector, eventName, method);
        }
      }
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.unbind('.delegateEvents' + this.cid);
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure: function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = getValue(this, 'attributes') || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.setElement(this.make(this.tagName, attrs), false);
      } else {
        this.setElement(this.el, false);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Backbone.Model.extend = Backbone.Collection.extend =
    Backbone.Router.extend = Backbone.View.extend = extend;

  // Backbone.sync
  // -------------

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = getValue(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(_.extend(params, options));
  };

  // Wrap an optional error callback with a fallback error event.
  Backbone.wrapError = function(onError, originalModel, options) {
    return function(model, resp) {
      resp = model === originalModel ? resp : model;
      if (onError) {
        onError(originalModel, resp, options);
      } else {
        originalModel.trigger('error', originalModel, resp, options);
      }
    };
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

}).call(this);;

/**
 * |-------------------|
 * | Backbone-Mediator |
 * |-------------------|
 *  Backbone-Mediator is freely distributable under the MIT license.
 *
 *  <a href="https://github.com/chalbert/Backbone-Mediator">More details & documentation</a>
 *
 * @author Nicolas Gilbert
 *
 * @requires _
 * @requires Backbone
 */
(function(factory){
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], factory);
  } else {
    factory(_, Backbone);
  }

})(function (_, Backbone){
  'use strict';

  /**
   * @static
   */
  var channels = {},
      Subscriber,
      /** @borrows Backbone.View#delegateEvents */
      delegateEvents = Backbone.View.prototype.delegateEvents,
      /** @borrows Backbone.View#delegateEvents */
      undelegateEvents = Backbone.View.prototype.undelegateEvents;

  /**
   * @class
   */
  Backbone.Mediator = {

    /**
     * Subscribe to a channel
     *
     * @param channel
     */
    subscribe: function(channel, subscription, context, once) {
      if (!channels[channel]) channels[channel] = [];
      channels[channel].push({fn: subscription, context: context || this, once: once});
    },

    /**
     * Trigger all callbacks for a channel
     *
     * @param channel
     * @params N Extra parametter to pass to handler
     */
    publish: function(channel) {
      if (!channels[channel]) return;

      var args = [].slice.call(arguments, 1),
          subscription;

      for (var i = 0; i < channels[channel].length; i++) {
        subscription = channels[channel][i];
        subscription.fn.apply(subscription.context, args);
        if (subscription.once) {
          Backbone.Mediator.unsubscribe(channel, subscription.fn, subscription.context);
          i--;
        }
      }
    },

    /**
     * Cancel subscription
     *
     * @param channel
     * @param fn
     * @param context
     */

    unsubscribe: function(channel, fn, context){
      if (!channels[channel]) return;

      var subscription;
      for (var i = 0; i < channels[channel].length; i++) {
        subscription = channels[channel][i];
        if (subscription.fn === fn && subscription.context === context) {
          channels[channel].splice(i, 1);
          i--;
        }
      }
    },

    /**
     * Subscribing to one event only
     *
     * @param channel
     * @param subscription
     * @param context
     */
    subscribeOnce: function (channel, subscription, context) {
      Backbone.Mediator.subscribe(channel, subscription, context, true);
    }

  };

  /**
   * Allow to define convention-based subscriptions
   * as an 'subscriptions' hash on a view. Subscriptions
   * can then be easily setup and cleaned.
   *
   * @class
   */


  Subscriber = {

    /**
     * Extend delegateEvents() to set subscriptions
     */
    delegateEvents: function(){
      delegateEvents.apply(this, arguments);
      this.setSubscriptions();
    },

    /**
     * Extend undelegateEvents() to unset subscriptions
     */
    undelegateEvents: function(){
      undelegateEvents.apply(this, arguments);
      this.unsetSubscriptions();
    },

    /** @property {Object} List of subscriptions, to be defined */
    subscriptions: {},

    /**
     * Subscribe to each subscription
     * @param {Object} [subscriptions] An optional hash of subscription to add
     */

    setSubscriptions: function(subscriptions){
      if (subscriptions) _.extend(this.subscriptions || {}, subscriptions);
      subscriptions = subscriptions || this.subscriptions;
      if (!subscriptions || _.isEmpty(subscriptions)) return;
      // Just to be sure we don't set duplicate
      this.unsetSubscriptions(subscriptions);

      _.each(subscriptions, function(subscription, channel){
        var once;
        if (subscription.$once) {
          subscription = subscription.$once;
          once = true;
        }
        if (_.isString(subscription)) {
          subscription = this[subscription];
        }
        Backbone.Mediator.subscribe(channel, subscription, this, once);
      }, this);
    },

    /**
     * Unsubscribe to each subscription
     * @param {Object} [subscriptions] An optional hash of subscription to remove
     */
    unsetSubscriptions: function(subscriptions){
      subscriptions = subscriptions || this.subscriptions;
      if (!subscriptions || _.isEmpty(subscriptions)) return;
      _.each(subscriptions, function(subscription, channel){
        if (_.isString(subscription)) {
          subscription = this[subscription];
        }
        Backbone.Mediator.unsubscribe(channel, subscription.$once || subscription, this);
      }, this);
    }
  };

  /**
   * @lends Backbone.View.prototype
   */
  _.extend(Backbone.View.prototype, Subscriber);

  /**
   * @lends Backbone.Mediator
   */
  _.extend(Backbone.Mediator, {
    /**
     * Shortcut for publish
     * @function
     */
    pub: Backbone.Mediator.publish,
    /**
     * Shortcut for subscribe
     * @function
     */
    sub: Backbone.Mediator.subscribe
  });

  return Backbone;

});;

/* ===================================================
 * bootstrap-transition.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close)
  })

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.parent('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON DATA-API
  * =============== */

  $(function () {
    $('body').on('click.button.data-api', '[data-toggle^=button]', function ( e ) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      $btn.button('toggle')
    })
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.item.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle()
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e = $.Event('slide', {
            relatedTarget: $next[0]
          })

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $(function () {
    $('body').on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
      var $this = $(this), href
        , target = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        , option = $(target).data('collapse') ? 'toggle' : $this.data()
      $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
      $(target).collapse(option)
    })
  })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        $parent.toggleClass('open')
        $this.focus()
      }

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) return $this.click()

      $items = $('[role=menu] li:not(.divider) a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    getParent($(toggle))
      .removeClass('open')
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)
    $parent.length || ($parent = $this.parent())

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html')
      .on('click.dropdown.data-api touchstart.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown touchstart.dropdown.data-api', '.dropdown', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api touchstart.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
      .on('keydown.dropdown.data-api touchstart.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)
  })

}(window.jQuery);/* =========================================================
 * bootstrap-modal.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)
            .focus()

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function (that) {
        this.$element
          .hide()
          .trigger('hidden')

        this.backdrop()
      }

    , removeBackdrop: function () {
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          if (this.options.backdrop != 'static') {
            this.$backdrop.click($.proxy(this.hide, this))
          }

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) :
            this.removeBackdrop()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this)
        , href = $this.attr('href')
        , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

      e.preventDefault()

      $target
        .modal(option)
        .one('hide', function () {
          $this.focus()
        })
    })
  })

}(window.jQuery);/* ===========================================================
 * bootstrap-tooltip.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (this.options.trigger != 'manual') {
        eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  , html: true
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(window.jQuery);/* =============================================================
 * bootstrap-scrollspy.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = !~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /*   TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window).on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);;


jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    ac = ac.filter(nulls);
    bc = bc.filter(nulls);
    a['class'] = ac.concat(bc).join(' ');
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function nulls(val) {
  return val != null;
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

  return exports;

})({});
;

/*!
 * jQuery UI 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */(function(a,b){function d(b){return!a(b).parents().andSelf().filter(function(){return a.curCSS(this,"visibility")==="hidden"||a.expr.filters.hidden(this)}).length}function c(b,c){var e=b.nodeName.toLowerCase();if("area"===e){var f=b.parentNode,g=f.name,h;if(!b.href||!g||f.nodeName.toLowerCase()!=="map")return!1;h=a("img[usemap=#"+g+"]")[0];return!!h&&d(h)}return(/input|select|textarea|button|object/.test(e)?!b.disabled:"a"==e?b.href||c:c)&&d(b)}a.ui=a.ui||{};a.ui.version||(a.extend(a.ui,{version:"1.8.18",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}}),a.fn.extend({propAttr:a.fn.prop||a.fn.attr,_focus:a.fn.focus,focus:function(b,c){return typeof b=="number"?this.each(function(){var d=this;setTimeout(function(){a(d).focus(),c&&c.call(d)},b)}):this._focus.apply(this,arguments)},scrollParent:function(){var b;a.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?b=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(a.curCSS(this,"position",1))&&/(auto|scroll)/.test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0):b=this.parents().filter(function(){return/(auto|scroll)/.test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!b.length?a(document):b},zIndex:function(c){if(c!==b)return this.css("zIndex",c);if(this.length){var d=a(this[0]),e,f;while(d.length&&d[0]!==document){e=d.css("position");if(e==="absolute"||e==="relative"||e==="fixed"){f=parseInt(d.css("zIndex"),10);if(!isNaN(f)&&f!==0)return f}d=d.parent()}}return 0},disableSelection:function(){return this.bind((a.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),a.each(["Width","Height"],function(c,d){function h(b,c,d,f){a.each(e,function(){c-=parseFloat(a.curCSS(b,"padding"+this,!0))||0,d&&(c-=parseFloat(a.curCSS(b,"border"+this+"Width",!0))||0),f&&(c-=parseFloat(a.curCSS(b,"margin"+this,!0))||0)});return c}var e=d==="Width"?["Left","Right"]:["Top","Bottom"],f=d.toLowerCase(),g={innerWidth:a.fn.innerWidth,innerHeight:a.fn.innerHeight,outerWidth:a.fn.outerWidth,outerHeight:a.fn.outerHeight};a.fn["inner"+d]=function(c){if(c===b)return g["inner"+d].call(this);return this.each(function(){a(this).css(f,h(this,c)+"px")})},a.fn["outer"+d]=function(b,c){if(typeof b!="number")return g["outer"+d].call(this,b);return this.each(function(){a(this).css(f,h(this,b,!0,c)+"px")})}}),a.extend(a.expr[":"],{data:function(b,c,d){return!!a.data(b,d[3])},focusable:function(b){return c(b,!isNaN(a.attr(b,"tabindex")))},tabbable:function(b){var d=a.attr(b,"tabindex"),e=isNaN(d);return(e||d>=0)&&c(b,!e)}}),a(function(){var b=document.body,c=b.appendChild(c=document.createElement("div"));c.offsetHeight,a.extend(c.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0}),a.support.minHeight=c.offsetHeight===100,a.support.selectstart="onselectstart"in c,b.removeChild(c).style.display="none"}),a.extend(a.ui,{plugin:{add:function(b,c,d){var e=a.ui[b].prototype;for(var f in d)e.plugins[f]=e.plugins[f]||[],e.plugins[f].push([c,d[f]])},call:function(a,b,c){var d=a.plugins[b];if(!!d&&!!a.element[0].parentNode)for(var e=0;e<d.length;e++)a.options[d[e][0]]&&d[e][1].apply(a.element,c)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(b,c){if(a(b).css("overflow")==="hidden")return!1;var d=c&&c==="left"?"scrollLeft":"scrollTop",e=!1;if(b[d]>0)return!0;b[d]=1,e=b[d]>0,b[d]=0;return e},isOverAxis:function(a,b,c){return a>b&&a<b+c},isOver:function(b,c,d,e,f,g){return a.ui.isOverAxis(b,d,f)&&a.ui.isOverAxis(c,e,g)}}))})(jQuery);/*!
 * jQuery UI Widget 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */(function(a,b){if(a.cleanData){var c=a.cleanData;a.cleanData=function(b){for(var d=0,e;(e=b[d])!=null;d++)try{a(e).triggerHandler("remove")}catch(f){}c(b)}}else{var d=a.fn.remove;a.fn.remove=function(b,c){return this.each(function(){c||(!b||a.filter(b,[this]).length)&&a("*",this).add([this]).each(function(){try{a(this).triggerHandler("remove")}catch(b){}});return d.call(a(this),b,c)})}}a.widget=function(b,c,d){var e=b.split(".")[0],f;b=b.split(".")[1],f=e+"-"+b,d||(d=c,c=a.Widget),a.expr[":"][f]=function(c){return!!a.data(c,b)},a[e]=a[e]||{},a[e][b]=function(a,b){arguments.length&&this._createWidget(a,b)};var g=new c;g.options=a.extend(!0,{},g.options),a[e][b].prototype=a.extend(!0,g,{namespace:e,widgetName:b,widgetEventPrefix:a[e][b].prototype.widgetEventPrefix||b,widgetBaseClass:f},d),a.widget.bridge(b,a[e][b])},a.widget.bridge=function(c,d){a.fn[c]=function(e){var f=typeof e=="string",g=Array.prototype.slice.call(arguments,1),h=this;e=!f&&g.length?a.extend.apply(null,[!0,e].concat(g)):e;if(f&&e.charAt(0)==="_")return h;f?this.each(function(){var d=a.data(this,c),f=d&&a.isFunction(d[e])?d[e].apply(d,g):d;if(f!==d&&f!==b){h=f;return!1}}):this.each(function(){var b=a.data(this,c);b?b.option(e||{})._init():a.data(this,c,new d(e,this))});return h}},a.Widget=function(a,b){arguments.length&&this._createWidget(a,b)},a.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:!1},_createWidget:function(b,c){a.data(c,this.widgetName,this),this.element=a(c),this.options=a.extend(!0,{},this.options,this._getCreateOptions(),b);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()}),this._create(),this._trigger("create"),this._init()},_getCreateOptions:function(){return a.metadata&&a.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName),this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled "+"ui-state-disabled")},widget:function(){return this.element},option:function(c,d){var e=c;if(arguments.length===0)return a.extend({},this.options);if(typeof c=="string"){if(d===b)return this.options[c];e={},e[c]=d}this._setOptions(e);return this},_setOptions:function(b){var c=this;a.each(b,function(a,b){c._setOption(a,b)});return this},_setOption:function(a,b){this.options[a]=b,a==="disabled"&&this.widget()[b?"addClass":"removeClass"](this.widgetBaseClass+"-disabled"+" "+"ui-state-disabled").attr("aria-disabled",b);return this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_trigger:function(b,c,d){var e,f,g=this.options[b];d=d||{},c=a.Event(c),c.type=(b===this.widgetEventPrefix?b:this.widgetEventPrefix+b).toLowerCase(),c.target=this.element[0],f=c.originalEvent;if(f)for(e in f)e in c||(c[e]=f[e]);this.element.trigger(c,d);return!(a.isFunction(g)&&g.call(this.element[0],c,d)===!1||c.isDefaultPrevented())}}})(jQuery);/*!
 * jQuery UI Mouse 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */(function(a,b){var c=!1;a(document).mouseup(function(a){c=!1}),a.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var b=this;this.element.bind("mousedown."+this.widgetName,function(a){return b._mouseDown(a)}).bind("click."+this.widgetName,function(c){if(!0===a.data(c.target,b.widgetName+".preventClickEvent")){a.removeData(c.target,b.widgetName+".preventClickEvent"),c.stopImmediatePropagation();return!1}}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName)},_mouseDown:function(b){if(!c){this._mouseStarted&&this._mouseUp(b),this._mouseDownEvent=b;var d=this,e=b.which==1,f=typeof this.options.cancel=="string"&&b.target.nodeName?a(b.target).closest(this.options.cancel).length:!1;if(!e||f||!this._mouseCapture(b))return!0;this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){d.mouseDelayMet=!0},this.options.delay));if(this._mouseDistanceMet(b)&&this._mouseDelayMet(b)){this._mouseStarted=this._mouseStart(b)!==!1;if(!this._mouseStarted){b.preventDefault();return!0}}!0===a.data(b.target,this.widgetName+".preventClickEvent")&&a.removeData(b.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(a){return d._mouseMove(a)},this._mouseUpDelegate=function(a){return d._mouseUp(a)},a(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),b.preventDefault(),c=!0;return!0}},_mouseMove:function(b){if(a.browser.msie&&!(document.documentMode>=9)&&!b.button)return this._mouseUp(b);if(this._mouseStarted){this._mouseDrag(b);return b.preventDefault()}this._mouseDistanceMet(b)&&this._mouseDelayMet(b)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,b)!==!1,this._mouseStarted?this._mouseDrag(b):this._mouseUp(b));return!this._mouseStarted},_mouseUp:function(b){a(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,b.target==this._mouseDownEvent.target&&a.data(b.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(b));return!1},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(a){return this.mouseDelayMet},_mouseStart:function(a){},_mouseDrag:function(a){},_mouseStop:function(a){},_mouseCapture:function(a){return!0}})})(jQuery);/*
 * jQuery UI Position 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */(function(a,b){a.ui=a.ui||{};var c=/left|center|right/,d=/top|center|bottom/,e="center",f={},g=a.fn.position,h=a.fn.offset;a.fn.position=function(b){if(!b||!b.of)return g.apply(this,arguments);b=a.extend({},b);var h=a(b.of),i=h[0],j=(b.collision||"flip").split(" "),k=b.offset?b.offset.split(" "):[0,0],l,m,n;i.nodeType===9?(l=h.width(),m=h.height(),n={top:0,left:0}):i.setTimeout?(l=h.width(),m=h.height(),n={top:h.scrollTop(),left:h.scrollLeft()}):i.preventDefault?(b.at="left top",l=m=0,n={top:b.of.pageY,left:b.of.pageX}):(l=h.outerWidth(),m=h.outerHeight(),n=h.offset()),a.each(["my","at"],function(){var a=(b[this]||"").split(" ");a.length===1&&(a=c.test(a[0])?a.concat([e]):d.test(a[0])?[e].concat(a):[e,e]),a[0]=c.test(a[0])?a[0]:e,a[1]=d.test(a[1])?a[1]:e,b[this]=a}),j.length===1&&(j[1]=j[0]),k[0]=parseInt(k[0],10)||0,k.length===1&&(k[1]=k[0]),k[1]=parseInt(k[1],10)||0,b.at[0]==="right"?n.left+=l:b.at[0]===e&&(n.left+=l/2),b.at[1]==="bottom"?n.top+=m:b.at[1]===e&&(n.top+=m/2),n.left+=k[0],n.top+=k[1];return this.each(function(){var c=a(this),d=c.outerWidth(),g=c.outerHeight(),h=parseInt(a.curCSS(this,"marginLeft",!0))||0,i=parseInt(a.curCSS(this,"marginTop",!0))||0,o=d+h+(parseInt(a.curCSS(this,"marginRight",!0))||0),p=g+i+(parseInt(a.curCSS(this,"marginBottom",!0))||0),q=a.extend({},n),r;b.my[0]==="right"?q.left-=d:b.my[0]===e&&(q.left-=d/2),b.my[1]==="bottom"?q.top-=g:b.my[1]===e&&(q.top-=g/2),f.fractions||(q.left=Math.round(q.left),q.top=Math.round(q.top)),r={left:q.left-h,top:q.top-i},a.each(["left","top"],function(c,e){a.ui.position[j[c]]&&a.ui.position[j[c]][e](q,{targetWidth:l,targetHeight:m,elemWidth:d,elemHeight:g,collisionPosition:r,collisionWidth:o,collisionHeight:p,offset:k,my:b.my,at:b.at})}),a.fn.bgiframe&&c.bgiframe(),c.offset(a.extend(q,{using:b.using}))})},a.ui.position={fit:{left:function(b,c){var d=a(window),e=c.collisionPosition.left+c.collisionWidth-d.width()-d.scrollLeft();b.left=e>0?b.left-e:Math.max(b.left-c.collisionPosition.left,b.left)},top:function(b,c){var d=a(window),e=c.collisionPosition.top+c.collisionHeight-d.height()-d.scrollTop();b.top=e>0?b.top-e:Math.max(b.top-c.collisionPosition.top,b.top)}},flip:{left:function(b,c){if(c.at[0]!==e){var d=a(window),f=c.collisionPosition.left+c.collisionWidth-d.width()-d.scrollLeft(),g=c.my[0]==="left"?-c.elemWidth:c.my[0]==="right"?c.elemWidth:0,h=c.at[0]==="left"?c.targetWidth:-c.targetWidth,i=-2*c.offset[0];b.left+=c.collisionPosition.left<0?g+h+i:f>0?g+h+i:0}},top:function(b,c){if(c.at[1]!==e){var d=a(window),f=c.collisionPosition.top+c.collisionHeight-d.height()-d.scrollTop(),g=c.my[1]==="top"?-c.elemHeight:c.my[1]==="bottom"?c.elemHeight:0,h=c.at[1]==="top"?c.targetHeight:-c.targetHeight,i=-2*c.offset[1];b.top+=c.collisionPosition.top<0?g+h+i:f>0?g+h+i:0}}}},a.offset.setOffset||(a.offset.setOffset=function(b,c){/static/.test(a.curCSS(b,"position"))&&(b.style.position="relative");var d=a(b),e=d.offset(),f=parseInt(a.curCSS(b,"top",!0),10)||0,g=parseInt(a.curCSS(b,"left",!0),10)||0,h={top:c.top-e.top+f,left:c.left-e.left+g};"using"in c?c.using.call(b,h):d.css(h)},a.fn.offset=function(b){var c=this[0];if(!c||!c.ownerDocument)return null;if(b)return this.each(function(){a.offset.setOffset(this,b)});return h.call(this)}),function(){var b=document.getElementsByTagName("body")[0],c=document.createElement("div"),d,e,g,h,i;d=document.createElement(b?"div":"body"),g={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},b&&a.extend(g,{position:"absolute",left:"-1000px",top:"-1000px"});for(var j in g)d.style[j]=g[j];d.appendChild(c),e=b||document.documentElement,e.insertBefore(d,e.firstChild),c.style.cssText="position: absolute; left: 10.7432222px; top: 10.432325px; height: 30px; width: 201px;",h=a(c).offset(function(a,b){return b}).offset(),d.innerHTML="",e.removeChild(d),i=h.top+h.left+(b?2e3:0),f.fractions=i>21&&i<22}()})(jQuery);/*
 * jQuery UI Draggable 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */(function(a,b){a.widget("ui.draggable",a.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1},_create:function(){this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position"))&&(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},destroy:function(){if(!!this.element.data("draggable")){this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy();return this}},_mouseCapture:function(b){var c=this.options;if(this.helper||c.disabled||a(b.target).is(".ui-resizable-handle"))return!1;this.handle=this._getHandle(b);if(!this.handle)return!1;c.iframeFix&&a(c.iframeFix===!0?"iframe":c.iframeFix).each(function(){a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(a(this).offset()).appendTo("body")});return!0},_mouseStart:function(b){var c=this.options;this.helper=this._createHelper(b),this._cacheHelperProportions(),a.ui.ddmanager&&(a.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},a.extend(this.offset,{click:{left:b.pageX-this.offset.left,top:b.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(b),this.originalPageX=b.pageX,this.originalPageY=b.pageY,c.cursorAt&&this._adjustOffsetFromHelper(c.cursorAt),c.containment&&this._setContainment();if(this._trigger("start",b)===!1){this._clear();return!1}this._cacheHelperProportions(),a.ui.ddmanager&&!c.dropBehaviour&&a.ui.ddmanager.prepareOffsets(this,b),this.helper.addClass("ui-draggable-dragging"),this._mouseDrag(b,!0),a.ui.ddmanager&&a.ui.ddmanager.dragStart(this,b);return!0},_mouseDrag:function(b,c){this.position=this._generatePosition(b),this.positionAbs=this._convertPositionTo("absolute");if(!c){var d=this._uiHash();if(this._trigger("drag",b,d)===!1){this._mouseUp({});return!1}this.position=d.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";a.ui.ddmanager&&a.ui.ddmanager.drag(this,b);return!1},_mouseStop:function(b){var c=!1;a.ui.ddmanager&&!this.options.dropBehaviour&&(c=a.ui.ddmanager.drop(this,b)),this.dropped&&(c=this.dropped,this.dropped=!1);if((!this.element[0]||!this.element[0].parentNode)&&this.options.helper=="original")return!1;if(this.options.revert=="invalid"&&!c||this.options.revert=="valid"&&c||this.options.revert===!0||a.isFunction(this.options.revert)&&this.options.revert.call(this.element,c)){var d=this;a(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){d._trigger("stop",b)!==!1&&d._clear()})}else this._trigger("stop",b)!==!1&&this._clear();return!1},_mouseUp:function(b){this.options.iframeFix===!0&&a("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),a.ui.ddmanager&&a.ui.ddmanager.dragStop(this,b);return a.ui.mouse.prototype._mouseUp.call(this,b)},cancel:function(){this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear();return this},_getHandle:function(b){var c=!this.options.handle||!a(this.options.handle,this.element).length?!0:!1;a(this.options.handle,this.element).find("*").andSelf().each(function(){this==b.target&&(c=!0)});return c},_createHelper:function(b){var c=this.options,d=a.isFunction(c.helper)?a(c.helper.apply(this.element[0],[b])):c.helper=="clone"?this.element.clone().removeAttr("id"):this.element;d.parents("body").length||d.appendTo(c.appendTo=="parent"?this.element[0].parentNode:c.appendTo),d[0]!=this.element[0]&&!/(fixed|absolute)/.test(d.css("position"))&&d.css("position","absolute");return d},_adjustOffsetFromHelper:function(b){typeof b=="string"&&(b=b.split(" ")),a.isArray(b)&&(b={left:+b[0],top:+b[1]||0}),"left"in b&&(this.offset.click.left=b.left+this.margins.left),"right"in b&&(this.offset.click.left=this.helperProportions.width-b.right+this.margins.left),"top"in b&&(this.offset.click.top=b.top+this.margins.top),"bottom"in b&&(this.offset.click.top=this.helperProportions.height-b.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var b=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0])&&(b.left+=this.scrollParent.scrollLeft(),b.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&a.browser.msie)b={top:0,left:0};return{top:b.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:b.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.element.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var b=this.options;b.containment=="parent"&&(b.containment=this.helper[0].parentNode);if(b.containment=="document"||b.containment=="window")this.containment=[b.containment=="document"?0:a(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,b.containment=="document"?0:a(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(b.containment=="document"?0:a(window).scrollLeft())+a(b.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(b.containment=="document"?0:a(window).scrollTop())+(a(b.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(b.containment)&&b.containment.constructor!=Array){var c=a(b.containment),d=c[0];if(!d)return;var e=c.offset(),f=a(d).css("overflow")!="hidden";this.containment=[(parseInt(a(d).css("borderLeftWidth"),10)||0)+(parseInt(a(d).css("paddingLeft"),10)||0),(parseInt(a(d).css("borderTopWidth"),10)||0)+(parseInt(a(d).css("paddingTop"),10)||0),(f?Math.max(d.scrollWidth,d.offsetWidth):d.offsetWidth)-(parseInt(a(d).css("borderLeftWidth"),10)||0)-(parseInt(a(d).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(f?Math.max(d.scrollHeight,d.offsetHeight):d.offsetHeight)-(parseInt(a(d).css("borderTopWidth"),10)||0)-(parseInt(a(d).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=c}else b.containment.constructor==Array&&(this.containment=b.containment)},_convertPositionTo:function(b,c){c||(c=this.position);var d=b=="absolute"?1:-1,e=this.options,f=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,g=/(html|body)/i.test(f[0].tagName);return{top:c.top+this.offset.relative.top*d+this.offset.parent.top*d-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():g?0:f.scrollTop())*d),left:c.left+this.offset.relative.left*d+this.offset.parent.left*d-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():g?0:f.scrollLeft())*d)}},_generatePosition:function(b){var c=this.options,d=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(d[0].tagName),f=b.pageX,g=b.pageY;if(this.originalPosition){var h;if(this.containment){if(this.relative_container){var i=this.relative_container.offset();h=[this.containment[0]+i.left,this.containment[1]+i.top,this.containment[2]+i.left,this.containment[3]+i.top]}else h=this.containment;b.pageX-this.offset.click.left<h[0]&&(f=h[0]+this.offset.click.left),b.pageY-this.offset.click.top<h[1]&&(g=h[1]+this.offset.click.top),b.pageX-this.offset.click.left>h[2]&&(f=h[2]+this.offset.click.left),b.pageY-this.offset.click.top>h[3]&&(g=h[3]+this.offset.click.top)}if(c.grid){var j=c.grid[1]?this.originalPageY+Math.round((g-this.originalPageY)/c.grid[1])*c.grid[1]:this.originalPageY;g=h?j-this.offset.click.top<h[1]||j-this.offset.click.top>h[3]?j-this.offset.click.top<h[1]?j+c.grid[1]:j-c.grid[1]:j:j;var k=c.grid[0]?this.originalPageX+Math.round((f-this.originalPageX)/c.grid[0])*c.grid[0]:this.originalPageX;f=h?k-this.offset.click.left<h[0]||k-this.offset.click.left>h[2]?k-this.offset.click.left<h[0]?k+c.grid[0]:k-c.grid[0]:k:k}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:d.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:d.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(b,c,d){d=d||this._uiHash(),a.ui.plugin.call(this,b,[c,d]),b=="drag"&&(this.positionAbs=this._convertPositionTo("absolute"));return a.Widget.prototype._trigger.call(this,b,c,d)},plugins:{},_uiHash:function(a){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),a.extend(a.ui.draggable,{version:"1.8.18"}),a.ui.plugin.add("draggable","connectToSortable",{start:function(b,c){var d=a(this).data("draggable"),e=d.options,f=a.extend({},c,{item:d.element});d.sortables=[],a(e.connectToSortable).each(function(){var c=a.data(this,"sortable");c&&!c.options.disabled&&(d.sortables.push({instance:c,shouldRevert:c.options.revert}),c.refreshPositions(),c._trigger("activate",b,f))})},stop:function(b,c){var d=a(this).data("draggable"),e=a.extend({},c,{item:d.element});a.each(d.sortables,function(){this.instance.isOver?(this.instance.isOver=0,d.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=!0),this.instance._mouseStop(b),this.instance.options.helper=this.instance.options._helper,d.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",b,e))})},drag:function(b,c){var d=a(this).data("draggable"),e=this,f=function(b){var c=this.offset.click.top,d=this.offset.click.left,e=this.positionAbs.top,f=this.positionAbs.left,g=b.height,h=b.width,i=b.top,j=b.left;return a.ui.isOver(e+c,f+d,i,j,g,h)};a.each(d.sortables,function(f){this.instance.positionAbs=d.positionAbs,this.instance.helperProportions=d.helperProportions,this.instance.offset.click=d.offset.click,this.instance._intersectsWith(this.instance.containerCache)?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=a(e).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return c.helper[0]},b.target=this.instance.currentItem[0],this.instance._mouseCapture(b,!0),this.instance._mouseStart(b,!0,!0),this.instance.offset.click.top=d.offset.click.top,this.instance.offset.click.left=d.offset.click.left,this.instance.offset.parent.left-=d.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=d.offset.parent.top-this.instance.offset.parent.top,d._trigger("toSortable",b),d.dropped=this.instance.element,d.currentItem=d.element,this.instance.fromOutside=d),this.instance.currentItem&&this.instance._mouseDrag(b)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",b,this.instance._uiHash(this.instance)),this.instance._mouseStop(b,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),d._trigger("fromSortable",b),d.dropped=!1)})}}),a.ui.plugin.add("draggable","cursor",{start:function(b,c){var d=a("body"),e=a(this).data("draggable").options;d.css("cursor")&&(e._cursor=d.css("cursor")),d.css("cursor",e.cursor)},stop:function(b,c){var d=a(this).data("draggable").options;d._cursor&&a("body").css("cursor",d._cursor)}}),a.ui.plugin.add("draggable","opacity",{start:function(b,c){var d=a(c.helper),e=a(this).data("draggable").options;d.css("opacity")&&(e._opacity=d.css("opacity")),d.css("opacity",e.opacity)},stop:function(b,c){var d=a(this).data("draggable").options;d._opacity&&a(c.helper).css("opacity",d._opacity)}}),a.ui.plugin.add("draggable","scroll",{start:function(b,c){var d=a(this).data("draggable");d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML"&&(d.overflowOffset=d.scrollParent.offset())},drag:function(b,c){var d=a(this).data("draggable"),e=d.options,f=!1;if(d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML"){if(!e.axis||e.axis!="x")d.overflowOffset.top+d.scrollParent[0].offsetHeight-b.pageY<e.scrollSensitivity?d.scrollParent[0].scrollTop=f=d.scrollParent[0].scrollTop+e.scrollSpeed:b.pageY-d.overflowOffset.top<e.scrollSensitivity&&(d.scrollParent[0].scrollTop=f=d.scrollParent[0].scrollTop-e.scrollSpeed);if(!e.axis||e.axis!="y")d.overflowOffset.left+d.scrollParent[0].offsetWidth-b.pageX<e.scrollSensitivity?d.scrollParent[0].scrollLeft=f=d.scrollParent[0].scrollLeft+e.scrollSpeed:b.pageX-d.overflowOffset.left<e.scrollSensitivity&&(d.scrollParent[0].scrollLeft=f=d.scrollParent[0].scrollLeft-e.scrollSpeed)}else{if(!e.axis||e.axis!="x")b.pageY-a(document).scrollTop()<e.scrollSensitivity?f=a(document).scrollTop(a(document).scrollTop()-e.scrollSpeed):a(window).height()-(b.pageY-a(document).scrollTop())<e.scrollSensitivity&&(f=a(document).scrollTop(a(document).scrollTop()+e.scrollSpeed));if(!e.axis||e.axis!="y")b.pageX-a(document).scrollLeft()<e.scrollSensitivity?f=a(document).scrollLeft(a(document).scrollLeft()-e.scrollSpeed):a(window).width()-(b.pageX-a(document).scrollLeft())<e.scrollSensitivity&&(f=a(document).scrollLeft(a(document).scrollLeft()+e.scrollSpeed))}f!==!1&&a.ui.ddmanager&&!e.dropBehaviour&&a.ui.ddmanager.prepareOffsets(d,b)}}),a.ui.plugin.add("draggable","snap",{start:function(b,c){var d=a(this).data("draggable"),e=d.options;d.snapElements=[],a(e.snap.constructor!=String?e.snap.items||":data(draggable)":e.snap).each(function(){var b=a(this),c=b.offset();this!=d.element[0]&&d.snapElements.push({item:this,width:b.outerWidth(),height:b.outerHeight(),top:c.top,left:c.left})})},drag:function(b,c){var d=a(this).data("draggable"),e=d.options,f=e.snapTolerance,g=c.offset.left,h=g+d.helperProportions.width,i=c.offset.top,j=i+d.helperProportions.height;for(var k=d.snapElements.length-1;k>=0;k--){var l=d.snapElements[k].left,m=l+d.snapElements[k].width,n=d.snapElements[k].top,o=n+d.snapElements[k].height;if(!(l-f<g&&g<m+f&&n-f<i&&i<o+f||l-f<g&&g<m+f&&n-f<j&&j<o+f||l-f<h&&h<m+f&&n-f<i&&i<o+f||l-f<h&&h<m+f&&n-f<j&&j<o+f)){d.snapElements[k].snapping&&d.options.snap.release&&d.options.snap.release.call(d.element,b,a.extend(d._uiHash(),{snapItem:d.snapElements[k].item})),d.snapElements[k].snapping=!1;continue}if(e.snapMode!="inner"){var p=Math.abs(n-j)<=f,q=Math.abs(o-i)<=f,r=Math.abs(l-h)<=f,s=Math.abs(m-g)<=f;p&&(c.position.top=d._convertPositionTo("relative",{top:n-d.helperProportions.height,left:0}).top-d.margins.top),q&&(c.position.top=d._convertPositionTo("relative",{top:o,left:0}).top-d.margins.top),r&&(c.position.left=d._convertPositionTo("relative",{top:0,left:l-d.helperProportions.width}).left-d.margins.left),s&&(c.position.left=d._convertPositionTo("relative",{top:0,left:m}).left-d.margins.left)}var t=p||q||r||s;if(e.snapMode!="outer"){var p=Math.abs(n-i)<=f,q=Math.abs(o-j)<=f,r=Math.abs(l-g)<=f,s=Math.abs(m-h)<=f;p&&(c.position.top=d._convertPositionTo("relative",{top:n,left:0}).top-d.margins.top),q&&(c.position.top=d._convertPositionTo("relative",{top:o-d.helperProportions.height,left:0}).top-d.margins.top),r&&(c.position.left=d._convertPositionTo("relative",{top:0,left:l}).left-d.margins.left),s&&(c.position.left=d._convertPositionTo("relative",{top:0,left:m-d.helperProportions.width}).left-d.margins.left)}!d.snapElements[k].snapping&&(p||q||r||s||t)&&d.options.snap.snap&&d.options.snap.snap.call(d.element,b,a.extend(d._uiHash(),{snapItem:d.snapElements[k].item})),d.snapElements[k].snapping=p||q||r||s||t}}}),a.ui.plugin.add("draggable","stack",{start:function(b,c){var d=a(this).data("draggable").options,e=a.makeArray(a(d.stack)).sort(function(b,c){return(parseInt(a(b).css("zIndex"),10)||0)-(parseInt(a(c).css("zIndex"),10)||0)});if(!!e.length){var f=parseInt(e[0].style.zIndex)||0;a(e).each(function(a){this.style.zIndex=f+a}),this[0].style.zIndex=f+e.length}}}),a.ui.plugin.add("draggable","zIndex",{start:function(b,c){var d=a(c.helper),e=a(this).data("draggable").options;d.css("zIndex")&&(e._zIndex=d.css("zIndex")),d.css("zIndex",e.zIndex)},stop:function(b,c){var d=a(this).data("draggable").options;d._zIndex&&a(c.helper).css("zIndex",d._zIndex)}})})(jQuery);/*
 * jQuery UI Resizable 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Resizables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */(function(a,b){a.widget("ui.resizable",a.ui.mouse,{widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1e3},_create:function(){var b=this,c=this.options;this.element.addClass("ui-resizable"),a.extend(this,{_aspectRatio:!!c.aspectRatio,aspectRatio:c.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:c.helper||c.ghost||c.animate?c.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(a('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("resizable",this.element.data("resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=c.handles||(a(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se");if(this.handles.constructor==String){this.handles=="all"&&(this.handles="n,e,s,w,se,sw,ne,nw");var d=this.handles.split(",");this.handles={};for(var e=0;e<d.length;e++){var f=a.trim(d[e]),g="ui-resizable-"+f,h=a('<div class="ui-resizable-handle '+g+'"></div>');/sw|se|ne|nw/.test(f)&&h.css({zIndex:++c.zIndex}),"se"==f&&h.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[f]=".ui-resizable-"+f,this.element.append(h)}}this._renderAxis=function(b){b=b||this.element;for(var c in this.handles){this.handles[c].constructor==String&&(this.handles[c]=a(this.handles[c],this.element).show());if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var d=a(this.handles[c],this.element),e=0;e=/sw|ne|nw|se|n|s/.test(c)?d.outerHeight():d.outerWidth();var f=["padding",/ne|nw|n/.test(c)?"Top":/se|sw|s/.test(c)?"Bottom":/^e$/.test(c)?"Right":"Left"].join("");b.css(f,e),this._proportionallyResize()}if(!a(this.handles[c]).length)continue}},this._renderAxis(this.element),this._handles=a(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){if(!b.resizing){if(this.className)var a=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);b.axis=a&&a[1]?a[1]:"se"}}),c.autoHide&&(this._handles.hide(),a(this.element).addClass("ui-resizable-autohide").hover(function(){c.disabled||(a(this).removeClass("ui-resizable-autohide"),b._handles.show())},function(){c.disabled||b.resizing||(a(this).addClass("ui-resizable-autohide"),b._handles.hide())})),this._mouseInit()},destroy:function(){this._mouseDestroy();var b=function(b){a(b).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};if(this.elementIsWrapper){b(this.element);var c=this.element;c.after(this.originalElement.css({position:c.css("position"),width:c.outerWidth(),height:c.outerHeight(),top:c.css("top"),left:c.css("left")})).remove()}this.originalElement.css("resize",this.originalResizeStyle),b(this.originalElement);return this},_mouseCapture:function(b){var c=!1;for(var d in this.handles)a(this.handles[d])[0]==b.target&&(c=!0);return!this.options.disabled&&c},_mouseStart:function(b){var d=this.options,e=this.element.position(),f=this.element;this.resizing=!0,this.documentScroll={top:a(document).scrollTop(),left:a(document).scrollLeft()},(f.is(".ui-draggable")||/absolute/.test(f.css("position")))&&f.css({position:"absolute",top:e.top,left:e.left}),this._renderProxy();var g=c(this.helper.css("left")),h=c(this.helper.css("top"));d.containment&&(g+=a(d.containment).scrollLeft()||0,h+=a(d.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:g,top:h},this.size=this._helper?{width:f.outerWidth(),height:f.outerHeight()}:{width:f.width(),height:f.height()},this.originalSize=this._helper?{width:f.outerWidth(),height:f.outerHeight()}:{width:f.width(),height:f.height()},this.originalPosition={left:g,top:h},this.sizeDiff={width:f.outerWidth()-f.width(),height:f.outerHeight()-f.height()},this.originalMousePosition={left:b.pageX,top:b.pageY},this.aspectRatio=typeof d.aspectRatio=="number"?d.aspectRatio:this.originalSize.width/this.originalSize.height||1;var i=a(".ui-resizable-"+this.axis).css("cursor");a("body").css("cursor",i=="auto"?this.axis+"-resize":i),f.addClass("ui-resizable-resizing"),this._propagate("start",b);return!0},_mouseDrag:function(b){var c=this.helper,d=this.options,e={},f=this,g=this.originalMousePosition,h=this.axis,i=b.pageX-g.left||0,j=b.pageY-g.top||0,k=this._change[h];if(!k)return!1;var l=k.apply(this,[b,i,j]),m=a.browser.msie&&a.browser.version<7,n=this.sizeDiff;this._updateVirtualBoundaries(b.shiftKey);if(this._aspectRatio||b.shiftKey)l=this._updateRatio(l,b);l=this._respectSize(l,b),this._propagate("resize",b),c.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"}),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),this._updateCache(l),this._trigger("resize",b,this.ui());return!1},_mouseStop:function(b){this.resizing=!1;var c=this.options,d=this;if(this._helper){var e=this._proportionallyResizeElements,f=e.length&&/textarea/i.test(e[0].nodeName),g=f&&a.ui.hasScroll(e[0],"left")?0:d.sizeDiff.height,h=f?0:d.sizeDiff.width,i={width:d.helper.width()-h,height:d.helper.height()-g},j=parseInt(d.element.css("left"),10)+(d.position.left-d.originalPosition.left)||null,k=parseInt(d.element.css("top"),10)+(d.position.top-d.originalPosition.top)||null;c.animate||this.element.css(a.extend(i,{top:k,left:j})),d.helper.height(d.size.height),d.helper.width(d.size.width),this._helper&&!c.animate&&this._proportionallyResize()}a("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",b),this._helper&&this.helper.remove();return!1},_updateVirtualBoundaries:function(a){var b=this.options,c,e,f,g,h;h={minWidth:d(b.minWidth)?b.minWidth:0,maxWidth:d(b.maxWidth)?b.maxWidth:Infinity,minHeight:d(b.minHeight)?b.minHeight:0,maxHeight:d(b.maxHeight)?b.maxHeight:Infinity};if(this._aspectRatio||a)c=h.minHeight*this.aspectRatio,f=h.minWidth/this.aspectRatio,e=h.maxHeight*this.aspectRatio,g=h.maxWidth/this.aspectRatio,c>h.minWidth&&(h.minWidth=c),f>h.minHeight&&(h.minHeight=f),e<h.maxWidth&&(h.maxWidth=e),g<h.maxHeight&&(h.maxHeight=g);this._vBoundaries=h},_updateCache:function(a){var b=this.options;this.offset=this.helper.offset(),d(a.left)&&(this.position.left=a.left),d(a.top)&&(this.position.top=a.top),d(a.height)&&(this.size.height=a.height),d(a.width)&&(this.size.width=a.width)},_updateRatio:function(a,b){var c=this.options,e=this.position,f=this.size,g=this.axis;d(a.height)?a.width=a.height*this.aspectRatio:d(a.width)&&(a.height=a.width/this.aspectRatio),g=="sw"&&(a.left=e.left+(f.width-a.width),a.top=null),g=="nw"&&(a.top=e.top+(f.height-a.height),a.left=e.left+(f.width-a.width));return a},_respectSize:function(a,b){var c=this.helper,e=this._vBoundaries,f=this._aspectRatio||b.shiftKey,g=this.axis,h=d(a.width)&&e.maxWidth&&e.maxWidth<a.width,i=d(a.height)&&e.maxHeight&&e.maxHeight<a.height,j=d(a.width)&&e.minWidth&&e.minWidth>a.width,k=d(a.height)&&e.minHeight&&e.minHeight>a.height;j&&(a.width=e.minWidth),k&&(a.height=e.minHeight),h&&(a.width=e.maxWidth),i&&(a.height=e.maxHeight);var l=this.originalPosition.left+this.originalSize.width,m=this.position.top+this.size.height,n=/sw|nw|w/.test(g),o=/nw|ne|n/.test(g);j&&n&&(a.left=l-e.minWidth),h&&n&&(a.left=l-e.maxWidth),k&&o&&(a.top=m-e.minHeight),i&&o&&(a.top=m-e.maxHeight);var p=!a.width&&!a.height;p&&!a.left&&a.top?a.top=null:p&&!a.top&&a.left&&(a.left=null);return a},_proportionallyResize:function(){var b=this.options;if(!!this._proportionallyResizeElements.length){var c=this.helper||this.element;for(var d=0;d<this._proportionallyResizeElements.length;d++){var e=this._proportionallyResizeElements[d];if(!this.borderDif){var f=[e.css("borderTopWidth"),e.css("borderRightWidth"),e.css("borderBottomWidth"),e.css("borderLeftWidth")],g=[e.css("paddingTop"),e.css("paddingRight"),e.css("paddingBottom"),e.css("paddingLeft")];this.borderDif=a.map(f,function(a,b){var c=parseInt(a,10)||0,d=parseInt(g[b],10)||0;return c+d})}if(a.browser.msie&&(!!a(c).is(":hidden")||!!a(c).parents(":hidden").length))continue;e.css({height:c.height()-this.borderDif[0]-this.borderDif[2]||0,width:c.width()-this.borderDif[1]-this.borderDif[3]||0})}}},_renderProxy:function(){var b=this.element,c=this.options;this.elementOffset=b.offset();if(this._helper){this.helper=this.helper||a('<div style="overflow:hidden;"></div>');var d=a.browser.msie&&a.browser.version<7,e=d?1:0,f=d?2:-1;this.helper.addClass(this._helper).css({width:this.element.outerWidth()+f,height:this.element.outerHeight()+f,position:"absolute",left:this.elementOffset.left-e+"px",top:this.elementOffset.top-e+"px",zIndex:++c.zIndex}),this.helper.appendTo("body").disableSelection()}else this.helper=this.element},_change:{e:function(a,b,c){return{width:this.originalSize.width+b}},w:function(a,b,c){var d=this.options,e=this.originalSize,f=this.originalPosition;return{left:f.left+b,width:e.width-b}},n:function(a,b,c){var d=this.options,e=this.originalSize,f=this.originalPosition;return{top:f.top+c,height:e.height-c}},s:function(a,b,c){return{height:this.originalSize.height+c}},se:function(b,c,d){return a.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[b,c,d]))},sw:function(b,c,d){return a.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[b,c,d]))},ne:function(b,c,d){return a.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[b,c,d]))},nw:function(b,c,d){return a.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[b,c,d]))}},_propagate:function(b,c){a.ui.plugin.call(this,b,[c,this.ui()]),b!="resize"&&this._trigger(b,c,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),a.extend(a.ui.resizable,{version:"1.8.18"}),a.ui.plugin.add("resizable","alsoResize",{start:function(b,c){var d=a(this).data("resizable"),e=d.options,f=function(b){a(b).each(function(){var b=a(this);b.data("resizable-alsoresize",{width:parseInt(b.width(),10),height:parseInt(b.height(),10),left:parseInt(b.css("left"),10),top:parseInt(b.css("top"),10)})})};typeof e.alsoResize=="object"&&!e.alsoResize.parentNode?e.alsoResize.length?(e.alsoResize=e.alsoResize[0],f(e.alsoResize)):a.each(e.alsoResize,function(a){f(a)}):f(e.alsoResize)},resize:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.originalSize,g=d.originalPosition,h={height:d.size.height-f.height||0,width:d.size.width-f.width||0,top:d.position.top-g.top||0,left:d.position.left-g.left||0},i=function(b,d){a(b).each(function(){var b=a(this),e=a(this).data("resizable-alsoresize"),f={},g=d&&d.length?d:b.parents(c.originalElement[0]).length?["width","height"]:["width","height","top","left"];a.each(g,function(a,b){var c=(e[b]||0)+(h[b]||0);c&&c>=0&&(f[b]=c||null)}),b.css(f)})};typeof e.alsoResize=="object"&&!e.alsoResize.nodeType?a.each(e.alsoResize,function(a,b){i(a,b)}):i(e.alsoResize)},stop:function(b,c){a(this).removeData("resizable-alsoresize")}}),a.ui.plugin.add("resizable","animate",{stop:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d._proportionallyResizeElements,g=f.length&&/textarea/i.test(f[0].nodeName),h=g&&a.ui.hasScroll(f[0],"left")?0:d.sizeDiff.height,i=g?0:d.sizeDiff.width,j={width:d.size.width-i,height:d.size.height-h},k=parseInt(d.element.css("left"),10)+(d.position.left-d.originalPosition.left)||null,l=parseInt(d.element.css("top"),10)+(d.position.top-d.originalPosition.top)||null;d.element.animate(a.extend(j,l&&k?{top:l,left:k}:{}),{duration:e.animateDuration,easing:e.animateEasing,step:function(){var c={width:parseInt(d.element.css("width"),10),height:parseInt(d.element.css("height"),10),top:parseInt(d.element.css("top"),10),left:parseInt(d.element.css("left"),10)};f&&f.length&&a(f[0]).css({width:c.width,height:c.height}),d._updateCache(c),d._propagate("resize",b)}})}}),a.ui.plugin.add("resizable","containment",{start:function(b,d){var e=a(this).data("resizable"),f=e.options,g=e.element,h=f.containment,i=h instanceof a?h.get(0):/parent/.test(h)?g.parent().get(0):h;if(!!i){e.containerElement=a(i);if(/document/.test(h)||h==document)e.containerOffset={left:0,top:0},e.containerPosition={left:0,top:0},e.parentData={element:a(document),left:0,top:0,width:a(document).width(),height:a(document).height()||document.body.parentNode.scrollHeight};else{var j=a(i),k=[];a(["Top","Right","Left","Bottom"]).each(function(a,b){k[a]=c(j.css("padding"+b))}),e.containerOffset=j.offset(),e.containerPosition=j.position(),e.containerSize={height:j.innerHeight()-k[3],width:j.innerWidth()-k[1]};var l=e.containerOffset,m=e.containerSize.height,n=e.containerSize.width,o=a.ui.hasScroll(i,"left")?i.scrollWidth:n,p=a.ui.hasScroll(i)?i.scrollHeight:m;e.parentData={element:i,left:l.left,top:l.top,width:o,height:p}}}},resize:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.containerSize,g=d.containerOffset,h=d.size,i=d.position,j=d._aspectRatio||b.shiftKey,k={top:0,left:0},l=d.containerElement;l[0]!=document&&/static/.test(l.css("position"))&&(k=g),i.left<(d._helper?g.left:0)&&(d.size.width=d.size.width+(d._helper?d.position.left-g.left:d.position.left-k.left),j&&(d.size.height=d.size.width/e.aspectRatio),d.position.left=e.helper?g.left:0),i.top<(d._helper?g.top:0)&&(d.size.height=d.size.height+(d._helper?d.position.top-g.top:d.position.top),j&&(d.size.width=d.size.height*e.aspectRatio),d.position.top=d._helper?g.top:0),d.offset.left=d.parentData.left+d.position.left,d.offset.top=d.parentData.top+d.position.top;var m=Math.abs((d._helper?d.offset.left-k.left:d.offset.left-k.left)+d.sizeDiff.width),n=Math.abs((d._helper?d.offset.top-k.top:d.offset.top-g.top)+d.sizeDiff.height),o=d.containerElement.get(0)==d.element.parent().get(0),p=/relative|absolute/.test(d.containerElement.css("position"));o&&p&&(m-=d.parentData.left),m+d.size.width>=d.parentData.width&&(d.size.width=d.parentData.width-m,j&&(d.size.height=d.size.width/d.aspectRatio)),n+d.size.height>=d.parentData.height&&(d.size.height=d.parentData.height-n,j&&(d.size.width=d.size.height*d.aspectRatio))},stop:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.position,g=d.containerOffset,h=d.containerPosition,i=d.containerElement,j=a(d.helper),k=j.offset(),l=j.outerWidth()-d.sizeDiff.width,m=j.outerHeight()-d.sizeDiff.height;d._helper&&!e.animate&&/relative/.test(i.css("position"))&&a(this).css({left:k.left-h.left-g.left,width:l,height:m}),d._helper&&!e.animate&&/static/.test(i.css("position"))&&a(this).css({left:k.left-h.left-g.left,width:l,height:m})}}),a.ui.plugin.add("resizable","ghost",{start:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.size;d.ghost=d.originalElement.clone(),d.ghost.css({opacity:.25,display:"block",position:"relative",height:f.height,width:f.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof e.ghost=="string"?e.ghost:""),d.ghost.appendTo(d.helper)},resize:function(b,c){var d=a(this).data("resizable"),e=d.options;d.ghost&&d.ghost.css({position:"relative",height:d.size.height,width:d.size.width})},stop:function(b,c){var d=a(this).data("resizable"),e=d.options;d.ghost&&d.helper&&d.helper.get(0).removeChild(d.ghost.get(0))}}),a.ui.plugin.add("resizable","grid",{resize:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.size,g=d.originalSize,h=d.originalPosition,i=d.axis,j=e._aspectRatio||b.shiftKey;e.grid=typeof e.grid=="number"?[e.grid,e.grid]:e.grid;var k=Math.round((f.width-g.width)/(e.grid[0]||1))*(e.grid[0]||1),l=Math.round((f.height-g.height)/(e.grid[1]||1))*(e.grid[1]||1);/^(se|s|e)$/.test(i)?(d.size.width=g.width+k,d.size.height=g.height+l):/^(ne)$/.test(i)?(d.size.width=g.width+k,d.size.height=g.height+l,d.position.top=h.top-l):/^(sw)$/.test(i)?(d.size.width=g.width+k,d.size.height=g.height+l,d.position.left=h.left-k):(d.size.width=g.width+k,d.size.height=g.height+l,d.position.top=h.top-l,d.position.left=h.left-k)}});var c=function(a){return parseInt(a,10)||0},d=function(a){return!isNaN(parseInt(a,10))}})(jQuery);;

/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);
;

/**
     * Cursor Functions
     *
     * Used for setting and getting text cursor position within an input
     * and textarea field. Also used to get and set selection range.
     *
     * @author Branden Cash
     * @email brandencash@crutzdesigns.com
     */
     
    (function( $ ){
    jQuery.fn.getCursorPosition = function(){
    if(this.lengh == 0) return -1;
    return $(this).getSelectionStart();
    }
     
    jQuery.fn.setCursorPosition = function(position){
    if(this.lengh == 0) return this;
    return $(this).setSelection(position, position);
    }
     
    jQuery.fn.getSelection = function(){
    if(this.lengh == 0) return -1;
    var s = $(this).getSelectionStart();
    var e = $(this).getSelectionEnd();
    return this[0].value.substring(s,e);
    }
     
    jQuery.fn.getSelectionStart = function(){
    if(this.lengh == 0) return -1;
    input = this[0];
     
    var pos = input.value.length;
     
    if (input.createTextRange) {
    var r = document.selection.createRange().duplicate();
    r.moveEnd('character', input.value.length);
    if (r.text == '')
    pos = input.value.length;
    pos = input.value.lastIndexOf(r.text);
    } else if(typeof(input.selectionStart)!="undefined")
    pos = input.selectionStart;
     
    return pos;
    }
     
    jQuery.fn.getSelectionEnd = function(){
    if(this.lengh == 0) return -1;
    input = this[0];
     
    var pos = input.value.length;
     
    if (input.createTextRange) {
    var r = document.selection.createRange().duplicate();
    r.moveStart('character', -input.value.length);
    if (r.text == '')
    pos = input.value.length;
    pos = input.value.lastIndexOf(r.text);
    } else if(typeof(input.selectionEnd)!="undefined")
    pos = input.selectionEnd;
     
    return pos;
    }
     
    jQuery.fn.setSelection = function(selectionStart, selectionEnd) {
    if(this.lengh == 0) return this;
    input = this[0];
     
    if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
    } else if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
    }
     
    return this;
    }
    })( jQuery );

;

/*
 * Flip! jQuery Plugin (http://lab.smashup.it/flip/)
 * @author Luca Manno (luca@smashup.it) [http://i.smashup.it]
 *              [Original idea by Nicola Rizzo (thanks!)]
 *
 * @version 0.9.9 [Nov. 2009]
 *
 * @changelog
 * v 0.9.9      ->      Fix transparency over non-colored background. Added dontChangeColor option.
 *                      Added $clone and $this parameters to on.. callback functions.
 *                      Force hexadecimal color values. Made safe for noConflict use.
 *                      Some refactoring. [Henrik Hjelte, Jul. 10, 2009]
 * 						Added revert options, fixes and improvements on color management.
 * 						Released in Nov 2009
 * v 0.5        ->      Added patch to make it work with Opera (thanks to Peter Siewert), Added callbacks [Feb. 1, 2008]
 * v 0.4.1      ->      Fixed a regression in Chrome and Safari caused by getTransparent [Oct. 1, 2008]
 * v 0.4        ->      Fixed some bugs with transparent color. Now Flip! works on non-white backgrounds | Update: jquery.color.js plugin or jqueryUI still needed :( [Sept. 29, 2008]
 * v 0.3        ->      Now is possibile to define the content after the animation.
 *                              (jQuery object or text/html is allowed) [Sept. 25, 2008]
 * v 0.2        ->      Fixed chainability and buggy innertext rendering (xNephilimx thanks!)
 * v 0.1        ->      Starting release [Sept. 11, 2008]
 *
 */
(function($) {

function int_prop(fx){
    fx.elem.style[ fx.prop ] = parseInt(fx.now,10) + fx.unit;
}

var throwError=function(message) {
    throw({name:"jquery.flip.js plugin error",message:message});
};

var isIE6orOlder=function() {
    // User agent sniffing is clearly out of fashion and $.browser will be be deprectad.
    // Now, I can't think of a way to feature detect that IE6 doesn't show transparent
    // borders in the correct way.
    // Until then, this function will do, and be partly political correct, allowing
    // 0.01 percent of the internet users to tweak with their UserAgent string.
    //
    // Not leadingWhiteSpace is to separate IE family from, well who knows?
    // Maybe some version of Opera?
    // The second guess behind this is that IE7+  will keep supporting maxHeight in the future.
	
	// First guess changed to dean edwards ie sniffing http://dean.edwards.name/weblog/2007/03/sniff/
    return (/*@cc_on!@*/false && (typeof document.body.style.maxHeight === "undefined"));
};


// Some named colors to work with
// From Interface by Stefan Petre
// http://interface.eyecon.ro/

var colors = {
	aqua:[0,255,255],
	azure:[240,255,255],
	beige:[245,245,220],
	black:[0,0,0],
	blue:[0,0,255],
	brown:[165,42,42],
	cyan:[0,255,255],
	darkblue:[0,0,139],
	darkcyan:[0,139,139],
	darkgrey:[169,169,169],
	darkgreen:[0,100,0],
	darkkhaki:[189,183,107],
	darkmagenta:[139,0,139],
	darkolivegreen:[85,107,47],
	darkorange:[255,140,0],
	darkorchid:[153,50,204],
	darkred:[139,0,0],
	darksalmon:[233,150,122],
	darkviolet:[148,0,211],
	fuchsia:[255,0,255],
	gold:[255,215,0],
	green:[0,128,0],
	indigo:[75,0,130],
	khaki:[240,230,140],
	lightblue:[173,216,230],
	lightcyan:[224,255,255],
	lightgreen:[144,238,144],
	lightgrey:[211,211,211],
	lightpink:[255,182,193],
	lightyellow:[255,255,224],
	lime:[0,255,0],
	magenta:[255,0,255],
	maroon:[128,0,0],
	navy:[0,0,128],
	olive:[128,128,0],
	orange:[255,165,0],
	pink:[255,192,203],
	purple:[128,0,128],
	violet:[128,0,128],
	red:[255,0,0],
	silver:[192,192,192],
	white:[255,255,255],
	yellow:[255,255,0],
	transparent: [255,255,255]
};

var acceptHexColor=function(color) {
	if(color && color.indexOf("#")==-1 && color.indexOf("(")==-1){
		return "rgb("+colors[color].toString()+")";
	} else {
		return color;
	}
};

$.extend( $.fx.step, {
    borderTopWidth : int_prop,
    borderBottomWidth : int_prop,
    borderLeftWidth: int_prop,
    borderRightWidth: int_prop
});

$.fn.revertFlip = function(){
	return this.each( function(){
		var $this = $(this);
		$this.flip($this.data('flipRevertedSettings'));		
	});
};

$.fn.flip = function(settings){
    return this.each( function() {
        var $this=$(this), flipObj, $clone, dirOption, dirOptions, newContent, ie6=isIE6orOlder();

        if($this.data('flipLock')){
            return false;
        }
		
		var revertedSettings = {
			direction: (function(direction){
				switch(direction)
				{
				case "tb":
				  return "bt";
				case "bt":
				  return "tb";
				case "lr":
				  return "rl";
				case "rl":
				  return "lr";		  
				default:
				  return "bt";
				}
			})(settings.direction),
			bgColor: acceptHexColor(settings.color) || "#999",
			color: acceptHexColor(settings.bgColor) || $this.css("background-color"),
			content: $this.html(),
			speed: settings.speed || 500,
            onBefore: settings.onBefore || function(){},
            onEnd: settings.onEnd || function(){},
            onAnimation: settings.onAnimation || function(){}
		};
		
		$this
			.data('flipRevertedSettings',revertedSettings)
			.data('flipLock',1)
			.data('flipSettings',revertedSettings);

        flipObj = {
            width: $this.width(),
            height: $this.height(),
            bgColor: acceptHexColor(settings.bgColor) || $this.css("background-color"),
            fontSize: $this.css("font-size") || "12px",
            direction: settings.direction || "tb",
            toColor: acceptHexColor(settings.color) || "#999",
            speed: settings.speed || 500,
            top: $this.offset().top,
            left: $this.offset().left,
            target: settings.content || null,
            transparent: "transparent",
            dontChangeColor: settings.dontChangeColor || false,
            onBefore: settings.onBefore || function(){},
            onEnd: settings.onEnd || function(){},
            onAnimation: settings.onAnimation || function(){}
        };

        // This is the first part of a trick to support
        // transparent borders using chroma filter for IE6
        // The color below is arbitrary, lets just hope it is not used in the animation
        ie6 && (flipObj.transparent="#123456");

        $clone= $this.css("visibility","hidden")
            .clone(true)
			.data('flipLock',1)
            .appendTo("body")
            .html("")
            .css({visibility:"visible",position:"absolute",left:flipObj.left,top:flipObj.top,margin:0,zIndex:9999,"-webkit-box-shadow":"0px 0px 0px #000","-moz-box-shadow":"0px 0px 0px #000"});

        var defaultStart=function() {
            return {
                backgroundColor: flipObj.transparent,
                fontSize:0,
                lineHeight:0,
                borderTopWidth:0,
                borderLeftWidth:0,
                borderRightWidth:0,
                borderBottomWidth:0,
                borderTopColor:flipObj.transparent,
                borderBottomColor:flipObj.transparent,
                borderLeftColor:flipObj.transparent,
                borderRightColor:flipObj.transparent,
				background: "none",
                borderStyle:'solid',
                height:0,
                width:0
            };
        };
        var defaultHorizontal=function() {
            var waist=(flipObj.height/100)*25;
            var start=defaultStart();
            start.width=flipObj.width;
            return {
                "start": start,
                "first": {
                    borderTopWidth: 0,
                    borderLeftWidth: waist,
                    borderRightWidth: waist,
                    borderBottomWidth: 0,
                    borderTopColor: '#999',
                    borderBottomColor: '#999',
                    top: (flipObj.top+(flipObj.height/2)),
                    left: (flipObj.left-waist)},
                "second": {
                    borderBottomWidth: 0,
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderTopColor: flipObj.transparent,
                    borderBottomColor: flipObj.transparent,
                    top: flipObj.top,
                    left: flipObj.left}
            };
        };
        var defaultVertical=function() {
            var waist=(flipObj.height/100)*25;
            var start=defaultStart();
            start.height=flipObj.height;
            return {
                "start": start,
                "first": {
                    borderTopWidth: waist,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderBottomWidth: waist,
                    borderLeftColor: '#999',
                    borderRightColor: '#999',
                    top: flipObj.top-waist,
                    left: flipObj.left+(flipObj.width/2)},
                "second": {
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                    borderLeftColor: flipObj.transparent,
                    borderRightColor: flipObj.transparent,
                    top: flipObj.top,
                    left: flipObj.left}
            };
        };

        dirOptions = {
            "tb": function () {
                var d=defaultHorizontal();
                d.start.borderTopWidth=flipObj.height;
                d.start.borderTopColor=flipObj.bgColor;
                d.second.borderBottomWidth= flipObj.height;
                d.second.borderBottomColor= flipObj.toColor;
                return d;
            },
            "bt": function () {
                var d=defaultHorizontal();
                d.start.borderBottomWidth=flipObj.height;
                d.start.borderBottomColor= flipObj.bgColor;
                d.second.borderTopWidth= flipObj.height;
                d.second.borderTopColor= flipObj.toColor;
                return d;
            },
            "lr": function () {
                var d=defaultVertical();
                d.start.borderLeftWidth=flipObj.width;
                d.start.borderLeftColor=flipObj.bgColor;
                d.second.borderRightWidth= flipObj.width;
                d.second.borderRightColor= flipObj.toColor;
                return d;
            },
            "rl": function () {
                var d=defaultVertical();
                d.start.borderRightWidth=flipObj.width;
                d.start.borderRightColor=flipObj.bgColor;
                d.second.borderLeftWidth= flipObj.width;
                d.second.borderLeftColor= flipObj.toColor;
                return d;
            }
        };

        dirOption=dirOptions[flipObj.direction]();

        // Second part of IE6 transparency trick.
        ie6 && (dirOption.start.filter="chroma(color="+flipObj.transparent+")");

        newContent = function(){
            var target = flipObj.target;
            return target && target.jquery ? target.html() : target;
        };

        $clone.queue(function(){
            flipObj.onBefore($clone,$this);
            $clone.html('').css(dirOption.start);
            $clone.dequeue();
        });

        $clone.animate(dirOption.first,flipObj.speed);

        $clone.queue(function(){
            flipObj.onAnimation($clone,$this);
            $clone.dequeue();
        });
        $clone.animate(dirOption.second,flipObj.speed);

        $clone.queue(function(){
            if (!flipObj.dontChangeColor) {
                $this.css({backgroundColor: flipObj.toColor});
            }
            $this.css({visibility: "visible"});

            var nC = newContent();
            if(nC){$this.html(nC);}
            $clone.remove();
            flipObj.onEnd($clone,$this);
            $this.removeData('flipLock');
            $clone.dequeue();
        });
    });
};
})(jQuery);
;

/*

FLIPPY jQuery plugin (http://guilhemmarty.com/flippy)

@author : Guilhem MARTY (bonjour@guilhemmarty.com)

@version: 1.0

@changelog:

Feb 11 2012 - v1.0 : First release

*/


(function($){
	var _Ang , _Step_ang , _Refresh_rate , _Depth , _W , _H , _nW , _nH , _cv_W, _cv_H, _CenterX , _CenterY , _Color , _Color_target , _Light , _Content , _Direction , _Midway , $this , _After, _Active;
	
	var _ColorsRef = {
		'aliceblue':'#f0f8ff',
		'antiquewhite':'#faebd7',
		'aqua':'#00ffff',
		'aquamarine':'#7fffd4',
		'azure':'#f0ffff',
		'beige':'#f5f5dc',
		'bisque':'#ffe4c4',
		'black':'#000000',
		'blanchedalmond':'#ffebcd',
		'blue':'#0000ff',
		'blueviolet':'#8a2be2',
		'brown':'#a52a2a',
		'burlywood':'#deb887',
		'cadetblue':'#5f9ea0',
		'chartreuse':'#7fff00',
		'chocolate':'#d2691e',
		'coral':'#ff7f50',
		'cornflowerblue':'#6495ed',
		'cornsilk':'#fff8dc',
		'crimson':'#dc143c',
		'cyan':'#00ffff',
		'darkblue':'#00008b',
		'darkcyan':'#008b8b',
		'darkgoldenrod':'#b8860b',
		'darkgray':'#a9a9a9',
		'darkgrey':'#a9a9a9',
		'darkgreen':'#006400',
		'darkkhaki':'#bdb76b',
		'darkmagenta':'#8b008b',
		'darkolivegreen':'#556b2f',
		'darkorange':'#ff8c00',
		'darkorchid':'#9932cc',
		'darkred':'#8b0000',
		'darksalmon':'#e9967a',
		'darkseagreen':'#8fbc8f',
		'darkslateblue':'#483d8b',
		'darkslategray':'#2f4f4f',
		'darkslategrey':'#2f4f4f',
		'darkturquoise':'#00ced1',
		'darkviolet':'#9400d3',
		'deeppink':'#ff1493',
		'deepskyblue':'#00bfff',
		'dimgray':'#696969',
		'dimgrey':'#696969',
		'dodgerblue':'#1e90ff',
		'firebrick':'#b22222',
		'floralwhite':'#fffaf0',
		'forestgreen':'#228b22',
		'fuchsia':'#ff00ff',
		'gainsboro':'#dcdcdc',
		'ghostwhite':'#f8f8ff',
		'gold':'#ffd700',
		'goldenrod':'#daa520',
		'gray':'#808080',
		'grey':'#808080',
		'green':'#008000',
		'greenyellow':'#adff2f',
		'honeydew':'#f0fff0',
		'hotpink':'#ff69b4',
		'indianred ':'#cd5c5c',
		'indigo  ':'#4b0082',
		'ivory':'#fffff0',
		'khaki':'#f0e68c',
		'lavender':'#e6e6fa',
		'lavenderblush':'#fff0f5',
		'lawngreen':'#7cfc00',
		'lemonchiffon':'#fffacd',
		'lightblue':'#add8e6',
		'lightcoral':'#f08080',
		'lightcyan':'#e0ffff',
		'lightgoldenrodyellow':'#fafad2',
		'lightgray':'#d3d3d3',
		'lightgrey':'#d3d3d3',
		'lightgreen':'#90ee90',
		'lightpink':'#ffb6c1',
		'lightsalmon':'#ffa07a',
		'lightseagreen':'#20b2aa',
		'lightskyblue':'#87cefa',
		'lightslategray':'#778899',
		'lightslategrey':'#778899',
		'lightsteelblue':'#b0c4de',
		'lightyellow':'#ffffe0',
		'lime':'#00ff00',
		'limegreen':'#32cd32',
		'linen':'#faf0e6',
		'magenta':'#ff00ff',
		'maroon':'#800000',
		'mediumaquamarine':'#66cdaa',
		'mediumblue':'#0000cd',
		'mediumorchid':'#ba55d3',
		'mediumpurple':'#9370d8',
		'mediumseagreen':'#3cb371',
		'mediumslateblue':'#7b68ee',
		'mediumspringgreen':'#00fa9a',
		'mediumturquoise':'#48d1cc',
		'mediumvioletred':'#c71585',
		'midnightblue':'#191970',
		'mintcream':'#f5fffa',
		'mistyrose':'#ffe4e1',
		'moccasin':'#ffe4b5',
		'navajowhite':'#ffdead',
		'navy':'#000080',
		'oldlace':'#fdf5e6',
		'olive':'#808000',
		'olivedrab':'#6b8e23',
		'orange':'#ffa500',
		'orangered':'#ff4500',
		'orchid':'#da70d6',
		'palegoldenrod':'#eee8aa',
		'palegreen':'#98fb98',
		'paleturquoise':'#afeeee',
		'palevioletred':'#d87093',
		'papayawhip':'#ffefd5',
		'peachpuff':'#ffdab9',
		'peru':'#cd853f',
		'pink':'#ffc0cb',
		'plum':'#dda0dd',
		'powderblue':'#b0e0e6',
		'purple':'#800080',
		'red':'#ff0000',
		'rosybrown':'#bc8f8f',
		'royalblue':'#4169e1',
		'saddlebrown':'#8b4513',
		'salmon':'#fa8072',
		'sandybrown':'#f4a460',
		'seagreen':'#2e8b57',
		'seashell':'#fff5ee',
		'sienna':'#a0522d',
		'silver':'#c0c0c0',
		'skyblue':'#87ceeb',
		'slateblue':'#6a5acd',
		'slategray':'#708090',
		'slategrey':'#708090',
		'snow':'#fffafa',
		'springgreen':'#00ff7f',
		'steelblue':'#4682b4',
		'tan':'#d2b48c',
		'teal':'#008080',
		'thistle':'#d8bfd8',
		'tomato':'#ff6347',
		'turquoise':'#40e0d0',
		'violet':'#ee82ee',
		'wheat':'#f5deb3',
		'white':'#ffffff',
		'whitesmoke':'#f5f5f5',
		'yellow':'#ffff00',
		'yellowgreen':'#9acd32'
	};
	
	$.fn.flippy = function(opts){
		if(!_Active){
			opts = $.extend({
				active_class:"flippy-active",
				step_ang:10,
				refresh_rate:15,
				duration:300,
				depth:0.12,
				color_target:"white",
				light:60,
				content:"",
				direction:"LEFT",
				onStart:function(){},
				onMidway:function(){},
				onFinish:function(){}
			}, opts);
			_Active_class="flippy-active";
			_Active = (_Active)? _Active : '';
			_Ang = 0;
			_Step_ang = (opts.refresh_rate/opts.duration)*200;
			_Refresh_rate = opts.refresh_rate;
			_Depth = opts.depth;
			_W = '';
			_H = '';
			_nW = '';
			_nH = '';
			_CenterX = (_CenterX != '')? _CenterX : '';
			_CenterY = (_CenterY != '')? _CenterY : '';
			_Color = (_Color != '')? _Color : '';
			_Color_target = convertColor(opts.color_target);
			_Direction = opts.direction;
			_Light = opts.light;
			_Content = opts.content;
			_Before = opts.onStart;
			_Midway = opts.onMidway;
			_After = opts.onFinish;

			var _i = 1;
			return this.each(function(){
				$this = $(this);
				_nW = $this.width();
				_nH = $this.height();
				_W = $this.outerWidth();
				_H = $this.outerHeight();
				_Active = true;
				_Before();
				
				_Content = (typeof _Content == "object") ? _Content.html() : _Content;
				_Color = convertColor($this.css("background-color"));
				$this
					.empty()
					.data("color",$this.css("background-color"))
					.css({
						 "background":"none",
						 "position":"relative",
						 "overflow":"visible"
					});
					
					switch(_Direction){
						case "TOP":
							_CenterX = (Math.sin(Math.PI/2)*_nW*_Depth);
							_CenterY = _H/2;
							var cv_pattern = '<canvas id="flippy" width="'+(_W+(2*_CenterX))+'" height="'+_H+'"></canvas>';
							new_flippy(cv_pattern);
							$this.find("#flippy")
								.css({
									 "position":"absolute",
									 "top":"0",
									 "left":"-"+_CenterX+"px"
								});
						break;
						case "BOTTOM":
							_CenterX = (Math.sin(Math.PI/2)*_nW*_Depth);
							_CenterY = _H/2;
							var cv_pattern = '<canvas id="flippy" width="'+(_W+(2*_CenterX))+'" height="'+_H+'"></canvas>';
							new_flippy(cv_pattern);
							$this.find("#flippy")
								.css({
									 "position":"absolute",
									 "top":"0",
									 "left":"-"+_CenterX+"px"
								});
						break;
						case "LEFT":
							_CenterY = (Math.sin(Math.PI/2)*_nH*_Depth);
							_CenterX = _W/2;
							var cv_pattern = '<canvas id="flippy" width="'+_W+'" height="'+(_H+(2*_CenterY))+'"></canvas>';
							new_flippy(cv_pattern);
							$this.find("#flippy")
								.css({
									 "position":"absolute",
									 "top":"-"+_CenterY+"px",
									 "left":"0"
								});
						break;
						case "RIGHT":
							_CenterY = (Math.sin(Math.PI/2)*_nH*_Depth);
							_CenterX = _W/2;
							var cv_pattern = '<canvas id="flippy" width="'+_W+'" height="'+(_H+(2*_CenterY))+'"></canvas>';
							new_flippy(cv_pattern);
							$this.find("#flippy")
								.css({
									 "position":"absolute",
									 "top":"-"+_CenterY+"px",
									 "left":"0"
								});
						break;
					}
				drawFlippy();
			});
		}
	}
	
	function new_flippy(cv_pattern){
		$this.append(cv_pattern);
	}
	
	function drawFlippy(){
		_Ang += _Step_ang;
		
		if(_Ang > 90 && _Ang <= (90+_Step_ang)){
			_Midway();
		}
		
		_Ang = (_Ang > (180+_Step_ang)) ? _Ang-(180+_Step_ang) : _Ang;
		var PI = Math.PI
		var rad = (_Ang/180)*PI;
		
		var canvas = document.getElementById("flippy");
		if($.browser.msie){G_vmlCanvasManager.initElement(canvas);}
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, _W+(2*_CenterX), _H+(2*_CenterY));
		ctx.beginPath();
		var deltaH = Math.sin(rad)*_H*_Depth;
		var deltaW = Math.sin(rad)*_W*_Depth;
		
		switch(_Direction){
			case "LEFT" :
				var X = Math.cos(rad)*(_W/2);
				ctx.fillStyle = (_Ang > 90) ? changeColor(_Color_target,Math.floor(Math.sin(rad)*_Light)) : changeColor(_Color,-Math.floor(Math.sin(rad)*_Light));
				ctx.moveTo(_CenterX-X,_CenterY+deltaH);//TL
				ctx.lineTo(_CenterX+X,_CenterY-deltaH);//TR
				ctx.lineTo(_CenterX+X,_CenterY+_H+deltaH);//BR
				ctx.lineTo(_CenterX-X,_CenterY+_H-deltaH);//BL
				ctx.lineTo(_CenterX-X,_CenterY);//loop
				ctx.fill();
			break;
			case "RIGHT" :
				var X = Math.cos(rad)*(_W/2);
				ctx.fillStyle = (_Ang > 90) ? changeColor(_Color_target,-Math.floor(Math.sin(rad)*_Light)) : changeColor(_Color,Math.floor(Math.sin(rad)*_Light));
				ctx.moveTo(_CenterX+X,_CenterY+deltaH);//TL
				ctx.lineTo(_CenterX-X,_CenterY-deltaH);//TR
				ctx.lineTo(_CenterX-X,_CenterY+_H+deltaH);//BR
				ctx.lineTo(_CenterX+X,_CenterY+_H-deltaH);//BL
				ctx.lineTo(_CenterX+X,_CenterY);//loop
				ctx.fill();
			break;
			case "TOP" :
				var Y = Math.cos(rad)*(_H/2);
				ctx.fillStyle = (_Ang > 90) ? changeColor(_Color_target,-Math.floor(Math.sin(rad)*_Light)) : changeColor(_Color,Math.floor(Math.sin(rad)*_Light));
				ctx.moveTo(_CenterX+deltaW,_CenterY-Y);//TL
				ctx.lineTo(_CenterX-deltaW,_CenterY+Y);//TR
				ctx.lineTo(_CenterX+_W+deltaW,_CenterY+Y);//BR
				ctx.lineTo(_CenterX+_W-deltaW,_CenterY-Y);//BL
				ctx.lineTo(_CenterX,_CenterY-Y);//loop
				ctx.fill();
			break;
			case "BOTTOM" :
				var Y = Math.cos(rad)*(_H/2);
				ctx.fillStyle = (_Ang > 90) ? changeColor(_Color_target,Math.floor(Math.sin(rad)*_Light)) : changeColor(_Color,-Math.floor(Math.sin(rad)*_Light));
				ctx.moveTo(_CenterX+deltaW,_CenterY+Y);//TL
				ctx.lineTo(_CenterX-deltaW,_CenterY-Y);//TR
				ctx.lineTo(_CenterX+_W+deltaW,_CenterY-Y);//BR
				ctx.lineTo(_CenterX+_W-deltaW,_CenterY+Y);//BL
				ctx.lineTo(_CenterX,_CenterY+Y);//loop
				ctx.fill();
			break;
		}
		
		if(_Ang < 180){
			setTimeout(drawFlippy,_Refresh_rate);
		}else{
			_Active = null;
			$this
				.css({
					 "background":_Color_target
				})
				.append(_Content)
				.find("#flippy")
					.remove();
				if($this.attr("id") == "flippy_container"){
					$this.attr("id","");
				}
			_After();
		}
	}
	
	function convertColor(thecolor){
		try{
			thecolor = (eval('_ColorsRef.'+thecolor) != null)? eval('_ColorsRef.'+thecolor) : thecolor;
		}catch(err){
		
		}
	
		if(thecolor.substr(0,4) == "rgb("){
			thecolor = "#"
				+toHex(eval(thecolor.substr(4,thecolor.length).split(',')[0]))
				+toHex(eval(thecolor.substr(3,thecolor.length).split(',')[1]))
				+toHex(eval(thecolor.substr(3,thecolor.length-4).split(',')[2]))
		};
		return thecolor;
	}
	
	function toDec(hex){
		var hexL = hex.length;
		var dec = 0;
		for(i=0;i<hexL;i++){
			var hexPow = Math.pow(16,hexL-i-1);
			var daHex = hex.substr(i,1)
			switch(daHex.toUpperCase()){
				case "A" : dec += 10*hexPow;break;
				case "B" : dec += 11*hexPow;break;
				case "C" : dec += 12*hexPow;break;
				case "D" : dec += 13*hexPow;break;
				case "E" : dec += 14*hexPow;break;
				case "F" : dec += 15*hexPow;break;
				default : dec += eval(daHex)*hexPow;break;
			};
		}
		return dec;
	}
	
	function toHex(dec){
		var modulos = new Array();
		while(Math.floor(dec)>16){
			modulos.push(dec%16);
			dec = Math.floor(dec/16);
		}
		
		var Hex;
		switch(dec){
			case 10 : Hex = "A"; break;
			case 11 : Hex = "B"; break;
			case 12 : Hex = "C"; break;
			case 13 : Hex = "D"; break;
			case 14 : Hex = "E"; break;
			case 15 : Hex = "F"; break;
			default : Hex = ""+dec; break;
		}
		for(i=modulos.length-1;i>=0;i--){
			switch(modulos[i]){
				case 10 : Hex += "A"; break;
				case 11 : Hex += "B"; break;
				case 12 : Hex += "C"; break;
				case 13 : Hex += "D"; break;
				case 14 : Hex += "E"; break;
				case 15 : Hex += "F"; break;
				default : Hex += ""+modulos[i]; break;
			}
		}
		if(Hex.length == 1 ){
			return "0"+Hex;
		}else{
			return Hex;
		}
	}
	
	function changeColor(colorHex,step){
		var redHex = colorHex.substr(1,2);
		var greenHex = colorHex.substr(3,2);
		var blueHex = colorHex.substr(5,2);
		
		var redDec = (toDec(redHex)+step > 255) ? 255 : toDec(redHex)+step;
		var greenDec = (toDec(greenHex)+step > 255) ? 255 : toDec(greenHex)+step;
		var blueDec = (toDec(blueHex)+step > 255) ? 255 : toDec(blueHex)+step;
		
		redHex = (redDec <= 0) ? "00" : toHex(redDec);
		greenHex = (greenDec <= 0) ? "00" : toHex(greenDec);
		blueHex = (blueDec <= 0) ? "00" : toHex(blueDec);
		
		return "#"+redHex+greenHex+blueHex;
	}
	
})(jQuery);

/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

(function(jQuery){
	
	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
		},
	
		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	function keyHandler( handleObj ) {
		// Only care when a possible input has been specified
		if ( typeof handleObj.data !== "string" ) {
			return;
		}
		
		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" ");
	
		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				 event.target.type === "text") ) {
				return;
			}
			
			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}
			
			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( jQuery );;

/*!
 * jScrollPane - v2.0.0beta12 - 2012-09-27
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2010 Kelvin Luck
 * Dual licensed under the MIT or GPL licenses.
 */

// Script: jScrollPane - cross browser customisable scrollbars
//
// *Version: 2.0.0beta12, Last updated: 2012-09-27*
//
// Project Home - http://jscrollpane.kelvinluck.com/
// GitHub       - http://github.com/vitch/jScrollPane
// Source       - http://github.com/vitch/jScrollPane/raw/master/script/jquery.jscrollpane.js
// (Minified)   - http://github.com/vitch/jScrollPane/raw/master/script/jquery.jscrollpane.min.js
//
// About: License
//
// Copyright (c) 2012 Kelvin Luck
// Dual licensed under the MIT or GPL Version 2 licenses.
// http://jscrollpane.kelvinluck.com/MIT-LICENSE.txt
// http://jscrollpane.kelvinluck.com/GPL-LICENSE.txt
//
// About: Examples
//
// All examples and demos are available through the jScrollPane example site at:
// http://jscrollpane.kelvinluck.com/
//
// About: Support and Testing
//
// This plugin is tested on the browsers below and has been found to work reliably on them. If you run
// into a problem on one of the supported browsers then please visit the support section on the jScrollPane
// website (http://jscrollpane.kelvinluck.com/) for more information on getting support. You are also
// welcome to fork the project on GitHub if you can contribute a fix for a given issue. 
//
// jQuery Versions - tested in 1.4.2+ - reported to work in 1.3.x
// Browsers Tested - Firefox 3.6.8, Safari 5, Opera 10.6, Chrome 5.0, IE 6, 7, 8
//
// About: Release History
//
// 2.0.0beta12 - (2012-09-27) fix for jQuery 1.8+
// 2.0.0beta11 - (2012-05-14)
// 2.0.0beta10 - (2011-04-17) cleaner required size calculation, improved keyboard support, stickToBottom/Left, other small fixes
// 2.0.0beta9 - (2011-01-31) new API methods, bug fixes and correct keyboard support for FF/OSX
// 2.0.0beta8 - (2011-01-29) touchscreen support, improved keyboard support
// 2.0.0beta7 - (2011-01-23) scroll speed consistent (thanks Aivo Paas)
// 2.0.0beta6 - (2010-12-07) scrollToElement horizontal support
// 2.0.0beta5 - (2010-10-18) jQuery 1.4.3 support, various bug fixes
// 2.0.0beta4 - (2010-09-17) clickOnTrack support, bug fixes
// 2.0.0beta3 - (2010-08-27) Horizontal mousewheel, mwheelIntent, keyboard support, bug fixes
// 2.0.0beta2 - (2010-08-21) Bug fixes
// 2.0.0beta1 - (2010-08-17) Rewrite to follow modern best practices and enable horizontal scrolling, initially hidden
//							 elements and dynamically sized elements.
// 1.x - (2006-12-31 - 2010-07-31) Initial version, hosted at googlecode, deprecated

(function($,window,undefined){

	$.fn.jScrollPane = function(settings)
	{
		// JScrollPane "class" - public methods are available through $('selector').data('jsp')
		function JScrollPane(elem, s)
		{
			var settings, jsp = this, pane, paneWidth, paneHeight, container, contentWidth, contentHeight,
				percentInViewH, percentInViewV, isScrollableV, isScrollableH, verticalDrag, dragMaxY,
				verticalDragPosition, horizontalDrag, dragMaxX, horizontalDragPosition,
				verticalBar, verticalTrack, scrollbarWidth, verticalTrackHeight, verticalDragHeight, arrowUp, arrowDown,
				horizontalBar, horizontalTrack, horizontalTrackWidth, horizontalDragWidth, arrowLeft, arrowRight,
				reinitialiseInterval, originalPadding, originalPaddingTotalWidth, previousContentWidth,
				wasAtTop = true, wasAtLeft = true, wasAtBottom = false, wasAtRight = false,
				originalElement = elem.clone(false, false).empty(),
				mwEvent = $.fn.mwheelIntent ? 'mwheelIntent.jsp' : 'mousewheel.jsp';

			originalPadding = elem.css('paddingTop') + ' ' +
								elem.css('paddingRight') + ' ' +
								elem.css('paddingBottom') + ' ' +
								elem.css('paddingLeft');
			originalPaddingTotalWidth = (parseInt(elem.css('paddingLeft'), 10) || 0) +
										(parseInt(elem.css('paddingRight'), 10) || 0);

			function initialise(s)
			{

				var /*firstChild, lastChild, */isMaintainingPositon, lastContentX, lastContentY,
						hasContainingSpaceChanged, originalScrollTop, originalScrollLeft,
						maintainAtBottom = false, maintainAtRight = false;

				settings = s;

				if (pane === undefined) {
					originalScrollTop = elem.scrollTop();
					originalScrollLeft = elem.scrollLeft();

					elem.css(
						{
							overflow: 'hidden',
							padding: 0
						}
					);
					// TODO: Deal with where width/ height is 0 as it probably means the element is hidden and we should
					// come back to it later and check once it is unhidden...
					paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
					paneHeight = elem.innerHeight();

					elem.width(paneWidth);
					
					pane = $('<div class="jspPane" />').css('padding', originalPadding).append(elem.children());
					container = $('<div class="jspContainer" />')
						.css({
							'width': paneWidth + 'px',
							'height': paneHeight + 'px'
						}
					).append(pane).appendTo(elem);

					/*
					// Move any margins from the first and last children up to the container so they can still
					// collapse with neighbouring elements as they would before jScrollPane 
					firstChild = pane.find(':first-child');
					lastChild = pane.find(':last-child');
					elem.css(
						{
							'margin-top': firstChild.css('margin-top'),
							'margin-bottom': lastChild.css('margin-bottom')
						}
					);
					firstChild.css('margin-top', 0);
					lastChild.css('margin-bottom', 0);
					*/
				} else {
					elem.css('width', '');

					maintainAtBottom = settings.stickToBottom && isCloseToBottom();
					maintainAtRight  = settings.stickToRight  && isCloseToRight();

					hasContainingSpaceChanged = elem.innerWidth() + originalPaddingTotalWidth != paneWidth || elem.outerHeight() != paneHeight;

					if (hasContainingSpaceChanged) {
						paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
						paneHeight = elem.innerHeight();
						container.css({
							width: paneWidth + 'px',
							height: paneHeight + 'px'
						});
					}

					// If nothing changed since last check...
					if (!hasContainingSpaceChanged && previousContentWidth == contentWidth && pane.outerHeight() == contentHeight) {
						elem.width(paneWidth);
						return;
					}
					previousContentWidth = contentWidth;
					
					pane.css('width', '');
					elem.width(paneWidth);

					container.find('>.jspVerticalBar,>.jspHorizontalBar').remove().end();
				}

				pane.css('overflow', 'auto');
				if (s.contentWidth) {
					contentWidth = s.contentWidth;
				} else {
					contentWidth = pane[0].scrollWidth;
				}
				contentHeight = pane[0].scrollHeight;
				pane.css('overflow', '');

				percentInViewH = contentWidth / paneWidth;
				percentInViewV = contentHeight / paneHeight;
				isScrollableV = percentInViewV > 1;

				isScrollableH = percentInViewH > 1;

				//console.log(paneWidth, paneHeight, contentWidth, contentHeight, percentInViewH, percentInViewV, isScrollableH, isScrollableV);

				if (!(isScrollableH || isScrollableV)) {
					elem.removeClass('jspScrollable');
					pane.css({
						top: 0,
						width: container.width() - originalPaddingTotalWidth
					});
					removeMousewheel();
					removeFocusHandler();
					removeKeyboardNav();
					removeClickOnTrack();
				} else {
					elem.addClass('jspScrollable');

					isMaintainingPositon = settings.maintainPosition && (verticalDragPosition || horizontalDragPosition);
					if (isMaintainingPositon) {
						lastContentX = contentPositionX();
						lastContentY = contentPositionY();
					}

					initialiseVerticalScroll();
					initialiseHorizontalScroll();
					resizeScrollbars();

					if (isMaintainingPositon) {
						scrollToX(maintainAtRight  ? (contentWidth  - paneWidth ) : lastContentX, false);
						scrollToY(maintainAtBottom ? (contentHeight - paneHeight) : lastContentY, false);
					}

					initFocusHandler();
					initMousewheel();
					initTouch();
					
					if (settings.enableKeyboardNavigation) {
						initKeyboardNav();
					}
					if (settings.clickOnTrack) {
						initClickOnTrack();
					}
					
					observeHash();
					if (settings.hijackInternalLinks) {
						hijackInternalLinks();
					}
				}

				if (settings.autoReinitialise && !reinitialiseInterval) {
					reinitialiseInterval = setInterval(
						function()
						{
							initialise(settings);
						},
						settings.autoReinitialiseDelay
					);
				} else if (!settings.autoReinitialise && reinitialiseInterval) {
					clearInterval(reinitialiseInterval);
				}

				originalScrollTop && elem.scrollTop(0) && scrollToY(originalScrollTop, false);
				originalScrollLeft && elem.scrollLeft(0) && scrollToX(originalScrollLeft, false);

				elem.trigger('jsp-initialised', [isScrollableH || isScrollableV]);
			}

			function initialiseVerticalScroll()
			{
				if (isScrollableV) {

					container.append(
						$('<div class="jspVerticalBar" />').append(
							$('<div class="jspCap jspCapTop" />'),
							$('<div class="jspTrack" />').append(
								$('<div class="jspDrag" />').append(
									$('<div class="jspDragTop" />'),
									$('<div class="jspDragBottom" />')
								)
							),
							$('<div class="jspCap jspCapBottom" />')
						)
					);

					verticalBar = container.find('>.jspVerticalBar');
					verticalTrack = verticalBar.find('>.jspTrack');
					verticalDrag = verticalTrack.find('>.jspDrag');

					if (settings.showArrows) {
						arrowUp = $('<a class="jspArrow jspArrowUp" />').bind(
							'mousedown.jsp', getArrowScroll(0, -1)
						).bind('click.jsp', nil);
						arrowDown = $('<a class="jspArrow jspArrowDown" />').bind(
							'mousedown.jsp', getArrowScroll(0, 1)
						).bind('click.jsp', nil);
						if (settings.arrowScrollOnHover) {
							arrowUp.bind('mouseover.jsp', getArrowScroll(0, -1, arrowUp));
							arrowDown.bind('mouseover.jsp', getArrowScroll(0, 1, arrowDown));
						}

						appendArrows(verticalTrack, settings.verticalArrowPositions, arrowUp, arrowDown);
					}

					verticalTrackHeight = paneHeight;
					container.find('>.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow').each(
						function()
						{
							verticalTrackHeight -= $(this).outerHeight();
						}
					);


					verticalDrag.hover(
						function()
						{
							verticalDrag.addClass('jspHover');
						},
						function()
						{
							verticalDrag.removeClass('jspHover');
						}
					).bind(
						'mousedown.jsp',
						function(e)
						{
							// Stop IE from allowing text selection
							$('html').bind('dragstart.jsp selectstart.jsp', nil);

							verticalDrag.addClass('jspActive');

							var startY = e.pageY - verticalDrag.position().top;

							$('html').bind(
								'mousemove.jsp',
								function(e)
								{
									positionDragY(e.pageY - startY, false);
								}
							).bind('mouseup.jsp mouseleave.jsp', cancelDrag);
							return false;
						}
					);
					sizeVerticalScrollbar();
				}
			}

			function sizeVerticalScrollbar()
			{
				verticalTrack.height(verticalTrackHeight + 'px');
				verticalDragPosition = 0;
				scrollbarWidth = settings.verticalGutter + verticalTrack.outerWidth();

				// Make the pane thinner to allow for the vertical scrollbar
				pane.width(paneWidth - scrollbarWidth - originalPaddingTotalWidth);

				// Add margin to the left of the pane if scrollbars are on that side (to position
				// the scrollbar on the left or right set it's left or right property in CSS)
				try {
					if (verticalBar.position().left === 0) {
						pane.css('margin-left', scrollbarWidth + 'px');
					}
				} catch (err) {
				}
			}

			function initialiseHorizontalScroll()
			{
				if (isScrollableH) {

					container.append(
						$('<div class="jspHorizontalBar" />').append(
							$('<div class="jspCap jspCapLeft" />'),
							$('<div class="jspTrack" />').append(
								$('<div class="jspDrag" />').append(
									$('<div class="jspDragLeft" />'),
									$('<div class="jspDragRight" />')
								)
							),
							$('<div class="jspCap jspCapRight" />')
						)
					);

					horizontalBar = container.find('>.jspHorizontalBar');
					horizontalTrack = horizontalBar.find('>.jspTrack');
					horizontalDrag = horizontalTrack.find('>.jspDrag');

					if (settings.showArrows) {
						arrowLeft = $('<a class="jspArrow jspArrowLeft" />').bind(
							'mousedown.jsp', getArrowScroll(-1, 0)
						).bind('click.jsp', nil);
						arrowRight = $('<a class="jspArrow jspArrowRight" />').bind(
							'mousedown.jsp', getArrowScroll(1, 0)
						).bind('click.jsp', nil);
						if (settings.arrowScrollOnHover) {
							arrowLeft.bind('mouseover.jsp', getArrowScroll(-1, 0, arrowLeft));
							arrowRight.bind('mouseover.jsp', getArrowScroll(1, 0, arrowRight));
						}
						appendArrows(horizontalTrack, settings.horizontalArrowPositions, arrowLeft, arrowRight);
					}

					horizontalDrag.hover(
						function()
						{
							horizontalDrag.addClass('jspHover');
						},
						function()
						{
							horizontalDrag.removeClass('jspHover');
						}
					).bind(
						'mousedown.jsp',
						function(e)
						{
							// Stop IE from allowing text selection
							$('html').bind('dragstart.jsp selectstart.jsp', nil);

							horizontalDrag.addClass('jspActive');

							var startX = e.pageX - horizontalDrag.position().left;

							$('html').bind(
								'mousemove.jsp',
								function(e)
								{
									positionDragX(e.pageX - startX, false);
								}
							).bind('mouseup.jsp mouseleave.jsp', cancelDrag);
							return false;
						}
					);
					horizontalTrackWidth = container.innerWidth();
					sizeHorizontalScrollbar();
				}
			}

			function sizeHorizontalScrollbar()
			{
				container.find('>.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow').each(
					function()
					{
						horizontalTrackWidth -= $(this).outerWidth();
					}
				);

				horizontalTrack.width(horizontalTrackWidth + 'px');
				horizontalDragPosition = 0;
			}

			function resizeScrollbars()
			{
				if (isScrollableH && isScrollableV) {
					var horizontalTrackHeight = horizontalTrack.outerHeight(),
						verticalTrackWidth = verticalTrack.outerWidth();
					verticalTrackHeight -= horizontalTrackHeight;
					$(horizontalBar).find('>.jspCap:visible,>.jspArrow').each(
						function()
						{
							horizontalTrackWidth += $(this).outerWidth();
						}
					);
					horizontalTrackWidth -= verticalTrackWidth;
					paneHeight -= verticalTrackWidth;
					paneWidth -= horizontalTrackHeight;
					horizontalTrack.parent().append(
						$('<div class="jspCorner" />').css('width', horizontalTrackHeight + 'px')
					);
					sizeVerticalScrollbar();
					sizeHorizontalScrollbar();
				}
				// reflow content
				if (isScrollableH) {
					pane.width((container.outerWidth() - originalPaddingTotalWidth) + 'px');
				}
				contentHeight = pane.outerHeight();
				percentInViewV = contentHeight / paneHeight;

				if (isScrollableH) {
					horizontalDragWidth = Math.ceil(1 / percentInViewH * horizontalTrackWidth);
					if (horizontalDragWidth > settings.horizontalDragMaxWidth) {
						horizontalDragWidth = settings.horizontalDragMaxWidth;
					} else if (horizontalDragWidth < settings.horizontalDragMinWidth) {
						horizontalDragWidth = settings.horizontalDragMinWidth;
					}
					horizontalDrag.width(horizontalDragWidth + 'px');
					dragMaxX = horizontalTrackWidth - horizontalDragWidth;
					_positionDragX(horizontalDragPosition); // To update the state for the arrow buttons
				}
				if (isScrollableV) {
					verticalDragHeight = Math.ceil(1 / percentInViewV * verticalTrackHeight);
					if (verticalDragHeight > settings.verticalDragMaxHeight) {
						verticalDragHeight = settings.verticalDragMaxHeight;
					} else if (verticalDragHeight < settings.verticalDragMinHeight) {
						verticalDragHeight = settings.verticalDragMinHeight;
					}
					verticalDrag.height(verticalDragHeight + 'px');
					dragMaxY = verticalTrackHeight - verticalDragHeight;
					_positionDragY(verticalDragPosition); // To update the state for the arrow buttons
				}
			}

			function appendArrows(ele, p, a1, a2)
			{
				var p1 = "before", p2 = "after", aTemp;
				
				// Sniff for mac... Is there a better way to determine whether the arrows would naturally appear
				// at the top or the bottom of the bar?
				if (p == "os") {
					p = /Mac/.test(navigator.platform) ? "after" : "split";
				}
				if (p == p1) {
					p2 = p;
				} else if (p == p2) {
					p1 = p;
					aTemp = a1;
					a1 = a2;
					a2 = aTemp;
				}

				ele[p1](a1)[p2](a2);
			}

			function getArrowScroll(dirX, dirY, ele)
			{
				return function()
				{
					arrowScroll(dirX, dirY, this, ele);
					this.blur();
					return false;
				};
			}

			function arrowScroll(dirX, dirY, arrow, ele)
			{
				arrow = $(arrow).addClass('jspActive');

				var eve,
					scrollTimeout,
					isFirst = true,
					doScroll = function()
					{
						if (dirX !== 0) {
							jsp.scrollByX(dirX * settings.arrowButtonSpeed);
						}
						if (dirY !== 0) {
							jsp.scrollByY(dirY * settings.arrowButtonSpeed);
						}
						scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.arrowRepeatFreq);
						isFirst = false;
					};

				doScroll();

				eve = ele ? 'mouseout.jsp' : 'mouseup.jsp';
				ele = ele || $('html');
				ele.bind(
					eve,
					function()
					{
						arrow.removeClass('jspActive');
						scrollTimeout && clearTimeout(scrollTimeout);
						scrollTimeout = null;
						ele.unbind(eve);
					}
				);
			}

			function initClickOnTrack()
			{
				removeClickOnTrack();
				if (isScrollableV) {
					verticalTrack.bind(
						'mousedown.jsp',
						function(e)
						{
							if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
								var clickedTrack = $(this),
									offset = clickedTrack.offset(),
									direction = e.pageY - offset.top - verticalDragPosition,
									scrollTimeout,
									isFirst = true,
									doScroll = function()
									{
										var offset = clickedTrack.offset(),
											pos = e.pageY - offset.top - verticalDragHeight / 2,
											contentDragY = paneHeight * settings.scrollPagePercent,
											dragY = dragMaxY * contentDragY / (contentHeight - paneHeight);
										if (direction < 0) {
											if (verticalDragPosition - dragY > pos) {
												jsp.scrollByY(-contentDragY);
											} else {
												positionDragY(pos);
											}
										} else if (direction > 0) {
											if (verticalDragPosition + dragY < pos) {
												jsp.scrollByY(contentDragY);
											} else {
												positionDragY(pos);
											}
										} else {
											cancelClick();
											return;
										}
										scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
										isFirst = false;
									},
									cancelClick = function()
									{
										scrollTimeout && clearTimeout(scrollTimeout);
										scrollTimeout = null;
										$(document).unbind('mouseup.jsp', cancelClick);
									};
								doScroll();
								$(document).bind('mouseup.jsp', cancelClick);
								return false;
							}
						}
					);
				}
				
				if (isScrollableH) {
					horizontalTrack.bind(
						'mousedown.jsp',
						function(e)
						{
							if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
								var clickedTrack = $(this),
									offset = clickedTrack.offset(),
									direction = e.pageX - offset.left - horizontalDragPosition,
									scrollTimeout,
									isFirst = true,
									doScroll = function()
									{
										var offset = clickedTrack.offset(),
											pos = e.pageX - offset.left - horizontalDragWidth / 2,
											contentDragX = paneWidth * settings.scrollPagePercent,
											dragX = dragMaxX * contentDragX / (contentWidth - paneWidth);
										if (direction < 0) {
											if (horizontalDragPosition - dragX > pos) {
												jsp.scrollByX(-contentDragX);
											} else {
												positionDragX(pos);
											}
										} else if (direction > 0) {
											if (horizontalDragPosition + dragX < pos) {
												jsp.scrollByX(contentDragX);
											} else {
												positionDragX(pos);
											}
										} else {
											cancelClick();
											return;
										}
										scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
										isFirst = false;
									},
									cancelClick = function()
									{
										scrollTimeout && clearTimeout(scrollTimeout);
										scrollTimeout = null;
										$(document).unbind('mouseup.jsp', cancelClick);
									};
								doScroll();
								$(document).bind('mouseup.jsp', cancelClick);
								return false;
							}
						}
					);
				}
			}

			function removeClickOnTrack()
			{
				if (horizontalTrack) {
					horizontalTrack.unbind('mousedown.jsp');
				}
				if (verticalTrack) {
					verticalTrack.unbind('mousedown.jsp');
				}
			}

			function cancelDrag()
			{
				$('html').unbind('dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp');

				if (verticalDrag) {
					verticalDrag.removeClass('jspActive');
				}
				if (horizontalDrag) {
					horizontalDrag.removeClass('jspActive');
				}
			}

			function positionDragY(destY, animate)
			{
				if (!isScrollableV) {
					return;
				}
				if (destY < 0) {
					destY = 0;
				} else if (destY > dragMaxY) {
					destY = dragMaxY;
				}

				// can't just check if(animate) because false is a valid value that could be passed in...
				if (animate === undefined) {
					animate = settings.animateScroll;
				}
				if (animate) {
					jsp.animate(verticalDrag, 'top', destY,	_positionDragY);
				} else {
					verticalDrag.css('top', destY);
					_positionDragY(destY);
				}

			}

			function _positionDragY(destY)
			{
				if (destY === undefined) {
					destY = verticalDrag.position().top;
				}

				container.scrollTop(0);
				verticalDragPosition = destY;

				var isAtTop = verticalDragPosition === 0,
					isAtBottom = verticalDragPosition == dragMaxY,
					percentScrolled = destY/ dragMaxY,
					destTop = -percentScrolled * (contentHeight - paneHeight);

				if (wasAtTop != isAtTop || wasAtBottom != isAtBottom) {
					wasAtTop = isAtTop;
					wasAtBottom = isAtBottom;
					elem.trigger('jsp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
				}
				
				updateVerticalArrows(isAtTop, isAtBottom);
				pane.css('top', destTop);
				elem.trigger('jsp-scroll-y', [-destTop, isAtTop, isAtBottom]).trigger('scroll');
			}

			function positionDragX(destX, animate)
			{
				if (!isScrollableH) {
					return;
				}
				if (destX < 0) {
					destX = 0;
				} else if (destX > dragMaxX) {
					destX = dragMaxX;
				}

				if (animate === undefined) {
					animate = settings.animateScroll;
				}
				if (animate) {
					jsp.animate(horizontalDrag, 'left', destX,	_positionDragX);
				} else {
					horizontalDrag.css('left', destX);
					_positionDragX(destX);
				}
			}

			function _positionDragX(destX)
			{
				if (destX === undefined) {
					destX = horizontalDrag.position().left;
				}

				container.scrollTop(0);
				horizontalDragPosition = destX;

				var isAtLeft = horizontalDragPosition === 0,
					isAtRight = horizontalDragPosition == dragMaxX,
					percentScrolled = destX / dragMaxX,
					destLeft = -percentScrolled * (contentWidth - paneWidth);

				if (wasAtLeft != isAtLeft || wasAtRight != isAtRight) {
					wasAtLeft = isAtLeft;
					wasAtRight = isAtRight;
					elem.trigger('jsp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
				}
				
				updateHorizontalArrows(isAtLeft, isAtRight);
				pane.css('left', destLeft);
				elem.trigger('jsp-scroll-x', [-destLeft, isAtLeft, isAtRight]).trigger('scroll');
			}

			function updateVerticalArrows(isAtTop, isAtBottom)
			{
				if (settings.showArrows) {
					arrowUp[isAtTop ? 'addClass' : 'removeClass']('jspDisabled');
					arrowDown[isAtBottom ? 'addClass' : 'removeClass']('jspDisabled');
				}
			}

			function updateHorizontalArrows(isAtLeft, isAtRight)
			{
				if (settings.showArrows) {
					arrowLeft[isAtLeft ? 'addClass' : 'removeClass']('jspDisabled');
					arrowRight[isAtRight ? 'addClass' : 'removeClass']('jspDisabled');
				}
			}

			function scrollToY(destY, animate)
			{
				var percentScrolled = destY / (contentHeight - paneHeight);
				positionDragY(percentScrolled * dragMaxY, animate);
			}

			function scrollToX(destX, animate)
			{
				var percentScrolled = destX / (contentWidth - paneWidth);
				positionDragX(percentScrolled * dragMaxX, animate);
			}

			function scrollToElement(ele, stickToTop, animate)
			{
				var e, eleHeight, eleWidth, eleTop = 0, eleLeft = 0, viewportTop, viewportLeft, maxVisibleEleTop, maxVisibleEleLeft, destY, destX;

				// Legal hash values aren't necessarily legal jQuery selectors so we need to catch any
				// errors from the lookup...
				try {
					e = $(ele);
				} catch (err) {
					return;
				}
				eleHeight = e.outerHeight();
				eleWidth= e.outerWidth();

				container.scrollTop(0);
				container.scrollLeft(0);
				
				// loop through parents adding the offset top of any elements that are relatively positioned between
				// the focused element and the jspPane so we can get the true distance from the top
				// of the focused element to the top of the scrollpane...
				while (!e.is('.jspPane')) {
					eleTop += e.position().top;
					eleLeft += e.position().left;
					e = e.offsetParent();
					if (/^body|html$/i.test(e[0].nodeName)) {
						// we ended up too high in the document structure. Quit!
						return;
					}
				}

				viewportTop = contentPositionY();
				maxVisibleEleTop = viewportTop + paneHeight;
				if (eleTop < viewportTop || stickToTop) { // element is above viewport
					destY = eleTop - settings.verticalGutter;
				} else if (eleTop + eleHeight > maxVisibleEleTop) { // element is below viewport
					destY = eleTop - paneHeight + eleHeight + settings.verticalGutter;
				}
				if (destY) {
					scrollToY(destY, animate);
				}
				
				viewportLeft = contentPositionX();
	            maxVisibleEleLeft = viewportLeft + paneWidth;
	            if (eleLeft < viewportLeft || stickToTop) { // element is to the left of viewport
	                destX = eleLeft - settings.horizontalGutter;
	            } else if (eleLeft + eleWidth > maxVisibleEleLeft) { // element is to the right viewport
	                destX = eleLeft - paneWidth + eleWidth + settings.horizontalGutter;
	            }
	            if (destX) {
	                scrollToX(destX, animate);
	            }

			}

			function contentPositionX()
			{
				return -pane.position().left;
			}

			function contentPositionY()
			{
				return -pane.position().top;
			}

			function isCloseToBottom()
			{
				var scrollableHeight = contentHeight - paneHeight;
				return (scrollableHeight > 20) && (scrollableHeight - contentPositionY() < 10);
			}

			function isCloseToRight()
			{
				var scrollableWidth = contentWidth - paneWidth;
				return (scrollableWidth > 20) && (scrollableWidth - contentPositionX() < 10);
			}

			function initMousewheel()
			{
				container.unbind(mwEvent).bind(
					mwEvent,
					function (event, delta, deltaX, deltaY) {
						var dX = horizontalDragPosition, dY = verticalDragPosition;
						jsp.scrollBy(deltaX * settings.mouseWheelSpeed, -deltaY * settings.mouseWheelSpeed, false);
						// return true if there was no movement so rest of screen can scroll
						return dX == horizontalDragPosition && dY == verticalDragPosition;
					}
				);
			}

			function removeMousewheel()
			{
				container.unbind(mwEvent);
			}

			function nil()
			{
				return false;
			}

			function initFocusHandler()
			{
				pane.find(':input,a').unbind('focus.jsp').bind(
					'focus.jsp',
					function(e)
					{
						scrollToElement(e.target, false);
					}
				);
			}

			function removeFocusHandler()
			{
				pane.find(':input,a').unbind('focus.jsp');
			}
			
			function initKeyboardNav()
			{
				var keyDown, elementHasScrolled, validParents = [];
				isScrollableH && validParents.push(horizontalBar[0]);
				isScrollableV && validParents.push(verticalBar[0]);
				
				// IE also focuses elements that don't have tabindex set.
				pane.focus(
					function()
					{
						elem.focus();
					}
				);
				
				elem.attr('tabindex', 0)
					.unbind('keydown.jsp keypress.jsp')
					.bind(
						'keydown.jsp',
						function(e)
						{
							if (e.target !== this && !(validParents.length && $(e.target).closest(validParents).length)){
								return;
							}
							var dX = horizontalDragPosition, dY = verticalDragPosition;
							switch(e.keyCode) {
								case 40: // down
								case 38: // up
								case 34: // page down
								case 32: // space
								case 33: // page up
								case 39: // right
								case 37: // left
									keyDown = e.keyCode;
									keyDownHandler();
									break;
								case 35: // end
									scrollToY(contentHeight - paneHeight);
									keyDown = null;
									break;
								case 36: // home
									scrollToY(0);
									keyDown = null;
									break;
							}

							elementHasScrolled = e.keyCode == keyDown && dX != horizontalDragPosition || dY != verticalDragPosition;
							return !elementHasScrolled;
						}
					).bind(
						'keypress.jsp', // For FF/ OSX so that we can cancel the repeat key presses if the JSP scrolls...
						function(e)
						{
							if (e.keyCode == keyDown) {
								keyDownHandler();
							}
							return !elementHasScrolled;
						}
					);
				
				if (settings.hideFocus) {
					elem.css('outline', 'none');
					if ('hideFocus' in container[0]){
						elem.attr('hideFocus', true);
					}
				} else {
					elem.css('outline', '');
					if ('hideFocus' in container[0]){
						elem.attr('hideFocus', false);
					}
				}
				
				function keyDownHandler()
				{
					var dX = horizontalDragPosition, dY = verticalDragPosition;
					switch(keyDown) {
						case 40: // down
							jsp.scrollByY(settings.keyboardSpeed, false);
							break;
						case 38: // up
							jsp.scrollByY(-settings.keyboardSpeed, false);
							break;
						case 34: // page down
						case 32: // space
							jsp.scrollByY(paneHeight * settings.scrollPagePercent, false);
							break;
						case 33: // page up
							jsp.scrollByY(-paneHeight * settings.scrollPagePercent, false);
							break;
						case 39: // right
							jsp.scrollByX(settings.keyboardSpeed, false);
							break;
						case 37: // left
							jsp.scrollByX(-settings.keyboardSpeed, false);
							break;
					}

					elementHasScrolled = dX != horizontalDragPosition || dY != verticalDragPosition;
					return elementHasScrolled;
				}
			}
			
			function removeKeyboardNav()
			{
				elem.attr('tabindex', '-1')
					.removeAttr('tabindex')
					.unbind('keydown.jsp keypress.jsp');
			}

			function observeHash()
			{
				if (location.hash && location.hash.length > 1) {
					var e,
						retryInt,
						hash = escape(location.hash.substr(1)) // hash must be escaped to prevent XSS
						;
					try {
						e = $('#' + hash + ', a[name="' + hash + '"]');
					} catch (err) {
						return;
					}

					if (e.length && pane.find(hash)) {
						// nasty workaround but it appears to take a little while before the hash has done its thing
						// to the rendered page so we just wait until the container's scrollTop has been messed up.
						if (container.scrollTop() === 0) {
							retryInt = setInterval(
								function()
								{
									if (container.scrollTop() > 0) {
										scrollToElement(e, true);
										$(document).scrollTop(container.position().top);
										clearInterval(retryInt);
									}
								},
								50
							);
						} else {
							scrollToElement(e, true);
							$(document).scrollTop(container.position().top);
						}
					}
				}
			}

			function hijackInternalLinks()
			{
				// only register the link handler once
				if ($(document.body).data('jspHijack')) {
					return;
				}

				// remember that the handler was bound
				$(document.body).data('jspHijack', true);

				// use live handler to also capture newly created links
				$(document.body).delegate('a[href*=#]', 'click', function(event) {
					// does the link point to the same page?
					// this also takes care of cases with a <base>-Tag or Links not starting with the hash #
					// e.g. <a href="index.html#test"> when the current url already is index.html
					var href = this.href.substr(0, this.href.indexOf('#')),
						locationHref = location.href,
						hash,
						element,
						container,
						jsp,
						scrollTop,
						elementTop;
					if (location.href.indexOf('#') !== -1) {
						locationHref = location.href.substr(0, location.href.indexOf('#'));
					}
					if (href !== locationHref) {
						// the link points to another page
						return;
					}

					// check if jScrollPane should handle this click event
					hash = escape(this.href.substr(this.href.indexOf('#') + 1));

					// find the element on the page
					element;
					try {
						element = $('#' + hash + ', a[name="' + hash + '"]');
					} catch (e) {
						// hash is not a valid jQuery identifier
						return;
					}

					if (!element.length) {
						// this link does not point to an element on this page
						return;
					}

					container = element.closest('.jspScrollable');
					jsp = container.data('jsp');

					// jsp might be another jsp instance than the one, that bound this event
					// remember: this event is only bound once for all instances.
					jsp.scrollToElement(element, true);

					if (container[0].scrollIntoView) {
						// also scroll to the top of the container (if it is not visible)
						scrollTop = $(window).scrollTop();
						elementTop = element.offset().top;
						if (elementTop < scrollTop || elementTop > scrollTop + $(window).height()) {
							container[0].scrollIntoView();
						}
					}

					// jsp handled this event, prevent the browser default (scrolling :P)
					event.preventDefault();
				});
			}
			
			// Init touch on iPad, iPhone, iPod, Android
			function initTouch()
			{
				var startX,
					startY,
					touchStartX,
					touchStartY,
					moved,
					moving = false;
  
				container.unbind('touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick').bind(
					'touchstart.jsp',
					function(e)
					{
						var touch = e.originalEvent.touches[0];
						startX = contentPositionX();
						startY = contentPositionY();
						touchStartX = touch.pageX;
						touchStartY = touch.pageY;
						moved = false;
						moving = true;
					}
				).bind(
					'touchmove.jsp',
					function(ev)
					{
						if(!moving) {
							return;
						}
						
						var touchPos = ev.originalEvent.touches[0],
							dX = horizontalDragPosition, dY = verticalDragPosition;
						
						jsp.scrollTo(startX + touchStartX - touchPos.pageX, startY + touchStartY - touchPos.pageY);
						
						moved = moved || Math.abs(touchStartX - touchPos.pageX) > 5 || Math.abs(touchStartY - touchPos.pageY) > 5;
						
						// return true if there was no movement so rest of screen can scroll
						return dX == horizontalDragPosition && dY == verticalDragPosition;
					}
				).bind(
					'touchend.jsp',
					function(e)
					{
						moving = false;
						/*if(moved) {
							return false;
						}*/
					}
				).bind(
					'click.jsp-touchclick',
					function(e)
					{
						if(moved) {
							moved = false;
							return false;
						}
					}
				);
			}
			
			function destroy(){
				var currentY = contentPositionY(),
					currentX = contentPositionX();
				elem.removeClass('jspScrollable').unbind('.jsp');
				elem.replaceWith(originalElement.append(pane.children()));
				originalElement.scrollTop(currentY);
				originalElement.scrollLeft(currentX);

				// clear reinitialize timer if active
				if (reinitialiseInterval) {
					clearInterval(reinitialiseInterval);
				}
			}

			// Public API
			$.extend(
				jsp,
				{
					// Reinitialises the scroll pane (if it's internal dimensions have changed since the last time it
					// was initialised). The settings object which is passed in will override any settings from the
					// previous time it was initialised - if you don't pass any settings then the ones from the previous
					// initialisation will be used.
					reinitialise: function(s)
					{
						s = $.extend({}, settings, s);
						initialise(s);
					},
					// Scrolls the specified element (a jQuery object, DOM node or jQuery selector string) into view so
					// that it can be seen within the viewport. If stickToTop is true then the element will appear at
					// the top of the viewport, if it is false then the viewport will scroll as little as possible to
					// show the element. You can also specify if you want animation to occur. If you don't provide this
					// argument then the animateScroll value from the settings object is used instead.
					scrollToElement: function(ele, stickToTop, animate)
					{
						scrollToElement(ele, stickToTop, animate);
					},
					// Scrolls the pane so that the specified co-ordinates within the content are at the top left
					// of the viewport. animate is optional and if not passed then the value of animateScroll from
					// the settings object this jScrollPane was initialised with is used.
					scrollTo: function(destX, destY, animate)
					{
						scrollToX(destX, animate);
						scrollToY(destY, animate);
					},
					// Scrolls the pane so that the specified co-ordinate within the content is at the left of the
					// viewport. animate is optional and if not passed then the value of animateScroll from the settings
					// object this jScrollPane was initialised with is used.
					scrollToX: function(destX, animate)
					{
						scrollToX(destX, animate);
					},
					// Scrolls the pane so that the specified co-ordinate within the content is at the top of the
					// viewport. animate is optional and if not passed then the value of animateScroll from the settings
					// object this jScrollPane was initialised with is used.
					scrollToY: function(destY, animate)
					{
						scrollToY(destY, animate);
					},
					// Scrolls the pane to the specified percentage of its maximum horizontal scroll position. animate
					// is optional and if not passed then the value of animateScroll from the settings object this
					// jScrollPane was initialised with is used.
					scrollToPercentX: function(destPercentX, animate)
					{
						scrollToX(destPercentX * (contentWidth - paneWidth), animate);
					},
					// Scrolls the pane to the specified percentage of its maximum vertical scroll position. animate
					// is optional and if not passed then the value of animateScroll from the settings object this
					// jScrollPane was initialised with is used.
					scrollToPercentY: function(destPercentY, animate)
					{
						scrollToY(destPercentY * (contentHeight - paneHeight), animate);
					},
					// Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
					// the value of animateScroll from the settings object this jScrollPane was initialised with is used.
					scrollBy: function(deltaX, deltaY, animate)
					{
						jsp.scrollByX(deltaX, animate);
						jsp.scrollByY(deltaY, animate);
					},
					// Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
					// the value of animateScroll from the settings object this jScrollPane was initialised with is used.
					scrollByX: function(deltaX, animate)
					{
						var destX = contentPositionX() + Math[deltaX<0 ? 'floor' : 'ceil'](deltaX),
							percentScrolled = destX / (contentWidth - paneWidth);
						positionDragX(percentScrolled * dragMaxX, animate);
					},
					// Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
					// the value of animateScroll from the settings object this jScrollPane was initialised with is used.
					scrollByY: function(deltaY, animate)
					{
						var destY = contentPositionY() + Math[deltaY<0 ? 'floor' : 'ceil'](deltaY),
							percentScrolled = destY / (contentHeight - paneHeight);
						positionDragY(percentScrolled * dragMaxY, animate);
					},
					// Positions the horizontal drag at the specified x position (and updates the viewport to reflect
					// this). animate is optional and if not passed then the value of animateScroll from the settings
					// object this jScrollPane was initialised with is used.
					positionDragX: function(x, animate)
					{
						positionDragX(x, animate);
					},
					// Positions the vertical drag at the specified y position (and updates the viewport to reflect
					// this). animate is optional and if not passed then the value of animateScroll from the settings
					// object this jScrollPane was initialised with is used.
					positionDragY: function(y, animate)
					{
						positionDragY(y, animate);
					},
					// This method is called when jScrollPane is trying to animate to a new position. You can override
					// it if you want to provide advanced animation functionality. It is passed the following arguments:
					//  * ele          - the element whose position is being animated
					//  * prop         - the property that is being animated
					//  * value        - the value it's being animated to
					//  * stepCallback - a function that you must execute each time you update the value of the property
					// You can use the default implementation (below) as a starting point for your own implementation.
					animate: function(ele, prop, value, stepCallback)
					{
						var params = {};
						params[prop] = value;
						ele.animate(
							params,
							{
								'duration'	: settings.animateDuration,
								'easing'	: settings.animateEase,
								'queue'		: false,
								'step'		: stepCallback
							}
						);
					},
					// Returns the current x position of the viewport with regards to the content pane.
					getContentPositionX: function()
					{
						return contentPositionX();
					},
					// Returns the current y position of the viewport with regards to the content pane.
					getContentPositionY: function()
					{
						return contentPositionY();
					},
					// Returns the width of the content within the scroll pane.
					getContentWidth: function()
					{
						return contentWidth;
					},
					// Returns the height of the content within the scroll pane.
					getContentHeight: function()
					{
						return contentHeight;
					},
					// Returns the horizontal position of the viewport within the pane content.
					getPercentScrolledX: function()
					{
						return contentPositionX() / (contentWidth - paneWidth);
					},
					// Returns the vertical position of the viewport within the pane content.
					getPercentScrolledY: function()
					{
						return contentPositionY() / (contentHeight - paneHeight);
					},
					// Returns whether or not this scrollpane has a horizontal scrollbar.
					getIsScrollableH: function()
					{
						return isScrollableH;
					},
					// Returns whether or not this scrollpane has a vertical scrollbar.
					getIsScrollableV: function()
					{
						return isScrollableV;
					},
					// Gets a reference to the content pane. It is important that you use this method if you want to
					// edit the content of your jScrollPane as if you access the element directly then you may have some
					// problems (as your original element has had additional elements for the scrollbars etc added into
					// it).
					getContentPane: function()
					{
						return pane;
					},
					// Scrolls this jScrollPane down as far as it can currently scroll. If animate isn't passed then the
					// animateScroll value from settings is used instead.
					scrollToBottom: function(animate)
					{
						positionDragY(dragMaxY, animate);
					},
					// Hijacks the links on the page which link to content inside the scrollpane. If you have changed
					// the content of your page (e.g. via AJAX) and want to make sure any new anchor links to the
					// contents of your scroll pane will work then call this function.
					hijackInternalLinks: $.noop,
					// Removes the jScrollPane and returns the page to the state it was in before jScrollPane was
					// initialised.
					destroy: function()
					{
							destroy();
					}
				}
			);
			
			initialise(s);
		}

		// Pluginifying code...
		settings = $.extend({}, $.fn.jScrollPane.defaults, settings);
		
		// Apply default speed
		$.each(['mouseWheelSpeed', 'arrowButtonSpeed', 'trackClickSpeed', 'keyboardSpeed'], function() {
			settings[this] = settings[this] || settings.speed;
		});

		return this.each(
			function()
			{
				var elem = $(this), jspApi = elem.data('jsp');
				if (jspApi) {
					jspApi.reinitialise(settings);
				} else {
					$("script",elem).filter('[type="text/javascript"],:not([type])').remove();
					jspApi = new JScrollPane(elem, settings);
					elem.data('jsp', jspApi);
				}
			}
		);
	};

	$.fn.jScrollPane.defaults = {
		showArrows					: false,
		maintainPosition			: true,
		stickToBottom				: false,
		stickToRight				: false,
		clickOnTrack				: true,
		autoReinitialise			: false,
		autoReinitialiseDelay		: 500,
		verticalDragMinHeight		: 0,
		verticalDragMaxHeight		: 99999,
		horizontalDragMinWidth		: 0,
		horizontalDragMaxWidth		: 99999,
		contentWidth				: undefined,
		animateScroll				: false,
		animateDuration				: 300,
		animateEase					: 'linear',
		hijackInternalLinks			: false,
		verticalGutter				: 4,
		horizontalGutter			: 4,
		mouseWheelSpeed				: 0,
		arrowButtonSpeed			: 0,
		arrowRepeatFreq				: 50,
		arrowScrollOnHover			: false,
		trackClickSpeed				: 0,
		trackClickRepeatFreq		: 70,
		verticalArrowPositions		: 'split',
		horizontalArrowPositions	: 'split',
		enableKeyboardNavigation	: true,
		hideFocus					: false,
		keyboardSpeed				: 0,
		initialDelay                : 300,        // Delay before starting repeating
		speed						: 30,		// Default speed when others falsey
		scrollPagePercent			: .8		// Percent of visible area scrolled when pageUp/Down or track area pressed
	};

})(jQuery,this);

;

/*
 * jsTree 1.0-rc3
 * http://jstree.com/
 *
 * Copyright (c) 2010 Ivan Bozhanov (vakata.com)
 *
 * Licensed same as jquery - under the terms of either the MIT License or the GPL Version 2 License
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * $Date: 2011-02-09 01:17:14 +0200 (ср, 09 февр 2011) $
 * $Revision: 236 $
 *//*jslint browser: true, onevar: true, undef: true, bitwise: true, strict: true *//*global window : false, clearInterval: false, clearTimeout: false, document: false, setInterval: false, setTimeout: false, jQuery: false, navigator: false, XSLTProcessor: false, DOMParser: false, XMLSerializer: false*/"use strict",function(){if(jQuery&&jQuery.jstree)return;var a=!1,b=!1,c=!1;(function(d){d.vakata={},d.vakata.css={get_css:function(a,b,c){a=a.toLowerCase();var d=c.cssRules||c.rules,e=0;do{if(d.length&&e>d.length+5)return!1;if(d[e].selectorText&&d[e].selectorText.toLowerCase()==a)return b===!0?(c.removeRule&&c.removeRule(e),c.deleteRule&&c.deleteRule(e),!0):d[e]}while(d[++e]);return!1},add_css:function(a,b){return d.jstree.css.get_css(a,!1,b)?!1:(b.insertRule?b.insertRule(a+" { }",0):b.addRule(a,null,0),d.vakata.css.get_css(a))},remove_css:function(a,b){return d.vakata.css.get_css(a,!0,b)},add_sheet:function(a){var b=!1,c=!0;if(a.str)return a.title&&(b=d("style[id='"+a.title+"-stylesheet']")[0]),b?c=!1:(b=document.createElement("style"),b.setAttribute("type","text/css"),a.title&&b.setAttribute("id",a.title+"-stylesheet")),b.styleSheet?c?(document.getElementsByTagName("head")[0].appendChild(b),b.styleSheet.cssText=a.str):b.styleSheet.cssText=b.styleSheet.cssText+" "+a.str:(b.appendChild(document.createTextNode(a.str)),document.getElementsByTagName("head")[0].appendChild(b)),b.sheet||b.styleSheet;if(a.url){if(!document.createStyleSheet)return b=document.createElement("link"),b.rel="stylesheet",b.type="text/css",b.media="all",b.href=a.url,document.getElementsByTagName("head")[0].appendChild(b),b.styleSheet;try{b=document.createStyleSheet(a.url)}catch(e){}}}};var e=[],f=-1,g={},h={};d.fn.jstree=function(a){var b=typeof a=="string",c=Array.prototype.slice.call(arguments,1),f=this;if(b){if(a.substring(0,1)=="_")return f;this.each(function(){var b=e[d.data(this,"jstree_instance_id")],g=b&&d.isFunction(b[a])?b[a].apply(b,c):b;if(typeof g!="undefined"&&(a.indexOf("is_")===0||g!==!0&&g!==!1))return f=g,!1})}else this.each(function(){var b=d.data(this,"jstree_instance_id"),f=[],h=a?d.extend({},!0,a):{},i=d(this),j=!1,k=[];f=f.concat(c),i.data("jstree")&&f.push(i.data("jstree")),h=f.length?d.extend.apply(null,[!0,h].concat(f)):h,typeof b!="undefined"&&e[b]&&e[b].destroy(),b=parseInt(e.push({}),10)-1,d.data(this,"jstree_instance_id",b),h.plugins=d.isArray(h.plugins)?h.plugins:d.jstree.defaults.plugins.slice(),h.plugins.unshift("core"),h.plugins=h.plugins.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(","),j=d.extend(!0,{},d.jstree.defaults,h),j.plugins=h.plugins,d.each(g,function(a,b){d.inArray(a,j.plugins)===-1?(j[a]=null,delete j[a]):k.push(a)}),j.plugins=k,e[b]=new d.jstree._instance(b,d(this).addClass("jstree jstree-"+b),j),d.each(e[b]._get_settings().plugins,function(a,c){e[b].data[c]={}}),d.each(e[b]._get_settings().plugins,function(a,c){g[c]&&g[c].__init.apply(e[b])}),setTimeout(function(){e[b]&&e[b].init()},0)});return f},d.jstree={defaults:{plugins:[]},_focused:function(){return e[f]||null},_reference:function(a){if(e[a])return e[a];var b=d(a);return!b.length&&typeof a=="string"&&(b=d("#"+a)),b.length?e[b.closest(".jstree").data("jstree_instance_id")]||null:null},_instance:function(a,b,c){this.data={core:{}},this.get_settings=function(){return d.extend(!0,{},c)},this._get_settings=function(){return c},this.get_index=function(){return a},this.get_container=function(){return b},this.get_container_ul=function(){return b.children("ul:eq(0)")},this._set_settings=function(a){c=d.extend(!0,{},c,a)}},_fn:{},plugin:function(a,b){b=d.extend({},{__init:d.noop,__destroy:d.noop,_fn:{},defaults:!1},b),g[a]=b,d.jstree.defaults[a]=b.defaults,d.each(b._fn,function(b,c){c.plugin=a,c.old=d.jstree._fn[b],d.jstree._fn[b]=function(){var a,e=c,f=Array.prototype.slice.call(arguments),g=new d.Event("before.jstree"),h=!1;if(this.data.core.locked===!0&&b!=="unlock"&&b!=="is_locked")return;do{if(e&&e.plugin&&d.inArray(e.plugin,this._get_settings().plugins)!==-1)break;e=e.old}while(e);if(!e)return;if(b.indexOf("_")===0)a=e.apply(this,f);else{a=this.get_container().triggerHandler(g,{func:b,inst:this,args:f,plugin:e.plugin});if(a===!1)return;typeof a!="undefined"&&(f=a),a=e.apply(d.extend({},this,{__callback:function(a){this.get_container().triggerHandler(b+".jstree",{inst:this,args:f,rslt:a,rlbk:h})},__rollback:function(){return h=this.get_rollback(),h},__call_old:function(a){return e.old.apply(this,a?Array.prototype.slice.call(arguments,1):f)}}),f)}return a},d.jstree._fn[b].old=c.old,d.jstree._fn[b].plugin=a})},rollback:function(a){a&&(d.isArray(a)||(a=[a]),d.each(a,function(a,b){e[b.i].set_rollback(b.h,b.d)}))}},d.jstree._fn=d.jstree._instance.prototype={},d(function(){var e=navigator.userAgent.toLowerCase(),f=(e.match(/.+?(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[0,"0"])[1],g=".jstree ul, .jstree li { display:block; margin:0 0 0 0; padding:0 0 0 0; list-style-type:none; } .jstree li { display:block; min-height:18px; line-height:18px; white-space:nowrap; margin-left:18px; min-width:18px; } .jstree-rtl li { margin-left:0; margin-right:18px; } .jstree > ul > li { margin-left:0px; } .jstree-rtl > ul > li { margin-right:0px; } .jstree ins { display:inline-block; text-decoration:none; width:18px; height:18px; margin:0 0 0 0; padding:0; } .jstree a { display:inline-block; line-height:16px; height:16px; color:black; white-space:nowrap; text-decoration:none; padding:1px 2px; margin:0; } .jstree a:focus { outline: none; } .jstree a > ins { height:16px; width:16px; } .jstree a > .jstree-icon { margin-right:3px; } .jstree-rtl a > .jstree-icon { margin-left:3px; margin-right:0; } li.jstree-open > ul { display:block; } li.jstree-closed > ul { display:none; } ";if(/msie/.test(e)&&parseInt(f,10)==6){a=!0;try{document.execCommand("BackgroundImageCache",!1,!0)}catch(h){}g+=".jstree li { height:18px; margin-left:0; margin-right:0; } .jstree li li { margin-left:18px; } .jstree-rtl li li { margin-left:0px; margin-right:18px; } li.jstree-open ul { display:block; } li.jstree-closed ul { display:none !important; } .jstree li a { display:inline; border-width:0 !important; padding:0px 2px !important; } .jstree li a ins { height:16px; width:16px; margin-right:3px; } .jstree-rtl li a ins { margin-right:0px; margin-left:3px; } "}/msie/.test(e)&&parseInt(f,10)==7&&(b=!0,g+=".jstree li a { border-width:0 !important; padding:0px 2px !important; } "),!/compatible/.test(e)&&/mozilla/.test(e)&&parseFloat(f,10)<1.9&&(c=!0,g+=".jstree ins { display:-moz-inline-box; } .jstree li { line-height:12px; } .jstree a { display:-moz-inline-box; } .jstree .jstree-no-icons .jstree-checkbox { display:-moz-inline-stack !important; } "),d.vakata.css.add_sheet({str:g,title:"jstree"})}),d.jstree.plugin("core",{__init:function(){this.data.core.locked=!1,this.data.core.to_open=this.get_settings().core.initially_open,this.data.core.to_load=this.get_settings().core.initially_load},defaults:{html_titles:!1,animation:500,initially_open:[],initially_load:[],open_parents:!0,notify_plugins:!0,rtl:!1,load_open:!1,strings:{loading:"Loading ...",new_node:"New node",multiple_selection:"Multiple selection"}},_fn:{init:function(){this.set_focus(),this._get_settings().core.rtl&&this.get_container().addClass("jstree-rtl").css("direction","rtl"),this.get_container().html("<ul><li class='jstree-last jstree-leaf'><ins>&#160;</ins><a class='jstree-loading' href='#'><ins class='jstree-icon'>&#160;</ins>"+this._get_string("loading")+"</a></li></ul>"),this.data.core.li_height=this.get_container_ul().find("li.jstree-closed, li.jstree-leaf").eq(0).height()||18,this.get_container().delegate("li > ins","click.jstree",d.proxy(function(a){var b=d(a.target);this.toggle_node(b)},this)).bind("mousedown.jstree",d.proxy(function(){this.set_focus()},this)).bind("dblclick.jstree",function(a){var b;if(document.selection&&document.selection.empty)document.selection.empty();else if(window.getSelection){b=window.getSelection();try{b.removeAllRanges(),b.collapse()}catch(c){}}}),this._get_settings().core.notify_plugins&&this.get_container().bind("load_node.jstree",d.proxy(function(a,b){var c=this._get_node(b.rslt.obj),e=this;c===-1&&(c=this.get_container_ul());if(!c.length)return;c.find("li").each(function(){var a=d(this);a.data("jstree")&&d.each(a.data("jstree"),function(b,c){e.data[b]&&d.isFunction(e["_"+b+"_notify"])&&e["_"+b+"_notify"].call(e,a,c)})})},this)),this._get_settings().core.load_open&&this.get_container().bind("load_node.jstree",d.proxy(function(a,b){var c=this._get_node(b.rslt.obj),e=this;c===-1&&(c=this.get_container_ul());if(!c.length)return;c.find("li.jstree-open:not(:has(ul))").each(function(){e.load_node(this,d.noop,d.noop)})},this)),this.__callback(),this.load_node(-1,function(){this.loaded(),this.reload_nodes()})},destroy:function(){var a,b=this.get_index(),c=this._get_settings(),h=this;d.each(c.plugins,function(a,b){try{g[b].__destroy.apply(h)}catch(c){}}),this.__callback();if(this.is_focused())for(a in e)if(e.hasOwnProperty(a)&&a!=b){e[a].set_focus();break}b===f&&(f=-1),this.get_container().unbind(".jstree").undelegate(".jstree").removeData("jstree_instance_id").find("[class^='jstree']").andSelf().attr("class",function(){return this.className.replace(/jstree[^ ]*|$/ig,"")}),d(document).unbind(".jstree-"+b).undelegate(".jstree-"+b),e[b]=null,delete e[b]},_core_notify:function(a,b){b.opened&&this.open_node(a,!1,!0)},lock:function(){this.data.core.locked=!0,this.get_container().children("ul").addClass("jstree-locked").css("opacity","0.7"),this.__callback({})},unlock:function(){this.data.core.locked=!1,this.get_container().children("ul").removeClass("jstree-locked").css("opacity","1"),this.__callback({})},is_locked:function(){return this.data.core.locked},save_opened:function(){var a=this;this.data.core.to_open=[],this.get_container_ul().find("li.jstree-open").each(function(){this.id&&a.data.core.to_open.push("#"+this.id.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"))}),this.__callback(a.data.core.to_open)},save_loaded:function(){},reload_nodes:function(a){var b=this,c=!0,e=[],f=[];a||(this.data.core.reopen=!1,this.data.core.refreshing=!0,this.data.core.to_open=d.map(d.makeArray(this.data.core.to_open),function(a){return"#"+a.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:")}),this.data.core.to_load=d.map(d.makeArray(this.data.core.to_load),function(a){return"#"+a.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:")}),this.data.core.to_open.length&&(this.data.core.to_load=this.data.core.to_load.concat(this.data.core.to_open))),this.data.core.to_load.length&&(d.each(this.data.core.to_load,function(a,b){if(b=="#")return!0;d(b).length?e.push(b):f.push(b)}),e.length&&(this.data.core.to_load=f,d.each(e,function(a,d){b._is_loaded(d)||(b.load_node(d,function(){b.reload_nodes(!0)},function(){b.reload_nodes(!0)}),c=!1)}))),this.data.core.to_open.length&&d.each(this.data.core.to_open,function(a,c){b.open_node(c,!1,!0)}),c&&(this.data.core.reopen&&clearTimeout(this.data.core.reopen),this.data.core.reopen=setTimeout(function(){b.__callback({},b)},50),this.data.core.refreshing=!1,this.reopen())},reopen:function(){var a=this;this.data.core.to_open.length&&d.each(this.data.core.to_open,function(b,c){a.open_node(c,!1,!0)}),this.__callback({})},refresh:function(a){var b=this;this.save_opened(),a||(a=-1),a=this._get_node(a),a||(a=-1),a!==-1?a.children("UL").remove():this.get_container_ul().empty(),this.load_node(a,function(){b.__callback({obj:a}),b.reload_nodes()})},loaded:function(){this.__callback()},set_focus:function(){if(this.is_focused())return;var a=d.jstree._focused();a&&a.unset_focus(),this.get_container().addClass("jstree-focused"),f=this.get_index(),this.__callback()},is_focused:function(){return f==this.get_index()},unset_focus:function(){this.is_focused()&&(this.get_container().removeClass("jstree-focused"),f=-1),this.__callback()},_get_node:function(a){var b=d(a,this.get_container());return b.is(".jstree")||a==-1?-1:(b=b.closest("li",this.get_container()),b.length?b:!1)},_get_next:function(a,b){return a=this._get_node(a),a===-1?this.get_container().find("> ul > li:first-child"):a.length?b?a.nextAll("li").size()>0?a.nextAll("li:eq(0)"):!1:a.hasClass("jstree-open")?a.find("li:eq(0)"):a.nextAll("li").size()>0?a.nextAll("li:eq(0)"):a.parentsUntil(".jstree","li").next("li").eq(0):!1},_get_prev:function(a,b){a=this._get_node(a);if(a===-1)return this.get_container().find("> ul > li:last-child");if(!a.length)return!1;if(b)return a.prevAll("li").length>0?a.prevAll("li:eq(0)"):!1;if(a.prev("li").length){a=a.prev("li").eq(0);while(a.hasClass("jstree-open"))a=a.children("ul:eq(0)").children("li:last");return a}var c=a.parentsUntil(".jstree","li:eq(0)");return c.length?c:!1},_get_parent:function(a){a=this._get_node(a);if(a==-1||!a.length)return!1;var b=a.parentsUntil(".jstree","li:eq(0)");return b.length?b:-1},_get_children:function(a){return a=this._get_node(a),a===-1?this.get_container().children("ul:eq(0)").children("li"):a.length?a.children("ul:eq(0)").children("li"):!1},get_path:function(a,b){var c=[],d=this;return a=this._get_node(a),a===-1||!a||!a.length?!1:(a.parentsUntil(".jstree","li").each(function(){c.push(b?this.id:d.get_text(this))}),c.reverse(),c.push(b?a.attr("id"):this.get_text(a)),c)},_get_string:function(a){return this._get_settings().core.strings[a]||a},is_open:function(a){return a=this._get_node(a),a&&a!==-1&&a.hasClass("jstree-open")},is_closed:function(a){return a=this._get_node(a),a&&a!==-1&&a.hasClass("jstree-closed")},is_leaf:function(a){return a=this._get_node(a),a&&a!==-1&&a.hasClass("jstree-leaf")},correct_state:function(a){a=this._get_node(a);if(!a||a===-1)return!1;a.removeClass("jstree-closed jstree-open").addClass("jstree-leaf").children("ul").remove(),this.__callback({obj:a})},open_node:function(b,c,d){b=this._get_node(b);if(!b.length)return!1;if(!b.hasClass("jstree-closed"))return c&&c.call(),!1;var e=d||a?0:this._get_settings().core.animation,f=this;this._is_loaded(b)?(this._get_settings().core.open_parents&&b.parentsUntil(".jstree",".jstree-closed").each(function(){f.open_node(this,!1,!0)}),e&&b.children("ul").css("display","none"),b.removeClass("jstree-closed").addClass("jstree-open").children("a").removeClass("jstree-loading"),e?b.children("ul").stop(!0,!0).slideDown(e,function(){this.style.display="",f.after_open(b)}):f.after_open(b),this.__callback({obj:b}),c&&c.call()):(b.children("a").addClass("jstree-loading"),this.load_node(b,function(){f.open_node(b,c,d)},c))},after_open:function(a){this.__callback({obj:a})},close_node:function(b,c){b=this._get_node(b);var d=c||a?0:this._get_settings().core.animation,e=this;if(!b.length||!b.hasClass("jstree-open"))return!1;d&&b.children("ul").attr("style","display:block !important"),b.removeClass("jstree-open").addClass("jstree-closed"),d?b.children("ul").stop(!0,!0).slideUp(d,function(){this.style.display="",e.after_close(b)}):e.after_close(b),this.__callback({obj:b})},after_close:function(a){this.__callback({obj:a})},toggle_node:function(a){a=this._get_node(a);if(a.hasClass("jstree-closed"))return this.open_node(a);if(a.hasClass("jstree-open"))return this.close_node(a)},open_all:function(a,b,c){a=a?this._get_node(a):-1;if(!a||a===-1)a=this.get_container_ul();c?a=a.find("li.jstree-closed"):(c=a,a.is(".jstree-closed")?a=a.find("li.jstree-closed").andSelf():a=a.find("li.jstree-closed"));var d=this;a.each(function(){var a=this;d._is_loaded(this)?d.open_node(this,!1,!b):d.open_node(this,function(){d.open_all(a,b,c)},!b)}),c.find("li.jstree-closed").length===0&&this.__callback({obj:c})},close_all:function(a,b){var c=this;a=a?this._get_node(a):this.get_container();if(!a||a===-1)a=this.get_container_ul();a.find("li.jstree-open").andSelf().each(function(){c.close_node(this,!b)}),this.__callback({obj:a})},clean_node:function(a){a=a&&a!=-1?d(a):this.get_container_ul(),a=a.is("li")?a.find("li").andSelf():a.find("li"),a.removeClass("jstree-last").filter("li:last-child").addClass("jstree-last").end().filter(":has(li)").not(".jstree-open").removeClass("jstree-leaf").addClass("jstree-closed"),a.not(".jstree-open, .jstree-closed").addClass("jstree-leaf").children("ul").remove(),this.__callback({obj:a})},get_rollback:function(){return this.__callback(),{i:this.get_index(),h:this.get_container().children("ul").clone(!0),d:this.data}},set_rollback:function(a,b){this.get_container().empty().append(a),this.data=b,this.__callback()},load_node:function(a,b,c){this.__callback({obj:a})},_is_loaded:function(a){return!0},create_node:function(a,b,c,e,f){a=this._get_node(a),b=typeof b=="undefined"?"last":b;var g=d("<li />"),h=this._get_settings().core,i;if(a!==-1&&!a.length)return!1;if(!f&&!this._is_loaded(a))return this.load_node(a,function(){this.create_node(a,b,c,e,!0)}),!1;this.__rollback(),typeof c=="string"&&(c={data:c}),c||(c={}),c.attr&&g.attr(c.attr),c.metadata&&g.data(c.metadata),c.state&&g.addClass("jstree-"+c.state),c.data||(c.data=this._get_string("new_node")),d.isArray(c.data)||(i=c.data,c.data=[],c.data.push(i)),d.each(c.data,function(a,b){i=d("<a />"),d.isFunction(b)&&(b=b.call(this,c)),typeof b=="string"?i.attr("href","#")[h.html_titles?"html":"text"](b):(b.attr||(b.attr={}),b.attr.href||(b.attr.href="#"),i.attr(b.attr)[h.html_titles?"html":"text"](b.title),b.language&&i.addClass(b.language)),i.prepend("<ins class='jstree-icon'>&#160;</ins>"),!b.icon&&c.icon&&(b.icon=c.icon),b.icon&&(b.icon.indexOf("/")===-1?i.children("ins").addClass(b.icon):i.children("ins").css("background","url('"+b.icon+"') center center no-repeat")),g.append(i)}),g.prepend("<ins class='jstree-icon'>&#160;</ins>"),a===-1&&(a=this.get_container(),b==="before"&&(b="first"),b==="after"&&(b="last"));switch(b){case"before":a.before(g),i=this._get_parent(a);break;case"after":a.after(g),i=this._get_parent(a);break;case"inside":case"first":a.children("ul").length||a.append("<ul />"),a.children("ul").prepend(g),i=a;break;case"last":a.children("ul").length||a.append("<ul />"),a.children("ul").append(g),i=a;break;default:a.children("ul").length||a.append("<ul />"),b||(b=0),i=a.children("ul").children("li").eq(b),i.length?i.before(g):a.children("ul").append(g),i=a}if(i===-1||i.get(0)===this.get_container().get(0))i=-1;return this.clean_node(i),this.__callback({obj:g,parent:i}),e&&e.call(this,g),g},get_text:function(a){a=this._get_node(a);if(!a.length)return!1;var b=this._get_settings().core.html_titles;return a=a.children("a:eq(0)"),b?(a=a.clone(),a.children("INS").remove(),a.html()):(a=a.contents().filter(function(){return this.nodeType==3})[0],a.nodeValue)},set_text:function(a,b){a=this._get_node(a);if(!a.length)return!1;a=a.children("a:eq(0)");if(this._get_settings().core.html_titles){var c=a.children("INS").clone();return a.html(b).prepend(c),this.__callback({obj:a,name:b}),!0}return a=a.contents().filter(function(){return this.nodeType==3})[0],this.__callback({obj:a,name:b}),a.nodeValue=b},rename_node:function(a,b){a=this._get_node(a),this.__rollback(),a&&a.length&&this.set_text.apply(this,Array.prototype.slice.call(arguments))&&this.__callback({obj:a,name:b})},delete_node:function(a){a=this._get_node(a);if(!a.length)return!1;this.__rollback();var b=this._get_parent(a),c=d([]),e=this;return a.each(function(){c=c.add(e._get_prev(this))}),a=a.detach(),b!==-1&&b.find("> ul > li").length===0&&b.removeClass("jstree-open jstree-closed").addClass("jstree-leaf"),this.clean_node(b),this.__callback({obj:a,prev:c,parent:b}),a},prepare_move:function(a,b,c,e,f){var g={};g.ot=d.jstree._reference(a)||this,g.o=g.ot._get_node(a),g.r=b===-1?-1:this._get_node(b),g.p=typeof c=="undefined"||c===!1?"last":c;if(!f&&h.o&&h.o[0]===g.o[0]&&h.r[0]===g.r[0]&&h.p===g.p){this.__callback(h),e&&e.call(this,h);return}g.ot=d.jstree._reference(g.o)||this,g.rt=d.jstree._reference(g.r)||this;if(g.r===-1||!g.r){g.cr=-1;switch(g.p){case"first":case"before":case"inside":g.cp=0;break;case"after":case"last":g.cp=g.rt.get_container().find(" > ul > li").length;break;default:g.cp=g.p}}else{if(!/^(before|after)$/.test(g.p)&&!this._is_loaded(g.r))return this.load_node(g.r,function(){this.prepare_move(a,b,c,e,!0)});switch(g.p){case"before":g.cp=g.r.index(),g.cr=g.rt._get_parent(g.r);break;case"after":g.cp=g.r.index()+1,g.cr=g.rt._get_parent(g.r);break;case"inside":case"first":g.cp=0,g.cr=g.r;break;case"last":g.cp=g.r.find(" > ul > li").length,g.cr=g.r;break;default:g.cp=g.p,g.cr=g.r}}g.np=g.cr==-1?g.rt.get_container():g.cr,g.op=g.ot._get_parent(g.o),g.cop=g.o.index(),g.op===-1&&(g.op=g.ot?g.ot.get_container():this.get_container()),!/^(before|after)$/.test(g.p)&&g.op&&g.np&&g.op[0]===g.np[0]&&g.o.index()<g.cp&&g.cp++,g.or=g.np.find(" > ul > li:nth-child("+(g.cp+1)+")"),h=g,this.__callback(h),e&&e.call(this,h)},check_move:function(){var a=h,b=!0,c=a.r===-1?this.get_container():a.r;return!a||!a.o||a.or[0]===a.o[0]?!1:a.op&&a.np&&a.op[0]===a.np[0]&&a.cp-1===a.o.index()?!1:(a.o.each(function(){if(c.parentsUntil(".jstree","li").andSelf().index(this)!==-1)return b=!1,!1}),b)},move_node:function(a,b,c,e,f,g){if(!f)return this.prepare_move(a,b,c,function(a){this.move_node(a,!1,!1,e,!0,g)});e&&(h.cy=!0);if(!g&&!this.check_move())return!1;this.__rollback();var i=!1;e?(i=a.o.clone(!0),i.find("*[id]").andSelf().each(function(){this.id&&(this.id="copy_"+this.id)})):i=a.o,a.or.length?a.or.before(i):(a.np.children("ul").length||d("<ul />").appendTo(a.np),a.np.children("ul:eq(0)").append(i));try{a.ot.clean_node(a.op),a.rt.clean_node(a.np),a.op.find("> ul > li").length||a.op.removeClass("jstree-open jstree-closed").addClass("jstree-leaf").children("ul").remove()}catch(j){}return e&&(h.cy=!0,h.oc=i),this.__callback(h),h},_get_move:function(){return h}}})})(jQuery),function(a){var b,c,d;a(function(){/msie/.test(navigator.userAgent.toLowerCase())?(c=a('<textarea cols="10" rows="2"></textarea>').css({position:"absolute",top:-1e3,left:0}).appendTo("body"),d=a('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>').css({position:"absolute",top:-1e3,left:0}).appendTo("body"),b=c.width()-d.width(),c.add(d).remove()):(c=a("<div />").css({width:100,height:100,overflow:"auto",position:"absolute",top:-1e3,left:0}).prependTo("body").append("<div />").find("div").css({width:"100%",height:200}),b=100-c.width(),c.parent().remove())}),a.jstree.plugin("ui",{__init:function(){this.data.ui.selected=a(),this.data.ui.last_selected=!1,this.data.ui.hovered=null,this.data.ui.to_select=this.get_settings().ui.initially_select,this.get_container().delegate("a","click.jstree",a.proxy(function(b){b.preventDefault(),b.currentTarget.blur(),a(b.currentTarget).hasClass("jstree-loading")||this.select_node(b.currentTarget,!0,b)},this)).delegate("a","mouseenter.jstree",a.proxy(function(b){a(b.currentTarget).hasClass("jstree-loading")||this.hover_node(b.target)},this)).delegate("a","mouseleave.jstree",a.proxy(function(b){a(b.currentTarget).hasClass("jstree-loading")||this.dehover_node(b.target)},this)).bind("reopen.jstree",a.proxy(function(){this.reselect()},this)).bind("get_rollback.jstree",a.proxy(function(){this.dehover_node(),this.save_selected()},this)).bind("set_rollback.jstree",a.proxy(function(){this.reselect()},this)).bind("close_node.jstree",a.proxy(function(b,c){var d=this._get_settings().ui,e=this._get_node(c.rslt.obj),f=e&&e.length?e.children("ul").find("a.jstree-clicked"):a(),g=this;if(d.selected_parent_close===!1||!f.length)return;f.each(function(){g.deselect_node(this),d.selected_parent_close==="select_parent"&&g.select_node(e)})},this)).bind("delete_node.jstree",a.proxy(function(a,b){var c=this._get_settings().ui.select_prev_on_delete,d=this._get_node(b.rslt.obj),e=d&&d.length?d.find("a.jstree-clicked"):[],f=this;e.each(function(){f.deselect_node(this)}),c&&e.length&&b.rslt.prev.each(function(){if(this.parentNode)return f.select_node(this),!1})},this)).bind("move_node.jstree",a.proxy(function(a,b){b.rslt.cy&&b.rslt.oc.find("a.jstree-clicked").removeClass("jstree-clicked")},this))},defaults:{select_limit:-1,select_multiple_modifier:"ctrl",select_range_modifier:"shift",selected_parent_close:"select_parent",selected_parent_open:!0,select_prev_on_delete:!0,disable_selecting_children:!1,initially_select:[]},_fn:{_get_node:function(b,c){if(typeof b=="undefined"||b===null)return c?this.data.ui.selected:this.data.ui.last_selected;var d=a(b,this.get_container());return d.is(".jstree")||b==-1?-1:(d=d.closest("li",this.get_container()),d.length?d:!1)},_ui_notify:function(a,b){b.selected&&this.select_node(a,!1)},save_selected:function(){var a=this;this.data.ui.to_select=[],this.data.ui.selected.each(function(){this.id&&a.data.ui.to_select.push("#"+this.id.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"))}),this.__callback(this.data.ui.to_select)},reselect:function(){var b=this,c=this.data.ui.to_select;c=a.map(a.makeArray(c),function(a){return"#"+a.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:")}),a.each(c,function(a,c){c&&c!=="#"&&b.select_node(c)}),this.data.ui.selected=this.data.ui.selected.filter(function(){return this.parentNode}),this.__callback()},refresh:function(a){return this.save_selected(),this.__call_old()},hover_node:function(a){a=this._get_node(a);if(!a.length)return!1;a.hasClass("jstree-hovered")||this.dehover_node(),this.data.ui.hovered=a.children("a").addClass("jstree-hovered").parent(),this._fix_scroll(a),this.__callback({obj:a})},dehover_node:function(){var a=this.data.ui.hovered,b;if(!a||!a.length)return!1;b=a.children("a").removeClass("jstree-hovered").parent(),this.data.ui.hovered[0]===b[0]&&(this.data.ui.hovered=null),this.__callback({obj:a})},select_node:function(a,b,c){a=this._get_node(a);if(a==-1||!a||!a.length)return!1;var d=this._get_settings().ui,e=d.select_multiple_modifier=="on"||d.select_multiple_modifier!==!1&&c&&c[d.select_multiple_modifier+"Key"],f=d.select_range_modifier!==!1&&c&&c[d.select_range_modifier+"Key"]&&this.data.ui.last_selected&&this.data.ui.last_selected[0]!==a[0]&&this.data.ui.last_selected.parent()[0]===a.parent()[0],g=this.is_selected(a),h=!0,i=this;if(b){if(d.disable_selecting_children&&e&&(a.parentsUntil(".jstree","li").children("a.jstree-clicked").length||a.children("ul").find("a.jstree-clicked:eq(0)").length))return!1;h=!1;switch(!0){case f:this.data.ui.last_selected.addClass("jstree-last-selected"),a=a[a.index()<this.data.ui.last_selected.index()?"nextUntil":"prevUntil"](".jstree-last-selected").andSelf(),d.select_limit==-1||a.length<d.select_limit?(this.data.ui.last_selected.removeClass("jstree-last-selected"),this.data.ui.selected.each(function(){this!==i.data.ui.last_selected[0]&&i.deselect_node(this)}),g=!1,h=!0):h=!1;break;case g&&!e:this.deselect_all(),g=!1,h=!0;break;case!g&&!e:if(d.select_limit==-1||d.select_limit>0)this.deselect_all(),h=!0;break;case g&&e:this.deselect_node(a);break;case!g&&e:if(d.select_limit==-1||this.data.ui.selected.length+1<=d.select_limit)h=!0}}h&&!g&&(f||(this.data.ui.last_selected=a),a.children("a").addClass("jstree-clicked"),d.selected_parent_open&&a.parents(".jstree-closed").each(function(){i.open_node(this,!1,!0)}),this.data.ui.selected=this.data.ui.selected.add(a),this._fix_scroll(a.eq(0)),this.__callback({obj:a,e:c}))},_fix_scroll:function(a){var c=this.get_container()[0],d;if(c.scrollHeight>c.offsetHeight){a=this._get_node(a);if(!a||a===-1||!a.length||!a.is(":visible"))return;d=a.offset().top-this.get_container().offset().top,d<0&&(c.scrollTop=c.scrollTop+d-1),d+this.data.core.li_height+(c.scrollWidth>c.offsetWidth?b:0)>c.offsetHeight&&(c.scrollTop=c.scrollTop+(d-c.offsetHeight+this.data.core.li_height+1+(c.scrollWidth>c.offsetWidth?b:0)))}},deselect_node:function(a){a=this._get_node(a);if(!a.length)return!1;this.is_selected(a)&&(a.children("a").removeClass("jstree-clicked"),this.data.ui.selected=this.data.ui.selected.not(a),this.data.ui.last_selected.get(0)===a.get(0)&&(this.data.ui.last_selected=this.data.ui.selected.eq(0)),this.__callback({obj:a}))},toggle_select:function(a){a=this._get_node(a);if(!a.length)return!1;this.is_selected(a)?this.deselect_node(a):this.select_node(a)},is_selected:function(a){return this.data.ui.selected.index(this._get_node(a))>=0},get_selected:function(b){return b?a(b).find("a.jstree-clicked").parent():this.data.ui.selected},deselect_all:function(b){var c=b?a(b).find("a.jstree-clicked").parent():this.get_container().find("a.jstree-clicked").parent();c.children("a.jstree-clicked").removeClass("jstree-clicked"),this.data.ui.selected=a([]),this.data.ui.last_selected=!1,this.__callback({obj:c})}}}),a.jstree.defaults.plugins.push("ui")}(jQuery),function(a){a.jstree.plugin("crrm",{__init:function(){this.get_container().bind("move_node.jstree",a.proxy(function(a,b){if(this._get_settings().crrm.move.open_onmove){var c=this;b.rslt.np.parentsUntil(".jstree").andSelf().filter(".jstree-closed").each(function(){c.open_node(this,!1,!0)})}},this))},defaults:{input_width_limit:200,move:{always_copy:!1,open_onmove:!0,default_position:"last",check_move:function(a){return!0}}},_fn:{_show_input:function(b,c){b=this._get_node(b);var d=this._get_settings().core.rtl,e=this._get_settings().crrm.input_width_limit,f=b.children("ins").width(),g=b.find("> a:visible > ins").width()*b.find("> a:visible > ins").length,h=this.get_text(b),i=a("<div />",{css:{position:"absolute",top:"-200px",left:d?"0px":"-1000px",visibility:"hidden"}}).appendTo("body"),j=b.css("position","relative").append(a("<input />",{value:h,"class":"jstree-rename-input",css:{padding:"0",border:"1px solid silver",position:"absolute",left:d?"auto":f+g+4+"px",right:d?f+g+4+"px":"auto",top:"0px",height:this.data.core.li_height-2+"px",lineHeight:this.data.core.li_height-2+"px",width:"150px"},blur:a.proxy(function(){var a=b.children(".jstree-rename-input"),d=a.val();d===""&&(d=h),i.remove(),a.remove(),this.set_text(b,h),this.rename_node(b,d),c.call(this,b,d,h),b.css("position","")},this),keyup:function(a){var b=a.keyCode||a.which;if(b==27){this.value=h,this.blur();return}if(b==13){this.blur();return}j.width(Math.min(i.text("pW"+this.value).width(),e))},keypress:function(a){var b=a.keyCode||a.which;if(b==13)return!1}})).children(".jstree-rename-input");this.set_text(b,""),i.css({fontFamily:j.css("fontFamily")||"",fontSize:j.css("fontSize")||"",fontWeight:j.css("fontWeight")||"",fontStyle:j.css("fontStyle")||"",fontStretch:j.css("fontStretch")||"",fontVariant:j.css("fontVariant")||"",letterSpacing:j.css("letterSpacing")||"",wordSpacing:j.css("wordSpacing")||""}),j.width(Math.min(i.text("pW"+j[0].value).width(),e))[0].select()},rename:function(a){a=this._get_node(a),this.__rollback();var b=this.__callback;this._show_input(a,function(a,c,d){b.call(this,{obj:a,new_name:c,old_name:d})})},create:function(b,c,d,e,f){var g,h=this;return b=this._get_node(b),b||(b=-1),this.__rollback(),g=this.create_node(b,c,d,function(b){var c=this._get_parent(b),d=a(b).index();e&&e.call(this,b),c.length&&c.hasClass("jstree-closed")&&this.open_node(c,!1,!0),f?h.__callback({obj:b,name:this.get_text(b),parent:c,position:d}):this._show_input(b,function(a,b,e){h.__callback({obj:a,name:b,parent:c,position:d})})}),g},remove:function(a){a=this._get_node(a,!0);var b=this._get_parent(a),c=this._get_prev(a);this.__rollback(),a=this.delete_node(a),a!==!1&&this.__callback({obj:a,prev:c,parent:b})},check_move:function(){if(!this.__call_old())return!1;var a=this._get_settings().crrm.move;return a.check_move.call(this,this._get_move())?!0:!1},move_node:function(a,b,c,d,e,f){var g=this._get_settings().crrm.move;if(!e)return typeof c=="undefined"&&(c=g.default_position),c==="inside"&&!g.default_position.match(/^(before|after)$/)&&(c=g.default_position),this.__call_old(!0,a,b,c,d,!1,f);if(g.always_copy===!0||g.always_copy==="multitree"&&a.rt.get_index()!==a.ot.get_index())d=!0;this.__call_old(!0,a,b,c,d,!0,f)},cut:function(a){a=this._get_node(a,!0);if(!a||!a.length)return!1;this.data.crrm.cp_nodes=!1,this.data.crrm.ct_nodes=a,this.__callback({obj:a})},copy:function(a){a=this._get_node(a,!0);if(!a||!a.length)return!1;this.data.crrm.ct_nodes=!1,this.data.crrm.cp_nodes=
a,this.__callback({obj:a})},paste:function(a){a=this._get_node(a);if(!a||!a.length)return!1;var b=this.data.crrm.ct_nodes?this.data.crrm.ct_nodes:this.data.crrm.cp_nodes;if(!this.data.crrm.ct_nodes&&!this.data.crrm.cp_nodes)return!1;this.data.crrm.ct_nodes&&(this.move_node(this.data.crrm.ct_nodes,a),this.data.crrm.ct_nodes=!1),this.data.crrm.cp_nodes&&this.move_node(this.data.crrm.cp_nodes,a,!1,!0),this.__callback({obj:a,nodes:b})}}})}(jQuery),function(a){var b=[];a.jstree._themes=!1,a.jstree.plugin("themes",{__init:function(){this.get_container().bind("init.jstree",a.proxy(function(){var a=this._get_settings().themes;this.data.themes.dots=a.dots,this.data.themes.icons=a.icons,this.set_theme(a.theme,a.url)},this)).bind("loaded.jstree",a.proxy(function(){this.data.themes.dots?this.show_dots():this.hide_dots(),this.data.themes.icons?this.show_icons():this.hide_icons()},this))},defaults:{theme:"default",url:!1,dots:!0,icons:!0},_fn:{set_theme:function(c,d){if(!c)return!1;d||(d=a.jstree._themes+c+"/style.css"),a.inArray(d,b)==-1&&(a.vakata.css.add_sheet({url:d}),b.push(d)),this.data.themes.theme!=c&&(this.get_container().removeClass("jstree-"+this.data.themes.theme),this.data.themes.theme=c),this.get_container().addClass("jstree-"+c),this.data.themes.dots?this.show_dots():this.hide_dots(),this.data.themes.icons?this.show_icons():this.hide_icons(),this.__callback()},get_theme:function(){return this.data.themes.theme},show_dots:function(){this.data.themes.dots=!0,this.get_container().children("ul").removeClass("jstree-no-dots")},hide_dots:function(){this.data.themes.dots=!1,this.get_container().children("ul").addClass("jstree-no-dots")},toggle_dots:function(){this.data.themes.dots?this.hide_dots():this.show_dots()},show_icons:function(){this.data.themes.icons=!0,this.get_container().children("ul").removeClass("jstree-no-icons")},hide_icons:function(){this.data.themes.icons=!1,this.get_container().children("ul").addClass("jstree-no-icons")},toggle_icons:function(){this.data.themes.icons?this.hide_icons():this.show_icons()}}}),a(function(){a.jstree._themes===!1&&a("script").each(function(){if(this.src.toString().match(/jquery\.jstree[^\/]*?\.js(\?.*)?$/))return a.jstree._themes=this.src.toString().replace(/jquery\.jstree[^\/]*?\.js(\?.*)?$/,"")+"themes/",!1}),a.jstree._themes===!1&&(a.jstree._themes="themes/")}),a.jstree.defaults.plugins.push("themes")}(jQuery),function(a){function c(b,c){var d=a.jstree._focused(),e;if(d&&d.data&&d.data.hotkeys&&d.data.hotkeys.enabled){e=d._get_settings().hotkeys[b];if(e)return e.call(d,c)}}var b=[];a.jstree.plugin("hotkeys",{__init:function(){if(typeof a.hotkeys=="undefined")throw"jsTree hotkeys: jQuery hotkeys plugin not included.";if(!this.data.ui)throw"jsTree hotkeys: jsTree UI plugin not included.";a.each(this._get_settings().hotkeys,function(d,e){e!==!1&&a.inArray(d,b)==-1&&(a(document).bind("keydown",d,function(a){return c(d,a)}),b.push(d))}),this.get_container().bind("lock.jstree",a.proxy(function(){this.data.hotkeys.enabled&&(this.data.hotkeys.enabled=!1,this.data.hotkeys.revert=!0)},this)).bind("unlock.jstree",a.proxy(function(){this.data.hotkeys.revert&&(this.data.hotkeys.enabled=!0)},this)),this.enable_hotkeys()},defaults:{up:function(){var a=this.data.ui.hovered||this.data.ui.last_selected||-1;return this.hover_node(this._get_prev(a)),!1},"ctrl+up":function(){var a=this.data.ui.hovered||this.data.ui.last_selected||-1;return this.hover_node(this._get_prev(a)),!1},"shift+up":function(){var a=this.data.ui.hovered||this.data.ui.last_selected||-1;return this.hover_node(this._get_prev(a)),!1},down:function(){var a=this.data.ui.hovered||this.data.ui.last_selected||-1;return this.hover_node(this._get_next(a)),!1},"ctrl+down":function(){var a=this.data.ui.hovered||this.data.ui.last_selected||-1;return this.hover_node(this._get_next(a)),!1},"shift+down":function(){var a=this.data.ui.hovered||this.data.ui.last_selected||-1;return this.hover_node(this._get_next(a)),!1},left:function(){var a=this.data.ui.hovered||this.data.ui.last_selected;return a&&(a.hasClass("jstree-open")?this.close_node(a):this.hover_node(this._get_prev(a))),!1},"ctrl+left":function(){var a=this.data.ui.hovered||this.data.ui.last_selected;return a&&(a.hasClass("jstree-open")?this.close_node(a):this.hover_node(this._get_prev(a))),!1},"shift+left":function(){var a=this.data.ui.hovered||this.data.ui.last_selected;return a&&(a.hasClass("jstree-open")?this.close_node(a):this.hover_node(this._get_prev(a))),!1},right:function(){var a=this.data.ui.hovered||this.data.ui.last_selected;return a&&a.length&&(a.hasClass("jstree-closed")?this.open_node(a):this.hover_node(this._get_next(a))),!1},"ctrl+right":function(){var a=this.data.ui.hovered||this.data.ui.last_selected;return a&&a.length&&(a.hasClass("jstree-closed")?this.open_node(a):this.hover_node(this._get_next(a))),!1},"shift+right":function(){var a=this.data.ui.hovered||this.data.ui.last_selected;return a&&a.length&&(a.hasClass("jstree-closed")?this.open_node(a):this.hover_node(this._get_next(a))),!1},space:function(){return this.data.ui.hovered&&this.data.ui.hovered.children("a:eq(0)").click(),!1},"ctrl+space":function(a){return a.type="click",this.data.ui.hovered&&this.data.ui.hovered.children("a:eq(0)").trigger(a),!1},"shift+space":function(a){return a.type="click",this.data.ui.hovered&&this.data.ui.hovered.children("a:eq(0)").trigger(a),!1},f2:function(){this.rename(this.data.ui.hovered||this.data.ui.last_selected)},del:function(){this.remove(this.data.ui.hovered||this._get_node(null))}},_fn:{enable_hotkeys:function(){this.data.hotkeys.enabled=!0},disable_hotkeys:function(){this.data.hotkeys.enabled=!1}}})}(jQuery),function(a){a.jstree.plugin("json_data",{__init:function(){var a=this._get_settings().json_data;a.progressive_unload&&this.get_container().bind("after_close.jstree",function(a,b){b.rslt.obj.children("ul").remove()})},defaults:{data:!1,ajax:!1,correct_state:!0,progressive_render:!1,progressive_unload:!1},_fn:{load_node:function(a,b,c){var d=this;this.load_node_json(a,function(){d.__callback({obj:d._get_node(a)}),b.call(this)},c)},_is_loaded:function(b){var c=this._get_settings().json_data;return b=this._get_node(b),b==-1||!b||!c.ajax&&!c.progressive_render&&!a.isFunction(c.data)||b.is(".jstree-open, .jstree-leaf")||b.children("ul").children("li").length>0},refresh:function(b){b=this._get_node(b);var c=this._get_settings().json_data;return b&&b!==-1&&c.progressive_unload&&(a.isFunction(c.data)||!!c.ajax)&&b.removeData("jstree_children"),this.__call_old()},load_node_json:function(b,c,d){var e=this.get_settings().json_data,f,g=function(){},h=function(){};b=this._get_node(b);if(b&&b!==-1&&(e.progressive_render||e.progressive_unload)&&!b.is(".jstree-open, .jstree-leaf")&&b.children("ul").children("li").length===0&&b.data("jstree_children")){f=this._parse_json(b.data("jstree_children"),b),f&&(b.append(f),e.progressive_unload||b.removeData("jstree_children")),this.clean_node(b),c&&c.call(this);return}if(b&&b!==-1){if(b.data("jstree_is_loading"))return;b.data("jstree_is_loading",!0)}switch(!0){case!e.data&&!e.ajax:throw"Neither data nor ajax settings supplied.";case a.isFunction(e.data):e.data.call(this,b,a.proxy(function(a){a=this._parse_json(a,b),a?(b===-1||!b?this.get_container().children("ul").empty().append(a.children()):(b.append(a).children("a.jstree-loading").removeClass("jstree-loading"),b.removeData("jstree_is_loading")),this.clean_node(b),c&&c.call(this)):(b===-1||!b?e.correct_state&&this.get_container().children("ul").empty():(b.children("a.jstree-loading").removeClass("jstree-loading"),b.removeData("jstree_is_loading"),e.correct_state&&this.correct_state(b)),d&&d.call(this))},this));break;case!!e.data&&!e.ajax||!!e.data&&!!e.ajax&&(!b||b===-1):if(!b||b==-1)f=this._parse_json(e.data,b),f?(this.get_container().children("ul").empty().append(f.children()),this.clean_node()):e.correct_state&&this.get_container().children("ul").empty();c&&c.call(this);break;case!e.data&&!!e.ajax||!!e.data&&!!e.ajax&&b&&b!==-1:g=function(a,c,f){var g=this.get_settings().json_data.ajax.error;g&&g.call(this,a,c,f),b!=-1&&b.length?(b.children("a.jstree-loading").removeClass("jstree-loading"),b.removeData("jstree_is_loading"),c==="success"&&e.correct_state&&this.correct_state(b)):c==="success"&&e.correct_state&&this.get_container().children("ul").empty(),d&&d.call(this)},h=function(d,f,h){var i=this.get_settings().json_data.ajax.success;i&&(d=i.call(this,d,f,h)||d);if(d===""||d&&d.toString&&d.toString().replace(/^[\s\n]+$/,"")===""||!a.isArray(d)&&!a.isPlainObject(d))return g.call(this,h,f,"");d=this._parse_json(d,b),d?(b===-1||!b?this.get_container().children("ul").empty().append(d.children()):(b.append(d).children("a.jstree-loading").removeClass("jstree-loading"),b.removeData("jstree_is_loading")),this.clean_node(b),c&&c.call(this)):b===-1||!b?e.correct_state&&(this.get_container().children("ul").empty(),c&&c.call(this)):(b.children("a.jstree-loading").removeClass("jstree-loading"),b.removeData("jstree_is_loading"),e.correct_state&&(this.correct_state(b),c&&c.call(this)))},e.ajax.context=this,e.ajax.error=g,e.ajax.success=h,e.ajax.dataType||(e.ajax.dataType="json"),a.isFunction(e.ajax.url)&&(e.ajax.url=e.ajax.url.call(this,b)),a.isFunction(e.ajax.data)&&(e.ajax.data=e.ajax.data.call(this,b)),a.ajax(e.ajax)}},_parse_json:function(b,c,d){var e=!1,f=this._get_settings(),g=f.json_data,h=f.core.html_titles,i,j,k,l,m;if(!b)return e;g.progressive_unload&&c&&c!==-1&&c.data("jstree_children",e);if(a.isArray(b)){e=a();if(!b.length)return!1;for(j=0,k=b.length;j<k;j++)i=this._parse_json(b[j],c,!0),i.length&&(e=e.add(i))}else{typeof b=="string"&&(b={data:b});if(!b.data&&b.data!=="")return e;e=a("<li />"),b.attr&&e.attr(b.attr),b.metadata&&e.data(b.metadata),b.state&&e.addClass("jstree-"+b.state),a.isArray(b.data)||(i=b.data,b.data=[],b.data.push(i)),a.each(b.data,function(c,d){i=a("<a />"),a.isFunction(d)&&(d=d.call(this,b)),typeof d=="string"?i.attr("href","#")[h?"html":"text"](d):(d.attr||(d.attr={}),d.attr.href||(d.attr.href="#"),i.attr(d.attr)[h?"html":"text"](d.title),d.language&&i.addClass(d.language)),i.prepend("<ins class='jstree-icon'>&#160;</ins>"),!d.icon&&b.icon&&(d.icon=b.icon),d.icon&&(d.icon.indexOf("/")===-1?i.children("ins").addClass(d.icon):i.children("ins").css("background","url('"+d.icon+"') center center no-repeat")),e.append(i)}),e.prepend("<ins class='jstree-icon'>&#160;</ins>"),b.children&&(g.progressive_render&&b.state!=="open"?e.addClass("jstree-closed").data("jstree_children",b.children):(g.progressive_unload&&e.data("jstree_children",b.children),a.isArray(b.children)&&b.children.length&&(i=this._parse_json(b.children,c,!0),i.length&&(m=a("<ul />"),m.append(i),e.append(m)))))}return d||(l=a("<ul />"),l.append(e),e=l),e},get_json:function(b,c,d,e){var f=[],g=this._get_settings(),h=this,i,j,k,l,m,n;b=this._get_node(b);if(!b||b===-1)b=this.get_container().find("> ul > li");return c=a.isArray(c)?c:["id","class"],!e&&this.data.types&&c.push(g.types.type_attr),d=a.isArray(d)?d:[],b.each(function(){k=a(this),i={data:[]},c.length&&(i.attr={}),a.each(c,function(a,b){j=k.attr(b),j&&j.length&&j.replace(/jstree[^ ]*/ig,"").length&&(i.attr[b]=(" "+j).replace(/ jstree[^ ]*/ig,"").replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,""))}),k.hasClass("jstree-open")&&(i.state="open"),k.hasClass("jstree-closed")&&(i.state="closed"),k.data()&&(i.metadata=k.data()),l=k.children("a"),l.each(function(){m=a(this),d.length||a.inArray("languages",g.plugins)!==-1||m.children("ins").get(0).style.backgroundImage.length||m.children("ins").get(0).className&&m.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,"").length?(n=!1,a.inArray("languages",g.plugins)!==-1&&a.isArray(g.languages)&&g.languages.length&&a.each(g.languages,function(a,b){if(m.hasClass(b))return n=b,!1}),j={attr:{},title:h.get_text(m,n)},a.each(d,function(a,b){j.attr[b]=(" "+(m.attr(b)||"")).replace(/ jstree[^ ]*/ig,"").replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"")}),a.inArray("languages",g.plugins)!==-1&&a.isArray(g.languages)&&g.languages.length&&a.each(g.languages,function(a,b){if(m.hasClass(b))return j.language=b,!0}),m.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,"").replace(/^\s+$/ig,"").length&&(j.icon=m.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,"").replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"")),m.children("ins").get(0).style.backgroundImage.length&&(j.icon=m.children("ins").get(0).style.backgroundImage.replace("url(","").replace(")",""))):j=h.get_text(m),l.length>1?i.data.push(j):i.data=j}),k=k.find("> ul > li"),k.length&&(i.children=h.get_json(k,c,d,!0)),f.push(i)}),f}}})}(jQuery),function(a){a.jstree.plugin("languages",{__init:function(){this._load_css()},defaults:[],_fn:{set_lang:function(b){var c=this._get_settings().languages,d=!1,e=".jstree-"+this.get_index()+" a";if(!a.isArray(c)||c.length===0)return!1;if(a.inArray(b,c)==-1){if(!c[b])return!1;b=c[b]}return b==this.data.languages.current_language?!0:(d=a.vakata.css.get_css(e+"."+this.data.languages.current_language,!1,this.data.languages.language_css),d!==!1&&(d.style.display="none"),d=a.vakata.css.get_css(e+"."+b,!1,this.data.languages.language_css),d!==!1&&(d.style.display=""),this.data.languages.current_language=b,this.__callback(b),!0)},get_lang:function(){return this.data.languages.current_language},_get_string:function(b,c){var d=this._get_settings().languages,e=this._get_settings().core.strings;return a.isArray(d)&&d.length&&(c=c&&a.inArray(c,d)!=-1?c:this.data.languages.current_language),e[c]&&e[c][b]?e[c][b]:e[b]?e[b]:b},get_text:function(b,c){b=this._get_node(b)||this.data.ui.last_selected;if(!b.size())return!1;var d=this._get_settings().languages,e=this._get_settings().core.html_titles;return a.isArray(d)&&d.length?(c=c&&a.inArray(c,d)!=-1?c:this.data.languages.current_language,b=b.children("a."+c)):b=b.children("a:eq(0)"),e?(b=b.clone(),b.children("INS").remove(),b.html()):(b=b.contents().filter(function(){return this.nodeType==3})[0],b.nodeValue)},set_text:function(b,c,d){b=this._get_node(b)||this.data.ui.last_selected;if(!b.size())return!1;var e=this._get_settings().languages,f=this._get_settings().core.html_titles,g;return a.isArray(e)&&e.length?(d=d&&a.inArray(d,e)!=-1?d:this.data.languages.current_language,b=b.children("a."+d)):b=b.children("a:eq(0)"),f?(g=b.children("INS").clone(),b.html(c).prepend(g),this.__callback({obj:b,name:c,lang:d}),!0):(b=b.contents().filter(function(){return this.nodeType==3})[0],this.__callback({obj:b,name:c,lang:d}),b.nodeValue=c)},_load_css:function(){var b=this._get_settings().languages,c="/* languages css */",d=".jstree-"+this.get_index()+" a",e;if(a.isArray(b)&&b.length){this.data.languages.current_language=b[0];for(e=0;e<b.length;e++)c+=d+"."+b[e]+" {",b[e]!=this.data.languages.current_language&&(c+=" display:none; "),c+=" } ";this.data.languages.language_css=a.vakata.css.add_sheet({str:c,title:"jstree-languages"})}},create_node:function(b,c,d,e){var f=this.__call_old(!0,b,c,d,function(b){var c=this._get_settings().languages,d=b.children("a"),f;if(a.isArray(c)&&c.length){for(f=0;f<c.length;f++)d.is("."+c[f])||b.append(d.eq(0).clone().removeClass(c.join(" ")).addClass(c[f]));d.not("."+c.join(", .")).remove()}e&&e.call(this,b)});return f}}})}(jQuery),function(a){a.jstree.plugin("cookies",{__init:function(){if(typeof a.cookie=="undefined")throw"jsTree cookie: jQuery cookie plugin not included.";var b=this._get_settings().cookies,c;!b.save_loaded||(c=a.cookie(b.save_loaded),c&&c.length&&(this.data.core.to_load=c.split(","))),!b.save_opened||(c=a.cookie(b.save_opened),c&&c.length&&(this.data.core.to_open=c.split(","))),!b.save_selected||(c=a.cookie(b.save_selected),c&&c.length&&this.data.ui&&(this.data.ui.to_select=c.split(","))),this.get_container().one((this.data.ui?"reselect":"reopen")+".jstree",a.proxy(function(){this.get_container().bind("open_node.jstree close_node.jstree select_node.jstree deselect_node.jstree",a.proxy(function(a){this._get_settings().cookies.auto_save&&this.save_cookie((a.handleObj.namespace+a.handleObj.type).replace("jstree",""))},this))},this))},defaults:{save_loaded:"jstree_load",save_opened:"jstree_open",save_selected:"jstree_select",auto_save:!0,cookie_options:{}},_fn:{save_cookie:function(b){if(this.data.core.refreshing)return;var c=this._get_settings().cookies;if(!b){c.save_loaded&&(this.save_loaded(),a.cookie(c.save_loaded,this.data.core.to_load.join(","),c.cookie_options)),c.save_opened&&(this.save_opened(),a.cookie(c.save_opened,this.data.core.to_open.join(","),c.cookie_options)),c.save_selected&&this.data.ui&&(this.save_selected(),a.cookie(c.save_selected,this.data.ui.to_select.join(","),c.cookie_options));return}switch(b){case"open_node":case"close_node":!c.save_opened||(this.save_opened(),a.cookie(c.save_opened,this.data.core.to_open.join(","),c.cookie_options)),!c.save_loaded||(this.save_loaded(),a.cookie(c.save_loaded,this.data.core.to_load.join(","),c.cookie_options));break;case"select_node":case"deselect_node":!!c.save_selected&&this.data.ui&&(this.save_selected(),a.cookie(c.save_selected,this.data.ui.to_select.join(","),c.cookie_options))}}}})}(jQuery),function(a){a.jstree.plugin("sort",{__init:function(){this.get_container().bind("load_node.jstree",a.proxy(function(a,b){var c=this._get_node(b.rslt.obj);c=c===-1?this.get_container().children("ul"):c.children("ul"),this.sort(c)},this)).bind("rename_node.jstree create_node.jstree create.jstree",a.proxy(function(a,b){this.sort(b.rslt.obj.parent())},this)).bind("move_node.jstree",a.proxy(function(a,b){var c=b.rslt.np==-1?this.get_container():b.rslt.np;this.sort(c.children("ul"))},this))},defaults:function(a,b){return this.get_text(a)>this.get_text(b)?1:-1},_fn:{sort:function(b){var c=this._get_settings().sort,d=this;b.append(a.makeArray(b.children("li")).sort(a.proxy(c,d))),b.find("> li > ul").each(function(){d.sort(a(this))}),this.clean_node(b)}}})}(jQuery),function(a){var b=!1,c=!1,d=!1,e=!1,f=!1,g=!1,h=!1,i=!1,j=!1;a.vakata.dnd={is_down:!1,is_drag:!1,helper:!1,scroll_spd:10,init_x:0,init_y:0,threshold:5,helper_left:5,helper_top:10,user_data:{},drag_start:function(b,c,d){a.vakata.dnd.is_drag&&a.vakata.drag_stop({});try{b.currentTarget.unselectable="on",b.currentTarget.onselectstart=function(){return!1},b.currentTarget.style&&(b.currentTarget.style.MozUserSelect="none")}catch(e){}return a.vakata.dnd.init_x=b.pageX,a.vakata.dnd.init_y=b.pageY,a.vakata.dnd.user_data=c,a.vakata.dnd.is_down=!0,a.vakata.dnd.helper=a("<div id='vakata-dragged' />").html(d),a(document).bind("mousemove",a.vakata.dnd.drag),a(document).bind("mouseup",a.vakata.dnd.drag_stop),!1},drag:function(b){if(!a.vakata.dnd.is_down)return;if(!a.vakata.dnd.is_drag)if(Math.abs(b.pageX-a.vakata.dnd.init_x)>5||Math.abs(b.pageY-a.vakata.dnd.init_y)>5)a.vakata.dnd.helper.appendTo("body"),a.vakata.dnd.is_drag=!0,a(document).triggerHandler("drag_start.vakata",{event:b,data:a.vakata.dnd.user_data});else return;if(b.type==="mousemove"){var c=a(document),d=c.scrollTop(),e=c.scrollLeft();b.pageY-d<20?(g&&h==="down"&&(clearInterval(g),g=!1),g||(h="up",g=setInterval(function(){a(document).scrollTop(a(document).scrollTop()-a.vakata.dnd.scroll_spd)},150))):g&&h==="up"&&(clearInterval(g),g=!1),a(window).height()-(b.pageY-d)<20?(g&&h==="up"&&(clearInterval(g),g=!1),g||(h="down",g=setInterval(function(){a(document).scrollTop(a(document).scrollTop()+a.vakata.dnd.scroll_spd)},150))):g&&h==="down"&&(clearInterval(g),g=!1),b.pageX-e<20?(f&&i==="right"&&(clearInterval(f),f=!1),f||(i="left",f=setInterval(function(){a(document).scrollLeft(a(document).scrollLeft()-a.vakata.dnd.scroll_spd)},150))):f&&i==="left"&&(clearInterval(f),f=!1),a(window).width()-(b.pageX-e)<20?(f&&i==="left"&&(clearInterval(f),f=!1),f||(i="right",f=setInterval(function(){a(document).scrollLeft(a(document).scrollLeft()+a.vakata.dnd.scroll_spd)},150))):f&&i==="right"&&(clearInterval(f),f=!1)}a.vakata.dnd.helper.css({left:b.pageX+a.vakata.dnd.helper_left+"px",top:b.pageY+a.vakata.dnd.helper_top+"px"}),a(document).triggerHandler("drag.vakata",{event:b,data:a.vakata.dnd.user_data})},drag_stop:function(b){f&&clearInterval(f),g&&clearInterval(g),a(document).unbind("mousemove",a.vakata.dnd.drag),a(document).unbind("mouseup",a.vakata.dnd.drag_stop),a(document).triggerHandler("drag_stop.vakata",{event:b,data:a.vakata.dnd.user_data}),a.vakata.dnd.helper.remove(),a.vakata.dnd.init_x=0,a.vakata.dnd.init_y=0,a.vakata.dnd.user_data={},a.vakata.dnd.is_down=!1,a.vakata.dnd.is_drag=!1}},a(function(){var b="#vakata-dragged { display:block; margin:0 0 0 0; padding:4px 4px 4px 24px; position:absolute; top:-2000px; line-height:16px; z-index:10000; } ";a.vakata.css.add_sheet({str:b,title:"vakata"})}),a.jstree.plugin("dnd",{__init:function(){this.data.dnd={active:!1,after:!1,inside:!1,before:!1,off:!1,prepared:!1,w:0,to1:!1,to2:!1,cof:!1,cw:!1,ch:!1,i1:!1,i2:!1,mto:!1},this.get_container().bind("mouseenter.jstree",a.proxy(function(c){if(a.vakata.dnd.is_drag&&a.vakata.dnd.user_data.jstree){this.data.themes&&(d.attr("class","jstree-"+this.data.themes.theme),e&&e.attr("class","jstree-"+this.data.themes.theme),a.vakata.dnd.helper.attr("class","jstree-dnd-helper jstree-"+this.data.themes.theme));if(c.currentTarget===c.target&&a.vakata.dnd.user_data.obj&&a(a.vakata.dnd.user_data.obj).length&&a(a.vakata.dnd.user_data.obj).parents(".jstree:eq(0)")[0]!==c.target){var f=a.jstree._reference(c.target),g;f.data.dnd.foreign?(g=f._get_settings().dnd.drag_check.call(this,{o:b,r:f.get_container(),is_root:!0}),(g===!0||g.inside===!0||g.before===!0||g.after===!0)&&a.vakata.dnd.helper.children("ins").attr("class","jstree-ok")):(f.prepare_move(b,f.get_container(),"last"),f.check_move()&&a.vakata.dnd.helper.children("ins").attr("class","jstree-ok"))}}},this)).bind("mouseup.jstree",a.proxy(function(c){if(a.vakata.dnd.is_drag&&a.vakata.dnd.user_data.jstree&&c.currentTarget===c.target&&a.vakata.dnd.user_data.obj&&a(a.vakata.dnd.user_data.obj).length&&a(a.vakata.dnd.user_data.obj).parents(".jstree:eq(0)")[0]!==c.target){var d=a.jstree._reference(c.currentTarget),e;d.data.dnd.foreign?(e=d._get_settings().dnd.drag_check.call(this,{o:b,r:d.get_container(),is_root:!0}),(e===!0||e.inside===!0||e.before===!0||e.after===!0)&&d._get_settings().dnd.drag_finish.call(this,{o:b,r:d.get_container(),is_root:!0})):d.move_node(b,d.get_container(),"last",c[d._get_settings().dnd.copy_modifier+"Key"])}},this)).bind("mouseleave.jstree",a.proxy(function(b){if(b.relatedTarget&&b.relatedTarget.id&&b.relatedTarget.id==="jstree-marker-line")return!1;a.vakata.dnd.is_drag&&a.vakata.dnd.user_data.jstree&&(this.data.dnd.i1&&clearInterval(this.data.dnd.i1),this.data.dnd.i2&&clearInterval(this.data.dnd.i2),this.data.dnd.to1&&clearTimeout(this.data.dnd.to1),this.data.dnd.to2&&clearTimeout(this.data.dnd.to2),a.vakata.dnd.helper.children("ins").hasClass("jstree-ok")&&a.vakata.dnd.helper.children("ins").attr("class","jstree-invalid"))},this)).bind("mousemove.jstree",a.proxy(function(b){if(a.vakata.dnd.is_drag&&a.vakata.dnd.user_data.jstree){var c=this.get_container()[0];b.pageX+24>this.data.dnd.cof.left+this.data.dnd.cw?(this.data.dnd.i1&&clearInterval(this.data.dnd.i1),this.data.dnd.i1=setInterval(a.proxy(function(){this.scrollLeft+=a.vakata.dnd.scroll_spd},c),100)):b.pageX-24<this.data.dnd.cof.left?(this.data.dnd.i1&&clearInterval(this.data.dnd.i1),this.data.dnd.i1=setInterval(a.proxy(function(){this.scrollLeft-=a.vakata.dnd.scroll_spd},c),100)):this.data.dnd.i1&&clearInterval(this.data.dnd.i1),b.pageY+24>this.data.dnd.cof.top+this.data.dnd.ch?(this.data.dnd.i2&&clearInterval(this.data.dnd.i2),this.data.dnd.i2=setInterval(a.proxy(function(){this.scrollTop+=a.vakata.dnd.scroll_spd},c),100)):b.pageY-24<this.data.dnd.cof.top?(this.data.dnd.i2&&clearInterval(this.data.dnd.i2),this.data.dnd.i2=setInterval(a.proxy(function(){this.scrollTop-=a.vakata.dnd.scroll_spd},c),100)):this.data.dnd.i2&&clearInterval(this.data.dnd.i2)}},this)).bind("scroll.jstree",a.proxy(function(b){a.vakata.dnd.is_drag&&a.vakata.dnd.user_data.jstree&&d&&e&&(d.hide(),e.hide())},this)).delegate("a","mousedown.jstree",a.proxy(function(a){if(a.which===1)return this.start_drag(a.currentTarget,a),!1},this)).delegate("a","mouseenter.jstree",a.proxy(function(b){a.vakata.dnd.is_drag&&a.vakata.dnd.user_data.jstree&&this.dnd_enter(b.currentTarget)},this)).delegate("a","mousemove.jstree",a.proxy(function(b){a.vakata.dnd.is_drag&&a.vakata.dnd.user_data.jstree&&((!c||!c.length||c.children("a")[0]!==b.currentTarget)&&this.dnd_enter(b.currentTarget),typeof this.data.dnd.off.top=="undefined"&&(this.data.dnd.off=a(b.target).offset()),this.data.dnd.w=(b.pageY-(this.data.dnd.off.top||0))%this.data.core.li_height,this.data.dnd.w<0&&(this.data.dnd.w+=this.data.core.li_height),this.dnd_show())},this)).delegate("a","mouseleave.jstree",a.proxy(function(b){if(a.vakata.dnd.is_drag&&a.vakata.dnd.user_data.jstree){if(b.relatedTarget&&b.relatedTarget.id&&b.relatedTarget.id==="jstree-marker-line")return!1;d&&d.hide(),e&&e.hide(),this.data.dnd.mto=setTimeout(function(a){return function(){a.dnd_leave(b)}}(this),0)}},this)).delegate("a","mouseup.jstree",a.proxy(function(b){a.vakata.dnd.is_drag&&a.vakata.dnd.user_data.jstree&&this.dnd_finish(b)},this)),a(document).bind("drag_stop.vakata",a.proxy(function(){this.data.dnd.to1&&clearTimeout(this.data.dnd.to1),this.data.dnd.to2&&clearTimeout(this.data.dnd.to2),this.data.dnd.i1&&clearInterval(this.data.dnd.i1),this.data.dnd.i2&&clearInterval(this.data.dnd.i2),this.data.dnd.after=!1,this.data.dnd.before=!1,this.data.dnd.inside=!1,this.data.dnd.off=!1,this.data.dnd.prepared=!1,this.data.dnd.w=!1,this.data.dnd.to1=!1,this.data.dnd.to2=!1,this.data.dnd.i1=!1,this.data.dnd.i2=!1,this.data.dnd.active=!1,this.data.dnd.foreign=!1,d&&d.css({top:"-2000px"}),e&&e.css({top:"-2000px"})},this)).bind("drag_start.vakata",a.proxy(function(b,c){if(c.data.jstree){var d=a(c.event.target);d.closest(".jstree").hasClass("jstree-"+this.get_index())&&this.dnd_enter(d)}},this));var f=this._get_settings().dnd;f.drag_target&&a(document).delegate(f.drag_target,"mousedown.jstree-"+this.get_index(),a.proxy(function(c){b=c.target,a.vakata.dnd.drag_start(c,{jstree:!0,obj:c.target},"<ins class='jstree-icon'></ins>"+a(c.target).text()),this.data.themes&&(d&&d.attr("class","jstree-"+this.data.themes.theme),e&&e.attr("class","jstree-"+this.data.themes.theme),a.vakata.dnd.helper.attr("class","jstree-dnd-helper jstree-"+this.data.themes.theme)),a.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");var f=this.get_container();this.data.dnd.cof=f.offset(),this.data.dnd.cw=parseInt(f.width(),10),this.data.dnd.ch=parseInt(f.height(),10),this.data.dnd.foreign=!0,c.preventDefault()},this)),f.drop_target&&a(document).delegate(f.drop_target,"mouseenter.jstree-"+this.get_index(),a.proxy(function(c){this.data.dnd.active&&this._get_settings().dnd.drop_check.call(this,{o:b,r:a(c.target),e:c})&&a.vakata.dnd.helper.children("ins").attr("class","jstree-ok")},this)).delegate(f.drop_target,"mouseleave.jstree-"+this.get_index(),a.proxy(function(b){this.data.dnd.active&&a.vakata.dnd.helper.children("ins").attr("class","jstree-invalid")},this)).delegate(f.drop_target,"mouseup.jstree-"+this.get_index(),a.proxy(function(c){this.data.dnd.active&&a.vakata.dnd.helper.children("ins").hasClass("jstree-ok")&&this._get_settings().dnd.drop_finish.call(this,{o:b,r:a(c.target),e:c})},this))},defaults:{copy_modifier:"ctrl",check_timeout:100,open_timeout:500,drop_target:".jstree-drop",drop_check:function(a){return!0},drop_finish:a.noop,drag_target:".jstree-draggable",drag_finish:a.noop,drag_check:function(a){return{after:!1,before:!1,inside:!0}}},_fn:{dnd_prepare:function(){if(!c||!c.length)return;this.data.dnd.off=c.offset(),this._get_settings().core.rtl&&(this.data.dnd.off.right=this.data.dnd.off.left+c.width());if(this.data.dnd.foreign){var a=this._get_settings().dnd.drag_check.call(this,{o:b,r:c});return this.data.dnd.after=a.after,this.data.dnd.before=a.before,this.data.dnd.inside=a.inside,this.data.dnd.prepared=!0,this.dnd_show()}return this.prepare_move(b,c,"before"),this.data.dnd.before=this.check_move(),this.prepare_move(b,c,"after"),this.data.dnd.after=this.check_move(),this._is_loaded(c)?(this.prepare_move(b,c,"inside"),this.data.dnd.inside=this.check_move()):this.data.dnd.inside=!1,this.data.dnd.prepared=!0,this.dnd_show()},dnd_show:function(){if(!this.data.dnd.prepared)return;var b=["before","inside","after"],c=!1,f=this._get_settings().core.rtl,g;this.data.dnd.w<this.data.core.li_height/3?b=["before","inside","after"]:this.data.dnd.w<=this.data.core.li_height*2/3?b=this.data.dnd.w<this.data.core.li_height/2?["inside","before","after"]:["inside","after","before"]:b=["after","inside","before"],a.each(b,a.proxy(function(b,d){if(this.data.dnd[d])return a.vakata.dnd.helper.children("ins").attr("class","jstree-ok"),c=d,!1},this)),c===!1&&a.vakata.dnd.helper.children("ins").attr("class","jstree-invalid"),g=f?this.data.dnd.off.right-18:this.data.dnd.off.left+10;switch(c){case"before":d.css({left:g+"px",top:this.data.dnd.off.top-6+"px"}).show(),e&&e.css({left:g+8+"px",top:this.data.dnd.off.top-1+"px"}).show();break;case"after":d.css({left:g+"px",top:this.data.dnd.off.top+this.data.core.li_height-6+"px"}).show(),e&&e.css({left:g+8+"px",top:this.data.dnd.off.top+this.data.core.li_height-1+"px"}).show();break;case"inside":d.css({left:g+(f?-4:4)+"px",top:this.data.dnd.off.top+this.data.core.li_height/2-5+"px"}).show(),e&&e.hide();break;default:d.hide(),e&&e.hide()}return j=c,c},dnd_open:function(){this.data.dnd.to2=!1,this.open_node(c,a.proxy(this.dnd_prepare,this),!0)},dnd_finish:function(a){this.data.dnd.foreign?(this.data.dnd.after||this.data.dnd.before||this.data.dnd.inside)&&this._get_settings().dnd.drag_finish.call(this,{o:b,r:c,p:j}):(this.dnd_prepare(),this.move_node(b,c,j,a[this._get_settings().dnd.copy_modifier+"Key"])),b=!1,c=!1,d.hide(),e&&e.hide()},dnd_enter:function(b){this.data.dnd.mto&&(clearTimeout(this.data.dnd.mto),this.data.dnd.mto=!1);var d=this._get_settings().dnd;this.data.dnd.prepared=!1,c=this._get_node(b),d.check_timeout?(this.data.dnd.to1&&clearTimeout(this.data.dnd.to1),this.data.dnd.to1=setTimeout(a.proxy(this.dnd_prepare,this),d.check_timeout)):this.dnd_prepare(),d.open_timeout?(this.data.dnd.to2&&clearTimeout(this.data.dnd.to2),c&&c.length&&c.hasClass("jstree-closed")&&(this.data.dnd.to2=setTimeout(a.proxy(this.dnd_open,this),d.open_timeout))):c&&c.length&&c.hasClass("jstree-closed")&&this.dnd_open()},dnd_leave:function(b){this.data.dnd.after=!1,this.data.dnd.before=!1,this.data.dnd.inside=!1,a.vakata.dnd.helper.children("ins").attr("class","jstree-invalid"),d.hide(),e&&e.hide(),c&&c[0]===b.target.parentNode&&(this.data.dnd.to1&&(clearTimeout(this.data.dnd.to1),this.data.dnd.to1=!1),this.data.dnd.to2&&(clearTimeout(this.data.dnd.to2),this.data.dnd.to2=!1))},start_drag:function(c,f){b=this._get_node(c),this.data.ui&&this.is_selected(b)&&(b=this._get_node(null,!0));var g=b.length>1?this._get_string("multiple_selection"):this.get_text(b),h=this.get_container();this._get_settings().core.html_titles||(g=g.replace(/</ig,"&lt;").replace(/>/ig,"&gt;")),a.vakata.dnd.drag_start(f,{jstree:!0,obj:b},"<ins class='jstree-icon'></ins>"+g),this.data.themes&&(d&&d.attr("class","jstree-"+this.data.themes.theme),e&&e.attr("class","jstree-"+this.data.themes.theme),a.vakata.dnd.helper.attr("class","jstree-dnd-helper jstree-"+this.data.themes.theme)),this.data.dnd.cof=h.offset(),this.data.dnd.cw=parseInt(h.width(),10),this.data.dnd.ch=parseInt(h.height(),10),this.data.dnd.active=!0}}}),a(function(){var b="#vakata-dragged ins { display:block; text-decoration:none; width:16px; height:16px; margin:0 0 0 0; padding:0; position:absolute; top:4px; left:4px;  -moz-border-radius:4px; border-radius:4px; -webkit-border-radius:4px; } #vakata-dragged .jstree-ok { background:green; } #vakata-dragged .jstree-invalid { background:red; } #jstree-marker { padding:0; margin:0; font-size:12px; overflow:hidden; height:12px; width:8px; position:absolute; top:-30px; z-index:10001; background-repeat:no-repeat; display:none; background-color:transparent; text-shadow:1px 1px 1px white; color:black; line-height:10px; } #jstree-marker-line { padding:0; margin:0; line-height:0%; font-size:1px; overflow:hidden; height:1px; width:100px; position:absolute; top:-30px; z-index:10000; background-repeat:no-repeat; display:none; background-color:#456c43;  cursor:pointer; border:1px solid #eeeeee; border-left:0; -moz-box-shadow: 0px 0px 2px #666; -webkit-box-shadow: 0px 0px 2px #666; box-shadow: 0px 0px 2px #666;  -moz-border-radius:1px; border-radius:1px; -webkit-border-radius:1px; }";a.vakata.css.add_sheet({str:b,title:"jstree"}),d=a("<div />").attr({id:"jstree-marker"}
).hide().html("&raquo;").bind("mouseleave mouseenter",function(a){return d.hide(),e.hide(),a.preventDefault(),a.stopImmediatePropagation(),!1}).appendTo("body"),e=a("<div />").attr({id:"jstree-marker-line"}).hide().bind("mouseup",function(a){if(c&&c.length)return c.children("a").trigger(a),a.preventDefault(),a.stopImmediatePropagation(),!1}).bind("mouseleave",function(b){var f=a(b.relatedTarget);if(f.is(".jstree")||f.closest(".jstree").length===0)if(c&&c.length)return c.children("a").trigger(b),d.hide(),e.hide(),b.preventDefault(),b.stopImmediatePropagation(),!1}).appendTo("body"),a(document).bind("drag_start.vakata",function(a,b){b.data.jstree&&(d.show(),e&&e.show())}),a(document).bind("drag_stop.vakata",function(a,b){b.data.jstree&&(d.hide(),e&&e.hide())})})}(jQuery),function(a){a.jstree.plugin("checkbox",{__init:function(){this.data.checkbox.noui=this._get_settings().checkbox.override_ui,this.data.ui&&this.data.checkbox.noui&&(this.select_node=this.deselect_node=this.deselect_all=a.noop,this.get_selected=this.get_checked),this.get_container().bind("open_node.jstree create_node.jstree clean_node.jstree refresh.jstree",a.proxy(function(a,b){this._prepare_checkboxes(b.rslt.obj)},this)).bind("loaded.jstree",a.proxy(function(a){this._prepare_checkboxes()},this)).delegate(this.data.ui&&this.data.checkbox.noui?"a":"ins.jstree-checkbox","click.jstree",a.proxy(function(a){a.preventDefault(),this._get_node(a.target).hasClass("jstree-checked")?this.uncheck_node(a.target):this.check_node(a.target);if(this.data.ui&&this.data.checkbox.noui)this.save_selected(),this.data.cookies&&this.save_cookie("select_node");else return a.stopImmediatePropagation(),!1},this))},defaults:{override_ui:!1,two_state:!1,real_checkboxes:!1,checked_parent_open:!0,real_checkboxes_names:function(a){return["check_"+(a[0].id||Math.ceil(Math.random()*1e4)),1]}},__destroy:function(){this.get_container().find("input.jstree-real-checkbox").removeClass("jstree-real-checkbox").end().find("ins.jstree-checkbox").remove()},_fn:{_checkbox_notify:function(a,b){b.checked&&this.check_node(a,!1)},_prepare_checkboxes:function(b){b=!b||b==-1?this.get_container().find("> ul > li"):this._get_node(b);if(b===!1)return;var c,d=this,e,f=this._get_settings().checkbox.two_state,g=this._get_settings().checkbox.real_checkboxes,h=this._get_settings().checkbox.real_checkboxes_names;b.each(function(){e=a(this),c=e.is("li")&&(e.hasClass("jstree-checked")||g&&e.children(":checked").length)?"jstree-checked":"jstree-unchecked",e.find("li").andSelf().each(function(){var b=a(this),e;b.children("a"+(d.data.languages?"":":eq(0)")).not(":has(.jstree-checkbox)").prepend("<ins class='jstree-checkbox'>&#160;</ins>").parent().not(".jstree-checked, .jstree-unchecked").addClass(f?"jstree-unchecked":c),g&&(b.children(":checkbox").length?b.children(":checkbox").addClass("jstree-real-checkbox"):(e=h.call(d,b),b.prepend("<input type='checkbox' class='jstree-real-checkbox' id='"+e[0]+"' name='"+e[0]+"' value='"+e[1]+"' />"))),f?(b.hasClass("jstree-checked")||b.children(":checked").length)&&b.addClass("jstree-checked").children(":checkbox").prop("checked",!0):(c==="jstree-checked"||b.hasClass("jstree-checked")||b.children(":checked").length)&&b.find("li").andSelf().addClass("jstree-checked").children(":checkbox").prop("checked",!0)})}),f||b.find(".jstree-checked").parent().parent().each(function(){d._repair_state(this)})},change_state:function(b,c){b=this._get_node(b);var d=!1,e=this._get_settings().checkbox.real_checkboxes;if(!b||b===-1)return!1;c=c===!1||c===!0?c:b.hasClass("jstree-checked");if(this._get_settings().checkbox.two_state)c?(b.removeClass("jstree-checked").addClass("jstree-unchecked"),e&&b.children(":checkbox").prop("checked",!1)):(b.removeClass("jstree-unchecked").addClass("jstree-checked"),e&&b.children(":checkbox").prop("checked",!0));else{if(c){d=b.find("li").andSelf();if(!d.filter(".jstree-checked, .jstree-undetermined").length)return!1;d.removeClass("jstree-checked jstree-undetermined").addClass("jstree-unchecked"),e&&d.children(":checkbox").prop("checked",!1)}else{d=b.find("li").andSelf();if(!d.filter(".jstree-unchecked, .jstree-undetermined").length)return!1;d.removeClass("jstree-unchecked jstree-undetermined").addClass("jstree-checked"),e&&d.children(":checkbox").prop("checked",!0),this.data.ui&&(this.data.ui.last_selected=b),this.data.checkbox.last_selected=b}b.parentsUntil(".jstree","li").each(function(){var b=a(this);if(c){if(b.children("ul").children("li.jstree-checked, li.jstree-undetermined").length)return b.parentsUntil(".jstree","li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined"),e&&b.parentsUntil(".jstree","li").andSelf().children(":checkbox").prop("checked",!1),!1;b.removeClass("jstree-checked jstree-undetermined").addClass("jstree-unchecked"),e&&b.children(":checkbox").prop("checked",!1)}else{if(b.children("ul").children("li.jstree-unchecked, li.jstree-undetermined").length)return b.parentsUntil(".jstree","li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined"),e&&b.parentsUntil(".jstree","li").andSelf().children(":checkbox").prop("checked",!1),!1;b.removeClass("jstree-unchecked jstree-undetermined").addClass("jstree-checked"),e&&b.children(":checkbox").prop("checked",!0)}})}return this.data.ui&&this.data.checkbox.noui&&(this.data.ui.selected=this.get_checked()),this.__callback(b),!0},check_node:function(a){if(this.change_state(a,!1)){a=this._get_node(a);if(this._get_settings().checkbox.checked_parent_open){var b=this;a.parents(".jstree-closed").each(function(){b.open_node(this,!1,!0)})}this.__callback({obj:a})}},uncheck_node:function(a){this.change_state(a,!0)&&this.__callback({obj:this._get_node(a)})},check_all:function(){var a=this,b=this._get_settings().checkbox.two_state?this.get_container_ul().find("li"):this.get_container_ul().children("li");b.each(function(){a.change_state(this,!1)}),this.__callback()},uncheck_all:function(){var a=this,b=this._get_settings().checkbox.two_state?this.get_container_ul().find("li"):this.get_container_ul().children("li");b.each(function(){a.change_state(this,!0)}),this.__callback()},is_checked:function(a){return a=this._get_node(a),a.length?a.is(".jstree-checked"):!1},get_checked:function(a,b){return a=!a||a===-1?this.get_container():this._get_node(a),b||this._get_settings().checkbox.two_state?a.find(".jstree-checked"):a.find("> ul > .jstree-checked, .jstree-undetermined > ul > .jstree-checked")},get_unchecked:function(a,b){return a=!a||a===-1?this.get_container():this._get_node(a),b||this._get_settings().checkbox.two_state?a.find(".jstree-unchecked"):a.find("> ul > .jstree-unchecked, .jstree-undetermined > ul > .jstree-unchecked")},show_checkboxes:function(){this.get_container().children("ul").removeClass("jstree-no-checkboxes")},hide_checkboxes:function(){this.get_container().children("ul").addClass("jstree-no-checkboxes")},_repair_state:function(a){a=this._get_node(a);if(!a.length)return;if(this._get_settings().checkbox.two_state){a.find("li").andSelf().not(".jstree-checked").removeClass("jstree-undetermined").addClass("jstree-unchecked").children(":checkbox").prop("checked",!0);return}var b=this._get_settings().checkbox.real_checkboxes,c=a.find("> ul > .jstree-checked").length,d=a.find("> ul > .jstree-undetermined").length,e=a.find("> ul > li").length;e===0?a.hasClass("jstree-undetermined")&&this.change_state(a,!1):c===0&&d===0?this.change_state(a,!0):c===e?this.change_state(a,!1):(a.parentsUntil(".jstree","li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined"),b&&a.parentsUntil(".jstree","li").andSelf().children(":checkbox").prop("checked",!1))},reselect:function(){if(this.data.ui&&this.data.checkbox.noui){var b=this,c=this.data.ui.to_select;c=a.map(a.makeArray(c),function(a){return"#"+a.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:")}),this.deselect_all(),a.each(c,function(a,c){b.check_node(c)}),this.__callback()}else this.__call_old()},save_loaded:function(){var a=this;this.data.core.to_load=[],this.get_container_ul().find("li.jstree-closed.jstree-undetermined").each(function(){this.id&&a.data.core.to_load.push("#"+this.id)})}}}),a(function(){var b=".jstree .jstree-real-checkbox { display:none; } ";a.vakata.css.add_sheet({str:b,title:"jstree"})})}(jQuery),function(a){a.vakata.xslt=function(b,c,d){var e="",f,g,h,i;return document.recalc?(f=document.createElement("xml"),g=document.createElement("xml"),f.innerHTML=b,g.innerHTML=c,a("body").append(f).append(g),setTimeout(function(b,c,d){return function(){d.call(null,b.transformNode(c.XMLDocument)),setTimeout(function(b,c){return function(){a(b).remove(),a(c).remove()}}(b,c),200)}}(f,g,d),100),!0):(typeof window.DOMParser!="undefined"&&typeof window.XMLHttpRequest!="undefined"&&typeof window.XSLTProcessor=="undefined"&&(b=(new DOMParser).parseFromString(b,"text/xml"),c=(new DOMParser).parseFromString(c,"text/xml")),typeof window.DOMParser!="undefined"&&typeof window.XMLHttpRequest!="undefined"&&typeof window.XSLTProcessor!="undefined"?(h=new XSLTProcessor,i=a.isFunction(h.transformDocument)?typeof window.XMLSerializer!="undefined":!0,i?(b=(new DOMParser).parseFromString(b,"text/xml"),c=(new DOMParser).parseFromString(c,"text/xml"),a.isFunction(h.transformDocument)?(e=document.implementation.createDocument("","",null),h.transformDocument(b,c,e,null),d.call(null,(new XMLSerializer).serializeToString(e)),!0):(h.importStylesheet(c),e=h.transformToFragment(b,document),d.call(null,a("<div />").append(e).html()),!0)):!1):!1)};var b={nest:'<?xml version="1.0" encoding="utf-8" ?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" ><xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" standalone="no" indent="no" media-type="text/html" /><xsl:template match="/">\t<xsl:call-template name="nodes">\t\t<xsl:with-param name="node" select="/root" />\t</xsl:call-template></xsl:template><xsl:template name="nodes">\t<xsl:param name="node" />\t<ul>\t<xsl:for-each select="$node/item">\t\t<xsl:variable name="children" select="count(./item) &gt; 0" />\t\t<li>\t\t\t<xsl:attribute name="class">\t\t\t\t<xsl:if test="position() = last()">jstree-last </xsl:if>\t\t\t\t<xsl:choose>\t\t\t\t\t<xsl:when test="@state = \'open\'">jstree-open </xsl:when>\t\t\t\t\t<xsl:when test="$children or @hasChildren or @state = \'closed\'">jstree-closed </xsl:when>\t\t\t\t\t<xsl:otherwise>jstree-leaf </xsl:otherwise>\t\t\t\t</xsl:choose>\t\t\t\t<xsl:value-of select="@class" />\t\t\t</xsl:attribute>\t\t\t<xsl:for-each select="@*">\t\t\t\t<xsl:if test="name() != \'class\' and name() != \'state\' and name() != \'hasChildren\'">\t\t\t\t\t<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>\t\t\t\t</xsl:if>\t\t\t</xsl:for-each>\t<ins class="jstree-icon"><xsl:text>&#xa0;</xsl:text></ins>\t\t\t<xsl:for-each select="content/name">\t\t\t\t<a>\t\t\t\t<xsl:attribute name="href">\t\t\t\t\t<xsl:choose>\t\t\t\t\t<xsl:when test="@href"><xsl:value-of select="@href" /></xsl:when>\t\t\t\t\t<xsl:otherwise>#</xsl:otherwise>\t\t\t\t\t</xsl:choose>\t\t\t\t</xsl:attribute>\t\t\t\t<xsl:attribute name="class"><xsl:value-of select="@lang" /> <xsl:value-of select="@class" /></xsl:attribute>\t\t\t\t<xsl:attribute name="style"><xsl:value-of select="@style" /></xsl:attribute>\t\t\t\t<xsl:for-each select="@*">\t\t\t\t\t<xsl:if test="name() != \'style\' and name() != \'class\' and name() != \'href\'">\t\t\t\t\t\t<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>\t\t\t\t\t</xsl:if>\t\t\t\t</xsl:for-each>\t\t\t\t\t<ins>\t\t\t\t\t\t<xsl:attribute name="class">jstree-icon \t\t\t\t\t\t\t<xsl:if test="string-length(attribute::icon) > 0 and not(contains(@icon,\'/\'))"><xsl:value-of select="@icon" /></xsl:if>\t\t\t\t\t\t</xsl:attribute>\t\t\t\t\t\t<xsl:if test="string-length(attribute::icon) > 0 and contains(@icon,\'/\')"><xsl:attribute name="style">background:url(<xsl:value-of select="@icon" />) center center no-repeat;</xsl:attribute></xsl:if>\t\t\t\t\t\t<xsl:text>&#xa0;</xsl:text>\t\t\t\t\t</ins>\t\t\t\t\t<xsl:copy-of select="./child::node()" />\t\t\t\t</a>\t\t\t</xsl:for-each>\t\t\t<xsl:if test="$children or @hasChildren"><xsl:call-template name="nodes"><xsl:with-param name="node" select="current()" /></xsl:call-template></xsl:if>\t\t</li>\t</xsl:for-each>\t</ul></xsl:template></xsl:stylesheet>',flat:'<?xml version="1.0" encoding="utf-8" ?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" ><xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" standalone="no" indent="no" media-type="text/xml" /><xsl:template match="/">\t<ul>\t<xsl:for-each select="//item[not(@parent_id) or @parent_id=0 or not(@parent_id = //item/@id)]">\t\t<xsl:call-template name="nodes">\t\t\t<xsl:with-param name="node" select="." />\t\t\t<xsl:with-param name="is_last" select="number(position() = last())" />\t\t</xsl:call-template>\t</xsl:for-each>\t</ul></xsl:template><xsl:template name="nodes">\t<xsl:param name="node" />\t<xsl:param name="is_last" />\t<xsl:variable name="children" select="count(//item[@parent_id=$node/attribute::id]) &gt; 0" />\t<li>\t<xsl:attribute name="class">\t\t<xsl:if test="$is_last = true()">jstree-last </xsl:if>\t\t<xsl:choose>\t\t\t<xsl:when test="@state = \'open\'">jstree-open </xsl:when>\t\t\t<xsl:when test="$children or @hasChildren or @state = \'closed\'">jstree-closed </xsl:when>\t\t\t<xsl:otherwise>jstree-leaf </xsl:otherwise>\t\t</xsl:choose>\t\t<xsl:value-of select="@class" />\t</xsl:attribute>\t<xsl:for-each select="@*">\t\t<xsl:if test="name() != \'parent_id\' and name() != \'hasChildren\' and name() != \'class\' and name() != \'state\'">\t\t<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>\t\t</xsl:if>\t</xsl:for-each>\t<ins class="jstree-icon"><xsl:text>&#xa0;</xsl:text></ins>\t<xsl:for-each select="content/name">\t\t<a>\t\t<xsl:attribute name="href">\t\t\t<xsl:choose>\t\t\t<xsl:when test="@href"><xsl:value-of select="@href" /></xsl:when>\t\t\t<xsl:otherwise>#</xsl:otherwise>\t\t\t</xsl:choose>\t\t</xsl:attribute>\t\t<xsl:attribute name="class"><xsl:value-of select="@lang" /> <xsl:value-of select="@class" /></xsl:attribute>\t\t<xsl:attribute name="style"><xsl:value-of select="@style" /></xsl:attribute>\t\t<xsl:for-each select="@*">\t\t\t<xsl:if test="name() != \'style\' and name() != \'class\' and name() != \'href\'">\t\t\t\t<xsl:attribute name="{name()}"><xsl:value-of select="." /></xsl:attribute>\t\t\t</xsl:if>\t\t</xsl:for-each>\t\t\t<ins>\t\t\t\t<xsl:attribute name="class">jstree-icon \t\t\t\t\t<xsl:if test="string-length(attribute::icon) > 0 and not(contains(@icon,\'/\'))"><xsl:value-of select="@icon" /></xsl:if>\t\t\t\t</xsl:attribute>\t\t\t\t<xsl:if test="string-length(attribute::icon) > 0 and contains(@icon,\'/\')"><xsl:attribute name="style">background:url(<xsl:value-of select="@icon" />) center center no-repeat;</xsl:attribute></xsl:if>\t\t\t\t<xsl:text>&#xa0;</xsl:text>\t\t\t</ins>\t\t\t<xsl:copy-of select="./child::node()" />\t\t</a>\t</xsl:for-each>\t<xsl:if test="$children">\t\t<ul>\t\t<xsl:for-each select="//item[@parent_id=$node/attribute::id]">\t\t\t<xsl:call-template name="nodes">\t\t\t\t<xsl:with-param name="node" select="." />\t\t\t\t<xsl:with-param name="is_last" select="number(position() = last())" />\t\t\t</xsl:call-template>\t\t</xsl:for-each>\t\t</ul>\t</xsl:if>\t</li></xsl:template></xsl:stylesheet>'},c=function(a){return a.toString().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")};a.jstree.plugin("xml_data",{defaults:{data:!1,ajax:!1,xsl:"flat",clean_node:!1,correct_state:!0,get_skip_empty:!1,get_include_preamble:!0},_fn:{load_node:function(a,b,c){var d=this;this.load_node_xml(a,function(){d.__callback({obj:d._get_node(a)}),b.call(this)},c)},_is_loaded:function(b){var c=this._get_settings().xml_data;return b=this._get_node(b),b==-1||!b||!c.ajax&&!a.isFunction(c.data)||b.is(".jstree-open, .jstree-leaf")||b.children("ul").children("li").size()>0},load_node_xml:function(b,c,d){var e=this.get_settings().xml_data,f=function(){},g=function(){};b=this._get_node(b);if(b&&b!==-1){if(b.data("jstree_is_loading"))return;b.data("jstree_is_loading",!0)}switch(!0){case!e.data&&!e.ajax:throw"Neither data nor ajax settings supplied.";case a.isFunction(e.data):e.data.call(this,b,a.proxy(function(d){this.parse_xml(d,a.proxy(function(d){d&&(d=d.replace(/ ?xmlns="[^"]*"/ig,""),d.length>10?(d=a(d),b===-1||!b?this.get_container().children("ul").empty().append(d.children()):(b.children("a.jstree-loading").removeClass("jstree-loading"),b.append(d),b.removeData("jstree_is_loading")),e.clean_node&&this.clean_node(b),c&&c.call(this)):b&&b!==-1?(b.children("a.jstree-loading").removeClass("jstree-loading"),b.removeData("jstree_is_loading"),e.correct_state&&(this.correct_state(b),c&&c.call(this))):e.correct_state&&(this.get_container().children("ul").empty(),c&&c.call(this)))},this))},this));break;case!!e.data&&!e.ajax||!!e.data&&!!e.ajax&&(!b||b===-1):(!b||b==-1)&&this.parse_xml(e.data,a.proxy(function(d){d?(d=d.replace(/ ?xmlns="[^"]*"/ig,""),d.length>10&&(d=a(d),this.get_container().children("ul").empty().append(d.children()),e.clean_node&&this.clean_node(b),c&&c.call(this))):e.correct_state&&(this.get_container().children("ul").empty(),c&&c.call(this))},this));break;case!e.data&&!!e.ajax||!!e.data&&!!e.ajax&&b&&b!==-1:f=function(a,c,f){var g=this.get_settings().xml_data.ajax.error;g&&g.call(this,a,c,f),b!==-1&&b.length?(b.children("a.jstree-loading").removeClass("jstree-loading"),b.removeData("jstree_is_loading"),c==="success"&&e.correct_state&&this.correct_state(b)):c==="success"&&e.correct_state&&this.get_container().children("ul").empty(),d&&d.call(this)},g=function(d,g,h){d=h.responseText;var i=this.get_settings().xml_data.ajax.success;i&&(d=i.call(this,d,g,h)||d);if(d===""||d&&d.toString&&d.toString().replace(/^[\s\n]+$/,"")==="")return f.call(this,h,g,"");this.parse_xml(d,a.proxy(function(d){d&&(d=d.replace(/ ?xmlns="[^"]*"/ig,""),d.length>10?(d=a(d),b===-1||!b?this.get_container().children("ul").empty().append(d.children()):(b.children("a.jstree-loading").removeClass("jstree-loading"),b.append(d),b.removeData("jstree_is_loading")),e.clean_node&&this.clean_node(b),c&&c.call(this)):b&&b!==-1?(b.children("a.jstree-loading").removeClass("jstree-loading"),b.removeData("jstree_is_loading"),e.correct_state&&(this.correct_state(b),c&&c.call(this))):e.correct_state&&(this.get_container().children("ul").empty(),c&&c.call(this)))},this))},e.ajax.context=this,e.ajax.error=f,e.ajax.success=g,e.ajax.dataType||(e.ajax.dataType="xml"),a.isFunction(e.ajax.url)&&(e.ajax.url=e.ajax.url.call(this,b)),a.isFunction(e.ajax.data)&&(e.ajax.data=e.ajax.data.call(this,b)),a.ajax(e.ajax)}},parse_xml:function(c,d){var e=this._get_settings().xml_data;a.vakata.xslt(c,b[e.xsl],d)},get_xml:function(b,d,e,f,g){var h="",i=this._get_settings(),j=this,k,l,m,n,o;b||(b="flat"),g||(g=0),d=this._get_node(d);if(!d||d===-1)d=this.get_container().find("> ul > li");return e=a.isArray(e)?e:["id","class"],!g&&this.data.types&&a.inArray(i.types.type_attr,e)===-1&&e.push(i.types.type_attr),f=a.isArray(f)?f:[],g||(i.xml_data.get_include_preamble&&(h+='<?xml version="1.0" encoding="UTF-8"?>'),h+="<root>"),d.each(function(){h+="<item",m=a(this),a.each(e,function(a,b){var d=m.attr(b);if(!i.xml_data.get_skip_empty||typeof d!="undefined")h+=" "+b+'="'+c((" "+(d||"")).replace(/ jstree[^ ]*/ig,"").replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,""))+'"'}),m.hasClass("jstree-open")&&(h+=' state="open"'),m.hasClass("jstree-closed")&&(h+=' state="closed"'),b==="flat"&&(h+=' parent_id="'+c(g)+'"'),h+=">",h+="<content>",n=m.children("a"),n.each(function(){k=a(this),o=!1,h+="<name",a.inArray("languages",i.plugins)!==-1&&a.each(i.languages,function(a,b){if(k.hasClass(b))return h+=' lang="'+c(b)+'"',o=b,!1}),f.length&&a.each(f,function(a,b){var d=k.attr(b);if(!i.xml_data.get_skip_empty||typeof d!="undefined")h+=" "+b+'="'+c((" "+d||"").replace(/ jstree[^ ]*/ig,"").replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,""))+'"'}),k.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,"").replace(/^\s+$/ig,"").length&&(h+=' icon="'+c(k.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,"").replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,""))+'"'),k.children("ins").get(0).style.backgroundImage.length&&(h+=' icon="'+c(k.children("ins").get(0).style.backgroundImage.replace("url(","").replace(")","").replace(/'/ig,"").replace(/"/ig,""))+'"'),h+=">",h+="<![CDATA["+j.get_text(k,o)+"]]>",h+="</name>"}),h+="</content>",l=m[0].id||!0,m=m.find("> ul > li"),m.length?l=j.get_xml(b,m,e,f,l):l="",b=="nest"&&(h+=l),h+="</item>",b=="flat"&&(h+=l)}),g||(h+="</root>"),h}}})}(jQuery),function(a){a.expr[":"].jstree_contains=function(a,b,c){return(a.textContent||a.innerText||"").toLowerCase().indexOf(c[3].toLowerCase())>=0},a.expr[":"].jstree_title_contains=function(a,b,c){return(a.getAttribute("title")||"").toLowerCase().indexOf(c[3].toLowerCase())>=0},a.jstree.plugin("search",{__init:function(){this.data.search.str="",this.data.search.result=a(),this._get_settings().search.show_only_matches&&this.get_container().bind("search.jstree",function(b,c){a(this).children("ul").find("li").hide().removeClass("jstree-last"),c.rslt.nodes.parentsUntil(".jstree").andSelf().show().filter("ul").each(function(){a(this).children("li:visible").eq(-1).addClass("jstree-last")})}).bind("clear_search.jstree",function(){a(this).children("ul").find("li").css("display","").end().end().jstree("clean_node",-1)})},defaults:{ajax:!1,search_method:"jstree_contains",show_only_matches:!1},_fn:{search:function(b,c){if(a.trim(b)===""){this.clear_search();return}var d=this.get_settings().search,e=this,f=function(){},g=function(){};this.data.search.str=b;if(!c&&d.ajax!==!1&&this.get_container_ul().find("li.jstree-closed:not(:has(ul)):eq(0)").length>0){this.search.supress_callback=!0,f=function(){},g=function(a,b,c){var d=this.get_settings().search.ajax.success;d&&(a=d.call(this,a,b,c)||a),this.data.search.to_open=a,this._search_open()},d.ajax.context=this,d.ajax.error=f,d.ajax.success=g,a.isFunction(d.ajax.url)&&(d.ajax.url=d.ajax.url.call(this,b)),a.isFunction(d.ajax.data)&&(d.ajax.data=d.ajax.data.call(this,b)),d.ajax.data||(d.ajax.data={search_string:b});if(!d.ajax.dataType||/^json/.exec(d.ajax.dataType))d.ajax.dataType="json";a.ajax(d.ajax);return}this.data.search.result.length&&this.clear_search(),this.data.search.result=this.get_container().find("a"+(this.data.languages?"."+this.get_lang():"")+":"+d.search_method+"("+this.data.search.str+")"),this.data.search.result.addClass("jstree-search").parent().parents(".jstree-closed").each(function(){e.open_node(this,!1,!0)}),this.__callback({nodes:this.data.search.result,str:b})},clear_search:function(b){this.data.search.result.removeClass("jstree-search"),this.__callback(this.data.search.result),this.data.search.result=a()},_search_open:function(b){var c=this,d=!0,e=[],f=[];this.data.search.to_open.length&&(a.each(this.data.search.to_open,function(b,c){if(c=="#")return!0;a(c).length&&a(c).is(".jstree-closed")?e.push(c):f.push(c)}),e.length&&(this.data.search.to_open=f,a.each(e,function(a,b){c.open_node(b,function(){c._search_open(!0)})}),d=!1)),d&&this.search(this.data.search.str,!0)}}})}(jQuery),function(a){a.vakata.context={hide_on_mouseleave:!1,cnt:a("<div id='vakata-contextmenu' />"),vis:!1,tgt:!1,par:!1,func:!1,data:!1,rtl:!1,show:function(b,c,d,e,f,g,h){a.vakata.context.rtl=!!h;var i=a.vakata.context.parse(b),j,k;if(!i)return;a.vakata.context.vis=!0,a.vakata.context.tgt=c,a.vakata.context.par=g||c||null,a.vakata.context.data=f||null,a.vakata.context.cnt.html(i).css({visibility:"hidden",display:"block",left:0,top:0}),a.vakata.context.hide_on_mouseleave&&a.vakata.context.cnt.one("mouseleave",function(b){a.vakata.context.hide()}),j=a.vakata.context.cnt.height(),k=a.vakata.context.cnt.width(),d+k>a(document).width()&&(d=a(document).width()-(k+5),a.vakata.context.cnt.find("li > ul").addClass("right")),e+j>a(document).height()&&(e-=j+c[0].offsetHeight,a.vakata.context.cnt.find("li > ul").addClass("bottom")),a.vakata.context.cnt.css({left:d,top:e}).find("li:has(ul)").bind("mouseenter",function(b){var c=a(document).width(),d=a(document).height(),e=a(this).children("ul").show();c!==a(document).width()&&e.toggleClass("right"),d!==a(document).height()&&e.toggleClass("bottom")}).bind("mouseleave",function(b){a(this).children("ul").hide()}).end().css({visibility:"visible"}).show(),a(document).triggerHandler("context_show.vakata")},hide:function(){a.vakata.context.vis=!1,a.vakata.context.cnt.attr("class","").css({visibility:"hidden"}),a(document).triggerHandler("context_hide.vakata")},parse:function(b,c){if(!b)return!1;var d="",e=!1,f=!0;return c||(a.vakata.context.func={}),d+="<ul>",a.each(b,function(b,c){if(!c)return!0;a.vakata.context.func[b]=c.action,!f&&c.separator_before&&(d+="<li class='vakata-separator vakata-separator-before'></li>"),f=!1,d+="<li class='"+(c._class||"")+(c._disabled?" jstree-contextmenu-disabled ":"")+"'><ins ",c.icon&&c.icon.indexOf("/")===-1&&(d+=" class='"+c.icon+"' "),c.icon&&c.icon.indexOf("/")!==-1&&(d+=" style='background:url("+c.icon+") center center no-repeat;' "),d+=">&#160;</ins><a href='#' rel='"+b+"'>",c.submenu&&(d+="<span style='float:"+(a.vakata.context.rtl?"left":"right")+";'>&raquo;</span>"),d+=c.label+"</a>",c.submenu&&(e=a.vakata.context.parse(c.submenu,!0),e&&(d+=e)),d+="</li>",c.separator_after&&(d+="<li class='vakata-separator vakata-separator-after'></li>",f=!0)}),d=d.replace(/<li class\='vakata-separator vakata-separator-after'\><\/li\>$/,""),d+="</ul>",a(document).triggerHandler("context_parse.vakata"),d.length>10?d:!1},exec:function(b){return a.isFunction(a.vakata.context.func[b])?(a.vakata.context.func[b].call(a.vakata.context.data,a.vakata.context.par),!0):!1}},a(function(){var b="#vakata-contextmenu { display:block; visibility:hidden; left:0; top:-200px; position:absolute; margin:0; padding:0; min-width:180px; background:#ebebeb; border:1px solid silver; z-index:10000; *width:180px; } #vakata-contextmenu ul { min-width:180px; *width:180px; } #vakata-contextmenu ul, #vakata-contextmenu li { margin:0; padding:0; list-style-type:none; display:block; } #vakata-contextmenu li { line-height:20px; min-height:20px; position:relative; padding:0px; } #vakata-contextmenu li a { padding:1px 6px; line-height:17px; display:block; text-decoration:none; margin:1px 1px 0 1px; } #vakata-contextmenu li ins { float:left; width:16px; height:16px; text-decoration:none; margin-right:2px; } #vakata-contextmenu li a:hover, #vakata-contextmenu li.vakata-hover > a { background:gray; color:white; } #vakata-contextmenu li ul { display:none; position:absolute; top:-2px; left:100%; background:#ebebeb; border:1px solid gray; } #vakata-contextmenu .right { right:100%; left:auto; } #vakata-contextmenu .bottom { bottom:-1px; top:auto; } #vakata-contextmenu li.vakata-separator { min-height:0; height:1px; line-height:1px; font-size:1px; overflow:hidden; margin:0 2px; background:silver; /* border-top:1px solid #fefefe; */ padding:0; } ";a.vakata.css.add_sheet({str:b,title:"vakata"}),a.vakata.context.cnt.delegate("a","click",function(a){a.preventDefault()}).delegate("a","mouseup",function(b){!a(this).parent().hasClass("jstree-contextmenu-disabled")&&a.vakata.context.exec(a(this).attr("rel"))?a.vakata.context.hide():a(this).blur()}).delegate("a","mouseover",function(){a.vakata.context.cnt.find(".vakata-hover").removeClass("vakata-hover")}).appendTo("body"),a(document).bind("mousedown",function(b){a.vakata.context.vis&&!a.contains(a.vakata.context.cnt[0],b.target)&&a.vakata.context.hide()}),typeof a.hotkeys!="undefined"&&a(document).bind("keydown","up",function(b){if(a.vakata.context.vis){var c=a.vakata.context.cnt.find("ul:visible").last().children(".vakata-hover").removeClass("vakata-hover").prevAll("li:not(.vakata-separator)").first();c.length||(c=a.vakata.context.cnt.find("ul:visible").last().children("li:not(.vakata-separator)").last()),c.addClass("vakata-hover"),b.stopImmediatePropagation(),b.preventDefault()}}).bind("keydown","down",function(b){if(a.vakata.context.vis){var c=a.vakata.context.cnt.find("ul:visible").last().children(".vakata-hover").removeClass("vakata-hover").nextAll("li:not(.vakata-separator)").first();c.length||(c=a.vakata.context.cnt.find("ul:visible").last().children("li:not(.vakata-separator)").first()),c.addClass("vakata-hover"),b.stopImmediatePropagation(),b.preventDefault()}}).bind("keydown","right",function(b){a.vakata.context.vis&&(a.vakata.context.cnt.find(".vakata-hover").children("ul").show().children("li:not(.vakata-separator)").removeClass("vakata-hover").first().addClass("vakata-hover"),b.stopImmediatePropagation(),b.preventDefault())}).bind("keydown","left",function(b){a.vakata.context.vis&&(a.vakata.context.cnt.find(".vakata-hover").children("ul").hide().children(".vakata-separator").removeClass("vakata-hover"),b.stopImmediatePropagation(),b.preventDefault())}).bind("keydown","esc",function(b){a.vakata.context.hide(),b.preventDefault()}).bind("keydown","space",function(b){a.vakata.context.cnt.find(".vakata-hover").last().children("a").click(),b.preventDefault()})}),a.jstree.plugin("contextmenu",{__init:function(){this.get_container().delegate("a","contextmenu.jstree",a.proxy(function(b){b.preventDefault(),a(b.currentTarget).hasClass("jstree-loading")||this.show_contextmenu(b.currentTarget,b.pageX,b.pageY)},this)).delegate("a","click.jstree",a.proxy(function(b){this.data.contextmenu&&a.vakata.context.hide()},this)).bind("destroy.jstree",a.proxy(function(){this.data.contextmenu&&a.vakata.context.hide()},this)),a(document).bind("context_hide.vakata",a.proxy(function(){this.data.contextmenu=!1},this))},defaults:{select_node:!1,show_at_node:!0,items:{create:{separator_before:!1,separator_after:!0,label:"Create",action:function(a){this.create(a)}},rename:{separator_before:!1,separator_after:!1,label:"Rename",action:function(a){this.rename(a)}},remove:{separator_before:!1,icon:!1,separator_after:!1,label:"Delete",action:function(a){this.is_selected(a)?this.remove():this.remove(a)}},ccp:{separator_before:!0,icon:!1,separator_after:!1,label:"Edit",action:!1,submenu:{cut:{separator_before:!1,separator_after:!1,label:"Cut",action:function(a){this.cut(a)}},copy:{separator_before:!1,icon:!1,separator_after:!1,label:"Copy",action:function(a){this.copy(a)}},paste:{separator_before:!1,icon:!1,separator_after:!1,label:"Paste",action:function(a){this.paste(a)}}}}}},_fn:{show_contextmenu:function(b,c,d){b=this._get_node(b);var e=this.get_settings().contextmenu,f=b.children("a:visible:eq(0)"),g=!1,h=!1;e.select_node&&this.data.ui&&!this.is_selected(b)&&(this.deselect_all(),this.select_node(b,!0));if(e.show_at_node||typeof c=="undefined"||typeof d=="undefined")g=f.offset(),c=g.left,d=g.top+this.data.core.li_height;h=b.data("jstree")&&b.data("jstree").contextmenu?b.data("jstree").contextmenu:e.items,a.isFunction(h)&&(h=h.call(this,b)),this.data.contextmenu=!0,a.vakata.context.show(h,f,c,d,this,b,this._get_settings().core.rtl),this.data.themes&&a.vakata.context.cnt.attr("class","jstree-"+this.data.themes.theme+"-context")}}})}(jQuery),function(b){b.jstree.plugin("types",{__init:function(){var c=this._get_settings().types;this.data.types.attach_to=[],this.get_container().bind("init.jstree",b.proxy(function(){var a=c.types,d=c.type_attr,e="",f=this;b.each(a,function(a,c){b.each(c,function(a,b){/^(max_depth|max_children|icon|valid_children)$/.test(a)||f.data.types.attach_to.push(a)});if(!c.icon)return!0;if(c.icon.image||c.icon.position)a=="default"?e+=".jstree-"+f.get_index()+" a > .jstree-icon { ":e+=".jstree-"+f.get_index()+" li["+d+'="'+a+'"] > a > .jstree-icon { ',c.icon.image&&(e+=" background-image:url("+c.icon.image+"); "),c.icon.position?e+=" background-position:"+c.icon.position+"; ":e+=" background-position:0 0; ",e+="} "}),e!==""&&b.vakata.css.add_sheet({str:e,title:"jstree-types"})},this)).bind("before.jstree",b.proxy(function(a,c){var d,e,f=this._get_settings().types.use_data?this._get_node(c.args[0]):!1,g=f&&f!==-1&&f.length?f.data("jstree"):!1;if(g&&g.types&&g.types[c.func]===!1)return a.stopImmediatePropagation(),!1;if(b.inArray(c.func,this.data.types.attach_to)!==-1){if(!c.args[0]||!c.args[0].tagName&&!c.args[0].jquery)return;d=this._get_settings().types.types,e=this._get_type(c.args[0]);if((d[e]&&typeof d[e][c.func]!="undefined"||d["default"]&&typeof d["default"][c.func]!="undefined")&&this._check(c.func,c.args[0])===!1)return a.stopImmediatePropagation(),!1}},this
)),a&&this.get_container().bind("load_node.jstree set_type.jstree",b.proxy(function(a,c){var d=c&&c.rslt&&c.rslt.obj&&c.rslt.obj!==-1?this._get_node(c.rslt.obj).parent():this.get_container_ul(),e=!1,f=this._get_settings().types;b.each(f.types,function(a,b){b.icon&&(b.icon.image||b.icon.position)&&(e=a==="default"?d.find("li > a > .jstree-icon"):d.find("li["+f.type_attr+"='"+a+"'] > a > .jstree-icon"),b.icon.image&&e.css("backgroundImage","url("+b.icon.image+")"),e.css("backgroundPosition",b.icon.position||"0 0"))})},this))},defaults:{max_children:-1,max_depth:-1,valid_children:"all",use_data:!1,type_attr:"rel",types:{"default":{max_children:-1,max_depth:-1,valid_children:"all"}}},_fn:{_types_notify:function(a,b){b.type&&this._get_settings().types.use_data&&this.set_type(b.type,a)},_get_type:function(a){return a=this._get_node(a),!a||!a.length?!1:a.attr(this._get_settings().types.type_attr)||"default"},set_type:function(a,b){b=this._get_node(b);var c=!b.length||!a?!1:b.attr(this._get_settings().types.type_attr,a);return c&&this.__callback({obj:b,type:a}),c},_check:function(a,c,d){c=this._get_node(c);var e=!1,f=this._get_type(c),g=0,h=this,i=this._get_settings().types,j=!1;if(c===-1){if(!i[a])return;e=i[a]}else{if(f===!1)return;j=i.use_data?c.data("jstree"):!1,j&&j.types&&typeof j.types[a]!="undefined"?e=j.types[a]:!i.types[f]||typeof i.types[f][a]=="undefined"?!!i.types["default"]&&typeof i.types["default"][a]!="undefined"&&(e=i.types["default"][a]):e=i.types[f][a]}return b.isFunction(e)&&(e=e.call(this,c)),a==="max_depth"&&c!==-1&&d!==!1&&i.max_depth!==-2&&e!==0&&c.children("a:eq(0)").parentsUntil(".jstree","li").each(function(b){if(i.max_depth!==-1&&i.max_depth-(b+1)<=0)return e=0,!1;g=b===0?e:h._check(a,this,!1);if(g!==-1&&g-(b+1)<=0)return e=0,!1;g>=0&&(g-(b+1)<e||e<0)&&(e=g-(b+1)),i.max_depth>=0&&(i.max_depth-(b+1)<e||e<0)&&(e=i.max_depth-(b+1))}),e},check_move:function(){if(!this.__call_old())return!1;var a=this._get_move(),c=a.rt._get_settings().types,d=a.rt._check("max_children",a.cr),e=a.rt._check("max_depth",a.cr),f=a.rt._check("valid_children",a.cr),g=0,h=1,i;if(f==="none")return!1;if(b.isArray(f)&&a.ot&&a.ot._get_type){a.o.each(function(){if(b.inArray(a.ot._get_type(this),f)===-1)return h=!1,!1});if(h===!1)return!1}if(c.max_children!==-2&&d!==-1){g=a.cr===-1?this.get_container().find("> ul > li").not(a.o).length:a.cr.find("> ul > li").not(a.o).length;if(g+a.o.length>d)return!1}if(c.max_depth!==-2&&e!==-1){h=0;if(e===0)return!1;if(typeof a.o.d=="undefined"){i=a.o;while(i.length>0)i=i.find("> ul > li"),h++;a.o.d=h}if(e-a.o.d<0)return!1}return!0},create_node:function(a,c,d,e,f,g){if(!g&&(f||this._is_loaded(a))){var h=typeof c=="string"&&c.match(/^before|after$/i)&&a!==-1?this._get_parent(a):this._get_node(a),i=this._get_settings().types,j=this._check("max_children",h),k=this._check("max_depth",h),l=this._check("valid_children",h),m;typeof d=="string"&&(d={data:d}),d||(d={});if(l==="none")return!1;if(b.isArray(l))if(!d.attr||!d.attr[i.type_attr])d.attr||(d.attr={}),d.attr[i.type_attr]=l[0];else if(b.inArray(d.attr[i.type_attr],l)===-1)return!1;if(i.max_children!==-2&&j!==-1){m=h===-1?this.get_container().find("> ul > li").length:h.find("> ul > li").length;if(m+1>j)return!1}if(i.max_depth!==-2&&k!==-1&&k-1<0)return!1}return this.__call_old(!0,a,c,d,e,f,g)}}})}(jQuery),function(a){a.jstree.plugin("html_data",{__init:function(){this.data.html_data.original_container_html=this.get_container().find(" > ul > li").clone(!0),this.data.html_data.original_container_html.find("li").andSelf().contents().filter(function(){return this.nodeType==3}).remove()},defaults:{data:!1,ajax:!1,correct_state:!0},_fn:{load_node:function(a,b,c){var d=this;this.load_node_html(a,function(){d.__callback({obj:d._get_node(a)}),b.call(this)},c)},_is_loaded:function(b){return b=this._get_node(b),b==-1||!b||!this._get_settings().html_data.ajax&&!a.isFunction(this._get_settings().html_data.data)||b.is(".jstree-open, .jstree-leaf")||b.children("ul").children("li").size()>0},load_node_html:function(b,c,d){var e,f=this.get_settings().html_data,g=function(){},h=function(){};b=this._get_node(b);if(b&&b!==-1){if(b.data("jstree_is_loading"))return;b.data("jstree_is_loading",!0)}switch(!0){case a.isFunction(f.data):f.data.call(this,b,a.proxy(function(d){d&&d!==""&&d.toString&&d.toString().replace(/^[\s\n]+$/,"")!==""?(d=a(d),d.is("ul")||(d=a("<ul />").append(d)),b==-1||!b?this.get_container().children("ul").empty().append(d.children()).find("li, a").filter(function(){return!this.firstChild||!this.firstChild.tagName||this.firstChild.tagName!=="INS"}).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"):(b.children("a.jstree-loading").removeClass("jstree-loading"),b.append(d).children("ul").find("li, a").filter(function(){return!this.firstChild||!this.firstChild.tagName||this.firstChild.tagName!=="INS"}).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"),b.removeData("jstree_is_loading")),this.clean_node(b),c&&c.call(this)):b&&b!==-1?(b.children("a.jstree-loading").removeClass("jstree-loading"),b.removeData("jstree_is_loading"),f.correct_state&&(this.correct_state(b),c&&c.call(this))):f.correct_state&&(this.get_container().children("ul").empty(),c&&c.call(this))},this));break;case!f.data&&!f.ajax:if(!b||b==-1)this.get_container().children("ul").empty().append(this.data.html_data.original_container_html).find("li, a").filter(function(){return!this.firstChild||!this.firstChild.tagName||this.firstChild.tagName!=="INS"}).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"),this.clean_node();c&&c.call(this);break;case!!f.data&&!f.ajax||!!f.data&&!!f.ajax&&(!b||b===-1):if(!b||b==-1)e=a(f.data),e.is("ul")||(e=a("<ul />").append(e)),this.get_container().children("ul").empty().append(e.children()).find("li, a").filter(function(){return!this.firstChild||!this.firstChild.tagName||this.firstChild.tagName!=="INS"}).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"),this.clean_node();c&&c.call(this);break;case!f.data&&!!f.ajax||!!f.data&&!!f.ajax&&b&&b!==-1:b=this._get_node(b),g=function(a,c,e){var g=this.get_settings().html_data.ajax.error;g&&g.call(this,a,c,e),b!=-1&&b.length?(b.children("a.jstree-loading").removeClass("jstree-loading"),b.removeData("jstree_is_loading"),c==="success"&&f.correct_state&&this.correct_state(b)):c==="success"&&f.correct_state&&this.get_container().children("ul").empty(),d&&d.call(this)},h=function(d,e,h){var i=this.get_settings().html_data.ajax.success;i&&(d=i.call(this,d,e,h)||d);if(d===""||d&&d.toString&&d.toString().replace(/^[\s\n]+$/,"")==="")return g.call(this,h,e,"");d?(d=a(d),d.is("ul")||(d=a("<ul />").append(d)),b==-1||!b?this.get_container().children("ul").empty().append(d.children()).find("li, a").filter(function(){return!this.firstChild||!this.firstChild.tagName||this.firstChild.tagName!=="INS"}).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"):(b.children("a.jstree-loading").removeClass("jstree-loading"),b.append(d).children("ul").find("li, a").filter(function(){return!this.firstChild||!this.firstChild.tagName||this.firstChild.tagName!=="INS"}).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"),b.removeData("jstree_is_loading")),this.clean_node(b),c&&c.call(this)):b&&b!==-1?(b.children("a.jstree-loading").removeClass("jstree-loading"),b.removeData("jstree_is_loading"),f.correct_state&&(this.correct_state(b),c&&c.call(this))):f.correct_state&&(this.get_container().children("ul").empty(),c&&c.call(this))},f.ajax.context=this,f.ajax.error=g,f.ajax.success=h,f.ajax.dataType||(f.ajax.dataType="html"),a.isFunction(f.ajax.url)&&(f.ajax.url=f.ajax.url.call(this,b)),a.isFunction(f.ajax.data)&&(f.ajax.data=f.ajax.data.call(this,b)),a.ajax(f.ajax)}}}}),a.jstree.defaults.plugins.push("html_data")}(jQuery),function(a){a.jstree.plugin("themeroller",{__init:function(){var b=this._get_settings().themeroller;this.get_container().addClass("ui-widget-content").addClass("jstree-themeroller").delegate("a","mouseenter.jstree",function(c){a(c.currentTarget).hasClass("jstree-loading")||a(this).addClass(b.item_h)}).delegate("a","mouseleave.jstree",function(){a(this).removeClass(b.item_h)}).bind("init.jstree",a.proxy(function(a,b){b.inst.get_container().find("> ul > li > .jstree-loading > ins").addClass("ui-icon-refresh"),this._themeroller(b.inst.get_container().find("> ul > li"))},this)).bind("open_node.jstree create_node.jstree",a.proxy(function(a,b){this._themeroller(b.rslt.obj)},this)).bind("loaded.jstree refresh.jstree",a.proxy(function(a){this._themeroller()},this)).bind("close_node.jstree",a.proxy(function(a,b){this._themeroller(b.rslt.obj)},this)).bind("delete_node.jstree",a.proxy(function(a,b){this._themeroller(b.rslt.parent)},this)).bind("correct_state.jstree",a.proxy(function(a,c){c.rslt.obj.children("ins.jstree-icon").removeClass(b.opened+" "+b.closed+" ui-icon").end().find("> a > ins.ui-icon").filter(function(){return this.className.toString().replace(b.item_clsd,"").replace(b.item_open,"").replace(b.item_leaf,"").indexOf("ui-icon-")===-1}).removeClass(b.item_open+" "+b.item_clsd).addClass(b.item_leaf||"jstree-no-icon")},this)).bind("select_node.jstree",a.proxy(function(a,c){c.rslt.obj.children("a").addClass(b.item_a)},this)).bind("deselect_node.jstree deselect_all.jstree",a.proxy(function(a,c){this.get_container().find("a."+b.item_a).removeClass(b.item_a).end().find("a.jstree-clicked").addClass(b.item_a)},this)).bind("dehover_node.jstree",a.proxy(function(a,c){c.rslt.obj.children("a").removeClass(b.item_h)},this)).bind("hover_node.jstree",a.proxy(function(a,c){this.get_container().find("a."+b.item_h).not(c.rslt.obj).removeClass(b.item_h),c.rslt.obj.children("a").addClass(b.item_h)},this)).bind("move_node.jstree",a.proxy(function(a,b){this._themeroller(b.rslt.o),this._themeroller(b.rslt.op)},this))},__destroy:function(){var b=this._get_settings().themeroller,c=["ui-icon"];a.each(b,function(a,b){b=b.split(" "),b.length&&(c=c.concat(b))}),this.get_container().removeClass("ui-widget-content").find("."+c.join(", .")).removeClass(c.join(" "))},_fn:{_themeroller:function(a){var b=this._get_settings().themeroller;a=!a||a==-1?this.get_container_ul():this._get_node(a).parent(),a.find("li.jstree-closed").children("ins.jstree-icon").removeClass(b.opened).addClass("ui-icon "+b.closed).end().children("a").addClass(b.item).children("ins.jstree-icon").addClass("ui-icon").filter(function(){return this.className.toString().replace(b.item_clsd,"").replace(b.item_open,"").replace(b.item_leaf,"").indexOf("ui-icon-")===-1}).removeClass(b.item_leaf+" "+b.item_open).addClass(b.item_clsd||"jstree-no-icon").end().end().end().end().find("li.jstree-open").children("ins.jstree-icon").removeClass(b.closed).addClass("ui-icon "+b.opened).end().children("a").addClass(b.item).children("ins.jstree-icon").addClass("ui-icon").filter(function(){return this.className.toString().replace(b.item_clsd,"").replace(b.item_open,"").replace(b.item_leaf,"").indexOf("ui-icon-")===-1}).removeClass(b.item_leaf+" "+b.item_clsd).addClass(b.item_open||"jstree-no-icon").end().end().end().end().find("li.jstree-leaf").children("ins.jstree-icon").removeClass(b.closed+" ui-icon "+b.opened).end().children("a").addClass(b.item).children("ins.jstree-icon").addClass("ui-icon").filter(function(){return this.className.toString().replace(b.item_clsd,"").replace(b.item_open,"").replace(b.item_leaf,"").indexOf("ui-icon-")===-1}).removeClass(b.item_clsd+" "+b.item_open).addClass(b.item_leaf||"jstree-no-icon")}},defaults:{opened:"ui-icon-triangle-1-se",closed:"ui-icon-triangle-1-e",item:"ui-state-default",item_h:"ui-state-hover",item_a:"ui-state-active",item_open:"ui-icon-folder-open",item_clsd:"ui-icon-folder-collapsed",item_leaf:"ui-icon-document"}}),a(function(){var b=".jstree-themeroller .ui-icon { overflow:visible; } .jstree-themeroller a { padding:0 2px; } .jstree-themeroller .jstree-no-icon { display:none; }";a.vakata.css.add_sheet({str:b,title:"jstree"})})}(jQuery),function(a){a.jstree.plugin("unique",{__init:function(){this.get_container().bind("before.jstree",a.proxy(function(b,c){var d=[],e=!0,f,g;c.func=="move_node"&&c.args[4]===!0&&c.args[0].o&&c.args[0].o.length&&(c.args[0].o.children("a").each(function(){d.push(a(this).text().replace(/^\s+/g,""))}),e=this._check_unique(d,c.args[0].np.find("> ul > li").not(c.args[0].o),"move_node"));if(c.func=="create_node")if(c.args[4]||this._is_loaded(c.args[0])){f=this._get_node(c.args[0]);if(c.args[1]&&(c.args[1]==="before"||c.args[1]==="after")){f=this._get_parent(c.args[0]);if(!f||f===-1)f=this.get_container()}typeof c.args[2]=="string"?d.push(c.args[2]):!c.args[2]||!c.args[2].data?d.push(this._get_string("new_node")):d.push(c.args[2].data),e=this._check_unique(d,f.find("> ul > li"),"create_node")}if(c.func=="rename_node"){d.push(c.args[1]),g=this._get_node(c.args[0]),f=this._get_parent(g);if(!f||f===-1)f=this.get_container();e=this._check_unique(d,f.find("> ul > li").not(g),"rename_node")}if(!e)return b.stopPropagation(),!1},this))},defaults:{error_callback:a.noop},_fn:{_check_unique:function(b,c,d){var e=[];return c.children("a").each(function(){e.push(a(this).text().replace(/^\s+/g,""))}),!e.length||!b.length?!0:(e=e.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(","),e.length+b.length!=e.concat(b).sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",").length?(this._get_settings().unique.error_callback.call(null,b,c,d),!1):!0)},check_move:function(){if(!this.__call_old())return!1;var b=this._get_move(),c=[];return b.o&&b.o.length?(b.o.children("a").each(function(){c.push(a(this).text().replace(/^\s+/g,""))}),this._check_unique(c,b.np.find("> ul > li").not(b.o),"check_move")):!0}}})}(jQuery),function(d){d.jstree.plugin("wholerow",{__init:function(){if(!this.data.ui)throw"jsTree wholerow: jsTree UI plugin not included.";this.data.wholerow.html=!1,this.data.wholerow.to=!1,this.get_container().bind("init.jstree",d.proxy(function(a,b){this._get_settings().core.animation=0},this)).bind("open_node.jstree create_node.jstree clean_node.jstree loaded.jstree",d.proxy(function(a,b){this._prepare_wholerow_span(b&&b.rslt&&b.rslt.obj?b.rslt.obj:-1)},this)).bind("search.jstree clear_search.jstree reopen.jstree after_open.jstree after_close.jstree create_node.jstree delete_node.jstree clean_node.jstree",d.proxy(function(a,b){this.data.to&&clearTimeout(this.data.to),this.data.to=setTimeout(function(a,b){return function(){a._prepare_wholerow_ul(b)}}(this,b&&b.rslt&&b.rslt.obj?b.rslt.obj:-1),0)},this)).bind("deselect_all.jstree",d.proxy(function(a,b){this.get_container().find(" > .jstree-wholerow .jstree-clicked").removeClass("jstree-clicked "+(this.data.themeroller?this._get_settings().themeroller.item_a:""))},this)).bind("select_node.jstree deselect_node.jstree ",d.proxy(function(a,b){b.rslt.obj.each(function(){var a=b.inst.get_container().find(" > .jstree-wholerow li:visible:eq("+parseInt((d(this).offset().top-b.inst.get_container().offset().top+b.inst.get_container()[0].scrollTop)/b.inst.data.core.li_height,10)+")");a.children("a").attr("class",b.rslt.obj.children("a").attr("class"))})},this)).bind("hover_node.jstree dehover_node.jstree",d.proxy(function(a,b){this.get_container().find(" > .jstree-wholerow .jstree-hovered").removeClass("jstree-hovered "+(this.data.themeroller?this._get_settings().themeroller.item_h:""));if(a.type==="hover_node"){var c=this.get_container().find(" > .jstree-wholerow li:visible:eq("+parseInt((b.rslt.obj.offset().top-this.get_container().offset().top+this.get_container()[0].scrollTop)/this.data.core.li_height,10)+")");c.children("a").attr("class",b.rslt.obj.children(".jstree-hovered").attr("class"))}},this)).delegate(".jstree-wholerow-span, ins.jstree-icon, li","click.jstree",function(a){var b=d(a.currentTarget);if(a.target.tagName==="A"||a.target.tagName==="INS"&&b.closest("li").is(".jstree-open, .jstree-closed"))return;b.closest("li").children("a:visible:eq(0)").click(),a.stopImmediatePropagation()}).delegate("li","mouseover.jstree",d.proxy(function(a){return a.stopImmediatePropagation(),d(a.currentTarget).children(".jstree-hovered, .jstree-clicked").length?!1:(this.hover_node(a.currentTarget),!1)},this)).delegate("li","mouseleave.jstree",d.proxy(function(a){if(d(a.currentTarget).children("a").hasClass("jstree-hovered").length)return;this.dehover_node(a.currentTarget)},this)),(b||a)&&d.vakata.css.add_sheet({str:".jstree-"+this.get_index()+" { position:relative; } ",title:"jstree"})},defaults:{},__destroy:function(){this.get_container().children(".jstree-wholerow").remove(),this.get_container().find(".jstree-wholerow-span").remove()},_fn:{_prepare_wholerow_span:function(a){a=!a||a==-1?this.get_container().find("> ul > li"):this._get_node(a);if(a===!1)return;a.each(function(){d(this).find("li").andSelf().each(function(){var a=d(this);if(a.children(".jstree-wholerow-span").length)return!0;a.prepend("<span class='jstree-wholerow-span' style='width:"+a.parentsUntil(".jstree","li").length*18+"px;'>&#160;</span>")})})},_prepare_wholerow_ul:function(){var a=this.get_container().children("ul").eq(0),c=a.html();a.addClass("jstree-wholerow-real"),this.data.wholerow.last_html!==c&&(this.data.wholerow.last_html=c,this.get_container().children(".jstree-wholerow").remove(),this.get_container().append(a.clone().removeClass("jstree-wholerow-real").wrapAll("<div class='jstree-wholerow' />").parent().width(a.parent()[0].scrollWidth).css("top",(a.height()+(b?5:0))*-1).find("li[id]").each(function(){this.removeAttribute("id")}).end()))}}}),d(function(){var e=".jstree .jstree-wholerow-real { position:relative; z-index:1; } .jstree .jstree-wholerow-real li { cursor:pointer; } .jstree .jstree-wholerow-real a { border-left-color:transparent !important; border-right-color:transparent !important; } .jstree .jstree-wholerow { position:relative; z-index:0; height:0; } .jstree .jstree-wholerow ul, .jstree .jstree-wholerow li { width:100%; } .jstree .jstree-wholerow, .jstree .jstree-wholerow ul, .jstree .jstree-wholerow li, .jstree .jstree-wholerow a { margin:0 !important; padding:0 !important; } .jstree .jstree-wholerow, .jstree .jstree-wholerow ul, .jstree .jstree-wholerow li { background:transparent !important; }.jstree .jstree-wholerow ins, .jstree .jstree-wholerow span, .jstree .jstree-wholerow input { display:none !important; }.jstree .jstree-wholerow a, .jstree .jstree-wholerow a:hover { text-indent:-9999px; !important; width:100%; padding:0 !important; border-right-width:0px !important; border-left-width:0px !important; } .jstree .jstree-wholerow-span { position:absolute; left:0; margin:0px; padding:0; height:18px; border-width:0; padding:0; z-index:0; }";c&&(e+=".jstree .jstree-wholerow a { display:block; height:18px; margin:0; padding:0; border:0; } .jstree .jstree-wholerow-real a { border-color:transparent !important; } ");if(b||a)e+=".jstree .jstree-wholerow, .jstree .jstree-wholerow li, .jstree .jstree-wholerow ul, .jstree .jstree-wholerow a { margin:0; padding:0; line-height:18px; } .jstree .jstree-wholerow a { display:block; height:18px; line-height:18px; overflow:hidden; } ";d.vakata.css.add_sheet({str:e,title:"jstree"})})}(jQuery),function(a){var b=["getChildren","getChildrenCount","getAttr","getName","getProps"],c=function(b,c){var d=!0;return b=b||{},c=[].concat(c),a.each(c,function(c,e){if(!a.isFunction(b[e]))return d=!1,!1}),d};a.jstree.plugin("model",{__init:function(){if(!this.data.json_data)throw"jsTree model: jsTree json_data plugin not included.";this._get_settings().json_data.data=function(d,e){var f=d==-1?this._get_settings().model.object:d.data("jstree_model");if(!c(f,b))return e.call(null,!1);this._get_settings().model.async?f.getChildren(a.proxy(function(a){this.model_done(a,e)},this)):this.model_done(f.getChildren(),e)}},defaults:{object:!1,id_prefix:!1,async:!1},_fn:{model_done:function(b,c){var d=[],e=this._get_settings(),f=this;a.isArray(b)||(b=[b]),a.each(b,function(b,c){var g=c.getProps()||{};g.attr=c.getAttr()||{},c.getChildrenCount()&&(g.state="closed"),g.data=c.getName(),a.isArray(g.data)||(g.data=[g.data]),f.data.types&&a.isFunction(c.getType)&&(g.attr[e.types.type_attr]=c.getType()),g.attr.id&&e.model.id_prefix&&(g.attr.id=e.model.id_prefix+g.attr.id),g.metadata||(g.metadata={}),g.metadata.jstree_model=c,d.push(g)}),c.call(null,d)}}})}(jQuery)}();;

/*
 * jquery.layout 1.2.0
 *
 * Copyright (c) 2008 
 *   Fabrizio Balliano (http://www.fabrizioballiano.net)
 *   Kevin Dalman (http://allpro.net)
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * $Date: 2008-12-27 02:17:22 +0100 (sab, 27 dic 2008) $
 * $Rev: 203 $
 * 
 * NOTE: For best code readability, view this with a fixed-space font and tabs equal to 4-chars
 */(function($){$.fn.layout=function(opts){function keyDown(a){if(!a)return!0;var b=a.keyCode;if(b<33)return!0;var d={38:"north",40:"south",37:"west",39:"east"},e=b>=37&&b<=40,f=a.altKey,g=a.shiftKey,h=a.ctrlKey,i=!1,j,k,l,m,n;return!h&&!g?!0:(e&&options[d[b]].enableCursorHotkey?i=d[b]:$.each(c.borderPanes.split(","),function(a,c){k=options[c],l=k.customHotkey,m=k.customHotkeyModifier;if(g&&m=="SHIFT"||h&&m=="CTRL"||h&&g)if(l&&b==(isNaN(l)||l<=9?l.toUpperCase().charCodeAt(0):l))return i=c,!1}),i?(k=options[i],j=state[i],!k.enableCursorHotkey||j.isHidden||!$Ps[i]?!0:(n=a.target||a.srcElement,n&&g&&e&&(n.tagName=="TEXTAREA"||n.tagName=="INPUT"&&(b==37||b==39))?!0:(toggle(i),a.stopPropagation(),a.returnValue=!1,!1))):!0)}function allowOverflow(a){this&&this.tagName&&(a=this);var b;typeof a=="string"?b=$Ps[a]:$(a).attr("pane")?b=$(a):b=$(a).parents("div[pane]:first");if(!b.length)return;var d=b.attr("pane"),e=state[d];e.cssSaved&&resetOverflow(d);if(e.isSliding||e.isResizing||e.isClosed){e.cssSaved=!1;return}var f={zIndex:c.zIndex.pane_normal+1},g={},h=b.css("overflow"),i=b.css("overflowX"),j=b.css("overflowY");h!="visible"&&(g.overflow=h,f.overflow="visible"),i&&i!="visible"&&i!="auto"&&(g.overflowX=i,f.overflowX="visible"),j&&j!="visible"&&j!="auto"&&(g.overflowY=i,f.overflowY="visible"),e.cssSaved=g,b.css(f),$.each(c.allPanes.split(","),function(a,b){b!=d&&resetOverflow(b)})}function resetOverflow(a){this&&this.tagName&&(a=this);var b;typeof a=="string"?b=$Ps[a]:$(a).hasClass("ui-layout-pane")?b=$(a):b=$(a).parents("div[pane]:first");if(!b.length)return;var d=b.attr("pane"),e=state[d],f=e.cssSaved||{};!e.isSliding&&!e.isResizing&&b.css("zIndex",c.zIndex.pane_normal),b.css(f),e.cssSaved=!1}function getBtn(a,b,d){var e=$(a),f="Error Adding Button \n\nInvalid ";if(!e.length)alert(f+"selector: "+a);else if(c.borderPanes.indexOf(b)==-1)alert(f+"pane: "+b);else{var g=options[b].buttonClass+"-"+d;return e.addClass(g+" "+g+"-"+b),e}return!1}function addToggleBtn(a,b){var c=getBtn(a,b,"toggle");c&&c.attr("title",state[b].isClosed?"Open":"Close").click(function(a){toggle(b),a.stopPropagation()})}function addOpenBtn(a,b){var c=getBtn(a,b,"open");c&&c.attr("title","Open").click(function(a){open(b),a.stopPropagation()})}function addCloseBtn(a,b){var c=getBtn(a,b,"close");c&&c.attr("title","Close").click(function(a){close(b),a.stopPropagation()})}function addPinBtn(a,b){var d=getBtn(a,b,"pin");if(d){var e=state[b];d.click(function(a){setPinState($(this),b,e.isSliding||e.isClosed),e.isSliding||e.isClosed?open(b):close(b),a.stopPropagation()}),setPinState(d,b,!e.isClosed&&!e.isSliding),c[b].pins.push(a)}}function syncPinBtns(a,b){$.each(c[a].pins,function(c,d){setPinState($(d),a,b)})}function setPinState(a,b,c){var d=a.attr("pin");if(d&&c==(d=="down"))return;var e=options[b].buttonClass,f=e+"-pin",g=f+"-"+b,h=f+"-up",i=g+"-up",j=f+"-down",k=g+"-down";a.attr("pin",c?"down":"up").attr("title",c?"Un-Pin":"Pin").removeClass(c?h:j).removeClass(c?i:k).addClass(c?j:h).addClass(c?k:i)}var prefix="ui-layout-",defaults={paneClass:prefix+"pane",resizerClass:prefix+"resizer",togglerClass:prefix+"toggler",togglerInnerClass:prefix+"",buttonClass:prefix+"button",contentSelector:"."+prefix+"content",contentIgnoreSelector:"."+prefix+"ignore"},options={name:"",scrollToBookmarkOnLoad:!0,defaults:{applyDefaultStyles:!1,closable:!0,resizable:!0,slidable:!0,contentSelector:defaults.contentSelector,contentIgnoreSelector:defaults.contentIgnoreSelector,paneClass:defaults.paneClass,resizerClass:defaults.resizerClass,togglerClass:defaults.togglerClass,buttonClass:defaults.buttonClass,resizerDragOpacity:1,maskIframesOnResize:!0,minSize:0,maxSize:0,spacing_open:4,spacing_closed:6,togglerLength_open:50,togglerLength_closed:50,togglerAlign_open:"center",togglerAlign_closed:"center",togglerTip_open:"Close",togglerTip_closed:"Open",resizerTip:"Resize",sliderTip:"Slide Open",sliderCursor:"pointer",slideTrigger_open:"click",slideTrigger_close:"mouseout",hideTogglerOnSlide:!1,togglerContent_open:"",togglerContent_closed:"",showOverflowOnHover:!1,enableCursorHotkey:!0,customHotkeyModifier:"SHIFT",fxName:"slide",fxSpeed:null,fxSettings:{},initClosed:!1,initHidden:!1},north:{paneSelector:"."+prefix+"north",size:"auto",resizerCursor:"n-resize"},south:{paneSelector:"."+prefix+"south",size:"auto",resizerCursor:"s-resize"},east:{paneSelector:"."+prefix+"east",size:200,resizerCursor:"e-resize"},west:{paneSelector:"."+prefix+"west",size:200,resizerCursor:"e-resize"},center:{paneSelector:"."+prefix+"center"}},effects={slide:{all:{duration:"fast"},north:{direction:"up"},south:{direction:"down"},east:{direction:"right"},west:{direction:"left"}},drop:{all:{duration:"slow"},north:{direction:"up"},south:{direction:"down"},east:{direction:"right"},west:{direction:"left"}},scale:{all:{duration:"fast"}}},config={allPanes:"north,south,east,west,center",borderPanes:"north,south,east,west",zIndex:{resizer_normal:1,pane_normal:2,mask:4,sliding:100,resizing:1e4,animation:1e4},resizers:{cssReq:{position:"absolute",padding:0,margin:0,fontSize:"1px",textAlign:"left",overflow:"hidden",zIndex:1},cssDef:{background:"#DDD",border:"none"}},togglers:{cssReq:{position:"absolute",display:"block",padding:0,margin:0,overflow:"hidden",textAlign:"center",fontSize:"1px",cursor:"pointer",zIndex:1},cssDef:{background:"#AAA"}},content:{cssReq:{overflow:"auto"},cssDef:{}},defaults:{cssReq:{position:"absolute",margin:0,zIndex:2},cssDef:{padding:"10px",background:"#FFF",border:"1px solid #BBB",overflow:"auto"}},north:{edge:"top",sizeType:"height",dir:"horz",cssReq:{top:0,bottom:"auto",left:0,right:0,width:"auto"}},south:{edge:"bottom",sizeType:"height",dir:"horz",cssReq:{top:"auto",bottom:0,left:0,right:0,width:"auto"}},east:{edge:"right",sizeType:"width",dir:"vert",cssReq:{left:"auto",right:0,top:"auto",bottom:"auto",height:"auto"}},west:{edge:"left",sizeType:"width",dir:"vert",cssReq:{left:0,right:"auto",top:"auto",bottom:"auto",height:"auto"}},center:{dir:"center",cssReq:{left:"auto",right:"auto",top:"auto",bottom:"auto",height:"auto",width:"auto"}}},state={id:Math.floor(Math.random()*1e4),container:{},north:{},south:{},east:{},west:{},center:{}},altEdge={top:"bottom",bottom:"top",left:"right",right:"left"},altSide={north:"south",south:"north",east:"west",west:"east"},isStr=function(a){if(typeof a=="string")return!0;if(typeof a=="object")try{var b=a.constructor.toString().match(/string/i);return b!==null}catch(c){}return!1},str=function(a){return typeof a=="string"||isStr(a)?$.trim(a):a},min=function(a,b){return Math.min(a,b)},max=function(a,b){return Math.max(a,b)},transformData=function(b){var c={defaults:{fxSettings:{}},north:{fxSettings:{}},south:{fxSettings:{}},east:{fxSettings:{}},west:{fxSettings:{}},center:{fxSettings:{}}};return b=b||{},b.effects||b.defaults||b.north||b.south||b.west||b.east||b.center?c=$.extend(c,b):$.each(b,function(b,d){a=b.split("__"),c[a[1]?a[0]:"defaults"][a[1]?a[1]:a[0]]=d}),c},setFlowCallback=function(a,b,d){function h(a,d){f=c[a],f.doCallback?(cpPane=f.callback.split(",")[1],cpPane!=a&&cpPane!=b&&h(cpPane,!0)):(f.doCallback=!0,f.callback=e)}var e=a+","+b+","+(d?1:0),f,g;$.each(c.borderPanes.split(","),function(a,b){if(c[b].isMoving)return h(b),!1})},execFlowCallback=function(a){var b=c[a];c.isLayoutBusy=!1,delete b.isMoving;if(!b.doCallback||!b.callback)return;b.doCallback=!1;var d=b.callback.split(","),e=d[2]>0?!0:!1;d[0]=="open"?open(d[1],e):d[0]=="close"&&close(d[1],e),b.doCallback||(b.callback=null)},execUserCallback=function(pane,v_fn){if(!v_fn)return;var fn;try{if(typeof v_fn=="function")fn=v_fn;else{if(typeof v_fn!="string")return;if(v_fn.indexOf(",")>0){var args=v_fn.split(","),fn=eval(args[0]);if(typeof fn=="function"&&args.length>1)return fn(args[1])}else fn=eval(v_fn)}if(typeof fn=="function")return fn(pane,$Ps[pane],$.extend({},state[pane]),$.extend({},options[pane]),options.name)}catch(ex){}},cssNum=function(a,b){var c=0,d=!1,e="";return $.browser.msie||$.curCSS(a[0],"display",true)=="none"&&(d=!0,e=$.curCSS(a[0],"visibility",!0),a.css({display:"block",visibility:"hidden"})),c=parseInt($.curCSS(a[0],b,!0),10)||0,d&&(a.css({display:"none"}),e&&e!="hidden"&&a.css({visibility:e})),c},cssW=function(a,b){var c;return isStr(a)?(a=str(a),c=$Ps[a]):c=$(a),b<=0?0:(b>0||(b=isStr(a)?getPaneSize(a):c.outerWidth()),$.boxModel?b-cssNum(c,"paddingLeft")-cssNum(c,"paddingRight")-($.curCSS(c[0],"borderLeftStyle",true)=="none"?0:cssNum(c,"borderLeftWidth"))-($.curCSS(c[0],"borderRightStyle",true)=="none"?0:cssNum(c,"borderRightWidth")):b)},cssH=function(a,b){var c;return isStr(a)?(a=str(a),c=$Ps[a]):c=$(a),b<=0?0:(b>0||(b=isStr(a)?getPaneSize(a):c.outerHeight()),$.boxModel?b-cssNum(c,"paddingTop")-cssNum(c,"paddingBottom")-($.curCSS(c[0],"borderTopStyle",true)=="none"?0:cssNum(c,"borderTopWidth"))-($.curCSS(c[0],"borderBottomStyle",true)=="none"?0:cssNum(c,"borderBottomWidth")):b)},cssSize=function(a,b){return c[a].dir=="horz"?cssH(a,b):cssW(a,b)},getPaneSize=function(a,b){var d=$Ps[a],e=options[a],f=state[a],g=b?e.spacing_open:0,h=b?e.spacing_closed:0;return!d||f.isHidden?0:f.isClosed||f.isSliding&&b?h:c[a].dir=="horz"?d.outerHeight()+g:d.outerWidth()+g},setPaneMinMaxSizes=function(a){var b=cDims,d=c[a].edge,e=c[a].dir,f=options[a],g=state[a],h=$Ps[a],i=$Ps[altSide[a]],j=f.spacing_open,k=options[altSide[a]].spacing_open,l=i?e=="horz"?i.outerHeight():i.outerWidth():0,m=e=="horz"?b.innerHeight:b.innerWidth,n=m-j-l-k,o=g.minSize||0,p=Math.min(g.maxSize||9999,n),q,r;switch(a){case"north":q=b.offsetTop+o,r=b.offsetTop+p;break;case"west":q=b.offsetLeft+o,r=b.offsetLeft+p;break;case"south":q=b.offsetTop+b.innerHeight-p,r=b.offsetTop+b.innerHeight-o;break;case"east":q=b.offsetLeft+b.innerWidth-p,r=b.offsetLeft+b.innerWidth-o}$.extend(g,{minSize:o,maxSize:p,minPosition:q,maxPosition:r})},getPaneDims=function(){var d={top:getPaneSize("north",!0),bottom:getPaneSize("south",!0),left:getPaneSize("west",!0),right:getPaneSize("east",!0),width:0,height:0};with(d)width=cDims.innerWidth-left-right,height=cDims.innerHeight-bottom-top,top+=cDims.top,bottom+=cDims.bottom,left+=cDims.left,right+=cDims.right;return d},getElemDims=function(a){var b={},c,d,e;return $.each("Left,Right,Top,Bottom".split(","),function(){c=str(this),d=b["border"+c]=cssNum(a,"border"+c+"Width"),e=b["padding"+c]=cssNum(a,"padding"+c),b["offset"+c]=d+e,a==$Container&&(b[c.toLowerCase()]=$.boxModel?e:0)}),b.innerWidth=b.outerWidth=a.outerWidth(),b.innerHeight=b.outerHeight=a.outerHeight(),$.boxModel&&(b.innerWidth-=b.offsetLeft+b.offsetRight,b.innerHeight-=b.offsetTop+b.offsetBottom),b},setTimer=function(a,b,c,d){var e=window.layout=window.layout||{},f=e.timers=e.timers||{},g="layout_"+state.id+"_"+a+"_"+b;if(f[g])return;f[g]=setTimeout(c,d)},clearTimer=function(a,b){var c=window.layout=window.layout||{},d=c.timers=c.timers||{},e="layout_"+state.id+"_"+a+"_"+b;return d[e]?(clearTimeout(d[e]),delete d[e],!0):!1},create=function(){initOptions(),initContainer(),initPanes(),initHandles(),initResizable(),sizeContent("all");if(options.scrollToBookmarkOnLoad)with(self.location)hash&&replace(hash);initHotkeys(),$(window).resize(function(){var a="timerLayout_"+state.id;window[a]&&clearTimeout(window[a]),window[a]=null,window[a]=setTimeout(resizeAll,100)})},initContainer=function(){try{if($Container[0].tagName=="BODY")$("html").css({height:"100%",overflow:"hidden"}),$("body").css({position:"relative",height:"100%",overflow:"hidden",margin:0,padding:0,border:"none"});else{var a={overflow:"hidden"},b=$Container.css("position"),c=$Container.css("height");if(!$Container.hasClass("ui-layout-pane")){if(!b||"fixed,absolute,relative".indexOf(b)<0)a.position="relative";if(!c||c=="auto")a.height="100%"}$Container.css(a)}}catch(d){}cDims=state.container=getElemDims($Container)},initHotkeys=function(){$.each(c.borderPanes.split(","),function(a,b){var c=options[b];if(c.enableCursorHotkey||c.customHotkey)return $(document).keydown(keyDown),!1})},initOptions=function(){opts=transformData(opts),opts.effects&&($.extend(effects,opts.effects),delete opts.effects),$.each("name,scrollToBookmarkOnLoad".split(","),function(a,b){opts[b]!==undefined?options[b]=opts[b]:opts.defaults[b]!==undefined&&(options[b]=opts.defaults[b],delete opts.defaults[b])}),$.each("paneSelector,resizerCursor,customHotkey".split(","),function(a,b){delete opts.defaults[b]}),$.extend(options.defaults,opts.defaults),c.center=$.extend(!0,{},c.defaults,c.center),$.extend(options.center,opts.center);var a=$.extend(!0,{},options.defaults,opts.defaults,options.center);$.each("paneClass,contentSelector,contentIgnoreSelector,applyDefaultStyles,showOverflowOnHover".split(","),function(b,c){options.center[c]=a[c]});var b=options.defaults;$.each(c.borderPanes.split(","),function(a,d){c[d]=$.extend(!0,{},c.defaults,c[d]),o=options[d]=$.extend(!0,{},options.defaults,options[d],opts.defaults,opts[d]),o.paneClass||(o.paneClass=defaults.paneClass),o.resizerClass||(o.resizerClass=defaults.resizerClass),o.togglerClass||(o.togglerClass=defaults.togglerClass),$.each(["_open","_close",""],function(a,c){var e="fxName"+c,f="fxSpeed"+c,g="fxSettings"+c;o[e]=opts[d][e]||opts[d].fxName||opts.defaults[e]||opts.defaults.fxName||o[e]||o.fxName||b[e]||b.fxName||"none";var h=o[e];if(h=="none"||!$.effects||!$.effects[h]||!effects[h]&&!o[g]&&!o.fxSettings)h=o[e]="none";var i=effects[h]||{},j=i.all||{},k=i[d]||{};o[g]=$.extend({},j,k,b.fxSettings||{},b[g]||{},o.fxSettings,o[g],opts.defaults.fxSettings,opts.defaults[g]||{},opts[d].fxSettings,opts[d][g]||{}),o[f]=opts[d][f]||opts[d].fxSpeed||opts.defaults[f]||opts.defaults.fxSpeed||o[f]||o[g].duration||o.fxSpeed||o.fxSettings.duration||b.fxSpeed||b.fxSettings.duration||k.duration||j.duration||"normal"})})},initPanes=function(){$.each(c.allPanes.split(","),function(){var a=str(this),b=options[a],d=state[a],e=d.fx,f=c[a].dir,g=b.size=="auto"||isNaN(b.size)?0:b.size,h=b.minSize||1,i=b.maxSize||9999,j=b.spacing_open||0,k=b.paneSelector,l=$.browser.msie&&$.browser.version<7,m={},n,o;$Cs[a]=!1,k.substr(0,1)==="#"?n=$Ps[a]=$Container.find(k+":first"):(n=$Ps[a]=$Container.children(k+":first"),n.length||(n=$Ps[a]=$Container.children("form:first").children(k+":first")));if(!n.length)return $Ps[a]=!1,!0;n.attr("pane",a).addClass(b.paneClass+" "+b.paneClass+"-"+a),a!="center"&&(d.isClosed=!1,d.isSliding=!1,d.isResizing=!1,d.isHidden=!1,d.noRoom=!1,c[a].pins=[]),m=$.extend({visibility:"visible",display:"block"},c.defaults.cssReq,c[a].cssReq),b.applyDefaultStyles&&$.extend(m,c.defaults.cssDef,c[a].cssDef),n.css(m),m={};switch(a){case"north":m.top=cDims.top,m.left=cDims.left,m.right=cDims.right;break;case"south":m.bottom=cDims.bottom,m.left=cDims.left,m.right=cDims.right;break;case"west":m.left=cDims.left;break;case"east":m.right=cDims.right;break;case"center":}if(f=="horz"){if(g===0||g=="auto")n.css({height:"auto"}),g=n.outerHeight();g=max(g,h),g=min(g,i),g=min(g,cDims.innerHeight-j),m.height=max(1,cssH(a,g)),d.size=g,d.maxSize=i,d.minSize=max(h,g-m.height+1),n.css(m)}else if(f=="vert"){if(g===0||g=="auto")n.css({width:"auto","float":"left"}),g=n.outerWidth(),n.css({"float":"none"});g=max(g,h),g=min(g,i),g=min(g,cDims.innerWidth-j),m.width=max(1,cssW(a,g)),d.size=g,d.maxSize=i,d.minSize=max(h,g-m.width+1),n.css(m),sizeMidPanes(a,null,!0)}else a=="center"&&(n.css(m),sizeMidPanes("center",null,!0));b.initClosed&&b.closable?(n.hide().addClass("closed"),d.isClosed=!0):b.initHidden||b.initClosed?(hide(a,!0),d.isHidden=!0):n.addClass("open"),b.showOverflowOnHover&&n.hover(allowOverflow,resetOverflow);if(b.contentSelector){o=$Cs[a]=n.children(b.contentSelector+":first");if(!o.length)return $Cs[a]=!1,!0;o.css(c.content.cssReq),b.applyDefaultStyles&&o.css(c.content.cssDef),n.css({overflow:"hidden"})}})},initHandles=function(){$.each(c.borderPanes.split(","),function(){var a=str(this),b=options[a],d=state[a],e=b.resizerClass,f=b.togglerClass,g=$Ps[a];$Rs[a]=!1,$Ts[a]=!1;if(!g||!b.closable&&!b.resizable)return;var h=c[a].edge,i=g.is(":visible"),j=i?b.spacing_open:b.spacing_closed,k="-"+a,l=i?"-open":"-closed",m,n;m=$Rs[a]=$("<span></span>"),(!i||!b.resizable)&&!i&&b.slidable&&m.attr("title",b.sliderTip).css("cursor",b.sliderCursor),m.attr("id",b.paneSelector.substr(0,1)=="#"?b.paneSelector.substr(1)+"-resizer":"").attr("resizer",a).css(c.resizers.cssReq).css(h,cDims[h]+getPaneSize(a)).addClass(e+" "+e+k+" "+e+l+" "+e+k+l).appendTo($Container),b.applyDefaultStyles&&m.css(c.resizers.cssDef),b.closable&&(n=$Ts[a]=$("<div></div>"),n.attr("id",b.paneSelector.substr(0,1)=="#"?b.paneSelector.substr(1)+"-toggler":"").css(c.togglers.cssReq).attr("title",i?b.togglerTip_open:b.togglerTip_closed).click(function(b){toggle(a),b.stopPropagation()}).mouseover(function(a){a.stopPropagation()}).addClass(f+" "+f+k+" "+f+l+" "+f+k+l).appendTo(m),b.togglerContent_open&&$("<span>"+b.togglerContent_open+"</span>").addClass("content content-open").css("display",d.isClosed?"none":"block").appendTo(n),b.togglerContent_closed&&$("<span>"+b.togglerContent_closed+"</span>").addClass("content content-closed").css("display",d.isClosed?"block":"none").appendTo(n),b.applyDefaultStyles&&n.css(c.togglers.cssDef),i||bindStartSlidingEvent(a,!0))}),sizeHandles("all",!0)},initResizable=function(){var a=typeof $.fn.draggable=="function",b,d,e;$.each(c.borderPanes.split(","),function(){var b=str(this),d=options[b],f=state[b];if(!a||!$Ps[b]||!d.resizable)return d.resizable=!1,!0;var g=d.resizerClass,h=g+"-drag",i=g+"-"+b+"-drag",j=g+"-dragging",k=g+"-"+b+"-dragging",l=!1,m=$Ps[b],n=$Rs[b];f.isClosed||n.attr("title",d.resizerTip).css("cursor",d.resizerCursor),n.draggable({containment:$Container[0],axis:c[b].dir=="horz"?"y":"x",delay:200,distance:1,helper:"clone",opacity:d.resizerDragOpacity,zIndex:c.zIndex.resizing,start:function(a,g){if(!1===execUserCallback(b,d.onresize_start))return!1;f.isResizing=!0,clearTimer(b,"closeSlider"),n.addClass(h+" "+i),l=!1;var j=b=="east"||b=="south"?d.spacing_open:0;setPaneMinMaxSizes(b),f.minPosition-=j,f.maxPosition-=j,e=c[b].dir=="horz"?"top":"left",$(d.maskIframesOnResize===!0?"iframe":d.maskIframesOnResize).each(function(){$('<div class="ui-layout-mask"/>').css({background:"#fff",opacity:"0.001",zIndex:9,position:"absolute",width:this.offsetWidth+"px",height:this.offsetHeight+"px"}).css($(this).offset()).appendTo(this.parentNode)})},drag:function(a,d){l||($(".ui-draggable-dragging").addClass(j+" "+k).children().css("visibility","hidden"),l=!0,f.isSliding&&$Ps[b].css("zIndex",c.zIndex.sliding)),d.position[e]<f.minPosition?d.position[e]=f.minPosition:d.position[e]>f.maxPosition&&(d.position[e]=f.maxPosition)},stop:function(a,d){var e=d.position,g,j;n.removeClass(h+" "+i);switch(b){case"north":g=e.top;break;case"west":g=e.left;break;case"south":g=cDims.outerHeight-e.top-n.outerHeight();break;case"east":g=cDims.outerWidth-e.left-n.outerWidth()}j=g-cDims[c[b].edge],sizePane(b,j),$("div.ui-layout-mask").remove(),f.isResizing=!1}})})},hide=function(a,b){var d=options[a],e=state[a],f=$Ps[a],g=$Rs[a];if(!f||e.isHidden)return;if(!1===execUserCallback(a,d.onhide_start))return;e.isSliding=!1,g&&g.hide(),b||e.isClosed?(e.isClosed=!0,e.isHidden=!0,f.hide(),sizeMidPanes(c[a].dir=="horz"?"all":"center"),execUserCallback(a,d.onhide_end||d.onhide)):(e.isHiding=!0,close(a,!1))},show=function(a,b){var c=options[a],d=state[a],e=$Ps[a],f=$Rs[a];if(!e||!d.isHidden)return;if(!1===execUserCallback(a,c.onshow_start))return;d.isSliding=!1,d.isShowing=!0,f&&c.spacing_open>0&&f.show(),b===!1?close(a,!0):open(a)},toggle=function(a){var b=state[a];b.isHidden?show(a):b.isClosed?open(a):close(a)},close=function(a,b,d){function t(){bindStartSlidingEvent(a,!0),r||execUserCallback(a,h.onclose_end||h.onclose),r&&execUserCallback(a,h.onshow_end||h.onshow),s&&execUserCallback(a,h.onhide_end||h.onhide),execFlowCallback(a)}var e=$Ps[a],f=$Rs[a],g=$Ts[a],h=options[a],i=state[a],j=!d&&!i.isClosed&&h.fxName_close!="none",k=c[a].edge,l=h.resizerClass,m=h.togglerClass,n="-"+a,o="-open",p="-sliding",q="-closed",r=i.isShowing,s=i.isHiding;delete i.isShowing,delete i.isHiding;if(!e||!h.resizable&&!h.closable)return;if(!b&&i.isClosed&&!r)return;if(c.isLayoutBusy){setFlowCallback("close",a,b);return}if(!r&&!1===execUserCallback(a,h.onclose_start))return;c[a].isMoving=!0,c.isLayoutBusy=!0,i.isClosed=!0,s?i.isHidden=!0:r&&(i.isHidden=!1),syncPinBtns(a,!1),i.isSliding||sizeMidPanes(c[a].dir=="horz"?"all":"center"),f&&(f.css(k,cDims[k]).removeClass(l+o+" "+l+n+o).removeClass(l+p+" "+l+n+p).addClass(l+q+" "+l+n+q),h.resizable&&f.draggable("disable").css("cursor","default").attr("title",""),g&&g.removeClass(m+o+" "+m+n+o).addClass(m+q+" "+m+n+q).attr("title",h.togglerTip_closed),sizeHandles()),j?(lockPaneForFX(a,!0),e.hide(h.fxName_close,h.fxSettings_close,h.fxSpeed_close,function(){lockPaneForFX(a,!1);if(!i.isClosed)return;t()})):(e.hide(),t())},open=function(a,b,d){function s(){i.isSliding||sizeMidPanes(c[a].dir=="vert"?"center":"all"),f&&(f.css(k,cDims[k]+getPaneSize(a)).removeClass(l+p+" "+l+n+p).addClass(l+o+" "+l+n+o).addClass(i.isSliding?l+q+" "+l+n+q:""),h.resizable?f.draggable("enable").css("cursor",h.resizerCursor).attr("title",h.resizerTip):f.css("cursor","default"),g&&g.removeClass(m+p+" "+m+n+p).addClass(m+o+" "+m+n+o).attr("title",h.togglerTip_open),sizeHandles("all")),sizeContent(a),syncPinBtns(a,!i.isSliding),execUserCallback(a,h.onopen_end||h.onopen),r&&execUserCallback(a,h.onshow_end||h.onshow),execFlowCallback(a)}var e=$Ps[a],f=$Rs[a],g=$Ts[a],h=options[a],i=state[a],j=!d&&i.isClosed&&h.fxName_open!="none",k=c[a].edge,l=h.resizerClass,m=h.togglerClass,n="-"+a,o="-open",p="-closed",q="-sliding",r=i.isShowing;delete i.isShowing;if(!e||!h.resizable&&!h.closable)return;if(!i.isClosed&&!i.isSliding)return;if(i.isHidden&&!r){show(a,!0);return}if(c.isLayoutBusy){setFlowCallback("open",a,b);return}if(!1===execUserCallback(a,h.onopen_start))return;c[a].isMoving=!0,c.isLayoutBusy=!0,i.isSliding&&!b&&bindStopSlidingEvents(a,!1),i.isClosed=!1,r&&(i.isHidden=!1),setPaneMinMaxSizes(a),i.size>i.maxSize&&e.css(c[a].sizeType,max(1,cssSize(a,i.maxSize))),bindStartSlidingEvent(a,!1),j?(lockPaneForFX(a,!0),e.show(h.fxName_open,h.fxSettings_open,h.fxSpeed_open,function(){lockPaneForFX(a,!1);if(i.isClosed)return;s()})):(e.show(),s())},lockPaneForFX=function(a,b){var d=$Ps[a];b?(d.css({zIndex:c.zIndex.animation}),a=="south"?d.css({top:cDims.top+cDims.innerHeight-d.outerHeight()}):a=="east"&&d.css({left:cDims.left+cDims.innerWidth-d.outerWidth()})):(state[a].isSliding||d.css({zIndex:c.zIndex.pane_normal}),a=="south"?d.css({top:"auto"}):a=="east"&&d.css({left:"auto"}))},bindStartSlidingEvent=function(a,b){var c=options[a],d=$Rs[a],e=c.slideTrigger_open;if(!d||!c.slidable)return;e!="click"&&e!="dblclick"&&e!="mouseover"&&(e="click"),d[b?"bind":"unbind"](e,slideOpen).css("cursor",b?c.sliderCursor:"default").attr("title",b?c.sliderTip:"")},bindStopSlidingEvents=function(a,b){function j(b){clearTimer(a,"closeSlider"),b.stopPropagation()}var d=options[a],e=state[a],f=d.slideTrigger_close,g=b?"bind":"unbind",h=$Ps[a],i=$Rs[a];e.isSliding=b,clearTimer(a,"closeSlider"),h.css({zIndex:b?c.zIndex.sliding:c.zIndex.pane_normal}),i.css({zIndex:b?c.zIndex.sliding:c.zIndex.resizer_normal}),f!="click"&&f!="mouseout"&&(f="mouseout");if(b){h.bind(f,slideClosed),i.bind(f,slideClosed);if(f="mouseout")h.bind("mouseover",j),i.bind("mouseover",j)}else{h.unbind(f),i.unbind(f);if(f="mouseout")h.unbind("mouseover"),i.unbind("mouseover"),clearTimer(a,"closeSlider")}},slideOpen=function(){var a=$(this).attr("resizer");state[a].isClosed&&(bindStopSlidingEvents(a,!0),open(a,!0))},slideClosed=function(){function e(){bindStopSlidingEvents(b,!1),d.isClosed||close(b)}var a=$(this),b=a.attr("pane")||a.attr("resizer"),c=options[b],d=state[b];if(d.isClosed||d.isResizing)return;c.slideTrigger_close=="click"?e():setTimer(b,"closeSlider",e,300)},sizePane=function(a,b){var d=c[a].edge,e=c[a].dir,f=options[a],g=state[a],h=$Ps[a],i=$Rs[a];setPaneMinMaxSizes(a),g.minSize=max(g.minSize,f.minSize),f.maxSize>0&&(g.maxSize=min(g.maxSize,f.maxSize)),b=max(b,g.minSize),b=min(b,g.maxSize),g.size=b,i.css(d,b+cDims[d]),h.css(c[a].sizeType,max(1,cssSize(a,b))),g.isSliding||sizeMidPanes(e=="horz"?"all":"center"),sizeHandles(),sizeContent(a),execUserCallback(a,f.onresize_end||f.onresize)},sizeMidPanes=function(a,b,c){if(!a||a=="all")a="east,west,center";var d=getPaneDims();b&&$.extend(d,b),$.each(a.split(","),function(){if(!$Ps[this])return;var a=str(this),b=options[a],e=state[a],f=$Ps[a],g=$Rs[a],h=!0,i={};a=="center"?(d=getPaneDims(),i=$.extend({},d),i.width=max(1,cssW(a,i.width)),i.height=max(1,cssH(a,i.height)),h=i.width>1&&i.height>1,$.browser.msie&&(!$.boxModel||$.browser.version<7)&&($Ps.north&&$Ps.north.css({width:cssW($Ps.north,cDims.innerWidth)}),$Ps.south&&$Ps.south.css({width:cssW($Ps.south,cDims.innerWidth)}))):(i.top=d.top,i.bottom=d.bottom,i.height=max(1,cssH(a,d.height)),h=i.height>1);if(h){f.css(i);if(e.noRoom){e.noRoom=!1;if(e.isHidden)return;show(a,!e.isClosed)}c||(sizeContent(a),execUserCallback(a,b.onresize_end||b.onresize))}else if(!e.noRoom){e.noRoom=!0;if(e.isHidden)return;c?(f.hide(),g&&g.hide()):hide(a)}})},sizeContent=function(a){if(!a||a=="all")a=c.allPanes;$.each(a.split(","),function(){if(!$Cs[this])return;var a=str(this),b=options[a].contentIgnoreSelector,c=$Ps[a],d=$Cs[a],e=d[0],f=cssH(c);c.children().each(function(){if(this==e)return;var a=$(this);if(!b||!a.is(b))f-=a.outerHeight()}),f>0&&(f=cssH(d,f)),f<1?d.hide():d.css({height:f}).show()})},sizeHandles=function(a,b){if(!a||a=="all")a=c.borderPanes;$.each(a.split(","),function(){var a=str(this),d=options[a],e=state[a],f=$Ps[a],g=$Rs[a],h=$Ts[a];if(!f||!g||!d.resizable&&!d.closable)return;var i=c[a].dir,j=e.isClosed?"_closed":"_open",k=d["spacing"+j],l=d["togglerAlign"+j],m=d["togglerLength"+j],n,o,p={};if(k==0){g.hide();return}!e.noRoom&&!e.isHidden&&g.show(),i=="horz"?(n=f.outerWidth(),g.css({width:max(1,cssW(g,n)),height:max(1,cssH(g,k)),left:cssNum(f,"left")})):(n=f.outerHeight(),g.css({height:max(1,cssH(g,n)),width:max(1,cssW(g,k)),top:cDims.top+getPaneSize("north",!0)}));if(h){if(m==0||e.isSliding&&d.hideTogglerOnSlide){h.hide();return}h.show();if(!(m>0)||m=="100%"||m>n)m=n,o=0;else if(typeof l=="string")switch(l){case"top":case"left":o=0;break;case"bottom":case"right":o=n-m;break;case"middle":case"center":default:o=Math.floor((n-m)/2)}else{var q=parseInt(l);l>=0?o=q:o=n-m+q}var r=d.togglerContent_open?h.children(".content-open"):!1,s=d.togglerContent_closed?h.children(".content-closed"):!1,t=e.isClosed?s:r;r&&r.css("display",e.isClosed?"none":"block"),s&&s.css("display",e.isClosed?"block":"none");if(i=="horz"){var u=cssW(h,m);h.css({width:max(0,u),height:max(1,cssH(h,k)),left:o}),t&&t.css("marginLeft",Math.floor((u-t.outerWidth())/2))}else{var v=cssH(h,m);h.css({height:max(0,v),width:max(1,cssW(h,k)),top:o}),t&&t.css("marginTop",Math.floor((v-t.outerHeight())/2))}}b&&d.initHidden&&(g.hide(),h&&h.hide())})},resizeAll=function(){var a=cDims.innerWidth,b=cDims.innerHeight;cDims=state.container=getElemDims($Container);var d=cDims.innerHeight<b,e=cDims.innerWidth<a,f,g;(d||e)&&$.each(["south","north","east","west"],function(a,b){f=state[b],g=c[b].dir,!f.isClosed&&(d&&g=="horz"||e&&g=="vert")&&(setPaneMinMaxSizes(b),f.size>f.maxSize&&sizePane(b,f.maxSize))}),sizeMidPanes("all"),sizeHandles("all")},$Container=$(this).css({overflow:"hidden"}),$Ps={},$Cs={},$Rs={},$Ts={},c=config,cDims=state.container;return create(),{options:options,state:state,panes:$Ps,toggle:toggle,open:open,close:close,hide:hide,show:show,resizeContent:sizeContent,sizePane:sizePane,resizeAll:resizeAll,addToggleBtn:addToggleBtn,addOpenBtn:addOpenBtn,addCloseBtn:addCloseBtn,addPinBtn:addPinBtn,allowOverflow:allowOverflow,resetOverflow:resetOverflow,cssWidth:cssW,cssHeight:cssH}}})(jQuery);;

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);
;

// moment.js
// version : 1.6.2
// author : Tim Wood
// license : MIT
// momentjs.com

(function (Date, undefined) {

    var moment,
        VERSION = "1.6.2",
        round = Math.round, i,
        // internal storage for language config files
        languages = {},
        currentLanguage = 'en',

        // check for nodeJS
        hasModule = (typeof module !== 'undefined'),

        // parameters to check for on the lang config
        langConfigProperties = 'months|monthsShort|monthsParse|weekdays|weekdaysShort|longDateFormat|calendar|relativeTime|ordinal|meridiem'.split('|'),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|dddd?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?|LT|LL?L?L?)/g,

        // parsing tokens
        parseMultipleFormatChunker = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenWord = /[0-9a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/i, // any word characters or numbers
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO seperator)

        // preliminary iso regex 
        // 0000-00-00 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000
        isoRegex = /^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,
        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.S', /T\d\d:\d\d:\d\d\.\d{1,3}/],
            ['HH:mm:ss', /T\d\d:\d\d:\d\d/],
            ['HH:mm', /T\d\d:\d\d/],
            ['HH', /T\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Month|Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        };

    // Moment prototype object
    function Moment(date, isUTC) {
        this._d = date;
        this._isUTC = !!isUTC;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // Duration Constructor
    function Duration(duration) {
        var data = this._data = {},
            years = duration.years || duration.y || 0,
            months = duration.months || duration.M || 0, 
            weeks = duration.weeks || duration.w || 0,
            days = duration.days || duration.d || 0,
            hours = duration.hours || duration.h || 0,
            minutes = duration.minutes || duration.m || 0,
            seconds = duration.seconds || duration.s || 0,
            milliseconds = duration.milliseconds || duration.ms || 0;

        // representation for dateAddRemove
        this._milliseconds = milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = months +
            years * 12;
            
        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;
        seconds += absRound(milliseconds / 1000);

        data.seconds = seconds % 60;
        minutes += absRound(seconds / 60);

        data.minutes = minutes % 60;
        hours += absRound(minutes / 60);

        data.hours = hours % 24;
        days += absRound(hours / 24);

        days += weeks * 7;
        data.days = days % 30;
        
        months += absRound(days / 30);

        data.months = months % 12;
        years += absRound(months / 12);

        data.years = years;
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength) {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding) {
        var ms = duration._milliseconds,
            d = duration._days,
            M = duration._months,
            currentDate;

        if (ms) {
            mom._d.setTime(+mom + ms * isAdding);
        }
        if (d) {
            mom.date(mom.date() + d * isAdding);
        }
        if (M) {
            currentDate = mom.date();
            mom.date(1)
                .month(mom.month() + M * isAdding)
                .date(Math.min(currentDate, mom.daysInMonth()));
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromArray(input) {
        return new Date(input[0], input[1] || 0, input[2] || 1, input[3] || 0, input[4] || 0, input[5] || 0, input[6] || 0);
    }

    // format date using native date object
    function formatMoment(m, inputString) {
        var currentMonth = m.month(),
            currentDate = m.date(),
            currentYear = m.year(),
            currentDay = m.day(),
            currentHours = m.hours(),
            currentMinutes = m.minutes(),
            currentSeconds = m.seconds(),
            currentMilliseconds = m.milliseconds(),
            currentZone = -m.zone(),
            ordinal = moment.ordinal,
            meridiem = moment.meridiem;
        // check if the character is a format
        // return formatted string or non string.
        //
        // uses switch/case instead of an object of named functions (like http://phpjs.org/functions/date:380)
        // for minification and performance
        // see http://jsperf.com/object-of-functions-vs-switch for performance comparison
        function replaceFunction(input) {
            // create a couple variables to be used later inside one of the cases.
            var a, b;
            switch (input) {
                // MONTH
            case 'M' :
                return currentMonth + 1;
            case 'Mo' :
                return (currentMonth + 1) + ordinal(currentMonth + 1);
            case 'MM' :
                return leftZeroFill(currentMonth + 1, 2);
            case 'MMM' :
                return moment.monthsShort[currentMonth];
            case 'MMMM' :
                return moment.months[currentMonth];
            // DAY OF MONTH
            case 'D' :
                return currentDate;
            case 'Do' :
                return currentDate + ordinal(currentDate);
            case 'DD' :
                return leftZeroFill(currentDate, 2);
            // DAY OF YEAR
            case 'DDD' :
                a = new Date(currentYear, currentMonth, currentDate);
                b = new Date(currentYear, 0, 1);
                return ~~ (((a - b) / 864e5) + 1.5);
            case 'DDDo' :
                a = replaceFunction('DDD');
                return a + ordinal(a);
            case 'DDDD' :
                return leftZeroFill(replaceFunction('DDD'), 3);
            // WEEKDAY
            case 'd' :
                return currentDay;
            case 'do' :
                return currentDay + ordinal(currentDay);
            case 'ddd' :
                return moment.weekdaysShort[currentDay];
            case 'dddd' :
                return moment.weekdays[currentDay];
            // WEEK OF YEAR
            case 'w' :
                a = new Date(currentYear, currentMonth, currentDate - currentDay + 5);
                b = new Date(a.getFullYear(), 0, 4);
                return ~~ ((a - b) / 864e5 / 7 + 1.5);
            case 'wo' :
                a = replaceFunction('w');
                return a + ordinal(a);
            case 'ww' :
                return leftZeroFill(replaceFunction('w'), 2);
            // YEAR
            case 'YY' :
                return leftZeroFill(currentYear % 100, 2);
            case 'YYYY' :
                return currentYear;
            // AM / PM
            case 'a' :
                return meridiem ? meridiem(currentHours, currentMinutes, false) : (currentHours > 11 ? 'pm' : 'am');
            case 'A' :
                return meridiem ? meridiem(currentHours, currentMinutes, true) : (currentHours > 11 ? 'PM' : 'AM');
            // 24 HOUR
            case 'H' :
                return currentHours;
            case 'HH' :
                return leftZeroFill(currentHours, 2);
            // 12 HOUR
            case 'h' :
                return currentHours % 12 || 12;
            case 'hh' :
                return leftZeroFill(currentHours % 12 || 12, 2);
            // MINUTE
            case 'm' :
                return currentMinutes;
            case 'mm' :
                return leftZeroFill(currentMinutes, 2);
            // SECOND
            case 's' :
                return currentSeconds;
            case 'ss' :
                return leftZeroFill(currentSeconds, 2);
            // MILLISECONDS
            case 'S' :
                return ~~ (currentMilliseconds / 100);
            case 'SS' :
                return leftZeroFill(~~(currentMilliseconds / 10), 2);
            case 'SSS' :
                return leftZeroFill(currentMilliseconds, 3);
            // TIMEZONE
            case 'Z' :
                return (currentZone < 0 ? '-' : '+') + leftZeroFill(~~(Math.abs(currentZone) / 60), 2) + ':' + leftZeroFill(~~(Math.abs(currentZone) % 60), 2);
            case 'ZZ' :
                return (currentZone < 0 ? '-' : '+') + leftZeroFill(~~(10 * Math.abs(currentZone) / 6), 4);
            // LONG DATES
            case 'L' :
            case 'LL' :
            case 'LLL' :
            case 'LLLL' :
            case 'LT' :
                return formatMoment(m, moment.longDateFormat[input]);
            // DEFAULT
            default :
                return input.replace(/(^\[)|(\\)|\]$/g, "");
            }
        }
        return inputString.replace(formattingTokens, replaceFunction);
    }

    // get the regex to find the next token
    function getParseRegexForToken(token) {
        switch (token) {
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
            return parseTokenFourDigits;
        case 'S':
        case 'SS':
        case 'SSS':
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'ddd':
        case 'dddd':
        case 'a':
        case 'A':
            return parseTokenWord;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'MM':
        case 'DD':
        case 'dd':
        case 'YY':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
            return parseTokenOneOrTwoDigits;
        default :
            return new RegExp(token.replace('\\', ''));
        }
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, datePartArray, config) {
        var a;
        //console.log('addTime', format, input);
        switch (token) {
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            datePartArray[1] = (input == null) ? 0 : ~~input - 1;
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            for (a = 0; a < 12; a++) {
                if (moment.monthsParse[a].test(input)) {
                    datePartArray[1] = a;
                    break;
                }
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DDDD
        case 'DD' : // fall through to DDDD
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            datePartArray[2] = ~~input;
            break;
        // YEAR
        case 'YY' :
            input = ~~input;
            datePartArray[0] = input + (input > 70 ? 1900 : 2000);
            break;
        case 'YYYY' :
            datePartArray[0] = ~~Math.abs(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config.isPm = ((input + '').toLowerCase() === 'pm');
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[3] = ~~input;
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[4] = ~~input;
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[5] = ~~input;
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
            datePartArray[6] = ~~ (('0.' + input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config.isUTC = true;
            a = (input + '').match(parseTimezoneChunker);
            if (a && a[1]) {
                config.tzh = ~~a[1];
            }
            if (a && a[2]) {
                config.tzm = ~~a[2];
            }
            // reverse offsets
            if (a && a[0] === '+') {
                config.tzh = -config.tzh;
                config.tzm = -config.tzm;
            }
            break;
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(string, format) {
        var datePartArray = [0, 0, 1, 0, 0, 0, 0],
            config = {
                tzh : 0, // timezone hour offset
                tzm : 0  // timezone minute offset
            },
            tokens = format.match(formattingTokens),
            i, parsedInput;

        for (i = 0; i < tokens.length; i++) {
            parsedInput = (getParseRegexForToken(tokens[i]).exec(string) || [])[0];
            string = string.replace(getParseRegexForToken(tokens[i]), '');
            addTimeToArrayFromToken(tokens[i], parsedInput, datePartArray, config);
        }
        // handle am pm
        if (config.isPm && datePartArray[3] < 12) {
            datePartArray[3] += 12;
        }
        // if is 12 am, change hours to 0
        if (config.isPm === false && datePartArray[3] === 12) {
            datePartArray[3] = 0;
        }
        // handle timezone
        datePartArray[3] += config.tzh;
        datePartArray[4] += config.tzm;
        // return
        return config.isUTC ? new Date(Date.UTC.apply({}, datePartArray)) : dateFromArray(datePartArray);
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (~~array1[i] !== ~~array2[i]) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(string, formats) {
        var output,
            inputParts = string.match(parseMultipleFormatChunker) || [],
            formattedInputParts,
            scoreToBeat = 99,
            i,
            currentDate,
            currentScore;
        for (i = 0; i < formats.length; i++) {
            currentDate = makeDateFromStringAndFormat(string, formats[i]);
            formattedInputParts = formatMoment(new Moment(currentDate), formats[i]).match(parseMultipleFormatChunker) || [];
            currentScore = compareArrays(inputParts, formattedInputParts);
            if (currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                output = currentDate;
            }
        }
        return output;
    }

    // date from iso format
    function makeDateFromString(string) {
        var format = 'YYYY-MM-DDT',
            i;
        if (isoRegex.exec(string)) {
            for (i = 0; i < 4; i++) {
                if (isoTimes[i][1].exec(string)) {
                    format += isoTimes[i][0];
                    break;
                }
            }
            return parseTokenTimezone.exec(string) ? 
                makeDateFromStringAndFormat(string, format + ' Z') :
                makeDateFromStringAndFormat(string, format);
        }
        return new Date(string);
    }

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture) {
        var rt = moment.relativeTime[string];
        return (typeof rt === 'function') ?
            rt(number || 1, !!withoutSuffix, string, isFuture) :
            rt.replace(/%d/i, number || 1);
    }

    function relativeTime(milliseconds, withoutSuffix) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < 45 && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < 45 && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < 22 && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= 25 && ['dd', days] ||
                days <= 45 && ['M'] ||
                days < 345 && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        return substituteTimeAgo.apply({}, args);
    }

    moment = function (input, format) {
        if (input === null || input === '') {
            return null;
        }
        var date,
            matched,
            isUTC;
        // parse Moment object
        if (moment.isMoment(input)) {
            date = new Date(+input._d);
            isUTC = input._isUTC;
        // parse string and format
        } else if (format) {
            if (isArray(format)) {
                date = makeDateFromStringAndArray(input, format);
            } else {
                date = makeDateFromStringAndFormat(input, format);
            }
        // evaluate it as a JSON-encoded date
        } else {
            matched = aspNetJsonRegex.exec(input);
            date = input === undefined ? new Date() :
                matched ? new Date(+matched[1]) :
                input instanceof Date ? input :
                isArray(input) ? dateFromArray(input) :
                typeof input === 'string' ? makeDateFromString(input) :
                new Date(input);
        }
        return new Moment(date, isUTC);
    };

    // creating with utc
    moment.utc = function (input, format) {
        if (isArray(input)) {
            return new Moment(new Date(Date.UTC.apply({}, input)), true);
        }
        return (format && input) ?
            moment(input + ' +0000', format + ' Z').utc() :
            moment(input && !parseTokenTimezone.exec(input) ? input + '+0000' : input).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var isDuration = moment.isDuration(input),
            isNumber = (typeof input === 'number'),
            duration = (isDuration ? input._data : (isNumber ? {} : input));

        if (isNumber) {
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        }

        return new Duration(duration);
    };

    // humanizeDuration
    // This method is deprecated in favor of the new Duration object.  Please
    // see the moment.duration method.
    moment.humanizeDuration = function (num, type, withSuffix) {
        return moment.duration(num, type === true ? null : type).humanize(type === true ? true : withSuffix);
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // language switching and caching
    moment.lang = function (key, values) {
        var i, req,
            parse = [];
        if (!key) {
            return currentLanguage;
        }
        if (values) {
            for (i = 0; i < 12; i++) {
                parse[i] = new RegExp('^' + values.months[i] + '|^' + values.monthsShort[i].replace('.', ''), 'i');
            }
            values.monthsParse = values.monthsParse || parse;
            languages[key] = values;
        }
        if (languages[key]) {
            for (i = 0; i < langConfigProperties.length; i++) {
                moment[langConfigProperties[i]] = languages[key][langConfigProperties[i]] || 
                    languages.en[langConfigProperties[i]];
            }
            currentLanguage = key;
        } else {
            if (hasModule) {
                req = require('./lang/' + key);
                moment.lang(key, req);
            }
        }
    };

    // set default language
    moment.lang('en', {
        months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        meridiem : false,
        calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[last] dddd [at] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        ordinal : function (number) {
            var b = number % 10;
            return (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        }
    });

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment;
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    // shortcut for prototype
    moment.fn = Moment.prototype = {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d;
        },

        unix : function () {
            return Math.floor(+this._d / 1000);
        },

        toString : function () {
            return this._d.toString();
        },

        toDate : function () {
            return this._d;
        },

        utc : function () {
            this._isUTC = true;
            return this;
        },

        local : function () {
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            return formatMoment(this, inputString ? inputString : moment.defaultFormat);
        },

        add : function (input, val) {
            var dur = val ? moment.duration(+val, input) : moment.duration(input);
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur = val ? moment.duration(+val, input) : moment.duration(input);
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, val, asFloat) {
            var inputMoment = this._isUTC ? moment(input).utc() : moment(input).local(),
                zoneDiff = (this.zone() - inputMoment.zone()) * 6e4,
                diff = this._d - inputMoment._d - zoneDiff,
                year = this.year() - inputMoment.year(),
                month = this.month() - inputMoment.month(),
                date = this.date() - inputMoment.date(),
                output;
            if (val === 'months') {
                output = year * 12 + month + date / 30;
            } else if (val === 'years') {
                output = year + (month + date / 30) / 12;
            } else {
                output = val === 'seconds' ? diff / 1e3 : // 1000
                    val === 'minutes' ? diff / 6e4 : // 1000 * 60
                    val === 'hours' ? diff / 36e5 : // 1000 * 60 * 60
                    val === 'days' ? diff / 864e5 : // 1000 * 60 * 60 * 24
                    val === 'weeks' ? diff / 6048e5 : // 1000 * 60 * 60 * 24 * 7
                    diff;
            }
            return asFloat ? output : round(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            var diff = this.diff(moment().sod(), 'days', true),
                calendar = moment.calendar,
                allElse = calendar.sameElse,
                format = diff < -6 ? allElse :
                diff < -1 ? calendar.lastWeek :
                diff < 0 ? calendar.lastDay :
                diff < 1 ? calendar.sameDay :
                diff < 2 ? calendar.nextDay :
                diff < 7 ? calendar.nextWeek : allElse;
            return this.format(typeof format === 'function' ? format.apply(this) : format);
        },

        isLeapYear : function () {
            var year = this.year();
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        },

        isDST : function () {
            return (this.zone() < moment([this.year()]).zone() || 
                this.zone() < moment([this.year(), 5]).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return input == null ? day :
                this.add({ d : input - day });
        },

        sod: function () {
            return moment(this)
                .hours(0)
                .minutes(0)
                .seconds(0)
                .milliseconds(0);
        },

        eod: function () {
            // end of day = start of day plus 1 day, minus 1 millisecond
            return this.sod().add({
                d : 1,
                ms : -1
            });
        },

        zone : function () {
            return this._isUTC ? 0 : this._d.getTimezoneOffset();
        },

        daysInMonth : function () {
            return moment(this).month(this.month() + 1).date(0).date();
        }
    };

    // helper for adding shortcuts
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = function (input) {
            var utc = this._isUTC ? 'UTC' : '';
            if (input != null) {
                this._d['set' + utc + key](input);
                return this;
            } else {
                return this._d['get' + utc + key]();
            }
        };
    }

    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
    for (i = 0; i < proxyGettersAndSetters.length; i ++) {
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase(), proxyGettersAndSetters[i]);
    }

    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
    makeGetterAndSetter('year', 'FullYear');

    moment.duration.fn = Duration.prototype = {
        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              this._months * 2592e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                rel = moment.relativeTime,
                output = relativeTime(difference, !withSuffix);

            if (withSuffix) {
                output = (difference <= 0 ? rel.past : rel.future).replace(/%s/i, output);
            }

            return output;
        }
    };

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    }
    /*global ender:false */
    if (typeof window !== 'undefined' && typeof ender === 'undefined') {
        window.moment = moment;
    }
    /*global define:false */
    if (typeof define === "function" && define.amd) {
        define("moment", [], function () {
            return moment;
        });
    }
})(Date);
;

//fgnass.github.com/spin.js#v1.2.5
(function(window, document, undefined) {

/**
 * Copyright (c) 2011 Felix Gnass [fgnass at neteye dot de]
 * Licensed under the MIT license
 */

  var prefixes = ['webkit', 'Moz', 'ms', 'O']; /* Vendor prefixes */
  var animations = {}; /* Animation rules keyed by their name */
  var useCssAnimations;

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl(tag, prop) {
    var el = document.createElement(tag || 'div');
    var n;

    for(n in prop) {
      el[n] = prop[n];
    }
    return el;
  }

  /**
   * Appends children and returns the parent.
   */
  function ins(parent /* child1, child2, ...*/) {
    for (var i=1, n=arguments.length; i<n; i++) {
      parent.appendChild(arguments[i]);
    }
    return parent;
  }

  /**
   * Insert a new stylesheet to hold the @keyframe or VML rules.
   */
  var sheet = function() {
    var el = createEl('style');
    ins(document.getElementsByTagName('head')[0], el);
    return el.sheet || el.styleSheet;
  }();

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-');
    var start = 0.01 + i/lines*100;
    var z = Math.max(1-(1-alpha)/trail*(100-start) , alpha);
    var prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase();
    var pre = prefix && '-'+prefix+'-' || '';

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:'+z+'}' +
        start + '%{opacity:'+ alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail)%100 + '%{opacity:'+ alpha + '}' +
        '100%{opacity:'+ z + '}' +
        '}', 0);
      animations[name] = 1;
    }
    return name;
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   **/
  function vendor(el, prop) {
    var s = el.style;
    var pp;
    var i;

    if(s[prop] !== undefined) return prop;
    prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop;
      if(s[pp] !== undefined) return pp;
    }
  }

  /**
   * Sets multiple style properties at once.
   */
  function css(el, prop) {
    for (var n in prop) {
      el.style[vendor(el, n)||n] = prop[n];
    }
    return el;
  }

  /**
   * Fills in default values.
   */
  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i];
      for (var n in def) {
        if (obj[n] === undefined) obj[n] = def[n];
      }
    }
    return obj;
  }

  /**
   * Returns the absolute page-offset of the given element.
   */
  function pos(el) {
    var o = {x:el.offsetLeft, y:el.offsetTop};
    while((el = el.offsetParent)) {
      o.x+=el.offsetLeft;
      o.y+=el.offsetTop;
    }
    return o;
  }

  var defaults = {
    lines: 12,            // The number of lines to draw
    length: 7,            // The length of each line
    width: 5,             // The line thickness
    radius: 10,           // The radius of the inner circle
    rotate: 0,            // rotation offset
    color: '#000',        // #rgb or #rrggbb
    speed: 1,             // Rounds per second
    trail: 100,           // Afterglow percentage
    opacity: 1/4,         // Opacity of the lines
    fps: 20,              // Frames per second when using setTimeout()
    zIndex: 2e9,          // Use a high z-index by default
    className: 'spinner', // CSS class to assign to the element
    top: 'auto',          // center vertically
    left: 'auto'          // center horizontally
  };

  /** The constructor */
  var Spinner = function Spinner(o) {
    if (!this.spin) return new Spinner(o);
    this.opts = merge(o || {}, Spinner.defaults, defaults);
  };

  Spinner.defaults = {};
  merge(Spinner.prototype, {
    spin: function(target) {
      this.stop();
      var self = this;
      var o = self.opts;
      var el = self.el = css(createEl(0, {className: o.className}), {position: 'relative', zIndex: o.zIndex});
      var mid = o.radius+o.length+o.width;
      var ep; // element position
      var tp; // target position

      if (target) {
        target.insertBefore(el, target.firstChild||null);
        tp = pos(target);
        ep = pos(el);
        css(el, {
          left: (o.left == 'auto' ? tp.x-ep.x + (target.offsetWidth >> 1) : o.left+mid) + 'px',
          top: (o.top == 'auto' ? tp.y-ep.y + (target.offsetHeight >> 1) : o.top+mid)  + 'px'
        });
      }

      el.setAttribute('aria-role', 'progressbar');
      self.lines(el, self.opts);

      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var i = 0;
        var fps = o.fps;
        var f = fps/o.speed;
        var ostep = (1-o.opacity)/(f*o.trail / 100);
        var astep = f/o.lines;

        !function anim() {
          i++;
          for (var s=o.lines; s; s--) {
            var alpha = Math.max(1-(i+s*astep)%f * ostep, o.opacity);
            self.opacity(el, o.lines-s, alpha, o);
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps));
        }();
      }
      return self;
    },
    stop: function() {
      var el = this.el;
      if (el) {
        clearTimeout(this.timeout);
        if (el.parentNode) el.parentNode.removeChild(el);
        this.el = undefined;
      }
      return this;
    },
    lines: function(el, o) {
      var i = 0;
      var seg;

      function fill(color, shadow) {
        return css(createEl(), {
          position: 'absolute',
          width: (o.length+o.width) + 'px',
          height: o.width + 'px',
          background: color,
          boxShadow: shadow,
          transformOrigin: 'left',
          transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
          borderRadius: (o.width>>1) + 'px'
        });
      }
      for (; i < o.lines; i++) {
        seg = css(createEl(), {
          position: 'absolute',
          top: 1+~(o.width/2) + 'px',
          transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
          opacity: o.opacity,
          animation: useCssAnimations && addAnimation(o.opacity, o.trail, i, o.lines) + ' ' + 1/o.speed + 's linear infinite'
        });
        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}));
        ins(el, ins(seg, fill(o.color, '0 0 1px rgba(0,0,0,.1)')));
      }
      return el;
    },
    opacity: function(el, i, val) {
      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val;
    }
  });

  /////////////////////////////////////////////////////////////////////////
  // VML rendering for IE
  /////////////////////////////////////////////////////////////////////////

  /**
   * Check and init VML support
   */
  !function() {

    function vml(tag, attr) {
      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr);
    }

    var s = css(createEl('group'), {behavior: 'url(#default#VML)'});

    if (!vendor(s, 'transform') && s.adj) {

      // VML support detected. Insert CSS rule ...
      sheet.addRule('.spin-vml', 'behavior:url(#default#VML)');

      Spinner.prototype.lines = function(el, o) {
        var r = o.length+o.width;
        var s = 2*r;

        function grp() {
          return css(vml('group', {coordsize: s +' '+s, coordorigin: -r +' '+-r}), {width: s, height: s});
        }

        var margin = -(o.width+o.length)*2+'px';
        var g = css(grp(), {position: 'absolute', top: margin, left: margin});

        var i;

        function seg(i, dx, filter) {
          ins(g,
            ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
              ins(css(vml('roundrect', {arcsize: 1}), {
                  width: r,
                  height: o.width,
                  left: o.radius,
                  top: -o.width>>1,
                  filter: filter
                }),
                vml('fill', {color: o.color, opacity: o.opacity}),
                vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
              )
            )
          );
        }

        if (o.shadow) {
          for (i = 1; i <= o.lines; i++) {
            seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)');
          }
        }
        for (i = 1; i <= o.lines; i++) seg(i);
        return ins(el, g);
      };
      Spinner.prototype.opacity = function(el, i, val, o) {
        var c = el.firstChild;
        o = o.shadow && o.lines || 0;
        if (c && i+o < c.childNodes.length) {
          c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild;
          if (c) c.opacity = val;
        }
      };
    }
    else {
      useCssAnimations = vendor(s, 'animation');
    }
  }();

  window.Spinner = Spinner;

})(window, document);
;

