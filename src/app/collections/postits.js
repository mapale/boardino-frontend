define([
  'backbone',
  'models/postit'
], function(Backbone, Postit){
    var PostitList = Backbone.Collection.extend({
        model: Postit,
        url: "api/boards/"+board_id+"/postits/"
    });
    return PostitList;
});