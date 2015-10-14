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
  
  // factory function body that constructs shinyNewServiceInstance
  return nuevoUsuario;
});


var vendedorController = myApp.controller('vendedorController', ['$scope', 'usuario', '$routeParams', '$location', '$localStorage', '$window', 'parametrosService', function ($scope, usuario, $routeParams, $location, $localStorage, $window, parametrosService) {
  if ((!$localStorage.usuario) || ($localStorage.usuario = {})) {
     var nombre = $routeParams.nombreUsuario;
     //usuario.nombre = nombre;
     $localStorage.usuario = {
       'nombre' : nombre
     };
     
     parametrosService.leer($scope, "Vendedor",
        function(response){
          $localStorage.usuario = {
            'nombre' : nombre,
            'idVendedor' : response.data
          };
          //$location.path("/PlantillaVenta");
          //$window.location.reload();    
        }
     );
     
     $scope.usuario = function() {
       return $localStorage.usuario;
     }
  }
}]);


var parametrosService = myApp.service('parametrosService', ['$localStorage', '$http', 'SERVIDOR', function($localStorage, $http, SERVIDOR) {
  
  this.leer = function($scope, clave, callback){
     $http({
        method: "GET",
        url: SERVIDOR.API_URL + "/ParametrosUsuario",
        params: {empresa : SERVIDOR.EMPRESA_POR_DEFECTO, usuario : $localStorage.usuario.nombre, clave : clave},
        headers: { 'Content-Type': 'application/json' }
    }).then(function successCallback(response) {
        callback(response);
    }, function errorCallback(response) {
        throw new Error("Error al leer el parámetro");
    });
    
  };

}]);
