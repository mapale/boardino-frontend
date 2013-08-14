define([
  'backbone',
  'models/line'
], function(Backbone, Line){
    var LineList = Backbone.Collection.extend({
        model: Line,
        url: "api/boards/"+board_id+"/lines/"
    });
    return LineList;
});
