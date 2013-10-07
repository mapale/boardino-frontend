/*globals define:false*/
define('app/models/board',[
  'backbone'
], function(Backbone){
  var Board = Backbone.Model.extend({
    urlRoot: "api/boards/"
  });
  return Board;
});