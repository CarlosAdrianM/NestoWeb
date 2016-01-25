'use strict';

var extractoClienteModule = angular.module('myApp.ExtractoCliente', ['ngRoute']);

extractoClienteModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ExtractoCliente', {
    templateUrl: 'ExtractoCliente/ExtractoCliente.html',
    controller: 'extractoClienteController'
  });
}]);

