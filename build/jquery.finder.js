/* 
The MIT License (MIT)

Copyright (c) 2015-2019 Mark Matyas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


*/

/*
The MIT License (MIT)

Copyright (c) 2015-2019 Mark Matyas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.finder = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/mmatyas/projects/finderjs/index.js":[function(require,module,exports){
"use strict";var extend=require("xtend"),EventEmitter=require("eventemitter3"),isArray=require("x-is-array"),_=require("./util"),defaults={labelKey:"label",childKey:"children",className:{container:"fjs-container",col:"fjs-col",list:"fjs-list",item:"fjs-item",active:"fjs-active",children:"fjs-has-children",url:"fjs-url",itemPrepend:"fjs-item-prepend",itemContent:"fjs-item-content",itemAppend:"fjs-item-append"}};function finder(e,t,n){var i=new EventEmitter,a=extend(defaults,{container:e,emitter:i},n);return a.className=extend(defaults.className,n?n.className:{}),"function"==typeof t&&(a.data=t),e.addEventListener("click",finder.clickEvent.bind(null,a)),e.addEventListener("keydown",finder.keydownEvent.bind(null,a)),i.on("item-selected",finder.itemSelected.bind(null,a)),i.on("create-column",finder.addColumn.bind(null,a)),i.on("navigate",finder.navigate.bind(null,a)),i.on("go-to",finder.goTo.bind(null,a,t)),_.addClass(e,a.className.container),finder.createColumn(t,a),a.defaultPath&&window.requestAnimationFrame(function(){finder.goTo(a,t,a.defaultPath)}),e.setAttribute("tabindex",0),i}function trim(e){return e.trim()}module.exports=finder,finder.goTo=function(e,t,n){var i=isArray(n)?n:n.split("/").map(trim).filter(Boolean);if(i.length){for(;e.container.firstChild;)e.container.removeChild(e.container.firstChild);finder.selectPath(i,e,t)}},finder.addColumn=function(e,t){e.container.appendChild(t),e.emitter.emit("column-created",t)},finder.itemSelected=function(e,t){var n,i=t.item,a=i._item,r=t.col,l=a[e.childKey]||e.data,c=r.getElementsByClassName(e.className.active),s=window.pageXOffset,d=window.pageYOffset;return c.length&&_.removeClass(c[0],e.className.active),_.addClass(i,e.className.active),_.nextSiblings(r).map(_.remove),e.container.focus(),window.scrollTo(s,d),l?(n=finder.createColumn(l,e,a),e.emitter.emit("interior-selected",a)):a.url?document.location.href=a.url:e.emitter.emit("leaf-selected",a),n},finder.clickEvent=function(e,t){var n=t.target,i=_.closest(n,function(t){return _.hasClass(t,e.className.col)}),a=_.closest(n,function(t){return _.hasClass(t,e.className.item)});_.stop(t),a&&e.emitter.emit("item-selected",{col:i,item:a})},finder.keydownEvent=function(e,t){var n={38:"up",39:"right",40:"down",37:"left"};t.keyCode in n&&(_.stop(t),e.emitter.emit("navigate",{direction:n[t.keyCode],container:e.container}))},finder.selectPath=function(e,t,n,i){var a=e[0],r=n.find(function(e){return e[t.labelKey]===a}),l=i||finder.createColumn(n,t),c=finder.itemSelected(t,{col:l,item:_.first(l,'[data-fjs-item="'+a+'"]')});e.shift(),e.length&&finder.selectPath(e,t,r[t.childKey],c)},finder.navigate=function(e,t){var n,i,a=finder.findLastActive(e),r=null,l=t.direction;a?(n=a.item,i=a.col,"up"===l&&n.previousSibling?r=n.previousSibling:"down"===l&&n.nextSibling?r=n.nextSibling:"right"===l&&i.nextSibling?(i=i.nextSibling,r=_.first(i,"."+e.className.item)):"left"===l&&i.previousSibling&&(i=i.previousSibling,r=_.first(i,"."+e.className.active)||_.first(i,"."+e.className.item))):(i=_.first(e.container,"."+e.className.col),r=_.first(i,"."+e.className.item)),r&&e.emitter.emit("item-selected",{container:e.container,col:i,item:r})},finder.findLastActive=function(e){var t,n=e.container.getElementsByClassName(e.className.active);return n.length?(t=n[n.length-1],{col:_.closest(t,function(t){return _.hasClass(t,e.className.col)}),item:t}):null},finder.createColumn=function(e,t,n){var i,a;if("function"!=typeof e){if(isArray(e))return a=finder.createList(e,t),(i=_.el("div")).appendChild(a),_.addClass(i,t.className.col),t.emitter.emit("create-column",i),i;throw new Error("Unknown data type")}e.call(null,n,t,function(e){return finder.createColumn(e,t,n)})},finder.createList=function(e,t){var n,i=_.el("ul");return n=e.map(function(e){return finder.createItem(t,e)}).reduce(function(e,t){return e.appendChild(t),e},document.createDocumentFragment()),i.appendChild(n),_.addClass(i,t.className.list),i},finder.createItemContent=function(e,t){var n=document.createDocumentFragment(),i=_.el("div."+e.className.itemPrepend),a=_.el("div."+e.className.itemContent),r=_.el("div."+e.className.itemAppend);return n.appendChild(i),a.appendChild(document.createTextNode(t[e.labelKey])),n.appendChild(a),n.appendChild(r),n},finder.createItem=function(e,t){var n=document.createDocumentFragment(),i=[e.className.item],a=_.el("li"),r=_.el("a");return n=(e.createItemContent||finder.createItemContent).call(null,e,t),r.appendChild(n),r.href="",r.setAttribute("tabindex",-1),t.url&&(r.href=t.url,i.push(e.className.url)),t.className&&i.push(t.className),t[e.childKey]&&i.push(e.className[e.childKey]),_.addClass(a,i),a.appendChild(r),a.setAttribute("data-fjs-item",t[e.labelKey]),a._item=t,a};

},{"./util":"/Users/mmatyas/projects/finderjs/util.js","eventemitter3":"/Users/mmatyas/projects/finderjs/node_modules/eventemitter3/index.js","x-is-array":"/Users/mmatyas/projects/finderjs/node_modules/x-is-array/index.js","xtend":"/Users/mmatyas/projects/finderjs/node_modules/xtend/immutable.js"}],"/Users/mmatyas/projects/finderjs/node_modules/eventemitter3/index.js":[function(require,module,exports){
"use strict";var has=Object.prototype.hasOwnProperty,prefix="~";function Events(){}function EE(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function EventEmitter(){this._events=new Events,this._eventsCount=0}Object.create&&(Events.prototype=Object.create(null),(new Events).__proto__||(prefix=!1)),EventEmitter.prototype.eventNames=function(){var e,t,n=[];if(0===this._eventsCount)return n;for(t in e=this._events)has.call(e,t)&&n.push(prefix?t.slice(1):t);return Object.getOwnPropertySymbols?n.concat(Object.getOwnPropertySymbols(e)):n},EventEmitter.prototype.listeners=function(e,t){var n=prefix?prefix+e:e,r=this._events[n];if(t)return!!r;if(!r)return[];if(r.fn)return[r.fn];for(var s=0,i=r.length,o=new Array(i);s<i;s++)o[s]=r[s].fn;return o},EventEmitter.prototype.emit=function(e,t,n,r,s,i){var o=prefix?prefix+e:e;if(!this._events[o])return!1;var v,f,h=this._events[o],c=arguments.length;if(h.fn){switch(h.once&&this.removeListener(e,h.fn,void 0,!0),c){case 1:return h.fn.call(h.context),!0;case 2:return h.fn.call(h.context,t),!0;case 3:return h.fn.call(h.context,t,n),!0;case 4:return h.fn.call(h.context,t,n,r),!0;case 5:return h.fn.call(h.context,t,n,r,s),!0;case 6:return h.fn.call(h.context,t,n,r,s,i),!0}for(f=1,v=new Array(c-1);f<c;f++)v[f-1]=arguments[f];h.fn.apply(h.context,v)}else{var p,a=h.length;for(f=0;f<a;f++)switch(h[f].once&&this.removeListener(e,h[f].fn,void 0,!0),c){case 1:h[f].fn.call(h[f].context);break;case 2:h[f].fn.call(h[f].context,t);break;case 3:h[f].fn.call(h[f].context,t,n);break;case 4:h[f].fn.call(h[f].context,t,n,r);break;default:if(!v)for(p=1,v=new Array(c-1);p<c;p++)v[p-1]=arguments[p];h[f].fn.apply(h[f].context,v)}}return!0},EventEmitter.prototype.on=function(e,t,n){var r=new EE(t,n||this),s=prefix?prefix+e:e;return this._events[s]?this._events[s].fn?this._events[s]=[this._events[s],r]:this._events[s].push(r):(this._events[s]=r,this._eventsCount++),this},EventEmitter.prototype.once=function(e,t,n){var r=new EE(t,n||this,!0),s=prefix?prefix+e:e;return this._events[s]?this._events[s].fn?this._events[s]=[this._events[s],r]:this._events[s].push(r):(this._events[s]=r,this._eventsCount++),this},EventEmitter.prototype.removeListener=function(e,t,n,r){var s=prefix?prefix+e:e;if(!this._events[s])return this;if(!t)return 0==--this._eventsCount?this._events=new Events:delete this._events[s],this;var i=this._events[s];if(i.fn)i.fn!==t||r&&!i.once||n&&i.context!==n||(0==--this._eventsCount?this._events=new Events:delete this._events[s]);else{for(var o=0,v=[],f=i.length;o<f;o++)(i[o].fn!==t||r&&!i[o].once||n&&i[o].context!==n)&&v.push(i[o]);v.length?this._events[s]=1===v.length?v[0]:v:0==--this._eventsCount?this._events=new Events:delete this._events[s]}return this},EventEmitter.prototype.removeAllListeners=function(e){var t;return e?(t=prefix?prefix+e:e,this._events[t]&&(0==--this._eventsCount?this._events=new Events:delete this._events[t])):(this._events=new Events,this._eventsCount=0),this},EventEmitter.prototype.off=EventEmitter.prototype.removeListener,EventEmitter.prototype.addListener=EventEmitter.prototype.on,EventEmitter.prototype.setMaxListeners=function(){return this},EventEmitter.prefixed=prefix,EventEmitter.EventEmitter=EventEmitter,"undefined"!=typeof module&&(module.exports=EventEmitter);

},{}],"/Users/mmatyas/projects/finderjs/node_modules/x-is-array/index.js":[function(require,module,exports){
var nativeIsArray=Array.isArray,toString=Object.prototype.toString;function isArray(r){return"[object Array]"===toString.call(r)}module.exports=nativeIsArray||isArray;

},{}],"/Users/mmatyas/projects/finderjs/node_modules/xtend/immutable.js":[function(require,module,exports){
module.exports=extend;var hasOwnProperty=Object.prototype.hasOwnProperty;function extend(){for(var r={},e=0;e<arguments.length;e++){var t=arguments[e];for(var n in t)hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r}

},{}],"/Users/mmatyas/projects/finderjs/util.js":[function(require,module,exports){
"use strict";var isArray=require("x-is-array");function isElement(e){try{return e instanceof Element}catch(r){return!(!e||1!==e.nodeType)}}function el(e){var r,s=[],n=e;return isElement(e)?e:((s=e.split(".")).length>1&&(n=s[0]),addClass(r=document.createElement(n),s.slice(1)),r)}function frag(){return document.createDocumentFragment()}function text(e){return document.createTextNode(e)}function remove(e){return"remove"in e?e.remove():e.parentNode.removeChild(e),e}function closest(e,r){for(var s=e;s;){if(r(s))return s;s=s.parentNode}return null}function addClass(e,r){var s=r;return isArray(r)||(s=r.trim().split(/\s+/)),s.forEach(function(e,r){e.className?hasClass(e,r)||(e.classList?e.classList.add(r):e.className+=" "+r):e.className=r}.bind(null,e)),e}function removeClass(e,r){var s=r;return isArray(r)||(s=r.trim().split(/\s+/)),s.forEach(function(e,r){var s;e.classList?e.classList.remove(r):(s=new RegExp("(?:^|\s)"+r+"(?!\S)","g"),e.className=e.className.replace(s,"").trim())}.bind(null,e)),e}function hasClass(e,r){return!!(e&&"className"in e)&&-1!==e.className.split(/\s+/).indexOf(r)}function nextSiblings(e){for(var r=e.nextSibling,s=[];r;)s.push(r),r=r.nextSibling;return s}function previousSiblings(e){for(var r=e.previousSibling,s=[];r;)s.push(r),r=r.previousSibling;return s}function stop(e){return e.stopPropagation(),e.preventDefault(),e}function first(e,r){return e.querySelector(r)}function append(e,r){var s=frag();return(isArray(r)?r:[r]).forEach(s.appendChild.bind(s)),e.appendChild(s),e}module.exports={el:el,frag:frag,text:text,closest:closest,addClass:addClass,removeClass:removeClass,hasClass:hasClass,nextSiblings:nextSiblings,previousSiblings:previousSiblings,remove:remove,stop:stop,first:first,append:append};

},{"x-is-array":"/Users/mmatyas/projects/finderjs/node_modules/x-is-array/index.js"}]},{},["/Users/mmatyas/projects/finderjs/index.js"])("/Users/mmatyas/projects/finderjs/index.js")
});


'use strict';

/**
 * jQuery wrapper for finderjs
 * @author Mark Matyas
 */

(function jQuery($) {
  var name = 'finderjs';

  $.fn[name] = function _finderjs(data, options) {
    return this.each(function each() {
      if (!$.data(this, '_' + name)) {
        $.data(this, '_' + name, finder(this, data, options));
      }
    });
  };
})(jQuery);
