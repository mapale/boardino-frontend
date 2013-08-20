/*globals define:false*/
define('app/collections/lines',[
  'backbone',
  'app/models/line',
  'app/utils'

],

function(Backbone, Line, Utils){
    var boardId = Utils.getBoardId();
    var LineList = Backbone.Collection.extend({
        model: Line,
        url: "api/boards/"+boardId+"/lines/"
    });
    return LineList;
});
