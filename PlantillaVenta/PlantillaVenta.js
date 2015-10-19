'use strict';

var plantillaVentaModule = angular.module('myApp.PlantillaVenta', ['ngRoute']);

plantillaVentaModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/PlantillaVenta', {
    templateUrl: 'PlantillaVenta/PlantillaVenta.html',
    controller: 'plantillaVentaController'
  });
}]);





