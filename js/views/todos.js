// js/views/todos.js

var app = app || {};

// Todo Item View
// --------------

app.TodoView = Backbone.View.extend({
  tagName: 'li',

  template: _.template( $('#item-template').html() ),

  events: {
    'click .toggle': 'togglecompleted',
    'dblclick label': 'edit',
    'click .destroy': 'clear',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  // Re-renders the titles of the todo item.
  render: function() {
    this.$el.html( this.template( this.model.toJSON() ) );

    this.$el.toggleClass( 'completed', this.model.get('completed') ); // NEW
    this.toggleVisible();

    this.$input = this.$('.edit');
    return this;
  },

  toggleVisible : function () {
    this.$el.toggleClass( 'hidden',  this.isHidden());
  },

  // Determines if item should be hidden
  isHidden : function () {
    var isCompleted = this.model.get('completed');
    return ( // hidden cases only
      (!isCompleted && app.TodoFilter === 'completed')
      || (isCompleted && app.TodoFilter === 'active')
    );
  },

  togglecompleted: function() {
    this.model.toggle();
  },

  // Switch this view into `"editing"` mode, displaying the input field.
  edit: function() {
    this.$el.addClass('editing');
    this.$input.focus();
  },

  // Close the `"editing"` mode, saving changes to the todo.
  close: function() {
    var value = this.$input.val().trim();

    if ( value ) {
      this.model.save({ title: value });
    } else {
      this.clear();
    }

    this.$el.removeClass('editing');
  },

  // If you hit `enter`, we're through editing the item.
  updateOnEnter: function( e ) {
    if ( e.which === ENTER_KEY ) {
      this.close();
    }
  },

  clear: function() {
      this.model.destroy();
  }
});