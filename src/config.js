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

      function getCookie(name) {
          var cookieValue = null;
          if (document.cookie && document.cookie !== '') {
              var cookies = document.cookie.split(';');
              for (var i = 0; i < cookies.length; i++) {
                  var cookie = $.trim(cookies[i]);
                  // Does this cookie string begin with the name we want?
                  if (cookie.substring(0, name.length + 1) === (name + '=')) {
                      cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                      break;
                  }
              }
          }
          return cookieValue;
      }

      Backbone._sync = Backbone.sync;
      Backbone.sync = function(method, model, options) {
          if (method == 'create' || method == 'update' || method == 'delete') {
              var csrfToken = getCookie('csrftoken');

              options.beforeSend = function(xhr){
                  xhr.setRequestHeader('X-CSRFToken', csrfToken);
              };
          }
          return Backbone._sync(method, model, options);
      };

      App.initialize();

      console.log("jQuery version: ", $.fn.jquery);
      $(function(){
          console.log("Backbone: ", Backbone.VERSION);
      });
      return {};
});
