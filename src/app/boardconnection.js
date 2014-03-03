/* globals define:false, io:false, window:false, $:false */
define("app/boardconnection",[
    'jquery',
    'io',
    'app/models/userprofile',    
],

function($,io,UserProfile) {

    'use strict';

    function BoardConnection(board_id, boardMessageHandler) {
        this.ws = io.connect( 'http://' + window['ws_host'] );
        var userprofile = new UserProfile();

        var _this = this;
        this.ws.on('connect', function () {
            userprofile.fetch({ 
                success: function(userProfile){
                    _this.subscribe(board_id, userProfile.get('user').username);
                    _this.ws.on('message', function (msg) {
                        boardMessageHandler.handle($.parseJSON(msg));
                    });
                },
                error: function(e){
                    _this.subscribe(board_id, 'guest');
                    _this.ws.on('message', function (msg) {
                        boardMessageHandler.handle($.parseJSON(msg));
                    });
                }
            });
        });
    }

    BoardConnection.prototype.disconnect = function(){
        this.ws.disconnect();
    };

    BoardConnection.prototype.send = function(message, args){
        if (!args["channel_id"]) {
            args["channel_id"] = this.board_id;
        }
        this.ws.send(JSON.stringify({
            "type": message,
            "args": args
        }));
    };

    BoardConnection.prototype.movePostit = function(id, x, y){
        this.send("move",{
                "obj": "postit",
                "id": id,
                "x": x,
                "y": y
        });
    };

    BoardConnection.prototype.moveText = function(id, x, y){
      this.send("move",{
        "obj": "text",
        "id": id,
        "x": x,
        "y": y
      });
    };

    BoardConnection.prototype.resizePostit = function(postItId, width, height){
        this.send("resize", {
                "obj": "postit",
                "id":postItId,
                "w": width,
                "h": height
            });
    };

    BoardConnection.prototype.resizeText = function(textId, width, height){
      this.send("resize", {
        "obj": "text",
        "id": textId,
        "w": width,
        "h": height
      });
    };

    BoardConnection.prototype.updatePostitText = function(postItId, text){
        this.send("update", {
                "obj": "postit",
                "id":postItId,
                "text": text
            });
    };

    BoardConnection.prototype.updateText = function(textId, text){
      this.send("update", {
        "obj": "text",
        "id": textId,
        "text": text
      });
  };

    BoardConnection.prototype.changePostitColor = function(postItId, color, backColor){
        this.send("change_color", {
                "id": postItId,
                "color": color,
                "back_color": backColor
            });
    };

    BoardConnection.prototype.subscribe = function(board_id, username){
        this.board_id = board_id;
        this.send("register",{
            "username": username
        });
    };

    BoardConnection.prototype.newPostit = function(postItId, x, y, width, height, text){
        this.send("new",{
                "obj":"postit",
                "id":postItId,
                "x": x,
                "y": y,
                "w": width,
                "h": height,
                "text":text
            });
    };

    BoardConnection.prototype.newText = function(textId, x, y, width, height, text){
      this.send("new",{
        "obj":"text",
        "id":textId,
        "x": x,
        "y": y,
        "w": width,
        "h": height,
        "text":text
      });
    };

    BoardConnection.prototype.deletePostit = function(postitId){
        this.send("delete",{
                "obj": "postit",
                "id":postitId
            });
    };

    BoardConnection.prototype.deleteText = function(textId){
      this.send("delete",{
        "obj": "text",
        "id": textId
      });
    };

    BoardConnection.prototype.deleteLine = function(id){
        this.send("delete", {
                "obj": "line",
                "id": id
            });
    };


    BoardConnection.prototype.startPath = function(id, x, y, color){
        this.send("startPath",{
                "id": id,
                "x": x,
                "y": y,
                "color": color
            });
    };

    BoardConnection.prototype.addPathPoint = function(id, x, y){
        this.send("addPathPoint",{
                "id": id,
                "x": x,
                "y": y
            });
    };

    BoardConnection.prototype.finishPath = function(id){
        this.send("finishPath",{
                "id": id
            });
    };

    return BoardConnection;
});
