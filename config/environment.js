/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ember-beam-intro-talk',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },


    // ***********************
    // BEAM CONFIG
    // ***********************


    beam: {
      config: {
        sanitize: {
          keyFormat: "camelcase"
        },
        attachCurrentUserToAllEvents: true,
        currentUserKey:               "user"
      },
      providers:  {
        debug:    { auth: true },
        mixpanel: {
          auth: { token: "a3dc59bcb5ac053831557e554f66ba9e" },
          config: {
            sanitize: {
              flattenPayload: true
            }
          }
        }
      }
    }




    // ***********************

  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
