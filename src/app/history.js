/* globals define:false, io:false, window:false, $:false */
define("app/history",[
    'jquery'
],

function($) {

    var History = function(size) {
        this.size=size;
        this.stacker = new Array(size);
        this.pointer = 0;
    }

    History.prototype.push = function(data) {
        if(this.isFull() == false) {
            this.stacker[this.pointer] = data;
            this.pointer++;
            return true;
        }
        else {
            return false;
        }
    }
      
    History.prototype.pop = function() {
        if(this.isEmpty != true) {
            this.pointer--;
            return this.stacker[this.pointer];
        }
        else {
            return false;
        }
    }
  
    History.prototype.isEmpty = function() {
        if(this.pointer == 0) return true;
        else return false;
    }

    History.prototype.isFull = function(){
        if(this.pointer == this.size) return true;
        else return false;
    }
});
