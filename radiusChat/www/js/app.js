// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('radiusChat', ['ionic','radiusChat.controllers', 'radiusChat.services'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('login', {
    url :'/login',
    templateUrl: 'templates/login.html',
    controller : 'LoginCtrl'
  })
  .state('signUp',{
    url:'/signUp',
    templateUrl: 'templates/signUp.html',
    controller: 'SignUpCtrl'
  })
  .state('chat',{
    url:'/chat',
    templateUrl: 'templates/chat.html',
    controller: 'ChatCtrl'
  })
  .state('error',{
    controller: 'ErrorCtrl'
  });
  $urlRouterProvider.otherwise('/login');
});
