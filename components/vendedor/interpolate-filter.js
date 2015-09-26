'use strict';

angular.module('myApp.vendedor.interpolate-filter', [])

.filter('interpolate', ['vendedor', function(vendedor) {
  return function(text) {
    return String(text).replace(/\%VENDEDOR\%/mg, vendedor);
  };
}]);
