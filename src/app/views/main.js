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
      "click #set-password-btn": "setBoardPassword"
    },
    initialize: function(attrs){
      this.boardView = attrs.boardView;
      var boardId = attrs.boardId;
      this.board = new Board({id: boardId});
      this.menu = $("#menu");
      this.menu.menu();
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
      $("#set-password-modal").modal();
    },
    setBoardPassword: function(e) {
      e.preventDefault();
      $(this).button('loading');
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
    }
  });
  return MainView;
});