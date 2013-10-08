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
      "mouseleave #menu": "hideMenu",
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
      this.menu.show();
    },
    hideMenu: function() {
      this.menu.hide();
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
      $("#set-password-btn").button().button('loading');
      var passwordInput = $("#board-password");
      var passwordConfirmInput = $("#board-password2");
      var password = passwordInput.val();
      var passwordConfirmation = passwordConfirmInput.val();
      if (password === passwordConfirmation) {
        this.board.set("password", password);
        this.board.save({}, {success: function(){
          $("#set-password-modal").modal('hide');
          $("#set-password-btn").button('reset');
          passwordInput.val("");
          $("set-password-error").hide();
        }});
      } else {
        $("#set-password-error").fadeIn();
        $(this).button('reset');
      }
    },
    setBoardAlias: function(e) {
      e.preventDefault();
      $("#set-alias-btn").button().button('loading');
      var alias = $("#board-alias").val();
      if(/[^a-zA-Z0-9]/.test(alias)){
        $("#set-alias-error").fadeOut().fadeIn();
        $("#set-alias-btn").button('reset');
      } else {
        this.board.set("hash", alias);
        this.board.save({},
          {
            success: function(){
              $("#set-alias-modal").modal('hide');
              $("#set-alias-btn").button('reset');
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
              $("#set-alias-btn").button('reset');
              $("#set-alias-error").fadeOut().fadeIn();
            }
          }
        );
      }
    }
  });
  return MainView;
});