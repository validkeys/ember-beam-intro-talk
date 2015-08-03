import Ember from 'ember';
import faker from 'faker';

function buildMessage(data) {
  let id    = data.id || faker.random.number();
  let imgId = 350 + id;
  let def = {
      id:     faker.random.number(),
      body:   faker.lorem.sentence(),
      avatar: "http://lorempixel.com/people/400/" + imgId,
      name:   faker.name.firstName(),
      date:   faker.date.recent()
    }
  return _.extend(def, data);
}

function generateMessages(numMessages = 10) {
  let messages = Ember.A([]);
  for (var i = 1; i <= numMessages; i++) {
    messages.pushObject(buildMessage({id: i}))
  };
  return messages;
}

export default Ember.Route.extend({

  model() {
    return generateMessages(10);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("attrs", {
      messages: model
    });
  },

  actions: {
    createPost: function(body) {
      let model = this.get('currentModel');

      let newMessage = buildMessage({
        body: body, 
        date: new Date(Date.now()),
        id:   _.max(_.pluck(model, 'id')) + 1
      });
      model.pushObject(newMessage);
    }
  }

});