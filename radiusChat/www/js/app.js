// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var app = angular.module('ionicApp', ['ionic'])

// .directive("login-splash",function(){
//   console.log('directive');
//   return {
//     templateUrl : "/templates/login-splash.html"
//   }
// })
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')
  $stateProvider.state('signUp', {
    url :'/signUp',
    templateUrl: 'templates/signUp.html'
    // template : '<h1>This is inline Template</h1>'
    // views :{
    //   signUp:{
    //     templateUrl: 'signUp.html',
    //     controller: 'signUpCtrl'
    // })
  });
});


app.controller('LoginCtrl', function($scope, $ionicPopup, $http){
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
    _httpPostLogin(user)

  }

  $scope.signUp = function(firstName,lastName,email,password){
    var user = {
      firstName:firstName,
      lastName:lastName,
      email:email,
      password:password
    };

    _httpPostSignUp(user)

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
