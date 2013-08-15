define([
  'backbone',
  'models/postit',
  'src/app/utils'
], function(Backbone, Postit, Utils){
    var boardId = Utils.getBoardId();
    var PostitList = Backbone.Collection.extend({
        model: Postit,
        url: "api/boards/"+boardId+"/postits/"
    });
    return PostitList;
});