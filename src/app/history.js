/* globals define:false, io:false, window:false, $:false */
define("app/history",[
    'jquery'
],

function($) {

    var History = function(boardView) {
        this.boardView = boardView;
        this.size = 10;
        this.stacker = new Array(this.size);
        this.pointer = 0;
    };

    History.prototype.push = function(data) {
        if(this.isFull() === false) {
            this.stacker[this.pointer] = data;
            this.pointer++;
            return true;
        }
        else {
            return false;
        }
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
            console.log("undo "+ lastAction.action);
            switch(lastAction.action) {
                case "remove_postit":
                    this.boardView.addOne(lastAction.data);
                    break;
            }
        }
    };

    return History;
});
