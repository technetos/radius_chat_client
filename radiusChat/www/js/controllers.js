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
          UserSession.set("authenticated", true);
          $state.go('chat');
        }
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

 .controller('ChatCtrl', function($scope,$state, UserSession,$ionicSideMenuDelegate){
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

  /* $scope.hello = function(rangeVl){
     alert('hello');
   }
 })*/

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
