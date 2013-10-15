/* globals define:false, io:false, window:false, $:false */
define("app/boardmessagehandler",[
    'jquery'
],

function($) {

    var BoardMessageHandler = function(){
        var connectedUsers;
        this.boardView = null;
        var _this = this;
        this.handlers = {
            "startPath": function(args){
                _this.boardView.startPath(args["id"], args["x"], args["y"], args["color"]);
            },
            "addPathPoint": function(args){
                _this.boardView.addPathPoint(args["id"], args["x"], args["y"]);
            },
            "finishPath": function(args){
                _this.boardView.finishPath(args["id"]);
            },
            "new" : function(args){
                if(args["obj"]==="postit") {
                  _this.boardView.showPostit(args["id"]);
                } else if(args["obj"]==="text"){
                  _this.boardView.showText(args["id"]);
                }
            },
            "update" : function(args){
              if(args["obj"]==="postit") {
                _this.boardView.updatePostitText(args["id"], args["text"]);
              } else if(args["obj"]==="text"){
                _this.boardView.updateText(args["id"], args["text"]);
              }
            },
            "move" : function(args){
              if(args["obj"]==="postit") {
                _this.boardView.movePostit(args["id"], args["x"], args["y"]);
              } else if(args["obj"]==="text") {
                _this.boardView.moveText(args["id"], args["x"], args["y"]);
              }
            },
            "resize" : function(args){
              if(args["obj"]==="postit") {
                _this.boardView.resizePostit(args["id"], args["w"], args["h"]);
              } else if(args["obj"]==="text") {
                _this.boardView.resizeText(args["id"], args["w"], args["h"]);
              }
            },
            "delete" : function(args){
                if(args["obj"]==="postit") {
                    _this.boardView.deletePostit(args["id"]);
                } else if(args["obj"]==="line") {
                    _this.boardView.deleteLine(args["id"]);
                } else if(args["obj"]==="text") {
                  _this.boardView.deleteText(args["id"]);
                }
            },
            "change_color" : function(args){
                _this.boardView.changePostitColor(args["id"], args["back_color"]);
            },
            "info" : function(args){
                connectedUsers = args.users+1;
                $("#connected_users").text(connectedUsers);
            },
            "register": function(args){
                connectedUsers++;
                $("#connected_users").text(connectedUsers);
                $("<div/>").addClass("user_connected")
                    .appendTo($("#notifications")).text("1 user joined!").show('slow')
                    .hide(4000, function(){$(this).remove();});
            },
            "disconnect": function(args){
                connectedUsers--;
                $("#connected_users").text(connectedUsers);
                $("<div/>").addClass("user_disconnected")
                    .appendTo($("#notifications")).text("1 user left!").show('slow')
                    .hide(4000, function(){$(this).remove();});
            }
        };

    };

    BoardMessageHandler.prototype.handle = function(message){
        var messageType = message["type"];
        if(this.handlers[messageType]) {
            this.handlers[messageType](message["args"]);
        }
    };

    BoardMessageHandler.prototype.setBoardView = function(boardView){
        this.boardView = boardView;
    };

    return BoardMessageHandler;
});
