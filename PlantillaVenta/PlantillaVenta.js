'use strict';

var plantillaVentaModule = angular.module('myApp.PlantillaVenta', ['ngRoute']);

plantillaVentaModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/PlantillaVenta', {
    templateUrl: 'PlantillaVenta/PlantillaVenta.html',
    controller: 'plantillaVentaController'
  });
}]);




var plantillaVentaController = plantillaVentaModule.controller('plantillaVentaController', ['$scope', 'plantillaVentaService', '$filter', 'usuario', function ($scope, plantillaVentaService, $filter, usuario) {
    $scope.model = {};
    $scope.usuario = usuario;
    

    $scope.buscarEnTodosLosProductos = function() {
        plantillaVentaService.buscarProductos($scope, $filter);
    }

    $scope.cargarClientes = function() {
        plantillaVentaService.getClientes($scope);
    }
    
    $scope.cargarDireccionesEntrega = function() {
        plantillaVentaService.direccionesEntrega($scope);
    }
     
 
    $scope.cargarPlantilla = function($cliente) {
        $scope.cliente = $cliente;
        plantillaVentaService.getProductos($scope);
    }
    
    $scope.cargarResumen = function() {
        $scope.productosResumen = [];
        angular.forEach($scope.productosInicial, function(value, key){
            if(value.cantidad !=0 || value.cantidadOferta !=0) {
                $scope.productosResumen.push(value);
            }
         });
    }
    
    $scope.comprobarSiExisteElProducto = function($producto) {
        if (!$filter('filter')($scope.productosInicial, { producto: $producto.producto })[0]) {
            $scope.productosInicial.push($producto);
        }
    }
    
    $scope.fijarFiltro = function() {
        if ($scope.model.filtroProductos == "") {
            //angular.copy($scope.productosInicial, $scope.productos);
            $scope.productos = $scope.productosInicial;
        } else {
            //angular.copy($scope.model.productosFiltrados, $scope.productos);
            $scope.productos = $scope.model.productosFiltrados;
        }
        $scope.model.filtroProductos = "";
    }
    
    $scope.crearPedido = function() {
        alert("Pedido creado");
    }
    
    $scope.selectAllContent= function($event) {
       $event.target.select();
    };    
}]);

var plantillaVentaService = plantillaVentaModule.service('plantillaVentaService', ['$http', 'SERVIDOR', '$filter', 'usuario', function ($http, SERVIDOR, $filter, usuario) {
    this.buscarProductos = function ($scope, $filter) {
        $scope.promesaBuscarProductos =  $http({
            method: "GET",
            url: SERVIDOR.API_URL + "/PlantillaVentas/BuscarProducto?empresa=1&filtroProducto=" + $scope.model.filtroProductos,
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.productos = data;
            var productoBuscado;
            var productoInicial; 
            var i;               
            for (i = 0; i < $scope.productos.length; i++) {
                productoBuscado =  $scope.productos[i];
                productoInicial = $filter('filter')($scope.productosInicial, { producto: productoBuscado.producto })[0];
                if (productoInicial) {
                    $scope.productos[i] = productoInicial;
                }
            }
            $scope.message = "";
        }).error(function (data) {
            $scope.message = "ERROR AL CARGAR LOS PRODUCTOS";
        });
        return $scope.promesaBuscarProductos;
    };
    
    this.direccionesEntrega = function ($scope) {
        $scope.promesaDireccionesEntrega =  $http({
            method: "GET",
            url: SERVIDOR.API_URL + "/PlantillaVentas/DireccionesEntrega?empresa=1&clienteDirecciones=" + $scope.cliente.cliente,
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.direccionesEntrega = data;
            $scope.direccionSeleccionada = undefined;
            var i=0;
            while($scope.direccionSeleccionada == undefined){
                if(i+1 > $scope.direccionesEntrega.length) {
                    throw "Error en la API de Nesto: cliente sin dirección por defecto";
                }
                
                if ($scope.direccionesEntrega[i].esDireccionPorDefecto) {
                    $scope.direccionSeleccionada = $scope.direccionesEntrega[i];
                }
                i++;
            }
            $scope.message = "";
        }).error(function (data) {
            $scope.message = "ERROR AL CARGAR LAS DIRECCIONES DE ENTREGA";
        });
        return $scope.promesaDireccionesEntrega;
    };

    this.getProductos = function ($scope) {
        $scope.promesaProductos =  $http({
            method: "GET",
            url: SERVIDOR.API_URL + "/PlantillaVentas?empresa=1&cliente=" + $scope.cliente.cliente,
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.productos = data;
            //$scope.productosInicial = angular.copy($scope.productos);
            $scope.productosInicial = $scope.productos;
            $scope.message = "";
        }).error(function (data) {
            $scope.message = "ERROR AL CARGAR LOS PRODUCTOS";
        });
        return $scope.promesaProductos;
    };
    
    this.getClientes = function ($scope) {
        $scope.promesaClientes = $http({
            method: "GET",
            url: SERVIDOR.API_URL + "/Clientes?empresa=1&vendedor=" + usuario.idVendedor + "&filtro=" + $scope.model.filtro,
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.clientes = data;
            $scope.message = "";
        }).error(function (data, status) {
            $scope.message = "ERROR AL CARGAR LOS CLIENTES";
        });
        return $scope.promesaClientes;
    };
}]);