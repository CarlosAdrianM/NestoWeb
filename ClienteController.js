var clienteController = myApp.controller('clienteController', ['$scope', 'usuario', '$routeParams', '$localStorage', 'parametrosService', '$location', '$window', function($scope, usuario, $routeParams, $localStorage, parametrosService, $location, $window){
  if ((!$localStorage.usuario) || ($localStorage.usuario = {})) {
    $localStorage.usuario = {
      'numeroCliente' : $routeParams.numeroCliente,
      'contacto' : $routeParams.contacto,
      'nombre' : "Cliente"+$routeParams.numeroCliente,
      'formaVenta' : "APP"
    };
    $location.path("/PlantillaVenta");
    $window.location.reload();
  }
}]);