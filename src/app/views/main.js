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
      "click #set-password": "showSetPasswordModal",
      "click #set-alias": "showSetAliasModal",
      "click #set-password-btn": "setBoardPassword",
      "click #set-alias-btn": "setBoardAlias"
    },
    initialize: function(attrs){
      this.boardView = attrs.boardView;
      var boardId = attrs.boardId;
      this.board = new Board({id: boardId});
      this.menu = $("#menu");
      this.menu.menu();
      $("#set-password-modal").modal({show:false});
      $("#set-alias-modal").modal({show:false});
    },
    render: function() {
      var _this = this;
      this.board.fetch({success: function(){
        _this.boardView.render();
      }});
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
    showSetPasswordModal: function(e) {
      e.preventDefault();
      $("#set-password-modal").modal('show');
    },
    showSetAliasModal: function(e) {
      e.preventDefault();
      $("board-alias").val(this.board.get("hash"));
      $("#set-alias-modal").modal('show');
    },
    setBoardPassword: function(e) {
      e.preventDefault();
      $("#set-password-btn").attr('disabled','disabled');
      var passwordInput = $("#board-password");
      var passwordConfirmInput = $("#board-password2");
      var password = passwordInput.val();
      var passwordConfirmation = passwordConfirmInput.val();
      if (password === passwordConfirmation) {
        this.board.set("password", password);
        this.board.save({}, {success: function(){
          $("#set-password-modal").modal('hide');
          $("#set-password-btn").removeAttr("disabled");
          passwordInput.val("");
          $("set-password-error").hide();
        }});
      } else {
        $("#set-password-error").fadeIn();
        $(this).removeAttr("disabled");
      }
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
    }
  });
  return MainView;
});