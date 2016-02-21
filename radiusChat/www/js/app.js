// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('ionicApp', ['ionic'])

// .directive("login-splash",function(){
//   console.log('directive');
//   return {
//     templateUrl : "/templates/login-splash.html"
//   }
// })

.controller('LoginCtrl', function($scope, $ionicPopup, $http){
  $scope.showLogin = true;
  $scope.showSignUp = false;
  $scope.email;
  $scope.password;
  $scope.firstName;
  $scope.lastName;

  $scope.switchForm = function(){
    $scope.showLogin = $scope.showSignUp;
    $scope.showSignUp = !($scope.showSignUp)
  }

  $scope.login = function(email,password){
    var user = {
      email: email,
      password:password
    };
    console.dir(user);

  }

  $scope.signUp = function(firstName,lastName,email,password){
    var user = {
      firstName:firstName,
      lastName:lastName,
      email:email,
      password:password
    };
    console.dir(user);
    _httpPostSignUp(user)

 }

 function _httpPostLogin(user){
   var request = {
     method : "POST",
     url : "52.32.132.194:3000/login",
     headers : {
       'content-type' : 'application/x-www-form-urlencoded'
     },
     data : {
       email : user.email,
       password : user.password
     }
   };

   $http(request).then(
     function(res){
       console.log(res.data);
     },
      function(res){
        console.log(res.status);
   });
 }

 function _httpPostSignUp(user){
   var request = {
     method : "POST",
     url:"52.32.132.194:3000/signup",
     headers : {
       'content-type' : 'application/x-www-form-urlencoded'
     },
     data : {
       email : user.email,
       password : user.password,
       firstName : user.firstName,
       lastName : user.lastName
     }
   };

   $http(request).then(
     function(res){
       console.log(res.data);
     },
      function(res){
        console.log('Error')
        console.log(res.status);
   });
 }

});
