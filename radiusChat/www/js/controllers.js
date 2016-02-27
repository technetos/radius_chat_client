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
       $state.go('success');
     },
      function(res){
        $state.go('error');
   });
  }
 })
 .controller('ChatCtrl', function($scope, $state, UserSession, socket, $ionicSideMenuDelegate){
   //Is the user Authenticated
   if(!UserSession.get().active){
     $state.go('login');
   }
   //Defines a message
   $scope.message = {
     text: "",
     sender: "",
     geoLocation: {
       longitude : "",
       latitude : ""
     }
   };

   //Initializes my variables
   $scope.text;
   $scope.buffer = [];
    $scope.rangeValue = "";
   _getGeoLocation();

   //Main Chat functions
   socket.on('send:message', function (message) {
     console.dir(message);
     if(_inRange(message.geoLocation)){
       $scope.buffer.push(message);
     }
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
           latitude : UserSession.getLocation().latitude,
           longitude : UserSession.getLocation().longitude
         }
       }
     });
   }

   function _getGeoLocation() {
       if (navigator.geolocation) {
           //navigator.geolocation.getCurrentPosition(_showPosition);
           console.dir(navigator.geolocation)
           navigator.geolocation.getCurrentPosition(function(position){
             UserSession.setLocation(position.coords.longitude, position.coords.latitude);
           });
       } else {
           $state.go('error');
       }
   }

   function _inRange(messageGeoLocation){
     var dLongitude = (UserSession.getLocation().longitude - messageGeoLocation.longitude);
     var dLongitudeInMeters = dLongitude * 110574.61;

     var dLatitude = (UserSession.getLocation().latitude - messageGeoLocation.latitude);
     var dLatitudeInMeters = dLatitude * 111302.62;

     var distance = (Math.sqrt(Math.pow((dLatitudeInMeters ),2) + Math.pow(( dLongitudeInMeters),2)));
     console.log(distance);
     return (UserSession.get().radius >= distance)
     //return (UserSession.get().radius <= ((()**2) + (()**2)** .5)* .00001);//convert from degrees to meters (0.00000904366)
   }

   //Side Menu Functions
   $scope.toggleleft = function(){
      $ionicSideMenuDelegate.toggleLeft();
   }

   $scope.logout = function(){
      UserSession.set('active', false);
      $state.go('login');
   }

   $scope.changeDistance = function(rangeValue){
      rangeValue = rangeValue;
      UserSession.set('radius', parseInt(rangeValue));
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
     })
     .controller('SuccessCtrl', function($scope, $ionicPopup, $state){
        var alertPopup = $ionicPopup.show({
           title: 'Success!',
           templateUrl: 'templates/error.html',
           buttons: [
             {
               text: 'Continue',
               type: 'button-balanced',
               onTap: function(e){
                 $state.go('login');
               }
             }
           ]
      });
});
