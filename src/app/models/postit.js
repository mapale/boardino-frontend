/*globals define:false*/
define('app/models/postit',[
    'backbone',
    'app/utils'
], function(Backbone, Utils){
    var boardId = Utils.getBoardId();
    var Postit = Backbone.Model.extend({
        urlRoot: "api/boards/"+boardId+"/postits/",

        initialize: function(){ this.zoom = 1; },

        setZoom: function(zoom){ this.zoom = zoom; this.trigger('change:zoom'); }
    });
    return Postit;
});

