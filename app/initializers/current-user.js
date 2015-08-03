export function initialize(container, application) {
  application.register("currentuser:main", {
    id:         1,
    firstName:  "Kyle",
    lastName:   "Davis",
    email:      "validkeys@gmail.com",
    username:   "validkeys"
  }, { instantiate: false, singleton: true })
  application.inject('route', 'currentUser', 'currentuser:main');
}

export default {
  name: 'current-user',
  initialize: initialize
};
