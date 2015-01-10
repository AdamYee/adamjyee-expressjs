requirejs.config({
    paths: {
        underscore: '../bower_components/underscore-amd/underscore',
        text: '../bower_components/text/text',
        durandal: '../bower_components/durandal/js',
        plugins: '../bower_components/durandal/js/plugins',
        transitions: '../bower_components/durandal/js/transitions',
        knockout: '../bower_components/knockout/dist/knockout',
        jquery: '../bower_components/jquery/jquery'
    }
});

define(function (require) {
   var system = require('durandal/system'),
       app = require('durandal/app');
 
   system.debug(true);
 
   app.title = 'Durandal Messages';
 
   app.configurePlugins({
     router:true,
     dialog: true
   });
 
   app.start().then(function() {
     app.setRoot('shell');
   });
});