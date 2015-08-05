import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["ui","comments"],
  messages:   null,

  sortedMessages: Ember.computed('messages.@each.date', function() {
    let messages = this.get('messages');
    return _.sortBy(messages, (message) => -(new Date(message.date).getTime()));
  }),

  actions: {
    postEdited: function(post) {
      this.sendAction('onEdit', post);
    }
  }
});