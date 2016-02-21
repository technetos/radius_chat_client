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
       username : $scope.user.username,
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
 .controller('ChatCtrl', function($scope, $state, UserSession, socket, $ionicSideMenuDelegate){
   if(!UserSession.get().active){
     $state.go('login');
   }
   
   $scope.message = {
     text: "",
     sender: "",
     geoLocation: {
       longitude : "",
       latitude : ""
     }
   };

   $scope.text;
   $scope.buffer = [];

   socket.on('send:message', function (message) {
     console.dir(message);
     $scope.buffer.push(message);
   });

   $scope.sendMessage = function (text) {
     $scope.message.text = text;
     $scope.message.sender = UserSession.get().user.username;
     _getGeoLocation();

     socket.emit('send:message', {
       message: {
         text : $scope.message.text,
         sender : $scope.message.sender,
         geoLocation : {
           latitude : $scope.message.geoLocation.latitude,
           longitude : $scope.message.geoLocation.longitude
         }
       }
     });
     UserSession.setLocation(geoLocation);
   }

   function _getGeoLocation() {
       if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(_showPosition);
       } else {
           $state.go('error');
       }
   }

   function _showPosition(position) {
       $scope.message.geoLocation.latitude = position.coords.latitude;
       $scope.message.geoLocation.longitude = position.coords.longitude;
   }

   function _inRange(messageGeoLocation){
     //return (UserSession.get().radius <= (((UserSession.getLocation().longitude - messageGeoLocation.longitude)**2) + ((UserSession.getLocation().latitude - messageGeoLocation.latitute)**2)** .5)* .00001);
   }
   $scope.rangeValue = "";


$scope.toggleleft = function(){
  $ionicSideMenuDelegate.toggleLeft();
}


$scope.logout = function(){
  UserSession.set('active', false);
  $state.go('login');
}

$scope.changeDistance = function(rangeValue){
  rangeValue = rangeValue;
  UserSession.set(rangeValue);
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
