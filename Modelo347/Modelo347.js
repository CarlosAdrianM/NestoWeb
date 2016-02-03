'use strict';

var modelo347Module = angular.module('myApp.Modelo347', ['ngRoute']);

modelo347Module.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/Modelo347', {
    templateUrl: 'Modelo347/Modelo347.html',
    controller: 'modelo347Controller'
  });
}]);

