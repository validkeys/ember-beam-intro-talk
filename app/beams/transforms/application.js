import BaseTransform from 'ember-beam/beams/transforms/base';

export default BaseTransform.extend({

  // OPTIONAL
  // Contains a key / value list of fields to map given any possible payload.
  // ex. "author": ['id','name']
  // This mapping will strip out all keys other than those specified within
  // an author attribute in your payload.
  mappings: {},

  // Any default event properties that you want
  // added to every event
  defaults(payload) {
    this._super.apply(this, arguments);
    payload["location"] = "ember meetup";
    return payload;
  },

  // Your main events hash:
  // ex. "page view": function(eventPackage, context)
  // Where the key (ex. page view) matches the event name you pushed into Beam
  // Each handler needs to return a fully-formed event package
  // { eventName: "...", payload: {} }
  events: {
    "post edited": function(eventPackage) {
      let { eventName, payload } = eventPackage;
      eventName = "post event";
      payload["action"] = "edited";
      return { eventName: eventName, payload: payload };
    },

    "post created": function(eventPackage) {
      let { eventName, payload } = eventPackage;
      eventName = "post event";
      payload["action"] = "created";

      let json = {
        "Is An Author": true,
        author: {
          numPosts: 12,
          user_id: 1,
          Profile: {
            url: "www.profile.com",
            IP_address: "123.123.123.123"
          }
        }
      };

      _.extend(payload, json);
      return { eventName: eventName, payload: payload };
    }
  }

});