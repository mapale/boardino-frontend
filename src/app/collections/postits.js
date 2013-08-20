/*globals define:false*/
define('app/collections/postits',[
  'backbone',
  'app/models/postit',
  'app/utils'

],

function(Backbone, Postit, Utils){
    var boardId = Utils.getBoardId();
    var PostitList = Backbone.Collection.extend({
        model: Postit,
        url: "api/boards/"+boardId+"/postits/"
    });
    return PostitList;
});
