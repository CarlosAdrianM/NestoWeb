'use strict';

var plantillaVentaModule = angular.module('myApp.PlantillaVenta', ['ngRoute']);

plantillaVentaModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/PlantillaVenta', {
    templateUrl: 'PlantillaVenta/PlantillaVenta.html',
    controller: 'plantillaVentaController'
  });
}]);




var plantillaVentaController = plantillaVentaModule.controller('plantillaVentaController', ['$scope', 'plantillaVentaService', '$filter', 'usuario', 'SERVIDOR', 'parametrosService', '$q', '$window', function ($scope, plantillaVentaService, $filter, usuario, SERVIDOR, parametrosService, $q, $window) {
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
    
    $scope.fijarFiltro = function($location) {
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
        $scope.pedido = {
            "empresa" : $scope.cliente.empresa,
            "cliente" : $scope.cliente.cliente,
            "contacto" : $scope.direccionSeleccionada.contacto,
            "fecha" : new Date(),
            "formaPago" : $scope.direccionSeleccionada.formaPago, 
            "plazosPago": $scope.direccionSeleccionada.plazosPago,
            "primerVencimiento": new Date(), //se calcula en la API
            "iva" : $scope.cliente.iva, 
            "vendedor" : $scope.direccionSeleccionada.vendedor, 
            "comentarios": $scope.direccionSeleccionada.comentarios,
            "comentarioPicking": $scope.cliente.comentarioPicking,
            "periodoFacturacion": $scope.direccionSeleccionada.periodoFacturacion,
            "ruta" : $scope.direccionSeleccionada.ruta,
            "serie": "NV", //calcular
            "ccc" : $scope.direccionSeleccionada.ccc,
            "origen": $scope.cliente.empresa,
            "contactoCobro": $scope.cliente.contacto, //calcular
            "noComisiona" : $scope.direccionSeleccionada.noComisiona,
            "mantenerJunto": $scope.direccionSeleccionada.mantenerJunto,
            "servirJunto" : $scope.direccionSeleccionada.servirJunto,
            "usuario": SERVIDOR.DOMINIO + "\\" + usuario.nombre,
            "LineasPedido" : []
        };
        var nuevaLinea = {}, lineaPedidoOferta = {};
        
        var formaVentaUsuario;
        var promesaFormaVenta = parametrosService.leer("FormaVentaDefecto").then(function(responseText) {
            formaVentaUsuario = responseText;
        });
        var delegacionUsuario;
        var promesaDelegacion = parametrosService.leer("DelegaciónDefecto").then(function(responseText) {
            delegacionUsuario = responseText;
        });
        var almacenRutaUsuario;
        var promesaAlmacen = parametrosService.leer("AlmacénRuta").then(function(responseText) {
            almacenRutaUsuario = responseText;
        });
        var ofertaLinea = 0;
        var ultimaOferta = 0;
        
        function cogerSiguienteOferta() {
            ultimaOferta += 1;
            return ultimaOferta;
        }
        
        $q.all([promesaFormaVenta, promesaDelegacion, promesaAlmacen]).then(function(results) {
            angular.forEach($scope.productosResumen, function(linea, key) {
                ofertaLinea = linea.cantidadOferta ? cogerSiguienteOferta() : 0;
                nuevaLinea = {
                    "estado" : 1, //ojo, de parámetro. ¿Pongo 0 para tener que validar?
                    "tipoLinea" : 1, // Producto
                    "producto" : linea.producto,
                    "texto" : linea.texto,
                    "cantidad" : linea.cantidad,
                    "fechaEntrega" : new Date(),
                    "precio" : linea.precio,
                    "descuento" : linea.descuento,
                    "aplicarDescuento" : linea.aplicarDescuento,
                    "vistoBueno" : 0, //calcular
                    "usuario" : SERVIDOR.DOMINIO + "\\" + usuario.nombre,
                    "almacen" : almacenRutaUsuario,
                    "iva" : linea.iva,
                    "delegacion" : delegacionUsuario, //pedir al usuario en alguna parte
                    "formaVenta" : formaVentaUsuario,
                    "oferta" : ofertaLinea
                };           
                $scope.pedido.LineasPedido.push(nuevaLinea);      
                
                if(linea.cantidadOferta) {
                    lineaPedidoOferta = angular.copy(nuevaLinea);
                    lineaPedidoOferta.cantidad = linea.cantidadOferta;
                    lineaPedidoOferta.precio = 0;
                    lineaPedidoOferta.oferta = nuevaLinea.oferta;
                    $scope.pedido.LineasPedido.push(lineaPedidoOferta);
                };              
            });
                
            plantillaVentaService.crearPedido($scope);
            alert("Pedido creado correctamente");
            $window.location.reload();
        });        
    };
    
    $scope.selectAllContent= function($event) {
       $event.target.select();
    };    
}]);

var plantillaVentaService = plantillaVentaModule.service('plantillaVentaService', ['$http', 'SERVIDOR', '$filter', 'usuario', function ($http, SERVIDOR, $filter, usuario) {
    this.buscarProductos = function ($scope, $filter) {
        $scope.promesaBuscarProductos =  $http({
            method: "GET",
            url: SERVIDOR.API_URL + "/PlantillaVentas/BuscarProducto",
            params: {empresa : $scope.cliente.empresa, filtroProducto : $scope.model.filtroProductos},
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
            url: SERVIDOR.API_URL + "/PlantillaVentas/DireccionesEntrega",
            params: {empresa : $scope.cliente.empresa, clienteDirecciones : $scope.cliente.cliente},
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
            url: SERVIDOR.API_URL + "/PlantillaVentas",
            params: { empresa : $scope.cliente.empresa, cliente : $scope.cliente.cliente},
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
            url: SERVIDOR.API_URL + "/Clientes",
            params: { empresa : SERVIDOR.EMPRESA_POR_DEFECTO, vendedor : usuario.idVendedor, filtro : $scope.model.filtro},
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.clientes = data;
            if (data.length) {
                $scope.message = "";
            } else {
                $scope.message = "No se ha encontrado ningún cliente";
            }
            
        }).error(function (data, status) {
            $scope.message = "ERROR AL CARGAR LOS CLIENTES";
        });
        return $scope.promesaClientes;
    };
    
    
    this.crearPedido = function ($scope) {
        $scope.message = "Creando pedido...";
        $scope.promesaPedido = $http({
            method: "POST",
            url: SERVIDOR.API_URL + "/PedidosVenta",
            headers: { 'Content-Type': 'application/json' },
            data: $scope.pedido
        }).success(function (data) {
            $scope.message = "Pedido creado correctamente";
        }).error(function (data, status) {
            $scope.message = "ERROR AL TRAMITAR EL PEDIDO";
        });
        return $scope.promesaClientes;
    };
}]);