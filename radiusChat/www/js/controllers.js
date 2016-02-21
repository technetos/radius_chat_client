angular.module('radiusChat.controllers', [])

.controller('LoginCtrl', function($scope, $http, $state, UserSession){
  $scope.email;
  $scope.password;

  $scope.login = function(email,password){
    var user = {
      email: email,
      password:password
    };
    _httpPostLogin(user)
  }

  function _httpPostLogin(user){
    var request = {
      method : "POST",
      url : "http://52.32.132.194:3000/login",
      headers : {
        'content-type' : 'application/json'
      },
      data : {
        email : user.email,
        password : user.password
      }
    };

    $http(request).then(
      function(res){
        if(res.status === 200){
          UserSession.set("user",res.data);
          UserSession.set("active", true);
          $state.go('chat');
        }
        console.dir(res)
      },
       function(res){
         $state.go('error');
    });
  }
})

.controller('SignUpCtrl', function($scope, $http, $state){
  $scope.user = {
    email: "",
    password: "",
    username: "",
    geoLocation: {
      longitude : "",
      latitude : ""
    }
  };

  $scope.signUp = function(username,email,password){
    $scope.user.username = username;
    $scope.user.email = email;
    $scope.user.password = password;
    _getGeoLocation()

    _httpPostSignUp();
  }

 function _getGeoLocation() {
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(_showPosition);
     } else {
         $state.go('error');
     }
 }

 function _showPosition(position) {
     $scope.user.geoLocation.latitude = position.coords.latitude;
     $scope.user.geoLocation.longitude = position.coords.longitude;
 }

 function _httpPostSignUp(){
   var request = {
     method : "POST",
     url: "http://52.32.132.194:3000/signup",
     headers : {
       'content-type' : 'application/json'
     },
     data : {
       username : $scope.user.firstName,
       email : $scope.user.email,
       password : $scope.user.password,
       geoLocation : {
         longitude : $scope.user.geoLocation.longitude,
         latitute : $scope.user.geoLocation.latitude
       }
     }
   };

   $http(request).then(
     function(res){
       console.log('Success');
       console.dir(res);
     },
      function(res){
        $state.go('error');
   });
  }
 })
 .controller('ChatCtrl', function($scope, $state, UserSession, socket){
   if(!UserSession.get().active){
     $state.go('login');
   }

   $scope.text;
   $scope.geoLocation = {};
   $scope.buffer = [];

   socket.on('send:message', function (message) {
     console.dir(message);
     $scope.buffer.push(message);
   });

   $scope.sendMessage = function (text) {
     geoLocation = {}

     function _getGeoLocation() {
         if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition(_showPosition);
         } else {
             $state.go('error');
         }
     }

     function _showPosition(position) {
         $scope.user.geoLocation.latitude = position.coords.latitude;
         $scope.user.geoLocation.longitude = position.coords.longitude;
     }

     console.dir($scope.geoLocation);

     socket.emit('send:message', {
       message: {
         text : text,
         sender : UserSession.get().user.username,
         geoLocation : {
           latitude : $scope.geoLocation.latitude,
           longitude : $scope.geoLocation.longitude
         }
       }
     });
     UserSession.setLocation(geoLocation);
   }

   function _inRange(messageGeoLocation){
     //return (UserSession.get().radius <= (((UserSession.getLocation().longitude - messageGeoLocation.longitude)**2) + ((UserSession.getLocation().latitude - messageGeoLocation.latitute)**2)** .5)* .00001);
   }
 })
 .controller('ErrorCtrl', function($scope, $ionicPopup, $state){
    var alertPopup = $ionicPopup.show({
       title: 'You Messed Up',
       templateUrl: 'templates/error.html',
       buttons: [
         {
           text: 'Continue',
           type: 'button-assertive',
           onTap: function(e){
             $state.go('login');
           }
         }
       ]
     });
});
