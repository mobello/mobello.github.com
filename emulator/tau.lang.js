/*
 * tau.lang.js   1.0.0   10/04/20
 *
 * Copyright 2006 KT Innotz, Inc. All rights reserved.
 * KT INNOTZ PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
(function (global) {
  if (typeof tau === 'undefined') {
    /**
     * Tau Framework Root Namespace
     * @namespace tau
     */
    tau = {
      version: '1.0'
    };
  }


  /*----------------------------------------------------------- [PRIVATE] ---*/

  /** Namespace RegExp @private */
  var _NSREGEXP = /^[\w]+(\.[\w]+)*$/;

  /**
   * JavaScript typeof operator mapping to Normalized types.
   * @private
   * @param {object} type JavaScript typeof result
   * @returns {string} Normalized object type
   */
  var _mapType = function (type) {
    // Filter non-normalized types (note: typeof 'object' is not discrete)
    switch (type) {
    case 'undefined':
      return tau.lang.type.UNDEFINED;
    case 'boolean':
      return tau.lang.type.BOOLEAN;
    case 'number':
      return tau.lang.type.NUMBER;
    case 'string':
      return tau.lang.type.STRING;
    case '[object Array]':
      return tau.lang.type.ARRAY;
    case '[object Date]':
      return tau.lang.type.DATE;
    case '[object Error]':
      return tau.lang.type.ERROR;
    case '[object Function]':
      return tau.lang.type.FUNCTION;
    case '[object RegExp]':
      return tau.lang.type.REGEXP;
    default:
    }
    // All other cases need additional type check
    return undefined;
  };


  /*------------------------------------------------ DEFINITIONS [PUBLIC] ---*/
  
  /**
   * JavaScript Language-specific Module
   * <p/>
   * Handles type checking, object validation, inheritance, and augmentation.
   * @namespace tau.lang
   * @version 0.1
   * @author <a href="mailto:johnlee@ktinnotz.com">John Lee</a>
   * <pre>
   * Types
   *   type.*:        Normalized JavaScript types.
   *
   * Functions
   *   typeOf:        Normalized typeof function
   *   isUndefined:   Checks if an object is undefined
   *   isNull:        Checks if an object is null
   *   isNumber:      Checks if an object is a number
   *   isBoolean:     Checks if an object is boolean
   *   isFunction:    Checks if an object is a function (class)
   *   isObject:      Checks if an object is an instance or a function
   *   isInstance:    Checks if an object is an instance; fails for functions
   *   isDate:        Checks if an object is a date
   *   isValue:       Checks if an object is valid value: Not undefined/null/NaN
   *   isArray:       Checks if an object is a array
   *   isElement:     Checks if an object is a DOM element
   *   isHash:        Checks if an object is a Hash
   *   isNamespace:   Checks if a string is a valid namespace
   *   emptyFn:       No operation function
   *   namespace:     Creates namespace objects
   *   clone:         Clones a new instance of the parameter
   *   extend:        Extends the parent class properties to the child class
   *   mixin:         Mixes object/class properties to an object instance/class
   *   augment:       Augments class properties to an object instance/class
   * </pre>
   */
  tau.lang = {

    /**
     * Normalized typeof function that returns a consistent type of the object 
     * in string type.
     * <p/> 
     * For instance, JavaScript's native typeof operator will return 'object'
     * for null and '[object Function]' for functions.
     * @param {object} obj JavaScript object
     * @returns {string} Normalized object type
     * @example tau.lang.typeOf(null) === 'null'
     */
    typeOf: function (obj) {
      return _mapType(typeof obj)
          || _mapType((Object.prototype.toString.call(obj)))
          || (obj ? tau.lang.type.OBJECT : tau.lang.type.NULL);
    },

    /**
     * Checks if an object is undefined.
     * @param {object} obj JavaScript object
     * @returns {boolean} true if object is undefined
     */
    isUndefined: function (obj) {
      return (typeof obj) === tau.lang.type.UNDEFINED;
    },

    /**
     * Checks if an object is null.
     * @param {object} obj JavaScript object
     * @returns {boolean} true if object is null
     */
    isNull: function (obj) {
      return obj === null;
    },

    /**
     * Checks if an object is a number.
     * @param {object} obj JavaScript object
     * @returns {boolean} true if object is a number
     */
    isNumber: function (obj) {
      return (typeof obj) === tau.lang.type.NUMBER && isFinite(obj);
    },

    /**
     * Checks if an object is a boolean.
     * @param {object} obj JavaScript object
     * @returns {boolean} true if object is a boolean
     */
    isBoolean: function (obj) {
      return (typeof obj) === tau.lang.type.BOOLEAN;
    },

    /**
     * Checks if an object is a string.
     * @param {object} obj JavaScript object
     * @returns {boolean} true if object is a string
     */
    isString: function (obj) {
      return (typeof obj) === tau.lang.type.STRING;
    },

    /**
     * Checks if an object is a function (class).
     * @param {object} obj JavaScript object
     * @returns {boolean} true if object is a function
     */
    isFunction: function (obj) {
      return tau.lang.typeOf(obj) === tau.lang.type.FUNCTION;
    },

    /**
     * Checks if an object is an instance or a function.
     * @param {object} obj JavaScript object
     * @returns {boolean} true if the parameter is an object or a function
     */
    isObject: function (obj) {
      return (obj && ((typeof obj === tau.lang.type.OBJECT) 
          || tau.lang.isFunction(obj))) || false;
    },

    /**
     * Checks if an object is an instance; fails for functions 
     * (i.e. uses the new operator).
     * @param {object} obj JavaScript object
     * @returns {boolean} true if the parameter is an object instance
     */
    isInstance: function (obj) {
      return (obj && ((typeof obj) === tau.lang.type.OBJECT)) || false;
    },

    /**
     * Checks if an object is a date.
     * @param {object} obj JavaScript object
     * @returns {boolean} true if object is a date
     */
    isDate: function (obj) {
      return tau.lang.typeOf(obj) === tau.lang.type.DATE;
    },

    /**
     * Checks if an object is valid value: Not undefined/null/NaN.
     * @param {object} obj JavaScript object
     * @returns {boolean} true if object is not undefined, null, or NaN.
     */
    isValue: function (obj) {
      var t = tau.lang.typeOf(obj);
      switch (t) {
      case tau.lang.type.UNDEFINED:
      case tau.lang.type.NULL:
        return false;
      case tau.lang.type.NUMBER:
        return isFinite(obj);
      default:
      }
      return !!(t);
    },

    /**
     * Checks if an object is a array.
     * @param {object} obj JavaScript object
     * @param {boolean} relaxed Less rigorous check (e.g. allows inheritance)
     * @returns {boolean} true if object is an array
     */
    isArray: function (obj, relaxed) {
      if (!relaxed) {
        return tau.lang.typeOf(obj) === tau.lang.type.ARRAY;
      } else if (obj) {
        // Handles arrays inheritance and arrays from external frame/window
        var methods = typeof obj === tau.lang.type.OBJECT
            && typeof obj.length === tau.lang.type.NUMBER
            && typeof obj.splice === tau.lang.type.FUNCTION
            && !(obj.propertyIsEnumerable('length'));
        return methods || (obj instanceof Array);
      }
      return false;
    },

    /**
     * Checks if an object is a DOM element.
     * @param {object} obj JavaScript object
     * @returns {boolean} true if object is a DOM element
     */
    isElement: function (obj) {
      return !!(obj && obj.nodeType === 1);
    },

    /**
     * Checks if an object is a Hash.
     * @param {object} obj JavaScript object
     * @returns {boolean} true if object is a Hash
     */
    isHash: function (obj) {
      return obj instanceof Hash;
    },

    /**
     * Checks if a string is a namespace format.
     * @param {string} ns Namespace
     * @returns {boolean} True if the parameter is a valid namespace
     */
    isNamespace: function (ns) {
      return tau.lang.isString(ns) && _NSREGEXP.test(ns);
    },

    /**
     * Empty Function that does no operation.
     * <p/>
     * Used to disable previously declared function without causing errors.
     */
    emptyFn: function () {
    },

    /**
     * Declares a namespace.
     * <p/>
     * An undefined namespace and any of its sub parts will be declared without
     * overwriting any previously defined namespaces hierarchy.
     * <p/>
     * An exception occurs if the namespace syntax is incorrect or a function
     * attempts to overwrite an existing namespace. 
     * @param {string} ns Namespace declaration
     * @param {object|function} attach Properties/Function to add to namespace
     * @param {boolean} overwrite Overwrites existing namespace
     * @returns {boolean} true if at least one namespace part was modified
     * @throws {Error} Invalid namespace format or overwrite existing namespace
     */
    namespace: function (ns, attach, overwrite) {
      if (!tau.lang.isNamespace(ns)) {
        throw new SyntaxError('tau.lang.namespace: invalid namespace, ' + ns);
      }

      var i, len,
          modified = false, 
          parent = global,
          parts = ns.split('.'),
          isFn = tau.lang.isFunction(attach);
      // Validate each namespace parts (create one if it doesn't exist)
      for (i = 0, len = isFn ? parts.length - 1 : parts.length; i < len; i++) {
        if (typeof parent[parts[i]] === 'undefined') {
          parent[parts[i]] = {};
          modified = true;
        } else if (!overwrite && tau.lang.isFunction(parent[parts[i]]) 
            && i < len - 1) {
          // Any parent part in the namespace must not be a function
          throw new Error('tau.lang.namespace: \"' + parts.slice(0, i + 1)
              .join('.') + '\" function was previously defined in hierarchy');
        }
        parent = parent[parts[i]];
      }

      if (isFn) {
        // Function assignment for the last portion of namespace
        if (overwrite || typeof parent[parts[i]] === 'undefined') {
          parent[parts[i]] = attach;
          modified = true;
        } else {
          throw new Error('tau.lang.namespace: \"' + ns + '\" definition ' 
              + ' already exists, cannot be overridden');
        }
      } else {
        // Attach properties to the final part of namespace; does not overwrite
        for (i in attach) {
          if (typeof parent[i] === 'undefined' && attach.hasOwnProperty(i)) {
            parent[i] = attach[i];
            modified = true;
          }
        }
      }

      return modified;
    },
    
    /**
     * Clones a new instance of the parameter.
     * @param {object} obj Object to be cloned (Function, Arrays, Dates, RegExp) 
     * @param {boolean} deep Recursively deep copy inner property instances
     * @returns {object} New cloned version of the parameter
     */
    clone: function (obj, deep) {
      var F, cloned, p, isArray, t = tau.lang.typeOf(obj);
      switch (t) {
      case tau.lang.type.OBJECT:
        /** @inner */
        F = function () {};
        F.prototype = obj;
        cloned = new F; // Shallow clone
        break;
      case tau.lang.type.FUNCTION:
        /** @inner */
        F = function () {
          obj.apply(this, arguments);
        };
        F.prototype = obj.prototype;
        return F;
      case tau.lang.type.ARRAY:
        cloned = [];
        isArray = true;
        break;
      case tau.lang.type.DATE:
        return new Date(obj);
      case tau.lang.type.REGEXP:
        return new RegExp(obj.source);
      default:
        return obj;
      }

      // Recursively deep copy arrays and undefined properties
      if (deep || isArray) {
        for (p in obj) {
          if (isArray || obj.hasOwnProperty(p)) {
            cloned[p] = tau.lang.clone(obj[p], deep);
          }
        }
      }
      return cloned;
    },

    /**
     * Extends the parent class properties to the child class.
     * <p/>
     * New properties and methods must be provided by the <code>props</code> 
     * parameter; any parent properties with the identical name in the class
     * hierarchy will be overridden in the child class.
     * <p/>
     * Additionally, extended class will have a <code>superclass</code> 
     * property to access its parent methods and properties.
     * <p/>
     * Note that the child class must call the parent constructor in its own
     * constructor to property inherit declaration made by the parent.
     * @example
     * function tau.example.MySubClass() {
     *   tau.example.MySubClass.superclass.constructor.apply(this, arguments);
     * }
     * tau.lang.extend(tau.example.MySubClass, tau.example.MyClass);
     * @param {object} child Child/Sub class to apply properties to
     * @param {object} parent Parent/Super class to inherit properties from
     * @param {object} props Properties to add/override to the child class
     * @returns {object} New extended class with the applied properties
     * @throws {Error} Parent/child parameter must be classes (functions).
     */
    extend: function (child, parent, props) {
      // Only allow Classes (functions) as parameters
      if (!tau.lang.isFunction(child) || !tau.lang.isFunction(parent)) {
        throw new Error('tau.lang.extend: parameters must be classes.');
      }

      // Create prototype inheritance references for the child class
      /** @inner */
      var p,
          F = function () {};
      F.prototype = parent.prototype;
      child.prototype = new F();
      child.prototype.constructor = child;

      // Child class can call parent's methods via the superclass property.
      // If the parent's constructor is the Object itself, we must reassign
      // the constructor to itself for proper super call
      child.superclass = parent.prototype;
      if (parent != Object
          && parent.prototype.constructor == Object.prototype.constructor) {
        parent.prototype.constructor = parent;
      }

      // Add/Override extended functions the child class
      for (p in props) {
        if (props.hasOwnProperty(p)) {
          child.prototype[p] = props[p];
        }
      }

      return child;
    },

    /**
     * Mixes object/class properties to an object instance/class.
     * <p/>
     * Mixing an object instance will give the source properties only to that 
     * instance object.  Mixing an object prototype will give properties to 
     * all instances derived by from that object via the new operator.
     * @param {object} dest Destination object/class to apply the properties to
     * @param {object} src Source object/class to receive the properties from
     * @param {boolean} override Override existing properties to destination
     * @param {array} srcApplyList List of property names to filter
     * @returns {object} Destination object/class with the applied properties
     * @throws {Error} Destination/source parameters must not be invalid
     */
    mixin: function (dest, src, override, srcApplyList) {
      // Invalid parameter check
      if (!src) {
        throw new Error('tau.lang.mixin: invalid source parameter.');
      }
      dest = dest || {};

      var i, len, p;
      if (tau.lang.isArray(srcApplyList)) {
        // Only apply properties in the mix list
        for (i = 0, len = srcApplyList.length; i < len; i++) {
          p = srcApplyList[i];
          if (p in src) {
            // Copies properties on override or if it doesn't already exist
            if (override || !(p in dest)) {
              dest[p] = src[p];
            }
          }
        }
      } else {
        // Copy properties on override or if it doesn't already exist
        for (p in src) {
          if (override || !(p in dest)) {
            dest[p] = src[p];
          }
        }
      }
      return dest;
    },

    /**
     * Augments class properties to an object instance/class.
     * <p/>
     * Augmenting an object instance will give properties only to that 
     * instance. Augmenting an object's prototype will give the properties 
     * to all instances derived by from that object via the new operator.
     * <p/>
     * Additionally, the augmented class' constructor will be called via 
     * proxy upon any one of its function call.
     * @param {object} dest Destination object/class to apply the properties to
     * @param {object} src Source class to receive the properties from
     * @param {boolean} override Override existing properties to destination
     * @param {array} srcApplyList List of property names to filter
     * @returns {object} Destination object/class with the applied properties
     * @throws {Error} Destination/source parameters must not be invalid
     */
    augment: function (dest, src, override, srcApplyList) {
      var p, srcProp, makeProxyFn, proxyFn, originalFn,
          isDestProto = tau.lang.isObject(dest.prototype),
          destProto = dest.prototype,
          destTarget = dest.prototype || dest,
          srcProto = src.prototype;

      // Prototype augmentation: make proxy functions to call constructor
      if (isDestProto && src) {
        proxyFn = {};
        originalFn = {};
        makeProxyFn = function (m) {
          // Proxy members functions for each original member
          // calls the constructor when any of the original members are called
          // when proxyFn[m] is called: this = object instance
          proxyFn[m] = function () {
            // Since we're going to call the constructor, we must re-attach
            // all the original properties
            for (var i in originalFn) {
              if (originalFn.hasOwnProperty(i) && (this[i] === proxyFn[i])) {
                this[i] = originalFn[i];
              }
            }
            src.apply(this); // src constructor
            return originalFn[m].apply(this, arguments); // original function
          };
          return proxyFn[m];
        };

        // Iterate through source properties and create/attach proxy properties
        for (p in srcProto) {
          if (srcProto.hasOwnProperty(p)) {
            if ((!srcApplyList || (p in srcApplyList))
                && (override || !(p in destProto))) {
              srcProp = srcProto[p];
              if (tau.lang.isFunction(srcProp)) {
                // Save original properties to originalFn and attach the proxy
                originalFn[p] = srcProp;
                destProto[p] = makeProxyFn(p);
              } else {
                // No need to create proxy members, just attach the non-function
                destProto[p] = srcProp;
              }
            }
          }
        }
      }

      // Mixes source prototype properties to destTarget (prototype or instance)
      tau.lang.mixin(destTarget, srcProto, override, srcApplyList);

      // Object instance augmentation: call source constructor to get properties
      if (!isDestProto) {
        src.apply(destTarget);
      }

      return destTarget;
    }

  };


  /**
   * Class declaration function.
   * <p/>
   * Used to begin a class declaration, from which, subsequent chained function
   * calls can be applied to <code>extend</code> an existing class, add one or
   * more <code>mixin</code> classes, and finally, <code>define</code> the 
   * declared class namespace.
   * @example
   *  $class('com.mycompany.MyClass').extend(com.mycompany.MySuper).define({
   *    $static: {                     // Static variables
   *      MAX_SIZE: 1000
   *    },
   *    MyClass: function (a, b) {},   // Class constructor
   *    foo: function () {}            // Class member
   *  });
   * @namespace $class
   * @param {string} name Class name to be defined
   * @returns {object} Class definition skeleton used to extend or define
   */
  $class = function (name) {
    var self = { 'name': name };

    /**
     * Extends a previously defined class (Temporary static method).
     * @inner
     * @this {object} Class definition skeleton used to extend or define
     * @param {function} superclass A defined class/function reference
     */
    self.extend = function (superclass) {
      if (!tau.lang.isFunction(superclass)) {
        throw new Error('$class.extend: cannot extend undefined class, \"' 
            + superclass + '\"');
      }
      this.$super = superclass;
      delete this.extend;
      return this;
    };

    /**
     * Mixes each object's properties to the defined class prototype (it will 
     * not overwrite existing properties).
     * @inner
     * @this {object} Class definition skeleton used to extend or define
     * @param {object} arg Mixin objects are applied in called parameter order
     */
    self.mixin = function () {
      this.mixins = arguments;
      delete this.mixin;
      return this;
    };

    /**
     * Defines a class with the given properties (Temporary static method).
     * <p/>
     * The parameter's property function labeled <code>constructor</code>,
     * if defined, will be used as the constructor for the defining class.
     * <p/>
     * There are two system-defined properties:
     * <code>$super</code>: Access to super class' properties
     * <code>$classname</code>: Class name in string
     * @inner
     * @this {object} Class definition skeleton used to extend or define
     * @param {object} m Properties to add/override to the defining class
     * @throws {Error} Duplicate class definition
     */
    self.define = function (m) {
      var p, len, F, cls, 
          sup = this.$super || Object,
          localName = this.name.substring(this.name.lastIndexOf('.') + 1),
          construct = (tau.lang.isInstance(m) && m.hasOwnProperty(localName)) 
              ? m[localName] : undefined;
      if (tau.lang.isFunction(construct)) {
        if (this.$super) {
          /** User defined extended constructor. @inner */
          cls = function () {
            sup.apply(this, arguments);       // Super constructor call
            construct.apply(this, arguments); // Instance constructor call
          };
        } else {
          /** User defined base constructor (no super class). @inner */
          cls = construct;
        }
      } else if (this.$super) {
        /** Default extended constructor. @inner */
        cls = function () {
          sup.apply(this, arguments);         // Instance constructor call
        };
      } else {
        /** Default base constructor (no super class). @inner */
        cls = function () {};
      }

      // Create inheritance
      /** Object to inherit a super class. @inner */
      F = function () {};
      F.prototype = sup.prototype;
      cls.prototype = new F();
      cls.prototype.constructor = cls;

      cls.$super = sup.prototype; // Super class reference (static)

      // If the super class constructor is JavaScript's native Object, it must
      // be reassigned to its own function definition; otherwise, the sub
      // class super constructor call will not pass its arguments properly.
      if (sup !== Object
          && sup.prototype.constructor === Object.prototype.constructor) {
        sup.prototype.constructor = sup;
      }

      // Define static properties/methods
      for (p in m.$static) {
        if (m.$static.hasOwnProperty(p)) {
          cls[p] = m.$static[p];
        }
      }

      // Define prototype properties/methods
      for (p in m) {
        if (m.hasOwnProperty(p) && p !== '$static') {
          cls.prototype[p] = m[p];
        }
      }
      cls.prototype.$classname = this.name; // Class name property (instance)

      // Define full namespace for the class, throw exception on duplicate
      if (!tau.lang.namespace(this.name, cls)) {
        throw new Error('$class.define: \"' + this.name +'\" already defined');
      }

      // Apply mixin properties 
      for (p = 0, len = this.mixins ? this.mixins.length : 0; p < len; p++) {
        tau.lang.mixin(cls.prototype, this.mixins[p]);
      }

      // Remove static properties used for class definition
      delete this.name;
      delete this.mixins;
      delete this.$super;
      delete this.define;
    };

    return self;
  };

  /**
   * Returns the <code>Function/Class</code> reference associated with the given
   * string namespace.
   * @example
   *  var clazz = $class.forName('tau.example.MyClass');
   *  var instance = new clazz();
   * @param {string} ns Fully qualified name of the desired Function/Class
   * @returns {function} <code>Function/Class</code> for the specified namespace
   * @throws {Error} Undefined namespace
   */
  $class.forName = function (ns) {
    var i, len,  
        parts = ns.split('.'),
        ref = global;
    // Validate each namespace parts (create one if it doesn't exist)
    for (i = 0, len = parts.length; i < len; i++) {
      if (typeof ref[parts[i]] === 'undefined') {
        // Any ref part in the namespace must not be a function
        throw new Error('$class.forName: \"' + parts.slice(0, i + 1).join('.')
            + '\" is undefined');
      }
      ref = ref[parts[i]];
    }
    return ref;
  };


  /*---------------------------------------------- TYPES/CLASSES [PUBLIC] ---*/

  /**
   * Normalized JavaScript types.
   * <pre>
   * ARRAY: 'array'
   * BOOLEAN: 'boolean'
   * DATE: 'date'
   * ERROR: 'error'
   * FUNCTION: 'function'
   * NUMBER: 'number'
   * NULL: 'null'
   * OBJECT: 'object'
   * REGEXP: 'regexp'
   * STRING: 'string'
   * UNDEFINED: 'undefined'
   * </pre>
   * @namespace tau.lang.type
   * @constant
   * @type string
   */
  tau.lang.type = {
    ARRAY: 'array',
    BOOLEAN: 'boolean',
    DATE: 'date',
    ERROR: 'error',
    FUNCTION: 'function',
    NUMBER: 'number',
    NULL: 'null',
    OBJECT: 'object',
    REGEXP: 'regexp',
    STRING: 'string',
    UNDEFINED: 'undefined'
  };

  /**
   * Enhanced Array with enhanced helper members.
   * @class tau.lang.Array
   */
  $class('tau.lang.Array').extend(Array).define(
  /** @lends tau.lang.Array.prototype */
  {

    /**
     * Searches the Array and returns only the parameter values that do not 
     * already exist in the array.
     * @param {object} args Objects to search for in the Array
     * @returns {array} An array of common parameter values
     */
    unique: function () {
      var i,
          items = [];
      for (i = 0; i < arguments.length; i++) {
        if (this.indexOf(arguments[i]) === -1) {
          items.push(arguments[i]);
        }
      }
      return items;
    },


    /**
     * Pushes objects uniquely into the array; no duplicates.
     * @param {object} args Objects to be pushed into the array
     * @returns {number} New array length
     */
    pushUnique: function () {
      if (arguments.length === 1 && this.indexOf(arguments[0]) === -1) {
        return this.push.call(this, arguments[0]);
      } else if (arguments.length > 1) {
        return this.push.apply(this, this.unique.apply(this, arguments));
      }
      return this.length;
    },

    /**
     * Prepends objects uniquely into the array; no duplicates.
     * @param {object} args Objects to be prepended into the array
     * @returns {number} New array length
     */
    unshiftUnique: function () {
      if (arguments.length === 1 && this.indexOf(arguments[0]) === -1) {
        return this.unshift.call(this, arguments[0]);
      } else if (arguments.length > 1) {
        return this.unshift.apply(this, this.unique.apply(this, arguments));
      }
      return this.length;
    },

    /**
     * Returns the last element of to pop() without actually popping.
     * @returns {object} Last array item
     */
    peek: function () {
      return this[this.length - 1];
    },

    /**
     * Removes a element from the list by value.
     * @param {object} args Objects to be removed from the array
     * @returns {boolean} True if atleast one item was removed
     */
    remove: function (item) {
      var i, 
          removed = false;
      if (arguments.length === 1) {
        // Remove single array item if it exists
        i = this.indexOf(item);
        if (i > -1) {
          removed = (this.splice(i, 1)[0] === item); 
        }
      } else {
        // Remove the list of parameter values
        for (i = 0; i < arguments.length; i++) {
          if (this.remove(arguments[i])) {
            removed = true;
          }
        }
      }
      return removed;
    }
  });
  
})(window);
