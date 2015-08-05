import BaseAdapter from 'ember-beam/beams/adapters/base';

export default BaseAdapter.extend({

  // Perform your library initialization here
  // ex. mixpanel.init("API_TOKEN")
  // providerConfiguration is a JSON object with 2 keys: auth, config
  // the auth key contains the authorization parameters you specified
  // in the config/environment

  setup( providerConfiguration ) {
    this._super.apply(this, arguments);
    Ember.Logger.info("setup() called on adapter", providerConfiguration);
    /* jshint ignore:start */
    (function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
    for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=f.getElementsByTagName("script")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);
    mixpanel.init(providerConfiguration.auth.token);
    /* jshint ignore:end */
  },


  // Send your events to your provider
  // ex. mixpanel.track(eventName, payload);
  emit(eventName, payload) {
    this._super.apply(this, arguments);
    console.debug("MIXPANEL ADAPTER EMITTING", { eventName: eventName, payload: payload });
    this.client().track(eventName, payload);
  },

  // A standard API to access your provider's global / client
  // ex. if using mixpanel, simply have the client method below
  // return the global: "mixpanel" (without quotes ofcourse)
  client() {
    return mixpanel;
  },

  // OPTIONAL
  // If your library has an identify method for identifying users
  // This is typicaly when the user first signs up
  // ex. mixpanel.identify(identifier)
  identify( identifier ) {
    this.client().identify(identifier);
  },

  // OPTIONAL
  // If your library has an alias method for identifying users
  // This is typically either an email address or your internal id
  // ex. mixpanel.alias(identifier)
  alias( identifier ) {
    this.client().alias(identifier);
  }, 

  // OPTIONAL
  // If your library has the ability to set properties on a user profile
  // This is typicaly when any new or updated information on a user occurs
  // ex. mixpanel.people.set(data)
  setUserInfo( data = {} ) {
    let specialProps  = ['name','created_at','createdAt','email','phone','first_name','last_name'],
        localUserData = _.clone(data),
        userKeys      = _.keys(localUserData);

    _.each(specialProps, (prop) => {
      if (userKeys.indexOf(prop) > -1) {
        localUserData['$' + prop] = localUserData[prop];
        delete localUserData[prop];
      }
    });
    
    this.client().people.set(localUserData);
  }

});