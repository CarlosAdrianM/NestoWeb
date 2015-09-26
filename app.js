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
  $routeProvider.otherwise({redirectTo: '/PlantillaVenta'});
}])
.constant('SERVIDOR', {
  'API_URL': 'http://88.26.231.83/api'
});

myApp.factory('vendedor', function($localStorage, $location) {
  // Si pudiésemos leer el nº de teléfono sería mejor
  
  /*$localStorage.vendedor = {
    'id' : "NV",
    'nombre' : "General"
  };*/
  var nuevoVendedor = $localStorage.vendedor;
  /*
  if (!nuevoVendedor || nuevoVendedor.id == "NV") {
      $location.href = '/signin';
  }
  */
  /*
  var nuevoVendedor = {
    'id' : "NV",
    'nombre' : "General"
  };
  */
  // factory function body that constructs shinyNewServiceInstance
  return nuevoVendedor;
});

