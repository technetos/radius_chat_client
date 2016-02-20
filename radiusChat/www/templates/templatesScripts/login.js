angular.module('login-splash', ['ionic'])

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
    var contact ={
      email: email,
      password:password
    }
    console.dir(contact);

  }

  $scope.signUp = function(firstName,lastName,email,password){
    var contact ={
      firstName:firstName,
      lastName:lastName,
      email:email,
      password:password
    }
    console.dir(contact);
 }
});
