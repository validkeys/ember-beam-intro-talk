import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.modelFor('application');
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("attrs", {
      messages: model
    });
  },

});