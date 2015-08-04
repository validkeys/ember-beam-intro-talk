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

  beforeModel() {
    let localUser = localStorage.getItem("user"),
        currentUser = this.get('currentUser');
    if (localUser) {
      currentUser.set("loggedIn", true);
    }
  },  

  model() {
    return generateMessages(10);
  },

  actions: {
    createPost(body) {
      let model = this.get('currentModel');

      let newMessage = buildMessage({
        body: body, 
        date: new Date(Date.now()),
        id:   _.max(_.pluck(model, 'id')) + 1
      });
      
      model.pushObject(newMessage);
      alert("Post Created!");
      // this.get('Beam').push("post created", { post: model }, this);
    },

    postEdited(post) {
      alert("Edit Complete!");
      // this.get('Beam').push("post edited", { post: post }, this);
    },

    login() {
      let currentUser = this.get('currentUser');
      localStorage.setItem("user", JSON.stringify(currentUser));
      currentUser.set("loggedIn",  true);
      // this.get('Beam').setCurrentUser(currentUser, "email", false);
    },

    logout() {
      this.get('currentUser').set("loggedIn", false);
      localStorage.removeItem("user");
    },

    didTransition() {
      Ember.run(this, function() {
        let path = document.location.pathname;
        this.get('Beam').push("page view", { path: path }, this);
      });
    }
  }

});