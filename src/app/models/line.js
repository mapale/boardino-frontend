/*globals define:false*/
define('app/models/line',[
    'backbone',
    'app/utils'
],

function(Backbone, Utils){
    var boardId = Utils.getBoardId();
    var Line = Backbone.Model.extend({
        urlRoot: "api/boards/"+boardId+"/lines/",

        initialize: function(){ this.zoom = 1; },

        setZoom: function(zoom){ this.zoom = zoom; this.trigger('change:zoom'); }
    });
    return Line;
});
