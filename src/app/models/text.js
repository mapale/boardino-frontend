/*globals define:false*/
define('app/models/text',[
  'backbone',
  'app/utils'
], function(Backbone, Utils){
  var boardId = Utils.getBoardId();
  var Text = Backbone.Model.extend({
    urlRoot: "api/boards/"+boardId+"/texts/",

    initialize: function(){
    }
  });
  return Text;
});


