/*globals define:false*/
define('src/app/models/postit',[
    'backbone',
    'src/app/utils'
], function(Backbone, Utils){
    var boardId = Utils.getBoardId();
    var Postit = Backbone.Model.extend({
        urlRoot: "api/boards/"+boardId+"/postits/",

        initialize: function(){
        }
    });
    return Postit;
});

