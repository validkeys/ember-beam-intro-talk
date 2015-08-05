import Ember from 'ember';
import faker from 'faker';
import { buildMessage, generateMessages } from '../utils/message-builder';

export default Ember.Route.extend({

  beforeModel() {
    let localUser = localStorage.getItem("user");
    if (localUser) {
      this.loginUser()
    }
  },  

  model() {
    return generateMessages(10);
  },

  loginUser() {
    let currentUser = this.get('currentUser');
    localStorage.setItem("user", JSON.stringify(currentUser));
    currentUser.set("loggedIn", true);
    // this.get('Beam').setCurrentUser(currentUser, "email", false);
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
      this.loginUser();
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