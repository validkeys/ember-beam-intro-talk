/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });


  app.import(app.bowerDirectory + "/semantic-ui/dist/components/grid.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/button.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/menu.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/header.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/input.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/form.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/divider.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/dropdown.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/transition.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/comment.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/table.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/segment.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/transition.js");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/dropdown.js");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/progress.js");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/progress.css");
  app.import(app.bowerDirectory + "/semantic-ui/dist/components/loader.css");
  app.import(app.bowerDirectory + "/lodash/lodash.js");

  return app.toTree();
};
