var plantillaVentaService = plantillaVentaModule.service('plantillaVentaService', ['$http', 'SERVIDOR', '$filter', 'usuario', '$window', 'CacheFactory', '$mdToast', '$mdDialog', function ($http, SERVIDOR, $filter, usuario, $window, CacheFactory, $mdToast, $mdDialog) {
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
        }).error(function (data) {
            $scope.mostrarError("Se ha producido un error al cargar los productos");
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
        }).error(function (data) {
            $scope.mostrarError("Se ha producido un error al cargar las direcciones de entrega");
        });
        return $scope.promesaDireccionesEntrega;
    };

    this.getProductos = function ($scope) {
        $scope.promesaProductos =  $http({
            method: "GET",
            url: SERVIDOR.API_URL + "/PlantillaVentas",
            params: { empresa : $scope.cliente.empresa, cliente : $scope.cliente.cliente},
            headers: { 'Content-Type': 'application/json' },
            cache : true
        }).success(function (data) {
            $scope.productos = data;
            //$scope.productosInicial = angular.copy($scope.productos);
            $scope.productosInicial = $scope.productos;
        }).error(function (data) {
            $scope.mostrarError("Se ha producido un error al cargar los productos");
        });
        return $scope.promesaProductos;
    };
    
    this.getClientes = function ($scope) {
        $scope.promesaClientes = $http({
            method: "GET",
            url: SERVIDOR.API_URL + "/Clientes",
            params: usuario.idVendedor ? { empresa : SERVIDOR.EMPRESA_POR_DEFECTO, vendedor : usuario.idVendedor, filtro : $scope.model.filtro} : { empresa : SERVIDOR.EMPRESA_POR_DEFECTO, filtro : $scope.model.filtro},
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.clientes = data;
            if (!data.length) {
                $scope.mostrarError("No se ha encontrado ningún cliente");
            }
            
        }).error(function (data, status) {
            $scope.mostrarError('Se ha producido un error al cargar los clientes');
        });
        return $scope.promesaClientes;
    };
    
    this.cargarUnCliente = function ($scope, numeroCliente, contacto) {
        
        $scope.promesaCliente = $http({
            method: "GET",
            url: SERVIDOR.API_URL + "/Clientes",
            params: { empresa : SERVIDOR.EMPRESA_POR_DEFECTO, cliente : numeroCliente, contacto : contacto},
            headers: { 'Content-Type': 'application/json' },
            cache : true
        }).success(function (data) {
            $scope.cliente = data;
        }).error(function (data, status) {
            $scope.mostrarError("Se ha producido un error al cargar el cliente");
        });
        return $scope.promesaCliente;
    };
    
    
    this.crearPedido = function ($scope) {
        $scope.promesaPedido = $http({
            method: "POST",
            url: SERVIDOR.API_URL + "/PedidosVenta",
            headers: { 'Content-Type': 'application/json' },
            data: $scope.pedido
        }).success(function (data) {
            $scope.mostrarError("Pedido creado correctamente");
            //alert("Pedido creado correctamente");
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title('Información')
                    .content('Pedido creado correctamente.')
                    .ariaLabel('Pedido creado correctamente')
                    .ok('Volver')
            ).finally(function() {
                $window.location.reload();
            });
        }).error(function (data, status) {
            $scope.mostrarError("Se ha producido un error al tramitar el pedido");
        });
        return $scope.promesaClientes;
    };
    
    this.cargarStockProducto = function($scope, producto) {
        if (!producto) {
            return;
        }
        $scope.promesaStock = $http({
            method: "GET",
            url: SERVIDOR.API_URL + "/PlantillaVentas/CargarStocks",
            params: { empresa : SERVIDOR.EMPRESA_POR_DEFECTO, almacen : "ALG", productoStock : producto.producto},
            headers: { 'Content-Type': 'application/json' },
            cache : true
        }).success(function (data) {
            producto.stockActualizado = true;
            producto.stock = data.stock;
            producto.cantidadDisponible = data.cantidadDisponible;
            producto.urlImagen = data.urlImagen;
            if (producto.cantidadDisponible >= producto.cantidad + producto.cantidadOferta) {
                producto.colorStock = "Verde";
            } else if (producto.stock >= producto.cantidad + producto.cantidadOferta) {
                producto.colorStock = "Naranja";
            } else {
                producto.colorStock = "Rojo";
            }
        }).error(function (data, status) {
            $scope.mostrarError("Se ha producido un error al actualizar el stock del producto");
        });
    }
    
}]);