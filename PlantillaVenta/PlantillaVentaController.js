var plantillaVentaController = plantillaVentaModule.controller('plantillaVentaController', ['$scope', 'plantillaVentaService', '$filter', 'usuario', 'SERVIDOR', 'parametrosService', '$q', '$location', '$mdToast', function ($scope, plantillaVentaService, $filter, usuario, SERVIDOR, parametrosService, $q, $location, $mdToast) {
    $scope.model = {};
    $scope.usuario = usuario;
    $scope.parent = {fechaEntrega: new Date()};
//    $scope.parent.fechaEntrega = new Date();
    $scope.hoy = new Date();
    $scope.status = {calendarioAbierto : false};
    
    
    if (usuario.numeroCliente) {
        $scope.ocultarPasoCliente = 'true';
        plantillaVentaService.cargarUnCliente($scope, usuario.numeroCliente, usuario.contacto).then(function(){
            $scope.cargarPlantilla($scope.cliente);
            //WizardHandler.wizard().goTo(1); //Productos
        });
    } else {
        $scope.ocultarPasoCliente = 'false';
    }
    
    $scope.mostrarError = function($texto) {
        $mdToast.show(
            $mdToast.simple()
            .content($texto)
            .position('top right')
            .hideDelay(10000)
        );
    }
    

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
        if (!$producto) {
            return;
        }

        $producto.colorStock = "Gris";
        
        if (!$producto.stockActualizado) {
            plantillaVentaService.cargarStockProducto($scope, $producto);
        } else {
            if ($producto.cantidadDisponible >= $producto.cantidad + $producto.cantidadOferta) {
                $producto.colorStock = "Verde";
            } else if ($producto.stock >= $producto.cantidad + $producto.cantidadOferta) {
                $producto.colorStock = "Naranja";
            } else {
                $producto.colorStock = "Rojo";
            }
        }
        
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
            "empresa" : $scope.cliente.empresa.trim(),
            "cliente" : $scope.cliente.cliente.trim(),
            "contacto" : $scope.direccionSeleccionada.contacto,
            "fecha" : $scope.hoy,
            "formaPago" : $scope.direccionSeleccionada.formaPago, 
            "plazosPago": $scope.direccionSeleccionada.plazosPago.trim(),
            "primerVencimiento": $scope.hoy, //se calcula en la API
            "iva" : $scope.cliente.iva, 
            "vendedor" : $scope.direccionSeleccionada.vendedor, 
            "comentarios": $scope.direccionSeleccionada.comentarioRuta,
            "comentarioPicking": $scope.cliente.comentarioPicking ? $scope.cliente.comentarioPicking.trim() : null,
            "periodoFacturacion": $scope.direccionSeleccionada.periodoFacturacion,
            "ruta" : $scope.direccionSeleccionada.ruta,
            "serie": "NV", //calcular
            "ccc" : $scope.direccionSeleccionada.ccc,
            "origen": $scope.cliente.empresa.trim(),
            "contactoCobro": $scope.cliente.contacto.trim(), //calcular
            "noComisiona" : $scope.direccionSeleccionada.noComisiona,
            "mantenerJunto": $scope.direccionSeleccionada.mantenerJunto,
            "servirJunto" : $scope.direccionSeleccionada.servirJunto,
            "usuario": SERVIDOR.DOMINIO + "\\" + usuario.nombre,
            "LineasPedido" : []
        };
        var nuevaLinea = {}, lineaPedidoOferta = {};
        
        if(usuario.idVendedor) {
            var promesaDelegacion = parametrosService.leer("DelegaciónDefecto").then(function(responseText) {
                usuario.delegacion = responseText;
            });            
        } else {
            usuario.delegacion = "ALG"
        }
        
        if(usuario.idVendedor) {
            var promesaAlmacen = parametrosService.leer("AlmacénRuta").then(function(responseText) {
                usuario.almacen = responseText;
            });
        } else {
            usuario.almacen = "ALG";
        }
            
        var ofertaLinea = 0;
        var ultimaOferta = 0;
        
        function cogerSiguienteOferta() {
            ultimaOferta += 1;
            return ultimaOferta;
        }
        
        $q.all([promesaDelegacion, promesaAlmacen]).then(function(results) {
            angular.forEach($scope.productosResumen, function(linea, key) {
                ofertaLinea = linea.cantidadOferta ? cogerSiguienteOferta() : 0;
                nuevaLinea = {
                    "estado" : 1, //ojo, de parámetro. ¿Pongo 0 para tener que validar?
                    "tipoLinea" : 1, // Producto
                    "producto" : linea.producto,
                    "texto" : linea.texto,
                    "cantidad" : linea.cantidad,
                    "fechaEntrega" : $scope.parent.fechaEntrega,
                    "precio" : linea.precio,
                    "descuento" : linea.descuento,
                    "aplicarDescuento" : linea.aplicarDescuento,
                    "vistoBueno" : 0, //calcular
                    "usuario" : SERVIDOR.DOMINIO + "\\" + usuario.nombre,
                    "almacen" : usuario.almacen,
                    "iva" : linea.iva,
                    "delegacion" : usuario.delegacion,
                    "formaVenta" : usuario.formaVenta,
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
        });        
    };
    
    $scope.generarCodigoQR = function(cliente) {
        $location.path("/codigoQr/" + cliente.cliente +"/"+ cliente.contacto);
    }
    
    $scope.abrirCalendario = function($event) {
        $scope.status.calendarioAbierto = true;
    };
    
    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };
    
    $scope.dateOptions = {
        //formatYear: 'yy',
        startingDay: 1,
        showWeeks: false
    };
    
    $scope.selectAllContent= function($event) {
       $event.target.select();
    };    
}]);