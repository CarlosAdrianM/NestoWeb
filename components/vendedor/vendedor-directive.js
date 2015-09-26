'use strict';

angular.module('myApp.vendedor.vendedor-directive', [])

.directive('appVendedor', ['vendedor', function(vendedor) {
  return function(scope, elm, attrs) {
    elm.text(vendedor);
  };
}]);
