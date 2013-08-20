/*globals define:false*/
define('app/models/line',[
    'backbone',
    'app/utils'
],

function(Backbone, Utils){
    var boardId = Utils.getBoardId();
    var Line = Backbone.Model.extend({
        urlRoot: "api/boards/"+boardId+"/lines/",

        initialize: function(){

        }
    });
    return Line;
});
