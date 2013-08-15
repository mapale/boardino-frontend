/* globals define:false, io:false, window:false, $:false */
define("src/app/boardconnection",[
    'jquery'
],

function($) {

    var BoardMessageHandler = function(boardView){
        var connectedUsers;
        this.handlers = {
            "startPath": function(args){
                boardView.startPath(args["id"], args["x"], args["y"], args["color"]);
            },
            "addPathPoint": function(args){
                boardView.addPathPoint(args["id"], args["x"], args["y"]);
            },
            "finishPath": function(args){
                boardView.finishPath(args["id"]);
            },
            "new" : function(args){
                if(args["obj"]==="postit") {
                    boardView.showPostit(args["id"]);
                }
            },
            "update" : function(args){
                boardView.updatePostitText(args["id"], args["text"]);
            },
            "move" : function(args){
                boardView.movePostit(args["id"], args["x"], args["y"]);
            },
            "resize" : function(args){
                boardView.resizePostit(args["id"], args["w"], args["h"]);
            },
            "delete" : function(args){
                if(args["obj"]==="postit") {
                    boardView.deletePostit(args["id"]);
                } else {
                    boardView.deleteLine(args["id"]);
                }
            },
            "change_color" : function(args){
                boardView.changePostitColor(args["id"], args["back_color"]);
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

    return BoardMessageHandler;
});
