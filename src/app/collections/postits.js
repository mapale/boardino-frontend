/*globals define:false*/
define('src/app/collections/postits',[
  'backbone',
  'src/app/models/postit',
  'src/app/utils'

],

function(Backbone, Postit, Utils){
    var boardId = Utils.getBoardId();
    var PostitList = Backbone.Collection.extend({
        model: Postit,
        url: "api/boards/"+boardId+"/postits/"
    });
    return PostitList;
});
