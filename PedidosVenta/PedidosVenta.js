'use strict';

var pedidosVentaModule = angular.module('myApp.PedidosVenta', ['ngRoute']);

plantillaVentaModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/PedidosVenta', {
    templateUrl: 'PedidosVenta/PedidosVenta.html',
    controller: 'pedidosVentaController'
  });
}]);

