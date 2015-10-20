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
  $routeProvider.when('/vendedor/:nombreUsuario', {
    templateUrl: "vendedor.html",
    controller: "vendedorController"
  })
  .when('/cliente/:numeroCliente/:contacto', {
    templateUrl: "cliente.html",
    controller: "clienteController"
  })
  .otherwise({redirectTo: '/PlantillaVenta'});
}])
.constant('SERVIDOR', {
  'API_URL': 'http://88.26.231.83/api',
  'DOMINIO': 'NUEVAVISION',
  'EMPRESA_POR_DEFECTO' : 1
});

myApp.factory('usuario', function($localStorage) {
  // Si pudiésemos leer el nº de teléfono sería mejor
  
  //delete $localStorage.usuario;
  
  var nuevoUsuario = $localStorage.usuario;
  
  if (!nuevoUsuario) {
      nuevoUsuario = {};
  }
  
  // Para que los vendedores que ya estén creados sean compatibles
  if(nuevoUsuario.idVendedor && !nuevoUsuario.formaVenta){
    nuevoUsuario.formaVenta = "DIR";
  }
  
  // factory function body that constructs shinyNewServiceInstance
  return nuevoUsuario;
});
