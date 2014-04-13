/*globals define:false*/
define('app/views/main',[
  'jquery',
  'backbone',
  'app/views/postit',
  'app/views/canvas',
  'app/models/board',
  'app/models/postit',
  'app/collections/postits'
], function($, Backbone, PostitView, BoardCanvas, Board, Postit, PostitList){
  var MainView = Backbone.View.extend({
    el: $("body"),
    events: {
      "mouseover #menu_tool": "showMenu",
      "mouseleave #menu_tool": "leaveMenuTool",
      "mouseleave #menu": "leaveMenu",
      "mouseenter #menu": "enteredMenu",
      "click #set-private": "showSetPrivateModal",
      "click #set-public": "showSetPublicModal",
      "click #set-alias": "showSetAliasModal",
      "click #set-private-btn": "setPrivate",
      "click #set-public-btn": "setPublic",
      "click #set-alias-btn": "setBoardAlias",
      "click #zoom_in": "zoomIn",
      "click #zoom_out": "zoomOut",
      "click #connected_users_btn": "toggleUsers",
      "click #premium-tool": "showGetPremiumModal"
    },
    initialize: function(attrs){
      this.boardView = attrs.boardView;
      this.board = attrs.board;
      this.menu = $("#menu");
      this.menu.menu();
      var _this = this;
      $("#get-premium-modal").modal({show:false});
      $("#set-private-modal").modal({show:false});
      $("#set-alias-modal").modal({show:false});
        $( "#zoom-slider" ).slider({
            orientation: "vertical",
            min: 0.2,
            max: 2,
            value: 1,
            step: 0.1,
            slide: function( event, ui ) {
                _this.boardView.setZoom(ui.value);
                //$( "#amount" ).val( ui.value );
            }
        });
    },
    render: function() {
      this.boardView.render();
    },
    showMenu: function() {
        clearTimeout(this.menu.data('timeoutId'));
        this.menu.show();
    },
    leaveMenu: function() {
      this.menu.fadeOut('fast');
    },
    enteredMenu: function() {
      clearTimeout(this.menu.data('timeoutId'));
    },
    leaveMenuTool: function(){
        var menu = this.menu;
        var timeoutId = setTimeout(function(){
            menu.fadeOut('fast');
        }, 200);
        this.menu.data('timeoutId', timeoutId);
    },
    showSetPrivateModal: function(e) {
        e.preventDefault();
        $("#set-private-modal").modal('show');
    },
    showSetPublicModal: function(e) {
        e.preventDefault();
        $("#set-public-modal").modal('show');
    },
    showSetAliasModal: function(e) {
      e.preventDefault();
      $("board-alias").val(this.board.get("hash"));
      $("#set-alias-modal").modal('show');
    },
    setPrivate: function(e){
        e.preventDefault();
        $("#set-private-btn").attr('disabled','disabled');
        this.board.save({'is_private': true}, {
            success: function(board){
                console.log(board);
                $("#set-private-error-msg").hide();
                $("#set-private-modal").modal('hide');
                $("#set-private-btn").removeAttr("disabled");
                $("#set-private").hide();
                $("#set-public").show();
            },
            error: function(model, response){
                $("#set-private-error-msg").show();
            }
        });
    },
    setPublic: function(e){
        e.preventDefault();
        $("#set-public-btn").attr('disabled','disabled');
        this.board.save({'is_private': false}, {
            success: function(board){
                $("#set-public-error-msg").hide();
                $("#set-public-modal").modal('hide');
                $("#set-public-btn").removeAttr("disabled");
                $("#set-private").show();
                $("#set-public").hide();
            },
            error: function(model, response){
                $("#set-public-error-msg").show();
            }
        });
    },
    setBoardAlias: function(e) {
      e.preventDefault();
      $("#set-alias-btn").attr("disabled", "disabled");
      var alias = $("#board-alias").val();
      if(/[^a-zA-Z0-9]/.test(alias)){
        $("#set-alias-error").fadeOut().fadeIn();
        $("#set-alias-btn").removeAttr("disabled");
      } else {
        this.board.set("hash", alias);
        this.board.save({},
          {
            success: function(){
              $("#set-alias-modal").modal('hide');
              $("#set-alias-btn").removeAttr("disabled");
              $("set-alias-error").hide();
              window.location.href = "/"+alias;
            },
            error: function(model, response){
              var responseObj = $.parseJSON(response.responseText);
              if (responseObj["hash"]) {
                $("#set-alias-error-msg").html(responseObj["hash"][0]);
              }else {
                $("#set-alias-error-msg").html("There was an unknown error. Try again.");
              }
              $("#set-alias-btn").removeAttr("disabled");
              $("#set-alias-error").fadeOut().fadeIn();
            }
          }
        );
      }
    },

      zoomIn: function(event){
          var zoom = this.boardView.zoomIn(event);
          $( "#zoom-slider" ).slider("value", zoom);
      },

      zoomOut: function(event){
          var zoom = this.boardView.zoomOut(event);
          $( "#zoom-slider" ).slider("value", zoom);
      },

      toggleUsers: function(e){
          e.preventDefault();
          $("#online_users_container").toggle("slow");
      },
      showGetPremiumModal: function(e) {
        e.preventDefault();
        $("#get-premium-modal").modal('show');
    }
  });
  return MainView;
});