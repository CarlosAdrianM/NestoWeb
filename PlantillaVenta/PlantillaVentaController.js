
var plantillaVentaController = plantillaVentaModule.controller('plantillaVentaController', ['$scope', 'plantillaVentaService', '$filter', 'usuario', 'SERVIDOR', 'parametrosService', '$q', 'WizardHandler', function ($scope, plantillaVentaService, $filter, usuario, SERVIDOR, parametrosService, $q, WizardHandler) {
    $scope.model = {};
    $scope.usuario = usuario;
    
    if (usuario.numeroCliente) {
        $scope.ocultarPasoCliente = 'true';
        plantillaVentaService.cargarUnCliente($scope, usuario.numeroCliente, usuario.contacto).then(function(){
            $scope.cargarPlantilla($scope.cliente);
            WizardHandler.wizard().goTo(1); //Productos
        });
    } else {
        $scope.ocultarPasoCliente = 'false';
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
        });        
    };
    
    $scope.selectAllContent= function($event) {
       $event.target.select();
    };    
}]);