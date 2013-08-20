/*globals requirejs:false, define:false, $:false, _:false, Backbone:false*/
requirejs.config({
  baseUrl: "",
  paths: {
    vendor: "static/assets/vendor",
    jquery: "static/assets/vendor/jquery",
    "jquery-ui": "static/assets/vendor/jquery-ui.min",
    backbone: "static/assets/vendor/backbone-min",
    underscore: "static/assets/vendor/underscore-min",
    json2: "static/assets/vendor/json2",
    paper: "static/assets/vendor/paper",
    io: "static/assets/vendor/socket.io.min"
  },
  shim: {
    "jquery-ui": {
      exports: "$",
      deps: ['jquery']
    },
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["jquery", "underscore", "json2"],
      exports: "Backbone"
    },
    paper : {
      exports: "paper"
    },
    io: {
      exports: "io"
    }
  } 
});

define([

  "jquery",
  "backbone",
  "app"

  ],

  function($, Backbone, App) {
    App.initialize();
    console.log("jQuery version: ", $.fn.jquery);
    $(function(){
       console.log("Backbone: ", Backbone.VERSION);
    });
    return {};
});
