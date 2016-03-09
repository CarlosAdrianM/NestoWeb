'use strict';

var plantillaVentaModule = angular.module('myApp.PlantillaVenta', ['ngRoute']);

plantillaVentaModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/PlantillaVenta', {
    templateUrl: 'PlantillaVenta/PlantillaVenta.html',
    controller: 'plantillaVentaController'
  });
}])

.directive("percent", function($filter){
    var p = function(viewValue){
        
        /*
        var m = viewValue.match(/^(\d+)\/(\d+)/);
        
        if (m != null) {
          m = m.replace(/,/g, '.');
          return $filter('number')(parseInt(m[1])/parseInt(m[2]), 2);
        }
        */
        var valorFormateado = $filter('number')(parseFloat(viewValue)/100, 2); 
        return valorFormateado.replace(/,/g, '.');
    };

    var f = function(modelValue){
        return $filter('number')(parseFloat(modelValue)*100, 2)+"%";
    };
    
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            ctrl.$parsers.unshift(p);
            ctrl.$formatters.unshift(f);
        }
    };
})

.directive("moneda", function($filter){
    var p = function(viewValue){
        
        /*
        var m = viewValue.match(/^(\d+)\/(\d+)/);
        
        if (m != null) {
          m = m.replace(/,/g, '.');
          return $filter('number')(parseInt(m[1])/parseInt(m[2]), 2);
        }
        */
        var valorFormateado = $filter('number')(parseFloat(viewValue), 2); 
        return valorFormateado.replace(/,/g, '.');
    };

    var f = function(modelValue){
        return $filter('currency')(parseFloat(modelValue));
    };
    
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            ctrl.$parsers.unshift(p);
            ctrl.$formatters.unshift(f);
        }
    };
});



