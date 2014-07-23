/*global
  require, define
*/

(function(root, factory) {
  // Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], function(_, Backbone) {
      factory(root, _, Backbone);
    });

  // Next for Node.js or CommonJS.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    var Backbone = require('backbone');
    factory(root, _, Backbone);

  // as browser global
  } else {
    factory(root, root._, root.Backbone);
  }
}(this, function(root, _, Backbone) {

  // Backbone.ViewState
  // ------------------

  // Backbone **ViewState** objects are designed to be nothing more but
  // a wrapper that is not a Model but does need to 'hold' data.
  // An example of a ViewState value is when your mouse or finger
  // is hovering over some target to add `{over: true}` to the viewState.
  // The idea behind it is that you can use getAttributes as default
  // for data in your render function.

  // For example:
  //
  //     render: function() {
  //       this.el.html(_.extend(
  //          this.viewState.getAttributes(),
  //          this.model.toJSON()
  //       ));
  //     }
  //
  var ViewState = Backbone.ViewState = function(attributes) {
    var attrs = attributes || {};
    this.attributes = _.clone(attrs);
  };

  _.extend(ViewState.prototype, Backbone.Events, {
    // get the value of an attribute
    get: function(attr) {
      return this.attributes[attr];
    },

    // returns all attributes (like toJSON, but this already is 'pojo')
    getAttributes: function() {
      return _.clone(this.attributes);
    },

    // set a hash of attributes on the object (firing `change`). This is
    // the core operation of a viewState object, updating the data and
    // notifying anyone who needs to know about the change.
    set: function(key, val, options) {
      var attrs, attr, current, silent, unset, changes = [];
      if (key === null) {
        return this;
      }

      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      unset   = options.unset;
      silent  = options.silent;
      current = this.attributes;

      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) {
          changes.push(attr);
        }
        if (unset) {
          delete current[attr];
        } else {
          current[attr] = val;
        }
      }

      if (!silent) {
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:'+ changes[i], this, current[changes[i]], options);
        }
        this.trigger('change', this, options);
      }
      return this;
    },

    // remove an attribute from the object, also firing a `change`.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // clear all attributes off this model, also firing `change`
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) {
        attrs[key] = void 0;
      }
      return this.set(attrs, _.extend({}, options, {unset: true}));
    }
  });
}));