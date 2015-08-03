import Ember from 'ember';

export default Ember.Component.extend({

  newBody: "",

  actions: {
    createPost: function() {
      this.sendAction("onCreate", this.get("newBody"));
      this.set("newBody", null);
    }
  }

});