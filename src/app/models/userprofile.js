/*globals define:false*/
define('app/models/userprofile',[
  'backbone'
], function(Backbone){
  var UserProfile = Backbone.Model.extend({
    urlRoot: "api/profile/"
  });
  return UserProfile;
});