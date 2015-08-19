/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	__webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	riot = __webpack_require__(2);
	router = __webpack_require__(3);


	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(9);
	riot.mount("*");

	var Route = riot.router.Route,
	    DefaultRoute = riot.router.DefaultRoute,
	    NotFoundRoute = riot.router.NotFoundRoute,
	    RedirectRoute = riot.router.RedirectRoute;

	riot.router.routes([
	  new DefaultRoute({tag: 'todo'}),
	  new Route({tag: 'login'})
	  // new Route({tag: 'users'}).routes([
	  //    new Route({path:'top', tag: 'users-home', api: {text: 'Select a top user'}}),
	  //    new Route({path: '/user/:userId', tag: 'user'}),
	  //    new DefaultRoute({tag: 'users-home', api: {text: 'Select a user'}}),
	  //    new NotFoundRoute({tag: 'not-found'})
	  //  ]),
	  // new NotFoundRoute({tag: 'not-found'}),
	  // new RedirectRoute({from: 'company', to: 'about'}),
	  // new RedirectRoute({from: 'u', to: 'users/user'})
	]);

	riot.router.start();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.2.4, @license MIT, (c) 2015 Muut Inc. + contributors */

	;(function(window, undefined) {
	  'use strict';
	var riot = { version: 'v2.2.4', settings: {} },
	  //// be aware, internal usage

	  // counter to give a unique id to all the Tag instances
	  __uid = 0,

	  // riot specific prefixes
	  RIOT_PREFIX = 'riot-',
	  RIOT_TAG = RIOT_PREFIX + 'tag',

	  // for typeof == '' comparisons
	  T_STRING = 'string',
	  T_OBJECT = 'object',
	  T_UNDEF  = 'undefined',
	  T_FUNCTION = 'function',
	  // special native tags that cannot be treated like the others
	  SPECIAL_TAGS_REGEX = /^(?:opt(ion|group)|tbody|col|t[rhd])$/,
	  RESERVED_WORDS_BLACKLIST = ['_item', '_id', 'update', 'root', 'mount', 'unmount', 'mixin', 'isMounted', 'isLoop', 'tags', 'parent', 'opts', 'trigger', 'on', 'off', 'one'],

	  // version# for IE 8-11, 0 for others
	  IE_VERSION = (window && window.document || {}).documentMode | 0,

	  // Array.isArray for IE8 is in the polyfills
	  isArray = Array.isArray

	riot.observable = function(el) {

	  el = el || {}

	  var callbacks = {},
	      _id = 0

	  el.on = function(events, fn) {
	    if (isFunction(fn)) {
	      if (typeof fn.id === T_UNDEF) fn._id = _id++

	      events.replace(/\S+/g, function(name, pos) {
	        (callbacks[name] = callbacks[name] || []).push(fn)
	        fn.typed = pos > 0
	      })
	    }
	    return el
	  }

	  el.off = function(events, fn) {
	    if (events == '*') callbacks = {}
	    else {
	      events.replace(/\S+/g, function(name) {
	        if (fn) {
	          var arr = callbacks[name]
	          for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
	            if (cb._id == fn._id) arr.splice(i--, 1)
	          }
	        } else {
	          callbacks[name] = []
	        }
	      })
	    }
	    return el
	  }

	  // only single event supported
	  el.one = function(name, fn) {
	    function on() {
	      el.off(name, on)
	      fn.apply(el, arguments)
	    }
	    return el.on(name, on)
	  }

	  el.trigger = function(name) {
	    var args = [].slice.call(arguments, 1),
	        fns = callbacks[name] || []

	    for (var i = 0, fn; (fn = fns[i]); ++i) {
	      if (!fn.busy) {
	        fn.busy = 1
	        fn.apply(el, fn.typed ? [name].concat(args) : args)
	        if (fns[i] !== fn) { i-- }
	        fn.busy = 0
	      }
	    }

	    if (callbacks.all && name != 'all') {
	      el.trigger.apply(el, ['all', name].concat(args))
	    }

	    return el
	  }

	  return el

	}
	riot.mixin = (function() {
	  var mixins = {}

	  return function(name, mixin) {
	    if (!mixin) return mixins[name]
	    mixins[name] = mixin
	  }

	})()

	;(function(riot, evt, win) {

	  // browsers only
	  if (!win) return

	  var loc = win.location,
	      fns = riot.observable(),
	      started = false,
	      current

	  function hash() {
	    return loc.href.split('#')[1] || ''   // why not loc.hash.splice(1) ?
	  }

	  function parser(path) {
	    return path.split('/')
	  }

	  function emit(path) {
	    if (path.type) path = hash()

	    if (path != current) {
	      fns.trigger.apply(null, ['H'].concat(parser(path)))
	      current = path
	    }
	  }

	  var r = riot.route = function(arg) {
	    // string
	    if (arg[0]) {
	      loc.hash = arg
	      emit(arg)

	    // function
	    } else {
	      fns.on('H', arg)
	    }
	  }

	  r.exec = function(fn) {
	    fn.apply(null, parser(hash()))
	  }

	  r.parser = function(fn) {
	    parser = fn
	  }

	  r.stop = function () {
	    if (started) {
	      if (win.removeEventListener) win.removeEventListener(evt, emit, false) //@IE8 - the if()
	      else win.detachEvent('on' + evt, emit) //@IE8
	      fns.off('*')
	      started = false
	    }
	  }

	  r.start = function () {
	    if (!started) {
	      if (win.addEventListener) win.addEventListener(evt, emit, false) //@IE8 - the if()
	      else win.attachEvent('on' + evt, emit) //IE8
	      started = true
	    }
	  }

	  // autostart the router
	  r.start()

	})(riot, 'hashchange', window)
	/*

	//// How it works?


	Three ways:

	1. Expressions: tmpl('{ value }', data).
	   Returns the result of evaluated expression as a raw object.

	2. Templates: tmpl('Hi { name } { surname }', data).
	   Returns a string with evaluated expressions.

	3. Filters: tmpl('{ show: !done, highlight: active }', data).
	   Returns a space separated list of trueish keys (mainly
	   used for setting html classes), e.g. "show highlight".


	// Template examples

	tmpl('{ title || "Untitled" }', data)
	tmpl('Results are { results ? "ready" : "loading" }', data)
	tmpl('Today is { new Date() }', data)
	tmpl('{ message.length > 140 && "Message is too long" }', data)
	tmpl('This item got { Math.round(rating) } stars', data)
	tmpl('<h1>{ title }</h1>{ body }', data)


	// Falsy expressions in templates

	In templates (as opposed to single expressions) all falsy values
	except zero (undefined/null/false) will default to empty string:

	tmpl('{ undefined } - { false } - { null } - { 0 }', {})
	// will return: " - - - 0"

	*/


	var brackets = (function(orig) {

	  var cachedBrackets,
	      r,
	      b,
	      re = /[{}]/g

	  return function(x) {

	    // make sure we use the current setting
	    var s = riot.settings.brackets || orig

	    // recreate cached vars if needed
	    if (cachedBrackets !== s) {
	      cachedBrackets = s
	      b = s.split(' ')
	      r = b.map(function (e) { return e.replace(/(?=.)/g, '\\') })
	    }

	    // if regexp given, rewrite it with current brackets (only if differ from default)
	    return x instanceof RegExp ? (
	        s === orig ? x :
	        new RegExp(x.source.replace(re, function(b) { return r[~~(b === '}')] }), x.global ? 'g' : '')
	      ) :
	      // else, get specific bracket
	      b[x]
	  }
	})('{ }')


	var tmpl = (function() {

	  var cache = {},
	      OGLOB = '"in d?d:' + (window ? 'window).' : 'global).'),
	      reVars =
	      /(['"\/])(?:[^\\]*?|\\.|.)*?\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function\s*\()|([A-Za-z_$]\w*)/g

	  // build a template (or get it from cache), render with data
	  return function(str, data) {
	    return str && (cache[str] || (cache[str] = tmpl(str)))(data)
	  }


	  // create a template instance

	  function tmpl(s, p) {

	    if (s.indexOf(brackets(0)) < 0) {
	      // return raw text
	      s = s.replace(/\n|\r\n?/g, '\n')
	      return function () { return s }
	    }

	    // temporarily convert \{ and \} to a non-character
	    s = s
	      .replace(brackets(/\\{/g), '\uFFF0')
	      .replace(brackets(/\\}/g), '\uFFF1')

	    // split string to expression and non-expresion parts
	    p = split(s, extract(s, brackets(/{/), brackets(/}/)))

	    // is it a single expression or a template? i.e. {x} or <b>{x}</b>
	    s = (p.length === 2 && !p[0]) ?

	      // if expression, evaluate it
	      expr(p[1]) :

	      // if template, evaluate all expressions in it
	      '[' + p.map(function(s, i) {

	        // is it an expression or a string (every second part is an expression)
	        return i % 2 ?

	          // evaluate the expressions
	          expr(s, true) :

	          // process string parts of the template:
	          '"' + s

	            // preserve new lines
	            .replace(/\n|\r\n?/g, '\\n')

	            // escape quotes
	            .replace(/"/g, '\\"') +

	          '"'

	      }).join(',') + '].join("")'

	    return new Function('d', 'return ' + s
	      // bring escaped { and } back
	      .replace(/\uFFF0/g, brackets(0))
	      .replace(/\uFFF1/g, brackets(1)) + ';')

	  }


	  // parse { ... } expression

	  function expr(s, n) {
	    s = s

	      // convert new lines to spaces
	      .replace(/\n|\r\n?/g, ' ')

	      // trim whitespace, brackets, strip comments
	      .replace(brackets(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), '')

	    // is it an object literal? i.e. { key : value }
	    return /^\s*[\w- "']+ *:/.test(s) ?

	      // if object literal, return trueish keys
	      // e.g.: { show: isOpen(), done: item.done } -> "show done"
	      '[' +

	          // extract key:val pairs, ignoring any nested objects
	          extract(s,

	              // name part: name:, "name":, 'name':, name :
	              /["' ]*[\w- ]+["' ]*:/,

	              // expression part: everything upto a comma followed by a name (see above) or end of line
	              /,(?=["' ]*[\w- ]+["' ]*:)|}|$/
	              ).map(function(pair) {

	                // get key, val parts
	                return pair.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/, function(_, k, v) {

	                  // wrap all conditional parts to ignore errors
	                  return v.replace(/[^&|=!><]+/g, wrap) + '?"' + k + '":"",'

	                })

	              }).join('') +

	        '].join(" ").trim()' :

	      // if js expression, evaluate as javascript
	      wrap(s, n)

	  }


	  // execute js w/o breaking on errors or undefined vars

	  function wrap(s, nonull) {
	    s = s.trim()
	    return !s ? '' : '(function(v){try{v=' +

	      // prefix vars (name => data.name)
	      s.replace(reVars, function(s, _, v) { return v ? '(("' + v + OGLOB + v + ')' : s }) +

	      // default to empty string for falsy values except zero
	      '}catch(e){}return ' + (nonull === true ? '!v&&v!==0?"":v' : 'v') + '}).call(d)'
	  }


	  // split string by an array of substrings

	  function split(str, substrings) {
	    var parts = []
	    substrings.map(function(sub, i) {

	      // push matched expression and part before it
	      i = str.indexOf(sub)
	      parts.push(str.slice(0, i), sub)
	      str = str.slice(i + sub.length)
	    })
	    if (str) parts.push(str)

	    // push the remaining part
	    return parts
	  }


	  // match strings between opening and closing regexp, skipping any inner/nested matches

	  function extract(str, open, close) {

	    var start,
	        level = 0,
	        matches = [],
	        re = new RegExp('(' + open.source + ')|(' + close.source + ')', 'g')

	    str.replace(re, function(_, open, close, pos) {

	      // if outer inner bracket, mark position
	      if (!level && open) start = pos

	      // in(de)crease bracket level
	      level += open ? 1 : -1

	      // if outer closing bracket, grab the match
	      if (!level && close != null) matches.push(str.slice(start, pos + close.length))

	    })

	    return matches
	  }

	})()

	/*
	  lib/browser/tag/mkdom.js

	  Includes hacks needed for the Internet Explorer version 9 and bellow

	*/
	// http://kangax.github.io/compat-table/es5/#ie8
	// http://codeplanet.io/dropping-ie8/

	var mkdom = (function (checkIE) {

	  var rootEls = {
	        'tr': 'tbody',
	        'th': 'tr',
	        'td': 'tr',
	        'tbody': 'table',
	        'col': 'colgroup'
	      },
	      GENERIC = 'div'

	  checkIE = checkIE && checkIE < 10

	  // creates any dom element in a div, table, or colgroup container
	  function _mkdom(html) {

	    var match = html && html.match(/^\s*<([-\w]+)/),
	        tagName = match && match[1].toLowerCase(),
	        rootTag = rootEls[tagName] || GENERIC,
	        el = mkEl(rootTag)

	    el.stub = true

	    if (checkIE && tagName && (match = tagName.match(SPECIAL_TAGS_REGEX)))
	      ie9elem(el, html, tagName, !!match[1])
	    else
	      el.innerHTML = html

	    return el
	  }

	  // creates tr, th, td, option, optgroup element for IE8-9
	  /* istanbul ignore next */
	  function ie9elem(el, html, tagName, select) {

	    var div = mkEl(GENERIC),
	        tag = select ? 'select>' : 'table>',
	        child

	    div.innerHTML = '<' + tag + html + '</' + tag

	    child = div.getElementsByTagName(tagName)[0]
	    if (child)
	      el.appendChild(child)

	  }
	  // end ie9elem()

	  return _mkdom

	})(IE_VERSION)

	// { key, i in items} -> { key, i, items }
	function loopKeys(expr) {
	  var b0 = brackets(0),
	      els = expr.trim().slice(b0.length).match(/^\s*(\S+?)\s*(?:,\s*(\S+))?\s+in\s+(.+)$/)
	  return els ? { key: els[1], pos: els[2], val: b0 + els[3] } : { val: expr }
	}

	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}


	/* Beware: heavy stuff */
	function _each(dom, parent, expr) {

	  remAttr(dom, 'each')

	  var tagName = getTagName(dom),
	      template = dom.outerHTML,
	      hasImpl = !!tagImpl[tagName],
	      impl = tagImpl[tagName] || {
	        tmpl: template
	      },
	      root = dom.parentNode,
	      placeholder = document.createComment('riot placeholder'),
	      tags = [],
	      child = getTag(dom),
	      checksum

	  root.insertBefore(placeholder, dom)

	  expr = loopKeys(expr)

	  // clean template code
	  parent
	    .one('premount', function () {
	      if (root.stub) root = parent.root
	      // remove the original DOM node
	      dom.parentNode.removeChild(dom)
	    })
	    .on('update', function () {
	      var items = tmpl(expr.val, parent)

	      // object loop. any changes cause full redraw
	      if (!isArray(items)) {

	        checksum = items ? JSON.stringify(items) : ''

	        items = !items ? [] :
	          Object.keys(items).map(function (key) {
	            return mkitem(expr, key, items[key])
	          })
	      }

	      var frag = document.createDocumentFragment(),
	          i = tags.length,
	          j = items.length

	      // unmount leftover items
	      while (i > j) {
	        tags[--i].unmount()
	        tags.splice(i, 1)
	      }

	      for (i = 0; i < j; ++i) {
	        var _item = !checksum && !!expr.key ? mkitem(expr, items[i], i) : items[i]

	        if (!tags[i]) {
	          // mount new
	          (tags[i] = new Tag(impl, {
	              parent: parent,
	              isLoop: true,
	              hasImpl: hasImpl,
	              root: SPECIAL_TAGS_REGEX.test(tagName) ? root : dom.cloneNode(),
	              item: _item
	            }, dom.innerHTML)
	          ).mount()

	          frag.appendChild(tags[i].root)
	        } else
	          tags[i].update(_item)

	        tags[i]._item = _item

	      }

	      root.insertBefore(frag, placeholder)

	      if (child) parent.tags[tagName] = tags

	    }).one('updated', function() {
	      var keys = Object.keys(parent)// only set new values
	      walk(root, function(node) {
	        // only set element node and not isLoop
	        if (node.nodeType == 1 && !node.isLoop && !node._looped) {
	          node._visited = false // reset _visited for loop node
	          node._looped = true // avoid set multiple each
	          setNamed(node, parent, keys)
	        }
	      })
	    })

	}


	function parseNamedElements(root, tag, childTags) {

	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop || (dom.parentNode && dom.parentNode.isLoop || dom.getAttribute('each')) ? 1 : 0

	      // custom child tag
	      var child = getTag(dom)

	      if (child && !dom.isLoop) {
	        childTags.push(initChildTag(child, dom, tag))
	      }

	      if (!dom.isLoop)
	        setNamed(dom, tag, [])
	    }

	  })

	}

	function parseExpressions(root, tag, expressions) {

	  function addExpr(dom, val, extra) {
	    if (val.indexOf(brackets(0)) >= 0) {
	      var expr = { dom: dom, expr: val }
	      expressions.push(extend(expr, extra))
	    }
	  }

	  walk(root, function(dom) {
	    var type = dom.nodeType

	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return

	    /* element */

	    // loop
	    var attr = dom.getAttribute('each')

	    if (attr) { _each(dom, tag, attr); return false }

	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]

	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }

	    })

	    // skip custom tags
	    if (getTag(dom)) return false

	  })

	}
	function Tag(impl, conf, innerHTML) {

	  var self = riot.observable(this),
	      opts = inherit(conf.opts) || {},
	      dom = mkdom(impl.tmpl),
	      parent = conf.parent,
	      isLoop = conf.isLoop,
	      hasImpl = conf.hasImpl,
	      item = cleanUpData(conf.item),
	      expressions = [],
	      childTags = [],
	      root = conf.root,
	      fn = impl.fn,
	      tagName = root.tagName.toLowerCase(),
	      attr = {},
	      propsInSyncWithParent = []

	  if (fn && root._tag) {
	    root._tag.unmount(true)
	  }

	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop

	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this

	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  this._id = __uid++

	  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)

	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (brackets(/{.*}/).test(val)) attr[el.name] = val
	  })

	  if (dom.innerHTML && !/^(select|optgroup|table|tbody|tr|col(?:group)?)$/.test(tagName))
	    // replace all the yield tags with the tag inner html
	    dom.innerHTML = replaceYield(dom.innerHTML, innerHTML)

	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self

	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      opts[el.name] = tmpl(el.value, ctx)
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[name] = tmpl(attr[name], ctx)
	    })
	  }

	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF)
	        self[key] = data[key]
	    }
	  }

	  function inheritFromParent () {
	    if (!self.parent || !isLoop) return
	    each(Object.keys(self.parent), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = !~RESERVED_WORDS_BLACKLIST.indexOf(k) && ~propsInSyncWithParent.indexOf(k)
	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = self.parent[k]
	      }
	    })
	  }

	  this.update = function(data) {
	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent
	    inheritFromParent()
	    // normalize the tag properties in case an item object was initially passed
	    if (data && typeof item === T_OBJECT) {
	      normalizeData(data)
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)
	    self.trigger('updated')
	  }

	  this.mixin = function() {
	    each(arguments, function(mix) {
	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix
	      each(Object.keys(mix), function(key) {
	        // bind methods to self
	        if (key != 'init')
	          self[key] = isFunction(mix[key]) ? mix[key].bind(self) : mix[key]
	      })
	      // init method will be called automatically
	      if (mix.init) mix.init.bind(self)()
	    })
	  }

	  this.mount = function() {

	    updateOpts()

	    // initialiation
	    if (fn) fn.call(self, opts)

	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)

	    // mount the child tags
	    toggle(true)

	    // update the root adding custom attributes coming from the compiler
	    // it fixes also #1087
	    if (impl.attrs || hasImpl) {
	      walkAttributes(impl.attrs, function (k, v) { root.setAttribute(k, v) })
	      parseExpressions(self.root, self, expressions)
	    }

	    if (!self.parent || isLoop) self.update(item)

	    // internal use only, fixes #403
	    self.trigger('premount')

	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      self.root = root = dom.firstChild

	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) self.root = root = parent.root
	    }
	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  }


	  this.unmount = function(keepRootTag) {
	    var el = root,
	        p = el.parentNode,
	        ptag

	    if (p) {

	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._id == self._id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }

	      else
	        while (el.firstChild) el.removeChild(el.firstChild)

	      if (!keepRootTag)
	        p.removeChild(el)
	      else
	        // the riot-tag attribute isn't needed anymore, remove it
	        p.removeAttribute('riot-tag')
	    }


	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    // somehow ie8 does not like `delete root._tag`
	    root._tag = null

	  }

	  function toggle(isMount) {

	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

	    // listen/unlisten parent (events flow one way from parent to children)
	    if (parent) {
	      var evt = isMount ? 'on' : 'off'

	      // the loop tags will be always in sync with the parent automatically
	      if (isLoop)
	        parent[evt]('unmount', self.unmount)
	      else
	        parent[evt]('update', self.update)[evt]('unmount', self.unmount)
	    }
	  }

	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)


	}

	function setEventHandler(name, handler, dom, tag) {

	  dom[name] = function(e) {

	    var item = tag._item,
	        ptag = tag.parent,
	        el

	    if (!item)
	      while (ptag && !item) {
	        item = ptag._item
	        ptag = ptag.parent
	      }

	    // cross browser event fix
	    e = e || window.event

	    // ignore error on some browsers
	    try {
	      e.currentTarget = dom
	      if (!e.target) e.target = e.srcElement
	      if (!e.which) e.which = e.charCode || e.keyCode
	    } catch (ignored) { /**/ }

	    e.item = item

	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      if (e.preventDefault) e.preventDefault()
	      e.returnValue = false
	    }

	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }

	  }

	}

	// used by if- attribute
	function insertTo(root, node, before) {
	  if (root) {
	    root.insertBefore(before, node)
	    root.removeChild(node)
	  }
	}

	function update(expressions, tag) {

	  each(expressions, function(expr, i) {

	    var dom = expr.dom,
	        attrName = expr.attr,
	        value = tmpl(expr.expr, tag),
	        parent = expr.dom.parentNode

	    if (expr.bool)
	      value = value ? attrName : false
	    else if (value == null)
	      value = ''

	    // leave out riot- prefixes from strings inside textarea
	    // fix #815: any value -> string
	    if (parent && parent.tagName == 'TEXTAREA') value = ('' + value).replace(/riot-/g, '')

	    // no change
	    if (expr.value === value) return
	    expr.value = value

	    // text node
	    if (!attrName) {
	      dom.nodeValue = '' + value    // #815 related
	      return
	    }

	    // remove original attribute
	    remAttr(dom, attrName)
	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)

	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub,
	          add = function() { insertTo(stub.parentNode, stub, dom) },
	          remove = function() { insertTo(dom.parentNode, dom, stub) }

	      // add to DOM
	      if (value) {
	        if (stub) {
	          add()
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted) el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        // if the parentNode is defined we can easily replace the tag
	        if (dom.parentNode)
	          remove()
	        else
	        // otherwise we need to wait the updated event
	          (tag.parent || tag).one('updated', remove)

	        dom.inStub = true
	      }
	    // show / hide
	    } else if (/^(show|hide)$/.test(attrName)) {
	      if (attrName == 'hide') value = !value
	      dom.style.display = value ? '' : 'none'

	    // field value
	    } else if (attrName == 'value') {
	      dom.value = value

	    // <img src="{ expr }">
	    } else if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
	      if (value)
	        dom.setAttribute(attrName.slice(RIOT_PREFIX.length), value)

	    } else {
	      if (expr.bool) {
	        dom[attrName] = value
	        if (!value) return
	      }

	      if (typeof value !== T_OBJECT) dom.setAttribute(attrName, value)

	    }

	  })

	}
	function each(els, fn) {
	  for (var i = 0, len = (els || []).length, el; i < len; i++) {
	    el = els[i]
	    // return false -> remove current item during loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}

	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}

	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}

	function getTag(dom) {
	  return dom.tagName && tagImpl[dom.getAttribute(RIOT_TAG) || dom.tagName.toLowerCase()]
	}

	function initChildTag(child, dom, parent) {
	  var tag = new Tag(child, { root: dom, parent: parent }, dom.innerHTML),
	      tagName = getTagName(dom),
	      ptag = getImmediateCustomParentTag(parent),
	      cachedTag

	  // fix for the parent attribute in the looped elements
	  tag.parent = ptag

	  cachedTag = ptag.tags[tagName]

	  // if there are multiple children tags having the same name
	  if (cachedTag) {
	    // if the parent tags property is not yet an array
	    // create it adding the first cached tag
	    if (!isArray(cachedTag))
	      ptag.tags[tagName] = [cachedTag]
	    // add the new nested tag to the array
	    if (!~ptag.tags[tagName].indexOf(tag))
	      ptag.tags[tagName].push(tag)
	  } else {
	    ptag.tags[tagName] = tag
	  }

	  // empty the child node once we got its template
	  // to avoid that its children get compiled multiple times
	  dom.innerHTML = ''

	  return tag
	}

	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}

	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = dom.getAttribute('name'),
	    tagName = namedTag && namedTag.indexOf(brackets(0)) < 0 ? namedTag : child ? child.name : dom.tagName.toLowerCase()

	  return tagName
	}

	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if ((obj = args[i])) {
	      for (var key in obj) {      // eslint-disable-line guard-for-in
	        src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}

	// with this function we avoid that the current Tag methods get overridden
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION)) return data

	  var o = {}
	  for (var key in data) {
	    if (!~RESERVED_WORDS_BLACKLIST.indexOf(key))
	      o[key] = data[key]
	  }
	  return o
	}

	function walk(dom, fn) {
	  if (dom) {
	    if (fn(dom) === false) return
	    else {
	      dom = dom.firstChild

	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}

	// minimize risk: only zero or one _space_ between attr & value
	function walkAttributes(html, fn) {
	  var m,
	      re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g

	  while ((m = re.exec(html))) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}

	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}

	function mkEl(name) {
	  return document.createElement(name)
	}

	function replaceYield(tmpl, innerHTML) {
	  return tmpl.replace(/<(yield)\/?>(<\/\1>)?/gi, innerHTML || '')
	}

	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}

	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}

	function inherit(parent) {
	  function Child() {}
	  Child.prototype = parent
	  return new Child()
	}

	function setNamed(dom, parent, keys) {
	  if (dom._visited) return
	  var p,
	      v = dom.getAttribute('id') || dom.getAttribute('name')

	  if (v) {
	    if (keys.indexOf(v) < 0) {
	      p = parent[v]
	      if (!p)
	        parent[v] = dom
	      else if (isArray(p))
	        p.push(dom)
	      else
	        parent[v] = [p, dom]
	    }
	    dom._visited = true
	  }
	}

	// faster String startsWith alternative
	function startsWith(src, str) {
	  return src.slice(0, str.length) === str
	}

	/*
	 Virtual dom is an array of custom tags on the document.
	 Updates and unmounts propagate downwards from parent to children.
	*/

	var virtualDom = [],
	    tagImpl = {},
	    styleNode

	function injectStyle(css) {

	  if (riot.render) return // skip injection on the server

	  if (!styleNode) {
	    styleNode = mkEl('style')
	    styleNode.setAttribute('type', 'text/css')
	  }

	  var head = document.head || document.getElementsByTagName('head')[0]

	  if (styleNode.styleSheet)
	    styleNode.styleSheet.cssText += css
	  else
	    styleNode.innerHTML += css

	  if (!styleNode._rendered)
	    if (styleNode.styleSheet) {
	      document.body.appendChild(styleNode)
	    } else {
	      var rs = $('style[type=riot]')
	      if (rs) {
	        rs.parentNode.insertBefore(styleNode, rs)
	        rs.parentNode.removeChild(rs)
	      } else head.appendChild(styleNode)

	    }

	  styleNode._rendered = true

	}

	function mountTo(root, tagName, opts) {
	  var tag = tagImpl[tagName],
	      // cache the inner HTML to fix #855
	      innerHTML = root._innerHTML = root._innerHTML || root.innerHTML

	  // clear the inner html
	  root.innerHTML = ''

	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

	  if (tag && tag.mount) {
	    tag.mount()
	    virtualDom.push(tag)
	    return tag.on('unmount', function() {
	      virtualDom.splice(virtualDom.indexOf(tag), 1)
	    })
	  }

	}

	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else injectStyle(css)
	  }
	  tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}

	riot.mount = function(selector, tagName, opts) {

	  var els,
	      allTags,
	      tags = []

	  // helper functions

	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      list += ', *[' + RIOT_TAG + '="' + e.trim() + '"]'
	    })
	    return list
	  }

	  function selectAllTags() {
	    var keys = Object.keys(tagImpl)
	    return keys + addRiotTags(keys)
	  }

	  function pushTags(root) {
	    var last
	    if (root.tagName) {
	      if (tagName && (!(last = root.getAttribute(RIOT_TAG)) || last != tagName))
	        root.setAttribute(RIOT_TAG, tagName)

	      var tag = mountTo(root,
	        tagName || root.getAttribute(RIOT_TAG) || root.tagName.toLowerCase(), opts)

	      if (tag) tags.push(tag)
	    }
	    else if (root.length) {
	      each(root, pushTags)   // assume nodeList
	    }
	  }

	  // ----- mount code -----

	  if (typeof tagName === T_OBJECT) {
	    opts = tagName
	    tagName = 0
	  }

	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(','))

	    els = $$(selector)
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector

	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }

	  if (els.tagName)
	    pushTags(els)
	  else
	    each(els, pushTags)

	  return tags
	}

	// update everything
	riot.update = function() {
	  return each(virtualDom, function(tag) {
	    tag.update()
	  })
	}

	// @deprecated
	riot.mountTo = riot.mount

	  // share methods for other riot parts, e.g. compiler
	  riot.util = { brackets: brackets, tmpl: tmpl }

	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if (true)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return (window.riot = riot) }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot

	})(typeof window != 'undefined' ? window : void 0);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory(__webpack_require__(2));
		else if(typeof define === 'function' && define.amd)
			define(["riot"], factory);
		else {
			var a = typeof exports === 'object' ? factory(require("riot")) : factory(root["riot"]);
			for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
		}
	})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
		
		var riot = __webpack_require__(1);
		var extend = __webpack_require__(2);
		var error = console && console.error || function () {};
		
		var Router = (function () {
		  function Router() {
		    _classCallCheck(this, Router);
		
		    riot.router = this;
		    riot.observable(this);
		    this.interceptors = [this.processRoute.bind(this)];
		    this.handler = new InitialRoute();
		    this.current = new Context('').response;
		    this.process = this.process.bind(this);
		  }
		
		  Router.prototype.route = function route(handler) {
		    this.handler = handler;
		  };
		
		  Router.prototype.routes = function routes(_routes) {
		    this.route(new Route().routes(_routes));
		  };
		
		  Router.prototype.use = function use(interceptor) {
		    this.interceptors.push(interceptor);
		  };
		
		  Router.prototype.process = function process() {
		    var params = Array.prototype.slice.call(arguments);
		    var context = new Context(params.join('/'));
		    this.processRequest(context);
		    return context;
		  };
		
		  Router.prototype.processRequest = function processRequest(context) {
		    this.processInterceptors(context);
		    return this.processResponse(context);
		  };
		
		  Router.prototype.processResponse = function processResponse(context) {
		    if (this.isRedirect(context)) {
		      return this.processRedirect(context);
		    }
		    var request = context.request;
		    var response = context.response;
		
		    if (!response.redirectTo) {
		      this.current = response;
		      this.trigger('route:updated', response);
		      return context;
		    }
		  };
		
		  Router.prototype.isRedirect = function isRedirect(context) {
		    return !!context.response.redirectTo;
		  };
		
		  Router.prototype.processRedirect = function processRedirect(context) {
		    context.redirectTo(context.response.redirectTo);
		    return this.processRequest(context);
		  };
		
		  Router.prototype.processInterceptors = function processInterceptors(context, preInterceptors, postInterceptors) {
		    var interceptors = (preInterceptors || []).concat(this.interceptors).concat(postInterceptors || []);
		    var next = function next() {
		      if (!context.stop) {
		        var processor = interceptors.shift();
		        var request = context.request;
		        var response = context.response;
		
		        if (processor) return processor(request, response, next, context);
		      }
		      return context;
		    };
		    return next();
		  };
		
		  Router.prototype.processRoute = function processRoute(request, response, next, context) {
		    this.handler.process(request, response, context);
		    return next();
		  };
		
		  Router.prototype.start = function start() {
		    riot.route(this.process);
		    riot.route.start();
		    this.exec();
		  };
		
		  Router.prototype.exec = function exec() {
		    riot.route.exec(this.process);
		  };
		
		  return Router;
		})();
		
		var Context = (function () {
		  function Context(request) {
		    _classCallCheck(this, Context);
		
		    this.request = typeof request === 'string' ? new Request(request) : request;
		    this.response = new Response(this.request);
		    this.redirectStack = [];
		  }
		
		  Context.prototype.redirectTo = function redirectTo(uri) {
		    if (this.redirectStack.indexOf(uri) > -1) throw new Error('Cyclic redirection to ' + uri + '. Stack = ' + this.redirectStack);
		    this.redirectStack.push(uri);
		    this.request = new Request(uri);
		    this.response = new Response(this.request);
		  };
		
		  return Context;
		})();
		
		var Handler = (function () {
		  function Handler() {
		    _classCallCheck(this, Handler);
		  }
		
		  Handler.prototype.matches = function matches(request) {
		    return false;
		  };
		
		  Handler.prototype.process = function process(request, response) {
		    var matcher = this.matches(request);
		    if (!matcher) return this.processNotMatch(request, response);
		    return this.processMatch(request, response, matcher);
		  };
		
		  Handler.prototype.processMatch = function processMatch(request, response, matcher) {
		    response.add(matcher);
		    return true;
		  };
		
		  Handler.prototype.processNotMatch = function processNotMatch(request, response) {
		    return false;
		  };
		
		  Handler.prototype.processRoutes = function processRoutes(request, response, routes) {
		    if (routes && routes.length) {
		      var t = routes.length;
		      for (var i = 0; i < t; i++) {
		        var route = routes[i];
		        if (route.process(request, response)) return true;
		      }
		      return false;
		    }
		  };
		
		  Handler.prototype.createRequest = function createRequest(request, matcher) {
		    return new ChildRequest(request, matcher);
		  };
		
		  return Handler;
		})();
		
		var Route = (function (_Handler) {
		  function Route(options) {
		    _classCallCheck(this, Route);
		
		    _Handler.call(this, options);
		    options = options || {};
		    this.tag = options.tag;
		    this.api = options.api;
		    this.path = options.path;
		    this.name = options.name;
		    this.pathParameterNames = [];
		    var path = (this.path || this.name || this.tag || '').replace(/^\//, '');
		    this.pattern = '^/?' + path.replace(/:([^/]+)/g, (function (ignored, group) {
		      this.pathParameterNames.push(group);
		      return '([^/]+)';
		    }).bind(this)) + '(:?/|$)';
		    this.regex = new RegExp(this.pattern);
		  }
		
		  _inherits(Route, _Handler);
		
		  Route.prototype.routes = function routes(_routes2) {
		    var redirectRoutes = _routes2.filter(function (r) {
		      return r instanceof RedirectRoute;
		    });
		    var defaultRoutes = _routes2.filter(function (r) {
		      return r instanceof DefaultRoute;
		    });
		    var notFoundRoutes = _routes2.filter(function (r) {
		      return r instanceof NotFoundRoute;
		    });
		    var otherRoutes = _routes2.filter(function (r) {
		      return redirectRoutes.indexOf(r) === -1 && defaultRoutes.indexOf(r) === -1 && notFoundRoutes.indexOf(r) === -1;
		    });
		    if (notFoundRoutes.length > 1) error('Can\'t use more than one NotFoundRoute per route. --> ' + (this.name || this.path || this.tag));
		    if (defaultRoutes.length > 1) error('Can\'t use more than one DefaultRoute per route. --> ' + (this.name || this.path || this.tag));
		    this._routes = [].concat(redirectRoutes).concat(otherRoutes).concat(defaultRoutes).concat(notFoundRoutes);
		    return this;
		  };
		
		  Route.prototype.matches = function matches(request) {
		    var matcher = this.regex.exec(request.uri);
		    if (matcher) {
		      var params = {};
		      for (var i in this.pathParameterNames) {
		        var name = this.pathParameterNames[i];
		        params[name] = matcher[parseInt(i, 10) + 1];
		      }
		      return { route: this, tag: this.tag, api: this.api, found: matcher[0], params: params };
		    }
		    return false;
		  };
		
		  Route.prototype.processMatch = function processMatch(request, response, matcher) {
		    var matches = _Handler.prototype.processMatch.call(this, request, response, matcher);
		    this.processRoutes(request, response, matcher);
		    return matches;
		  };
		
		  Route.prototype.processRoutes = function processRoutes(request, response, matcher) {
		    return _Handler.prototype.processRoutes.call(this, _Handler.prototype.createRequest.call(this, request, matcher), response, this._routes);
		  };
		
		  return Route;
		})(Handler);
		
		var InitialRoute = (function (_Route) {
		  function InitialRoute() {
		    _classCallCheck(this, InitialRoute);
		
		    _Route.apply(this, arguments);
		  }
		
		  _inherits(InitialRoute, _Route);
		
		  InitialRoute.prototype.processMatch = function processMatch() {
		    return true;
		  };
		
		  InitialRoute.prototype.processRoutes = function processRoutes(request, response, matcher) {
		    return _Route.prototype.processRoutes.call(this, request, response, this._routes);
		  };
		
		  return InitialRoute;
		})(Route);
		
		var ChildRequest = function ChildRequest(request, matcher) {
		  _classCallCheck(this, ChildRequest);
		
		  this.request = request;
		  this.matcher = matcher;
		  this.uri = this.request.uri.substring(matcher.found.length);
		  this.parentUri = this.request.uri.substring(0, matcher.found.length);
		};
		
		var NotFoundRoute = (function (_Handler2) {
		  function NotFoundRoute(options) {
		    _classCallCheck(this, NotFoundRoute);
		
		    _Handler2.call(this, options);
		    options = options || {};
		    this.tag = options.tag;
		    this.api = options.api;
		  }
		
		  _inherits(NotFoundRoute, _Handler2);
		
		  NotFoundRoute.prototype.matches = function matches(request) {
		    return { route: this, tag: this.tag, api: this.api, found: request.uri };
		  };
		
		  return NotFoundRoute;
		})(Handler);
		
		var RedirectRoute = (function (_Handler3) {
		  function RedirectRoute(options) {
		    _classCallCheck(this, RedirectRoute);
		
		    _Handler3.call(this, options);
		    options = options || {};
		    this.from = options.from;
		    this.to = options.to;
		    this.pattern = '(^/?)' + this.from + '(/|$)';
		    this.regex = new RegExp(this.pattern);
		  }
		
		  _inherits(RedirectRoute, _Handler3);
		
		  RedirectRoute.prototype.process = function process(request, response) {
		    var uri = request.uri.replace(this.regex, '$1' + this.to + '$2');
		    if (uri !== request.uri) {
		      var parent = request.parentUri || '';
		      // Rewrite response.uri & request.uri
		      response.uri = parent + uri;
		      request.uri = uri;
		    }
		  };
		
		  return RedirectRoute;
		})(Handler);
		
		var DefaultRoute = (function (_Handler4) {
		  function DefaultRoute(options) {
		    _classCallCheck(this, DefaultRoute);
		
		    _Handler4.call(this, options);
		    options = options || {};
		    this.tag = options.tag;
		    this.api = options.api;
		  }
		
		  _inherits(DefaultRoute, _Handler4);
		
		  DefaultRoute.prototype.matches = function matches(request) {
		    var uri = request.uri.trim();
		    if (uri === '/' || uri === '') return { route: this, tag: this.tag, api: this.api, found: uri };
		  };
		
		  return DefaultRoute;
		})(Handler);
		
		var Request = function Request(uri) {
		  _classCallCheck(this, Request);
		
		  this.uri = uri;
		};
		
		var Response = (function () {
		  function Response(request) {
		    _classCallCheck(this, Response);
		
		    this.uri = request.uri;
		    this.matches = [];
		    this.params = {};
		  }
		
		  Response.prototype.add = function add(matcher) {
		    this.matches.push(matcher);
		    var params = matcher.params;
		    if (params) {
		      for (var key in params) {
		        if (params.hasOwnProperty(key)) {
		          this.params[key] = params[key];
		        }
		      }
		    }
		  };
		
		  Response.prototype.get = function get(index) {
		    return this.matches[index];
		  };
		
		  Response.prototype.size = function size() {
		    return this.matches.length;
		  };
		
		  Response.prototype.isEmpty = function isEmpty() {
		    return this.matches.length;
		  };
		
		  return Response;
		})();
		
		riot.tag('route', '<router-content></router-content>', function (opts) {
		  this.calculateLevel = (function (target) {
		    var level = 0;
		    if (target.parent) level += this.calculateLevel(target.parent);
		    if (target.opts.__router_level) level += target.opts.__router_level;
		    if (target.__router_tag) level += 1;
		    return level;
		  }).bind(this);
		
		  this.unmountTag = function () {
		    if (this.instance) this.instance.forEach(function (instance) {
		      instance.unmount(true);
		    });
		  };
		
		  this.mountTag = function (tag, api) {
		    this.unmountTag();
		    if (tag) {
		      this.root.replaceChild(document.createElement(tag), this.root.children[0]);
		      this.instance = riot.mount(this.root.children[0], tag, api);
		    }
		  };
		
		  this.updateRoute = (function () {
		    var mount = { tag: null };
		    if (riot.router && riot.router.current) {
		      var response = riot.router.current;
		      if (this.level <= response.size()) {
		        var matcher = response.get(this.level);
		        if (matcher) {
		          var params = matcher.params || {};
		          var api = extend(true, {}, matcher.api, params, { __router_level: this.level });
		          mount = { tag: matcher.tag, api: api };
		        }
		      }
		    }
		    this.mountTag(mount.tag, mount.api);
		  }).bind(this);
		
		  this.__router_tag = 'route';
		  this.level = this.calculateLevel(this);
		  riot.router.on('route:updated', this.updateRoute);
		
		  this.on('unmount', (function () {
		    riot.router.off('route:updated', this.updateRoute);
		    this.unmountTag();
		  }).bind(this));
		});
		
		var router = new Router();
		router.Route = Route;
		router.DefaultRoute = DefaultRoute;
		router.RedirectRoute = RedirectRoute;
		router.NotFoundRoute = NotFoundRoute;
		router._ = { Response: Response, Request: Request };
		
		riot.router = router;
		
		module.exports = router;

	/***/ },
	/* 1 */
	/***/ function(module, exports) {

		module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

	/***/ },
	/* 2 */
	/***/ function(module, exports) {

		'use strict';
		
		var hasOwn = Object.prototype.hasOwnProperty;
		var toStr = Object.prototype.toString;
		
		var isArray = function isArray(arr) {
			if (typeof Array.isArray === 'function') {
				return Array.isArray(arr);
			}
		
			return toStr.call(arr) === '[object Array]';
		};
		
		var isPlainObject = function isPlainObject(obj) {
			if (!obj || toStr.call(obj) !== '[object Object]') {
				return false;
			}
		
			var hasOwnConstructor = hasOwn.call(obj, 'constructor');
			var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
			// Not own constructor property must be Object
			if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
				return false;
			}
		
			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own.
			var key;
			for (key in obj) {/**/}
		
			return typeof key === 'undefined' || hasOwn.call(obj, key);
		};
		
		module.exports = function extend() {
			var options, name, src, copy, copyIsArray, clone,
				target = arguments[0],
				i = 1,
				length = arguments.length,
				deep = false;
		
			// Handle a deep copy situation
			if (typeof target === 'boolean') {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				i = 2;
			} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
				target = {};
			}
		
			for (; i < length; ++i) {
				options = arguments[i];
				// Only deal with non-null/undefined values
				if (options != null) {
					// Extend the base object
					for (name in options) {
						src = target[name];
						copy = options[name];
		
						// Prevent never-ending loop
						if (target !== copy) {
							// Recurse if we're merging plain objects or arrays
							if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
								if (copyIsArray) {
									copyIsArray = false;
									clone = src && isArray(src) ? src : [];
								} else {
									clone = src && isPlainObject(src) ? src : {};
								}
		
								// Never move original objects, clone them
								target[name] = extend(deep, clone, copy);
		
							// Don't bring in undefined values
							} else if (typeof copy !== 'undefined') {
								target[name] = copy;
							}
						}
					}
				}
			}
		
			// Return the modified object
			return target;
		};
		


	/***/ }
	/******/ ])
	});
	;
	//# sourceMappingURL=router.js.map

/***/ },
/* 4 */
/***/ function(module, exports) {

	riot.tag('app', '<route class="ui container app content"></route>', 'class="app"', function(opts) {

	});


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	riot.tag('login', '<form onsubmit="{ login }"> <input name="login_id" type="text" placeholder="login_id"> <input name="password" type="password" placeholder="password"> <button>login</button> </form>', function(opts) {

	  var request = __webpack_require__(6)
	  this.login = function() {
	    params = {
	      login_id: this.login_id.value,
	      password: this.password.value
	    };
	    request.post('https://wizpra.card.wizpra.com/api/session')
	      .send(params)
	      .end(function(err,json) {
	        console.log(json)
	        riot.route('#/home');
	      });
	  }.bind(this);


	});


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Emitter = __webpack_require__(7);
	var reduce = __webpack_require__(8);

	/**
	 * Root reference for iframes.
	 */

	var root = 'undefined' == typeof window
	  ? (this || self)
	  : window;

	/**
	 * Noop.
	 */

	function noop(){};

	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isHost(obj) {
	  var str = {}.toString.call(obj);

	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}

	/**
	 * Determine XHR.
	 */

	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  return false;
	};

	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */

	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(obj) {
	  return obj === Object(obj);
	}

	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */

	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    if (null != obj[key]) {
	      pairs.push(encodeURIComponent(key)
	        + '=' + encodeURIComponent(obj[key]));
	    }
	  }
	  return pairs.join('&');
	}

	/**
	 * Expose serialization method.
	 */

	 request.serializeObject = serialize;

	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */

	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var parts;
	  var pair;

	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    parts = pair.split('=');
	    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
	  }

	  return obj;
	}

	/**
	 * Expose parser.
	 */

	request.parseString = parseString;

	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */

	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};

	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */

	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };

	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */

	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};

	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;

	  lines.pop(); // trailing CRLF

	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }

	  return fields;
	}

	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function type(str){
	  return str.split(/ *; */).shift();
	};

	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function params(str){
	  return reduce(str.split(/ *; */), function(obj, str){
	    var parts = str.split(/ *= */)
	      , key = parts.shift()
	      , val = parts.shift();

	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};

	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */

	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  this.setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this.setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this.parseBody(this.text ? this.text : this.xhr.response)
	    : null;
	}

	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};

	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */

	Response.prototype.setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);

	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};

	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */

	Response.prototype.parseBody = function(str){
	  var parse = request.parse[this.type];
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};

	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */

	Response.prototype.setStatusProperties = function(status){
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }

	  var type = status / 100 | 0;

	  // status / class
	  this.status = status;
	  this.statusType = type;

	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;

	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};

	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */

	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;

	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;

	  return err;
	};

	/**
	 * Expose `Response`.
	 */

	request.Response = Response;

	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */

	function Request(method, url) {
	  var self = this;
	  Emitter.call(this);
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {};
	  this._header = {};
	  this.on('end', function(){
	    var err = null;
	    var res = null;

	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      return self.callback(err);
	    }

	    self.emit('response', res);

	    if (err) {
	      return self.callback(err, res);
	    }

	    if (res.status >= 200 && res.status < 300) {
	      return self.callback(err, res);
	    }

	    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	    new_err.original = err;
	    new_err.response = res;
	    new_err.status = res.status;

	    self.callback(new_err, res);
	  });
	}

	/**
	 * Mixin `Emitter`.
	 */

	Emitter(Request.prototype);

	/**
	 * Allow for extension
	 */

	Request.prototype.use = function(fn) {
	  fn(this);
	  return this;
	}

	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.timeout = function(ms){
	  this._timeout = ms;
	  return this;
	};

	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.clearTimeout = function(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};

	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */

	Request.prototype.abort = function(){
	  if (this.aborted) return;
	  this.aborted = true;
	  this.xhr.abort();
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};

	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};

	/**
	 * Remove header `field`.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};

	/**
	 * Get case-insensitive header `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 */

	Request.prototype.getHeader = function(field){
	  return this._header[field.toLowerCase()];
	};

	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.auth = function(user, pass){
	  var str = btoa(user + ':' + pass);
	  this.set('Authorization', 'Basic ' + str);
	  return this;
	};

	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/

	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};

	/**
	 * Write the field `name` and `val` for "multipart/form-data"
	 * request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} name
	 * @param {String|Blob|File} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.field = function(name, val){
	  if (!this._formData) this._formData = new root.FormData();
	  this._formData.append(name, val);
	  return this;
	};

	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.attach = function(field, file, filename){
	  if (!this._formData) this._formData = new root.FormData();
	  this._formData.append(field, file, filename);
	  return this;
	};

	/**
	 * Send `data`, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // querystring
	 *       request.get('/search')
	 *         .end(callback)
	 *
	 *       // multiple data "writes"
	 *       request.get('/search')
	 *         .send({ search: 'query' })
	 *         .send({ range: '1..5' })
	 *         .send({ order: 'desc' })
	 *         .end(callback)
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"})
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	  *      request.post('/user')
	  *        .send('name=tobi')
	  *        .send('species=ferret')
	  *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.send = function(data){
	  var obj = isObject(data);
	  var type = this.getHeader('Content-Type');

	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    if (!type) this.type('form');
	    type = this.getHeader('Content-Type');
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }

	  if (!obj || isHost(data)) return this;
	  if (!type) this.type('json');
	  return this;
	};

	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */

	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};

	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */

	Request.prototype.crossDomainError = function(){
	  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
	  err.crossDomain = true;
	  this.callback(err);
	};

	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */

	Request.prototype.timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};

	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */

	Request.prototype.withCredentials = function(){
	  this._withCredentials = true;
	  return this;
	};

	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var query = this._query.join('&');
	  var timeout = this._timeout;
	  var data = this._formData || this._data;

	  // store callback
	  this._callback = fn || noop;

	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;

	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }

	    if (0 == status) {
	      if (self.timedout) return self.timeoutError();
	      if (self.aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };

	  // progress
	  var handleProgress = function(e){
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    self.emit('progress', e);
	  };
	  if (this.hasListeners('progress')) {
	    xhr.onprogress = handleProgress;
	  }
	  try {
	    if (xhr.upload && this.hasListeners('progress')) {
	      xhr.upload.onprogress = handleProgress;
	    }
	  } catch(e) {
	    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	    // Reported here:
	    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	  }

	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }

	  // querystring
	  if (query) {
	    query = request.serializeObject(query);
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }

	  // initiate request
	  xhr.open(this.method, this.url, true);

	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;

	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
	    // serialize stuff
	    var contentType = this.getHeader('Content-Type');
	    var serialize = request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (serialize) data = serialize(data);
	  }

	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }

	  // send stuff
	  this.emit('request', this);
	  xhr.send(data);
	  return this;
	};

	/**
	 * Faux promise support
	 *
	 * @param {Function} fulfill
	 * @param {Function} reject
	 * @return {Request}
	 */

	Request.prototype.then = function (fulfill, reject) {
	  return this.end(function(err, res) {
	    err ? reject(err) : fulfill(res);
	  });
	}

	/**
	 * Expose `Request`.
	 */

	request.Request = Request;

	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */

	function request(method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new Request('GET', method).end(url);
	  }

	  // url first
	  if (1 == arguments.length) {
	    return new Request('GET', method);
	  }

	  return new Request(method, url);
	}

	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.del = function(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * Expose `request`.
	 */

	module.exports = request;


/***/ },
/* 7 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks[event] = this._callbacks[event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  var self = this;
	  this._callbacks = this._callbacks || {};

	  function on() {
	    self.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks[event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks[event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks[event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks[event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	
	/**
	 * Reduce `arr` with `fn`.
	 *
	 * @param {Array} arr
	 * @param {Function} fn
	 * @param {Mixed} initial
	 *
	 * TODO: combatible error handling?
	 */

	module.exports = function(arr, fn, initial){  
	  var idx = 0;
	  var len = arr.length;
	  var curr = arguments.length == 3
	    ? initial
	    : arr[idx++];

	  while (idx < len) {
	    curr = fn.call(null, curr, arr[idx], ++idx, arr);
	  }
	  
	  return curr;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	riot.tag('todo', '<h3>{ opts.title }</h3> <form onsubmit="{ add }"> <input name="input" onkeyup="{ edit }"> <button __disabled="{ !text }">Add</button> </form> <ul> <li each="{ items }"> <label class="{ completed: done }"> <input type="checkbox" __checked="{ done }" onclick="{ parent.toggle }"> { title } </label> </li> </ul>', function(opts) {
	    this.disabled = true;

	    this.items = opts.items;
	    console.log(this.items);

	    if(this.items===undefined) {
	      this.items = []
	    }

	    this.edit = function(e) {
	      this.text = e.target.value
	    }
	    this.add = function(e) {
	      riot.route('customers/267393/edit')
	      if (this.text) {
	        this.items.push({ title: this.text })
	        this.text = this.input.value = ''
	      }
	    }

	    this.toggle = function (e) {
	      var item = e.item
	      item.done = !item.done
	      return true
	    }
	  
	});


/***/ }
/******/ ]);