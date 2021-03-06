/* globals define:false, io:false, window:false, $:false */
define("app/history",[
    'app/models/postit',
    'app/models/text',
    'app/models/line'
],

function(Postit, Text, Line) {

    var History = function(boardView) {
        this.boardView = boardView;
        this.size = 10;
        this.stacker = new Array(this.size);
        this.pointer = 0;
    };

    History.prototype.push = function(data) {
        // if(this.isFull() === false) {
            this.stacker[this.pointer] = data;
            this.pointer++;
            return true;
        // }
        // else {
        //     return false;
        // }
    };
      
    History.prototype.pop = function() {
        if(this.isEmpty !== true) {
            this.pointer--;
            return this.stacker[this.pointer];
        }
        else {
            return false;
        }
    };
  
    History.prototype.isEmpty = function() {
        return this.pointer === 0;
    };

    History.prototype.isFull = function(){
        return this.pointer === this.size;
    };

    History.prototype.add = function(action, data) {
        this.push({action: action, data: data});
    };

    History.prototype.undo = function() {
        var lastAction = this.pop();
        if (lastAction) {
            switch(lastAction.action) {
                case "removed_postit":
                    var postit = new Postit({
                        "x": lastAction.data.get("x"),
                        "y": lastAction.data.get("y"),
                        "width": lastAction.data.get("width"),
                        "height": lastAction.data.get("height"),
                        "back_color": lastAction.data.get("back_color"),
                        "text": lastAction.data.get("text")
                    });
                    this.boardView.addPostit(postit);
                    break;
                case "removed_text":
                    var text = new Text({
                        text: lastAction.data.get("text"),
                        x: lastAction.data.get("x"),
                        y: lastAction.data.get("y"),
                        width: lastAction.data.get("width"),
                        height: lastAction.data.get("height")
                    });
                    this.boardView.addText(text);
                    break;
                case "added_line":
                    var line = lastAction.data;
                    this.boardView.deleteLine(line);
                    break;
                case "deleted_line":
                    var deletedLine = lastAction.data;
                    var recreatedLine = new Line({
                        path: deletedLine.get("path"),
                        color_l: deletedLine.get("color_l"),
                        stroke_w: deletedLine.get("stroke_w")
                    });
                    recreatedLine.type = deletedLine.type;

                    this.boardView.canvas.drawLine(recreatedLine);
                    var _aThis = this;
                    this.boardView.canvas.saveLine(recreatedLine, {x: 1, y:1}, function(){
                        _aThis.boardView.boardConnection.finishPath(recreatedLine.get("id"));
                    });

                    break;

                case "added_postit":
                    var added_postit = lastAction.data;
                    added_postit.destroy();
                    break;
                case "changed_postit_color":
                    var changedPostit = lastAction.data.postit;
                    var prevColor = lastAction.data.prevColor;
                    var _this = this;
                    changedPostit.save({"back_color": prevColor}, {
                        success: function(){
                            _this.boardView.boardConnection.changePostitColor(changedPostit.get("id"), prevColor, prevColor);
                        }
                    });
            }
        }
    };

    return History;
});
