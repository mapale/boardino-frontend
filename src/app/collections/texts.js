/*globals define:false*/
define('app/collections/texts',[
  'backbone',
  'app/models/text',
  'app/utils'

], function(Backbone, Text, Utils){
    var boardId = Utils.getBoardId();
    var TextList = Backbone.Collection.extend({
      model: Text,
      url: "api/boards/"+boardId+"/texts/"
    });
    return TextList;
  });

