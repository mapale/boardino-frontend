define([
    'backbone'
], function(Backbone){
    var Line = Backbone.Model.extend({
        urlRoot: "api/boards/"+board_id+"/lines/",

        initialize: function(){

        }
    });
    return Line;
});

