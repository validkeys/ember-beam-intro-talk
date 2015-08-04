export function initialize(container, application) {
  application.register("currentuser:main", Ember.Object.create({
    id:         1,
    firstName:  "Kyle",
    lastName:   "Davis",
    email:      "validkeys@gmail.com",
    username:   "validkeys",
    loggedIn:   false
  }), { instantiate: false, singleton: true })
  
  application.inject('route', 'currentUser', 'currentuser:main');
  application.inject('controller', 'currentUser', 'currentuser:main');
  application.inject('component', 'currentUser', 'currentuser:main');
}

export default {
  name: 'current-user',
  initialize: initialize
};
