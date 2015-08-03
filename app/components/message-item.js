import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ["comment"],
  isEditing:  false,

  actions: {
    toggleEdit: function() {
      this.toggleProperty("isEditing");
    },

    submitEdit: function() {
      this.toggleProperty("isEditing");
    }
  }

});