/*globals define:false*/
define('app/models/text',[
  'backbone',
  'app/utils'
], function(Backbone, Utils){
  var boardId = Utils.getBoardId();
  var Text = Backbone.Model.extend({
    urlRoot: "api/boards/"+boardId+"/texts/",

    initialize: function(){ this.zoom = 1; },

    setZoom: function(zoom){ this.zoom = zoom; this.trigger('change:zoom'); }
  });
  return Text;
});


