/*
   Copyright (c) 2012 KT Corp.
  
   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU Lesser General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Lesser General Public License for more details.

   You should have received a copy of the GNU Lesser General Public License
   along with This program.  If not, see <http://www.gnu.org/licenses/>.
*/
(function(global) {

      /**
       * Request option context maker.
       * @private
       * @param {Object} opts Request options
       * @returns {Object} Request context
       */
  var _createRequestOpts = function (opts) {
        opts = tau.mixin({
          // Default Request Options
          type: 'GET',              // 'GET', 'POST', 'JSONP'
          contentType: 'application/x-www-form-urlencoded',
          encoding: 'UTF-8',
          async: true,
          timeout: 5000,            // Default timeout is 5 seconds
          silent: false,            // Does not fire system events
          url: ''                   // URL used to send the request
          /** @param {String} params Parameters used by POST request */
          /** @param {String} username User name for an authentication */
          /** @param {String} password Password for an authentication */
          /** @param {String} callbackParam JSONP callback param key */
        }, opts, true);
        return opts;
      },

      /**
       * Creates equest timeout handler.
       * <p/>
       * Timeout callback handled via request ctx.responseProxy.
       * @private
       * @param {Object} ctx Request context
       * @returns {Number} Timer id if the timeout was set, undefined otherwise
       */
      _createTimeout = function (ctx) {
        if (ctx.timeout > 0) {
          /** Request timed out, notify callback handler 
           * @inner */
          return setTimeout(function () {
            // Timeout Error call by passing in an error response
            if (tau.isFunction(ctx.responseProxy)) {
              ctx.responseProxy(new _Response(408, 'Client Request Timeout'));
            }
          }, ctx.timeout);
        }
        return undefined;
      },

      /**
       * Notifies a runtime system event.
       * @private
       * @param {Object} ctx Request context
       * @param {String} eventName Event name
       */
      _fireSysEvent = function (eventName, ctx) {
        if (!ctx.silent) {
          tau.getRuntime().fireEvent(eventName, ctx.id);
        }
      },

      /**
       * @class
       * A response corresponding to a XML/XSS/Proxy request.
       * @constructs
       * @private
       * @param {Number} status Request status
       * @param {String} statusText Status in string
       * @param {String} contType Content type (e.g. html/text)
       * @param {String} respText Content in text
       * @param {String} respXML Content in XML
       */
      _Response = function (status, statusText, contType, respText, respXML) {
        this.status = status || 0;
        this.statusText = statusText || '';
        this.contentType = contType || '';
        this.responseText = respText || '';
        if (contType && contType.indexOf('application/json') != -1) {
          this.responseJSON = tau.isString(respText) ? tau.parse(respText) : respText;
        } else {
          if (!respXML) {
            respXML = (new DOMParser()).parseFromString(respText);
          }
          this.responseXML = respXML || null;
        }
      };


  /** @lends tau.data.XMLRequest */
  $class('tau.data.XMLRequest').define({
    /**
     * @class
     * XMLHttpRequest wrapped request helper.
     * <p/>
     * System Events Fired:
     * <pre>
     *  Request sent: "requestsent" (tau.rt.Event.REQ_SENT)
     *  Request received: "requestreceived" (tau.rt.Event.REQ_RECEIVED)
     *  Request aborted: "requestaborted" (tau.rt.Event.REQ_ABORTED)
     * </pre>
     * @constructs
     */
    XMLRequest: function (opts) {
      /** @private Default options */
      this._opts = _createRequestOpts(opts);
      /** @private Maps request id to per XMLRequest instance */
      this._registry = {};
    },

    /**
     * Sends a request using XMLHttpRequest.
     * @param {String} url URL to send the 
     * @param {Function} callbackFn Request success/fail callback function
     * @param {Object} opts Overrideable request options
     * @returns {String} Request id
     */
    send: function (url, callbackFn, opts) {
      var that = this,
          ctx = tau.mixin({
        id: tau.genId('xml'),
        req: new XMLHttpRequest(),
        timestamp: new Date().getTime(),
        url: tau.isString(url) ? url : undefined,
        callbackFn: tau.isFunction(callbackFn) ? callbackFn : undefined,

        /**
         * Handles both XHR state changes and native response errors.
         * (will be assigned to XMLHttpRequest.XHR.onreadystatechange)
         * <p/>
         * Note: client-aborted requests must not be handled here because 
         * aborted request must not call the <code>callbackFn</code>.
         * @inner
         * @param {Object} event XHR request or error Response
         */
        responseProxy: function (event) {
          var resp = null;
          if (ctx.req 
              && (ctx.req.readyState === 4 || event instanceof _Response)) {
            ctx.req.onreadystatechange = null; // Avoid timeout race condition 

            if (event instanceof _Response) {
              // Error initiated by the client: abort XHR
              ctx.req.abort();
              resp = event;
            } else {
              // Successfully received response via XHR (status: 200 - 299)
              resp = new _Response(ctx.req.status, ctx.req.statusText, 
                            ctx.req.getResponseHeader('Content-Type'), 
                            ctx.req.responseText, ctx.req.responseXML);
            }
            tau.log.debug('status: ' + resp.statusText + '(' + ctx.id + ')', that);

            if (tau.isFunction(ctx.callbackFn)) {
              ctx.callbackFn(resp);  // Client callback with native response
            }

            ctx.release();
            _fireSysEvent(tau.rt.Event.REQ_RECEIVED, ctx);
          }
        },

        /** Releases all of the request resource for this closure. 
         * @inner */
        release: function () {
          if (ctx.timeoutId) {
            clearTimeout(ctx.timeoutId);
          }
          delete that._registry[ctx.id];
          ctx.req = null; // Prevent closure memory leak on onreadystatechange
        }
      }, tau.mixin(tau.mixin({}, opts), this._opts));
      ctx.req.onreadystatechange = ctx.responseProxy;

      if (ctx.async) {
        this._registry[ctx.id] = ctx; // Async request registration
        ctx.timeoutId = _createTimeout(ctx);
      }

      if (document.URL.indexOf('http://') == -1) {
        throw new Error('Under original scheme of \''
            + document.URL.substring(0, document.URL.indexOf(':') + 3)
            + '\' your request can not be handled as XHR: '
            + ctx.url + this.currentStack());
      }
      // Send XHR request
      try {
        _fireSysEvent(tau.rt.Event.REQ_SENT, ctx);
        if (ctx.url.indexOf('http://') == 0 
            && ctx.url.indexOf('http://' + document.domain) == -1) {
          ctx.referer = ctx.url;  // tunnel proxy
          ctx.url =  './proxy';
        }
        ctx.req.open(ctx.type, ctx.url, ctx.async, ctx.username, ctx.password);
        if (ctx.referer) {
          ctx.req.setRequestHeader('x-tau-uri', ctx.referer);
        }
        ctx.req.setRequestHeader('Content-type', ctx.contentType);
        ctx.req.send(ctx.type.toUpperCase() === 'GET' ? 
						null : tau.url(ctx.url, ctx.params).query());

        // Synchronous response can do callback immediately after
        if (!ctx.async) {
          ctx.callbackFn(new _Response(ctx.req.status, ctx.req.statusText, 
                          ctx.req.getResponseHeader('Content-Type'), 
                          ctx.req.responseText, ctx.req.responseXML));
          _fireSysEvent(tau.rt.Event.REQ_RECEIVED, ctx);
        }
      } catch (ex) {
        // Notify error to client (request abort done in responseProxy)
        ctx.responseProxy(new _Response(400, ex.name + '(' + ex.code + '): ' 
            + ex.message));
      }

      return ctx.id;
    },

    /**
     * Aborts a request previously sent using its id.
     * @param {String} id Request id
     */
    abort: function (id) {
      var ctx = this._registry[id];
      if (ctx) {
        tau.log.debug('aborted (' + ctx.id + ')', this);
        ctx.req.onreadystatechange = null; // Avoid timeout race condition
        ctx.req.abort();
        ctx.release();
        _fireSysEvent(tau.rt.Event.REQ_ABORTED, ctx);
      }
    },

    /** No need to Garbage collect XMLHttpRequest; empty function. */
    gc: tau.emptyFn
  });


  /** @lends tau.data.XSSRequest */
  $class('tau.data.XSSRequest').define({
    /**
     * @class
     * Cross Script loading request helper.
     * <p/>
     * System Events Fired:
     * <pre>
     *  Request sent: "requestsent" (tau.rt.Event.REQ_SENT)
     *  Request received: "requestreceived" (tau.rt.Event.REQ_RECEIVED)
     *  Request aborted: "requestaborted" (tau.rt.Event.REQ_ABORTED)
     * </pre>
     * @constructs
     */
    XSSRequest: function (opts) {
      /** @private Default options */
      this._opts = _createRequestOpts(opts);
      // JSONP namespace Must be globally accessible
      this._opts.jsonpNamespace = this._opts.jsonpNamespace || this.$classname;
      /** @private Maps request id to request per JSONP namespace */
      this._registry = $class.forName(this._opts.jsonpNamespace);
    },

    /**
     * Sends a request using dynamic script loading.
     * @param {String} url URL to send the 
     * @param {Function} callbackFn Request success/fail callback function
     * @param {Object} opts Request options
     * @returns {String} Request id
     */
    send: function (url, callbackFn, opts) {
      var that = this,
          ctx = tau.mixin({
        id: tau.genId('xss'),
        req: new tau.ScriptHelper(),
        timestamp: new Date().getTime(),
        url: tau.isString(url) ? url : undefined,
        callbackFn: tau.isFunction(callbackFn) ? callbackFn : undefined,

        // Mimics xhr.readyState:
        // 0 Uninitialized, 1 Loading, 2 Loaded, 3 Interactive, 4 Complete
        readyState: 0,

        /** Mimics xhr.send(). 
         * @inner */
        send: function () {
          if (ctx.readyState === 0) {
            ctx.readyState = 1; // open() was called successfully

            // Internal request ready, send request via script loading
            ctx.req.ctx.setAttribute('id', ctx.id);
            ctx.req.load(ctx.url, ctx.release);  // called after responseProxy

            ctx.readyState = 2; // The request was successfully sent
            return ctx.id;
          }
          return null;
        },

        /**
         * Uused to process successful responses or errors, and to call 
         * client's <code>callbackFn</code> function.
         * <p/>
         * Mimics the behavior of the <code>XMLHttpRequest</code>'s
         * <code>onreadystatechange</code> function in handling requests. 
         * Accordingly, the XHR states are imitated by the 
         * <code>readyState</code> variable. 
         * <p/>
         * If the <code>_Response</code> instance is the <code>value</code> of 
         * the parameter, an error has occurred to the request. Otherwise, 
         * the <code>value</code> is the actual request sent from the server.
         * <p/>
         * Note: client-aborted requests must not be handled here because 
         * aborted request must not call the <code>callbackFn</code>.
         * @inner
         * @param value {Object} Payload from the server or Error Response
         */
        responseProxy: function (value) {
          var resp = null;
          if (ctx.readyState === 2) {
            ctx.readyState = 3; // Currently receiving data

            if (value instanceof _Response) {
              // Error initiated by the client: cannot abort script load
              resp = value;
            } else {
              // Successfully received response via Proxy (status: 200 - 299)
              if (tau.isString(value)) {
                resp = new _Response(200, 'OK', 'html/text', value, '');
              } else {
                resp = new _Response(200, 'OK', 'application/json', value, '');
              }
            }
            ctx.readyState = 4;
            tau.log.debug('status: ' + resp.statusText + ' (' + ctx.id + ')', that);

            if (tau.isFunction(ctx.callbackFn)) {
              ctx.callbackFn(resp); // Client callback with native response              
            }

            // Must not release req here because script loading cannot be 
            // canceled; the server will eventually execute this callback.
            // Just stop any withstanding timeouts.
            if (ctx.timeoutId) {
              clearTimeout(ctx.timeoutId);
            }
            _fireSysEvent(tau.rt.Event.REQ_RECEIVED, ctx);
          }
        },

        /** Releases all of req's resources.
         * @inner */
        release: function () {
          delete that._registry[ctx.id];
          ctx.req.unload();
          ctx.readyState = 0;
        },

        /**
         * Checks if the request context has timed out.
         * @inner
         * @param {Number} buff Extra buffer in Milliseconds before the timeout 
         */
        isTimedOut: function (buff) {
          return ctx.readyState >= 2 && (new Date().getTime() - ctx.timestamp
              - (buff || 0)) >= ctx.timeout;
        }
      }, tau.mixin(tau.mixin({}, opts), this._opts));

      // XSS is always async: register request ctx and setup timeout
      that._registry[ctx.id] = ctx;
      ctx.timeoutId = _createTimeout(ctx);

      // JSONP requests need callback parameters
      if ('JSONP' === ctx.type.toUpperCase()) {
        ctx.url = tau.url(ctx.url).appendParam(
                    ctx.jsonpCallback || 'callback', 
                    ctx.jsonpNamespace + '.' + ctx.id + '.responseProxy').ctx;
      }
      _fireSysEvent(tau.rt.Event.REQ_SENT, ctx);

      return ctx.send();
    },

    /**
     * Aborts a request previously sent by its id.
     * @param {String} id Request id
     * @ignore 
     */
    abort: function (id) {
      var ctx = this._registry[id];
      if (ctx && ctx.readyState === 2) {
        tau.log.debug('aborted (' + ctx.id + ')', this);
        ctx.readyState = 4;
        if (ctx.timeoutId) {
          clearTimeout(ctx.timeoutId);
        }
        _fireSysEvent(tau.rt.Event.REQ_ABORTED, ctx);
      }
    },

    /**
     * Garbage-collect any unprocessed or withstanding requests.
     * @param buff {Number} Additional timeout buffer
     */
    gc: function (buff) {
      tau.forEach(this._registry, function (i, ctx) {
        if (ctx && tau.isFunction(ctx.isTimedOut) && ctx.isTimedOut(buff)) {
          ctx.release();
        }
      });
    }
  });


  // Default Request Options
  var _DATASOURCEOPTS = {
    remoteSort: false,
    remoteFilter: false,
    
    groupField: undefined,
    getGroupName : undefined,
    groupDir: "ASC",
    dir: "ASC",
    
    pageSize: 25,
    // TODO
    batchUpdateMode: 'operation',
    filterOnLoad: true,
    sortOnLoad: true,
    sorter: undefined,
    
    data: undefined,
    
    proxy : undefined,
    proxyLoad: false,
    req : undefined
  };
  
  var _REQUESTOPTS = {
    type : 'xml', /* xss : XSSRequest, xml : XMLRequest // storage에 대해서도 처리? 우선 보류 */
    url : undefined,
    reader : undefined,
    opt : undefined
  };
  
  // Default Request Options
  var _MODELOPTS = {
    id  : undefined,
    name : undefined,
    mapping : undefined,
    type : 'string',
    defaultValue : null,
    sortType : undefined
  };

  /**
   * @name tau.data
   * @namespace Data Model.
   */
  tau.namespace('tau.data', /** @lends tau.data.prototype */ {
    _MODELMGR: null, // Model manager singleton instance

    /**
     * Singleton Model Manager instance getter.
     * @returns {object} Singleton {@link tau.data.ModelMgr} instance
     */
    getModelMgr: function () {
      if (!this._MODELMGR) {
        this._MODELMGR = new tau.data.ModelMgr();
      }
      return this._MODELMGR;
    },
    
    registerModel: function (modelname, opts) {
      this.getModelMgr().registerModel(modelname, opts);
    }
  });

  //----------------------------------------------------------------------------
  /** @lends tau.data.ModelMgr */
  $class('tau.data.ModelMgr').define({
    /**
     * Constructor
     * @class class definition goes here
     * @constructs
     */
    ModelMgr: function () {
      if (this._MODELMGR) {
        throw new Error(
            'tau.data.ModelMgr: Only one model manager instance may exist!');
      }
      this.types = {};
    },

    /**
     * Registers a model definition. All model plugins marked with
     * isDefault: true are bootstrapped immediately, as are any addition
     * plugins defined in the model config.
     */
    registerModel: function (modelname, opts) {
      var fields = opts || [], key, sorttype, props = {}, 
          model = function () {
        tau.data.Model.prototype.constructor.apply(this, arguments);
      };
      if (tau.isArray(fields)) {
        for ( var i = 0; i < fields.length; i++) {
          key = fields[i];
          sorttype = tau.data.SortTypes;
          if (tau.isString(key)) {
            props[key] = {
              'name': key,
              'sortType': sorttype.asUCString
            };
            props[key] = tau.mixin(props[key], _MODELOPTS);
          } else if (tau.isObject(key)) {

            switch (key['type']) {
            case 'boolean':
              key['sortType'] = sorttype.asUCString;
              break;
            case 'number':
              key['sortType'] = sorttype.asFloat;
              break;
            case 'date':
              key['sortType'] = sorttype.asDate;
              break;
            case 'string':
            default :  
              key['sortType'] = sorttype.asUCString;
              break;
            }
            props[key.name] = tau.mixin(key, _MODELOPTS);
          }
        }
      }
      model = tau.extend(model, tau.data.Model, {
        'fields': props
      });
      this.types[modelname] = model;
      return model;
    },

    create: function (config, name) {
      var con = typeof name == 'function' ? name : this.types[name
          || config.name];
      return new con(config);
    }
  });

  //----------------------------------------------------------------------------
  /** @lends tau.data.Reader */
  $class('tau.data.Reader').define({
    /**
     * Constructor
     * @class class definition goes here
     * @constructs
     */
    Reader: function (rawdata) {
    },
    getItem: function (index){},
    getCount: function (){},
    getTotalCount: function (){return getCount();}
  });


  /**
   * @class tau.data.SortTypes
   * @singleton Defines the default sorting (casting?) comparison functions used
   *            when sorting data.
   */
  tau.data.SortTypes = {
    /**
     * Default sort that does nothing
     * @param {Mixed} s The value being converted
     * @return {Mixed} The comparison value
     */
    none: function (s) {
      return s;
    },

    /**
     * The regular expression used to strip tags
     * @type {RegExp}
     * @property
     */
    stripTagsRE: /<\/?[^>]+>/gi,

    /**
     * Strips all HTML tags to sort on text only
     * @param {Mixed} s The value being converted
     * @return {String} The comparison value
     */
    asText: function (s) {
      return String(s).replace(this.stripTagsRE, "");
    },

    /**
     * Strips all HTML tags to sort on text only - Case insensitive
     * @param {Mixed} s The value being converted
     * @return {String} The comparison value
     */
    asUCText: function (s) {
      return String(s).toUpperCase().replace(this.stripTagsRE, "");
    },

    /**
     * Case insensitive string
     * @param {Mixed} s The value being converted
     * @return {String} The comparison value
     */
    asUCString: function (s) {
      return String(s).toUpperCase();
    },

    /**
     * Date sorting
     * @param {Mixed} s The value being converted
     * @return {Number} The comparison value
     */
    asDate: function (s) {
      if (!s) {
        return 0;
      }
      if (tau.isDate(s)) {
        return s.getTime();
      }
      return Date.parse(String(s));
    },

    /**
     * Float sorting
     * @param {Mixed} s The value being converted
     * @return {Float} The comparison value
     */
    asFloat: function (s) {
      var val = parseFloat(String(s).replace(/,/g, ""));
      return isNaN(val) ? 0 : val;
    },

    /**
     * Integer sorting
     * @param {Mixed} s The value being converted
     * @return {Number} The comparison value
     */
    asInt: function (s) {
      var val = parseInt(String(s).replace(/,/g, ""), 10);
      return isNaN(val) ? 0 : val;
    }
  };

  //----------------------------------------------------------------------------
  /** @lends tau.data.Datasource */
  $class('tau.data.Datasource').extend(tau.rt.EventDelegator).define({
    /**
     * Constructor
     * @class tau.data.Datasource definition goes here
     * @extends tau.rt.EventDelegator
     * @constructs
     */
    Datasource: function (model, opts) {
      this.init(opts);
      if (typeof model == 'string') {
        this.model = tau.data.getModelMgr().types[model];
      }
      this._currentPage = 0,
      /**
       * Temporary cache in which removed model instances are kept until
       * successfully synchronised with a Proxy, at which point this is
       * cleared.
       */
      this._removed = [];

      /**
       * this Datasource's local cache of records
       */
      this._data = tau.mixin(new tau.ItemRegistry(), {
        clear: function (){
          this._registryArray = null;
        },
        
        addItem: function (value, key) {
          var children = this.getArrayItems();
          if (children && tau.arr(children).pushUnique(value)) {
            if (!tau.isUndefined(key)) {
              this._registryMap[key] = value;
            }
            return true;
          }
          return false;
        },

        /**
         * @private Performs the actual sorting based on a
         *          direction and a sorting function.
         *          Internally, this creates a temporary array
         *          of all items in the MixedCollection, sorts
         *          it and then writes the sorted array data
         *          back into this.items and this.keys
         * @param {String} property Property to sort by ('key',
         *        'value', or 'index')
         * @param {String} dir (optional) Direction to sort
         *        'ASC' or 'DESC'. Defaults to 'ASC'.
         * @param {Function} fn (optional) Comparison function
         *        that defines the sort order. Defaults to
         *        sorting by numeric value.
         */
        _sort: function (property, dir, fn) {
          var i, len, dsc = String(dir).toUpperCase() == 'DESC' ? -1
              : 1,

          // this is a temporary array used to apply the sorting
          // function
          c = [], items = this._registryArray;

          // default to a simple sorter function if one is not
          // provided
          fn = fn || function (a, b) {
            return a - b;
          };

          // copy all the items into a temporary array, which we
          // will sort
          for (i = 0, len = items.length; i < len; i++) {
            c[c.length] = {
              value: items[i],
              index: i
            };
          }

          // sort the temporary array
          c.sort(function (a, b) {
            var v = fn(a[property], b[property]) * dsc;
            if (v === 0) {
              v = (a.index < b.index ? -1 : 1);
            }
            return v;
          });

          // copy the temporary array back into the main
          // this.items and this.keys objects
          for (i = 0, len = c.length; i < len; i++) {
            items[i] = c[i].value;
          }
        },

        /**
         * Sorts this collection by <b>item</b> value with the
         * passed comparison function.
         * @param {String} dir (optional) 'ASC' or 'DESC'.
         *        Defaults to 'ASC'.
         * @param {Function} fn (optional) Comparison function
         *        that defines the sort order. Defaults to
         *        sorting by numeric value.
         */
        sort: function (dir, fn) {
          this._sort('value', dir, fn);
        },

        /**
         * Filter the <i>objects</i> in this collection by a
         * specific property. Returns a new collection that has
         * been filtered.
         * @param {String} property A property on your objects
         * @param {String/RegExp} value Either string that the
         *        property values should start with or a RegExp
         *        to test against the property
         * @param {Boolean} anyMatch (optional) True to match
         *        any part of the string, not just the beginning
         * @param {Boolean} caseSensitive (optional) True for
         *        case sensitive comparison (defaults to False).
         * @return {MixedCollection} The new filtered collection
         */
        filter: function (property, value, anyMatch,
            caseSensitive, exactMatch) {
          // we can accept an array of filter objects, or a
          // single filter object - normalize them here
          if (tau.isObject(property)) {
            property = [ property ];
          }

          if (tau.isArray(property)) {
            var filters = [];

            // normalize the filters passed into an array of
            // filter functions
            for ( var i = 0, j = property.length; i < j; i++) {
              var filter = property[i], func = filter.fn, scope = filter.scope
                  || this;

              // if we weren't given a filter function,
              // construct one now
              if (typeof func != 'function') {
                func = this.createFilterFn(filter.property,
                    filter.value, filter.anyMatch,
                    filter.caseSensitive, filter.exactMatch);
              }

              filters.push( {
                fn: func,
                scope: scope
              });
            }

            var fn = this.createMultipleFilterFn(filters);
          } else {
            // classic single property filter
            var fn = this.createFilterFn(property, value,
                anyMatch, caseSensitive, exactMatch);
          }

          return (fn === false ? this : this.filterBy(fn));
        },

        /**
         * @private Returns a filter function used to test a the
         *          given property's value. Defers most of the
         *          work to createValueMatcher
         * @param {String} property The property to create the
         *        filter function for
         * @param {String/RegExp} value The string/regex to
         *        compare the property value to
         * @param {Boolean} anyMatch True if we don't care if
         *        the filter value is not the full value
         *        (defaults to false)
         * @param {Boolean} caseSensitive True to create a
         *        case-sensitive regex (defaults to false)
         * @param {Boolean} exactMatch True to force exact match (^
         *        and $ characters added to the regex). Defaults
         *        to false. Ignored if anyMatch is true.
         */
        createFilterFn: function (property, value, anyMatch,
            caseSensitive, exactMatch) {
          if (tau.isUndefined(value) || value == null) {
            return false;
          }
          value = this.createValueMatcher(value, anyMatch,
              caseSensitive, exactMatch);
          return function (r) {
            return value.test(r[property]);
          };
        },

        createValueMatcher : function (value, anyMatch, caseSensitive, exactMatch) {
          if (!value.exec) { // not a regex
              var er = Ext.escapeRe;
              value = String(value);

              if (anyMatch === true) {
                  value = er(value);
              } else {
                  value = '^' + er(value);
                  if (exactMatch === true) {
                      value += '$';
                  }
              }
              value = new RegExp(value, caseSensitive ? '' : 'i');
           }
           return value;
        },
        
        /**
         * Returns a range of items in this collection
         * @param {Number} startIndex (optional) The starting
         *        index. Defaults to 0.
         * @param {Number} endIndex (optional) The ending index.
         *        Defaults to the last item.
         * @return {Array} An array of items
         */
        getRange: function (start, end) {
          var items = this.items;
          if (items.length < 1) {
            return [];
          }
          start = start || 0;
          end = Math
              .min(typeof end == 'undefined' ? this.length - 1
                  : end, this.length - 1);
          var i, r = [];
          if (start <= end) {
            for (i = start; i <= end; i++) {
              r[r.length] = items[i];
            }
          } else {
            for (i = start; i >= end; i--) {
              r[r.length] = items[i];
            }
          }
          return r;
        }
      }); // end

      if (this._opts.data) {
        this.inlineData = this._opts.data;
        delete this._opts.data;
      }

      if (tau.isUndefined(this._opts.proxy) && 
          tau.isObject(this._opts.req)) {
        this._opts.proxy = this.getProxy();
      } 
    },

    /**
     * Initializes/resets the Datasource. <p/> Null/Undefined parameter
     * will reset the entier datasource state.
     * @param {object} opts Datasource Options
     */
    init: function (opts) {
      /**
       * Datasource Options
       * @private
       */
      this._opts = tau.mixin(opts, _DATASOURCEOPTS);
    },

    getGroups: function () {
      var records = this._data.getArrayItems(), 
          length = records.length, 
          groups = [], pointers = {}, 
          record, groupStr, group, i;

      for (i = 0; i < length; i++) {
        record = records[i];
        groupStr = this.getGroupName(record);
        group = pointers[groupStr];

        if (group == undefined) {
          group = {
            name: groupStr,
            children: []
          };

          groups.push(group);
          pointers[groupStr] = group;
        }

        group.children.push(record);
      }

      return groups;
    },

    /**
     * 그룹핑 String을 return
     */
    getGroupName: function (instance) {
      if (this._opts.getGroupName){
        return this._opts.getGroupName(instance);
      }
      return instance.get(this._opts.groupField);
    },

    /**
     * Returns the Proxy currently attached to this Datasource instance
     * @return {BaseRequset} The Proxy instance
     */
    getProxy: function () {
      if (!this._opts.proxy){
        switch(this._opts.req.type){
        case 'xml':
          this._opts.proxy = new tau.data.XMLRequest();
          break;
        case 'xss':
          this._opts.proxy = new tau.data.XSSRequest();
          break;
        /* TODO : storage 관련된 것도 고려해야함. */  
        }
      }
      this._opts.req = tau.mixin(this._opts.req, _REQUESTOPTS);
      return this._opts.proxy;
    },
    
    /* 
     * @private
     * proxy send의 callback function에서 내부적으로 호출. raw 데이터를 convert를 통해 변경해준다.
     */
    requestCallback: function (resp, reader) {
      // TODO : result 정의해야함.
      var result = resp;
      if (resp.status === 200){
        if (reader)
          result = new reader(resp.responseXML);
        this.fireEvent('dataloadSucess');
      } else {
        this.fireEvent('dataloadFail', resp);
      }
      return result;
    },
    
    /**
     * 데이터를 추가한다.
     * @param {Object} data The data for each model
     * @return {Array} The array of newly created model instances
     */
    add: function (record) {
      if (!(record instanceof tau.data.Model)) {
        record = tau.data.getModelMgr().create(record,
            this.model);
      }
      this._data.addItem(record);
      record._join(this);
      if (this.snapshot) {
        this.snapshot.addItem(record);
      }
      // TODO
      this.fireEvent('add', {scope : this, data : record, index :this._data.length});
      return record;
    },

    /* TODO
     * Proxy에 데이터를 save
     */
    save: function (options){
      
    },
    
    /*
     * Proxy에서 데이터를 load
     */
    load: function (opts) {
      var fn, data, start, limit,
          self = this;
       
      if (opts){
        start = opts.start || 0;
        limit = opts.limit || self._opts.pageSize;
      }
      
      // TODO : option에 대해 상세하게 정의해야함.
      fn = function (resp) {
        
        var curData = [];
        
        tau.log.debug('convert [' + self._opts.req.convert + ']');
        
        data = self.requestCallback(resp, self._opts.req.convert);
        self._count = data.getCount();

        // 데이터를 model에 맞게 변경해준다.
        for(var i=start, j=0; j < limit && i < data.getCount(); i++, j++){
          curData.push(self.add(data.getItem(i)));
        }
        if (tau.isFunction(self._opts.req.doneFn)){
          self._opts.req.doneFn(resp);
        }
        self.fireEvent("dataload", curData);
      };
      
      try {
        this.getProxy().send(this._opts.req.url, fn, 
            this._opts.req.opt);
      } catch(e) {
      }
    },
    
    /**
     * 읽어온 데이터 크기를 반환한다.
     * @return {Number} 데이터 크기
     */
    getCount: function (){
      return this._count;
    },

    /**
     * 읽어올 데이터가 있는지 여부를 반환한다.
     * @return {Boolean} 데이터가 더 있는지 여부
     */
    hasNext: function (){
      return (this._currentPage * this._opts.pageSize) < (this.getCount() - 1);
    },
    
    loadData: function(){
      if (this.inlineData) {
        this.loadInlineData(this.inlineData);
        delete this.inlineData;
      } else if (this._opts.proxyLoad) {
        this.nextPage();
      }
    },
    
    /**
     * Datasource에 직접 지정한 array 데이터를 Model에 맞게 load한다. 
     * @param {Array} data Array of data to load. Any non-model
     *        instances will be cast into model instances first
     * @param {boolean} append True to add the records to the existing
     *        records in the datasource, false to remove the old ones first
     */
    loadInlineData: function (data, append) {
      var model = this.model;
      // make sure each data element is an tau.data.Model instance
      for ( var i = 0, length = data.length; i < length; i++) {
        var record = data[i];

        if (!(record instanceof tau.data.Model)) {
          data[i] = tau.data.getModelMgr().create(record, model);
        }
      }

      this._loadRecords(data, append);
    },

    /**
     * Loads an array of {@tau.data.Model model} instances into the
     * store, fires the datachanged event.
     * @param {Array} records The array of records to load
     * @param {Boolean} add True to add these records to the existing
     *        records, false to remove the Store's existing records
     *        first
     */
    _loadRecords: function (records, add) {
      if (!add) {
        this._data.clear();
      }

      for ( var i = 0, length = records.length; i < length; i++) {
        records[i]._join(this);
      }

      for ( var i = 0, length = records.length; i < length; i++) {
        this._data.addItem(records[i]);
      }
      if (this._opts.filterOnLoad) {
        this.filter();
      }

      if (this._opts.sortOnLoad) {
        this.sort();
      }
      this.fireEvent('dataload', this._data.getArrayItems());
    },
    
    /**
     * @private
     * @param {tau.data.Model} record The model instance that was edited
     */
    afterEdit : function (record) {
      this.fireEvent('edit', {scope : this, data : record});
    },
    
    /**
     * @private
     * @param {tau.data.Model} record The model instance that was edited
     */
    afterCancel : function (record) {
      this.fireEvent('cancel', {scope : this, data : record});
    },

    /**
     * @private
     * @param {tau.data.Model} record The model instance that was edited
     */
    afterCommit : function (record) {
      this.fireEvent('commit', {scope : this, data : record});
    },
    
    /**
     * @param {String} dir The overall direction to sort the data
     *        by. Defaults to "ASC".
     * @param {Boolean} suppressEvent If true, the 'datachanged' event
     *        is not fired. Defaults to false
     */
    sort: function (sorters, dir, suppressEvent) {
      sorters = sorters || this._opts.sorters;
      dir = dir || this._opts.dir;

      if (typeof sorters == 'string') {
        sorters = [ {
          field: sorters,
          dir: dir
        } ];
      }

      this.sortInfo = {
        sorters: sorters,
        dir: dir
      };

      if (this.remoteSort) {
        this.load();
      } else {
        if (sorters == undefined || sorters.length == 0) {
          return;
        }

        var sortFns = [], length = sorters.length, i;

        // create a sorter function for each sorter field/dir
        // combo
        for (i = 0; i < length; i++) {
          sortFns.push(this.createSortFunction(sorters[i].field,
              sorters[i].dir));
        }

        // the direction modifier is multiplied with the result of the
        // sorting functions to provide overall sort direction
        // (as opposed to direction per field)
        var directionModifier = dir.toUpperCase() == "DESC" ? -1
            : 1;

        // create a function which ORs each sorter together to enable
        // multi-sort
        var fn = function (r1, r2) {
          var result = sortFns[0].call(this, r1, r2);

          // if we have more than one sorter, OR any additional sorter
          // functions together
          if (sortFns.length > 1) {
            for ( var i = 1, j = sortFns.length; i < j; i++) {
              result = result || sortFns[i].call(this, r1, r2);
            }
          }

          return directionModifier * result;
        };

        this._data.sort(dir, fn);

        if (!suppressEvent) {
          this.fireEvent('datachanged', this._data.getArrayItems());
        }
      }
    },

    /**
     * @private Creates and returns a function which sorts an array by
     *          the given field and direction
     * @param {String} field The field to create the sorter for
     * @param {String} dir The direction to sort by (defaults to
     *        "ASC")
     * @return {Function} A function which sorts by the field/direction
     *         combination provided
     */
    createSortFunction: function (field, dir) {
      dir = dir || "ASC";
      var directionModifier = dir.toUpperCase() == "DESC" ? -1
          : 1;
      var fields = this.model.prototype.fields, sortType = fields[field].sortType;

      // create a comparison function. Takes 2 records, returns 1 if
      // record 1 is greater,
      // -1 if record 2 is greater or 0 if they are equal
      return function(r1, r2) {
        var v1 = sortType(r1._data[field]), v2 = sortType(r2._data[field]);

        return directionModifier * (v1 > v2 ? 1 : (v1 < v2 ? -1 : 0));
      };
    },

    /**
     * TODO filter 처리해야함.
     * @param {Boolean} suppressEvent If true, the 'datachanged' event
     *        is not fired. Defaults to false
     */
    filter: function (filters, suppressEvent) {
      this._opts.filters = filters || this._opts.filters;

      if (this.remoteFilter) {
        // the read function will pick up the new filters and request
        // the filtered data from the proxy
        this.load();
      } else {
        /**
         * A pristine (unfiltered) collection of the records in this store.
         * This is used to reinstate records when a filter is removed or
         * changed
         * @property snapshot
         */
        this.snapshot = this.snapshot || this._data;
    
        this._data = (this.snapshot || this._data)
            .filter(this._opts.filters);
    
        if (!suppressEvent) {
          this.fireEvent('datachanged', this._data.getArrayItems());
        }
      }
    },

    /**
     * Revert to a view of the Record cache with no filtering applied.
     * @param {Boolean} suppressEvent If <tt>true</tt> the filter is
     *        cleared silently without firing the <code>datachanged</code>
     *        event.
     */
    clearFilter: function (suppressEvent) {
      if (this.isFiltered()) {
        this._data = this.snapshot;
        delete this.snapshot;
    
        if (suppressEvent !== true) {
          this.fireEvent('datachanged', this._data.getArrayItems());
        }
      }
    },
    
    /**
     * Returns true if this store is currently filtered
     * @return {Boolean}
     */
    isFiltered: function () {
      return !!this.snapshot && this.snapshot != this._data;
    },
    
    // PAGING METHODS
    
    /**
     * Loads a given 'page' of data by setting the start and limit values appropriately
     * @param {Number} page The number of the page to load
     */
    loadPage: function (page) {
      this._currentPage = page;
      var returnVal = this.load({
          start: (page - 1) * this._opts.pageSize,
          limit: this._opts.pageSize
      });
    },
    
    /**
     * Loads the next 'page' in the current data set
     */
    nextPage: function () {
        return this.loadPage(this._currentPage + 1);
    },
    
    /**
     * Loads the previous 'page' in the current data set
     */
    previousPage: function () {
      return this.loadPage(this._currentPage - 1);
    }
  });

  /**

   */
  //----------------------------------------------------------------------------
  /** @lends tau.data.Model */
  $class('tau.data.Model').define({
    /**
     * Constructor
     * @class tau.data.Model definition goes here
     * <pre><code>
     * tau.data.registerModel('User', [ 
     *   {
     *     name: 'name',
     *     type: 'string'
     *   },{
     *     name: 'age',
     *     type: 'int'
     *   },{
     *     name: 'phone',
     *     type: 'string'
     *   },{
     *     name: 'alive',
     *     type: 'boolean',
     *     defaultValue: true
     *   }
     * ]};
     * </code></pre>
     * 
     * <pre><code>
     * var user = tau.data.getModelMgr.create( {
     *   name: 'Ed',
     *   age: 24,
     *   phone: '555-555-5555'
     * }, 'User');
     * </code></pre>
     * @constructs
     * @param data
     * @param id
     */
    Model: function (data, id) {

      /**
       * Readonly flag - true if this Record has been modified.
       */
      this._dirty = false;

      /**
       * <tt>true</tt> when the record does not yet exist in a server-side
       * database (see {@link tau.data.Model.markDirty}). Any record which has a real
       * database pk set as its id property is NOT a phantom -- it's real.
       */
      this._phantom = false;

      /**
       * Internal flag used to track whether or not the model instance is
       * currently being edited. Read-only
       */
      this._editing = false;

      //add default field values if present
      var fields = this.fields,
          field, name, prop;
          
      for (prop in fields) {
        field = fields[prop]; 
        name  = field.name;
        mapping = field.mapping;
        
        if (!tau.isUndefined(mapping)){
          data[name] = data[mapping] || field.defaultValue;
          delete data[mapping];
        } else {
          if (data[name] == undefined) {
            data[name] = data[mapping] || field.defaultValue;
          }
        }
      }
      
      this._data = data || {};
      this._data['id'] = id || this._data['id'] || tau.genId('model');
      
      /**
       * Key: value pairs of all fields whose values have changed
       */
      this.modified = null;
    },

    /**
     * data가 변경되었을 경우 dirty flag, 수정된 사항을 저장한다.
     */
    markDirty: function () {
      this._dirty = true;
      this.modified = this.modified || {};
      this.fields.each(function(field) {
        this.modified[field.name] = this._data[field.name];
      }, this);
    },

    /**
     * Returns the unique ID allocated to this model instance as defined by
     * @return {String} The id
     */
    getId: function () {
      return this._data['id'];
    },

    /**
     * Sets the model instance's id field to the given id
     * @param {String} id The new id
     */
    setId: function (id) {
      this._data['id'] = id;
    },

    /**
     * Returns the value of the given field
     * @param {String} field The field to fetch the value for
     * @return {Object} The value
     */
    get: function (field) {
      //tau.log('get : ' + field + '/ data :' + this._data[field], 1, this);
      return this._data[field];
    },

    /**
     * Sets the given field to the given value, marks the instance as dirty
     * @param {String} field The field to set
     * @param {Object} value The value to set
     */
    set: function (field, value) {
      this._dirty = true;
      this.modified = this.modified || {};
      
      if(this.modified[field] === undefined){
        this.modified[field] = this._data[field];
      }
      this._data[field] = value;

      if (!this._editing) {
        this._callDatasource('afterEdit');
      }
    },

    /**
     * Gets a hash of only the fields that have been modified since this
     * Model was created or commited.
     * @return Object
     */
    getChanges: function () {
      var modified = this.modified, changes = {}, field;

      for (field in modified) {
        if (modified.hasOwnProperty(field)) {
          changes[field] = this._data[field];
        }
      }
      return changes;
    },

    /**
     * Returns <tt>true</tt> if the passed field name has been
     * {@link tau.data.Model.modified} since the load or last commit.
     * @param {String} field
     * @return {Boolean}
     */
    isModified: function (field) {
      return !!(this.modified && this.modified.hasOwnProperty(field));
    },

    /**
     * Begin an edit. While in edit mode, no events (e.g.. the <code>update</code> event)
     * are relayed to the containing datasource.
     */
    beginEdit : function (){
      this.editing = true;
      this.modified = this.modified || {};
    },
    
    
    /**
     * data edit한 것을 취소
     * @param {Boolean} silent (optional) True to skip notification of the
     *        owning store of the change (defaults to false)
     */
    cancel: function (silent) {
      var modified = this.modified, field;

      for (field in modified) {
        if (typeof modified[field] != "function") {
          this._data[field] = modified[field];
        }
      }

      this._dirty = false;
      this._editing = false;
      delete this.modified;

      if (silent !== true) {
        this._callDatasource('afterCancel');
      }
    },

    /**
     * edit한 data을 commit
     * @param {Boolean} silent (optional) True to skip notification of the
     *        owning store of the change (defaults to false)
     */
    commit: function (silent) {
      this._dirty = false;
      this._editing = false;

      delete this.modified;

      if (silent !== true) {
        this._callDatasource('afterCommit');
      }
    },

    /**
     * Tells this model instance that it has been added to a Datasource
     * @param {tau.data.Datasource} datasource The datasource that the model
     *        has been added to
     */
    _join: function (datasource) {
      this._datasource = datasource;
    },

    /**
     * Tells this model instance that it has been removed from the
     * Datasource
     * @param {tau.data.Datasource} datasource The datasource to unjoin
     */
    _unjoin: function (datasource) {
      delete this._datasource;
    },

    /**
     * Helper function used by afterEdit, afterCancel and afterCommit.
     * @param {String} fn The function to call on the datasource
     */
    _callDatasource: function (fn) {
      var datasource = this._datasource;

      if (!tau.isUndefined(datasource) && 
          tau.isFunction(datasource[fn])) {
        datasource[fn](this);
      }
    }
  });
})(window);