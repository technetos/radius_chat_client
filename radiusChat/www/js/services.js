angular.module('radiusChat.services', [])
.factory('UserSession', function() {
  var currentSessions = {};
  return {
    get: function(){
      return currentSessions;
    },
    set: function(key,value){
      currentSessions[key] = value;
    }
  };
});
