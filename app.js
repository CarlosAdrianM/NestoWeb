'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.PlantillaVenta',
//  'myApp.view2',
//  'myApp.vendedor',
  'cgBusy',
  'ui.bootstrap',
  'mgo-angular-wizard',
  'ngStorage'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/vendedor/:idVendedor', {
    templateUrl: "vendedor.html",
    controller: "vendedorController"
  })
  .otherwise({redirectTo: '/PlantillaVenta'});
}])
.constant('SERVIDOR', {
  'API_URL': 'http://88.26.231.83/api'
});

myApp.factory('usuario', function($localStorage) {
  // Si pudiésemos leer el nº de teléfono sería mejor
  
  //delete $localStorage.usuario;
  
  var nuevoUsuario = $localStorage.usuario;
  
  if (!nuevoUsuario) {
      nuevoUsuario = {};
  }
  
  // factory function body that constructs shinyNewServiceInstance
  return nuevoUsuario;
});

var vendedorController = myApp.controller('vendedorController', ['$scope', 'usuario', '$routeParams', '$location', '$localStorage', '$window', function ($scope, usuario, $routeParams, $location, $localStorage, $window) {
  $localStorage.usuario = {
    'idVendedor' : $routeParams.idVendedor,
    'nombre' : "General"
  };
  $location.path("/PlantillaVenta");
  $window.location.reload();
}]);