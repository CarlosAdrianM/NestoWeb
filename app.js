'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngMaterial',
  'ngRoute',
  'myApp.PlantillaVenta',
  'myApp.ExtractoCliente',
  'myApp.Modelo347',
//  'myApp.view2',
//  'myApp.vendedor',
  'cgBusy',
  'ui.bootstrap',
  'mgo-angular-wizard',
  'ngStorage',
  'ja.qr',
  'angular-cache'
])
.config(function(CacheFactoryProvider) {
  angular.extend(CacheFactoryProvider.defaults, { maxAge: 1 * 60 * 1000 });
})

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/vendedor/:nombreUsuario', {
    templateUrl: "vendedor.html",
    controller: "vendedorController"
  })
  .when('/cliente/:numeroCliente/:contacto', {
    templateUrl: "cliente.html",
    controller: "clienteController"
  })
 .when('/codigoQr/:numeroCliente/:contacto', {
    templateUrl: "codigoQr.html",
    controller: "codigoQrController"
  })
  .otherwise({redirectTo: '/PlantillaVenta'});
}])
.constant('SERVIDOR', {
  //'API_URL': 'http://88.26.231.83/api',
  'API_URL': 'http://localhost:53364/api',
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

myApp.directive('datepickerLocaldate', [function () {
    var directive = {
        require: 'ngModel',
        link: link
    };
    return directive;

    function link(scope, element, attr, ngModel) {
        var converted = false;
        scope.$watch(
            function(){
                return ngModel.$modelValue;
            },
            function(modelValue){
                if(!converted && modelValue){
                    converted=true;

                    var dt = new Date(modelValue);
                    if(dt.getTimezoneOffset() > 0)
                        dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());

                    ngModel.$modelValue = dt;
                    ngModel.$render();

                }
        });
    }
}]);