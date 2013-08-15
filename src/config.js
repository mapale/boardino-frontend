/*globals requirejs:false, define:false, $:false, _:false, Backbone:false*/
requirejs.config({
  baseUrl: "",
  paths: {
    vendor: "assets/vendor",
    jquery: [
      "http://code.jquery.com/jquery-1.9.1",
      "assets/vendor/jquery"
    ],
    backbone: "assets/vendor/backbone-min",
    underscore: "assets/vendor/underscore-min",
    json2: "assets/vendor/json2",
    paper: "assets/vendor/paper"
  },
  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["jquery", "underscore", "json2"],
      exports: "Backbone"
    },
    paper : {
        exports: "paper"
    }
  } 
});

define([

  "jquery",
  "backbone",
  "app"

  ],

  function($, Backbone, App) {
    console.log("jQuery version: ", $.fn.jquery);
    $(function(){
       console.log("Backbone: ", Backbone.VERSION);
    });
    return {};
});
