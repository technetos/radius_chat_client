angular.module('radiusChat.controllers', [])

.controller('LoginCtrl', function($scope, $http){
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
        console.log('Success');
        console.dir(res);
      },
       function(res){
         console.log('Error')
         console.log(res.status);
    });
  }
})

.controller('SignUpCtrl', function($scope, $http,$window){

  $scope.email;
  $scope.password;
  $scope.username;
  /*$scope.geoLocation = {
    longitude:"test",
    latitute:"test"
  };*/






  $scope.signUp = function(email, password, username){

    /*if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
        $scope.$apply(function(){
          $scope.latitude = position.coords.latitude;
          $scope.longitude = position.coords.longitude;
          console.log(latitude);
        });
      });
    }else{
      console.log("boo");
    }*/

    $window.navigator.geolocation.getCurrentPosition(function(position){
      console.log(position);
      var latitude = position.coordinates.latitude;
      var longitude = position.coordinates.longitude;
      $scope.latitude = latitude;
      $scope.longitude = longitude; 
    });



   /*function showPosition(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
     geoLocation = {
          latitude: latitude,
          longitude: longitude
      }
      console.log(geoLocation);
    };*/
    //console.log(position);
    var user = {
        email: email,
        password: password,
        username: username,
        //goeLocation: geoLocation
    };

    _httpPostSignUp(user);
 }
 function _httpPostSignUp(user){
   var request = {
     method : "POST",
     url: "http://52.32.132.194:3000/signup",
     headers : {
       'content-type' : 'application/json'
     },
     data : {
       username : user.firstName,
       email : user.email,
       password : user.password,
       location : {
         longitude : "test",
         latitute : "test"
       }
     }
   };

   $http(request).then(
     function(res){
       console.log('Success');
       console.dir(res);
     },
      function(res){
        console.log('Error')
        console.log(res.status);
   });
  }
 });
