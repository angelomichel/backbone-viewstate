Backbone ViewState
==================

To use for Backbone.Views, the ViewState keeps data/attributes in a
Backbone.View you don't want in your Backbone.Model.

Instead of using the View itself to keep data, a ViewState is the
place where you set/get all attributes. All ViewState attributes are passed
to your `render`'s template as template data.

For example in some Backbone.View:

```javascript

    initialize: function() {
      this.viewState = new Backbone.ViewState();
    },

    getTemplateData: function() {
      return _.extend(
        this.model.toJSON(),
        this.viewState.getAttributes()
      );
    },

    render: function() {
      this.el.html(template(this.getTemplateData()));
    }

```
