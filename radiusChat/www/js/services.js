angular.module('radiusChat.services', [])
.factory('UserSession', function() {
  var currentSessions = {active:false};
  return {
    get: function(){
      return currentSessions;
    },
    set: function(key,value){
      currentSessions[key] = value;
    },
    setLocation: function(geoLocation){
      currentSessions.user.geoLocation = geoLocation;
    },
    getLocation: function(){
      return currentSessions.user.geoLocation;
    }
  };
})
.factory('socket', function ($rootScope) {
  var socket = io.connect('http://52.32.132.194:3000');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
