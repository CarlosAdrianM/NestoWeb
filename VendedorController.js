var vendedorController = myApp.controller('vendedorController', ['$scope', 'usuario', '$routeParams', '$location', '$localStorage', '$window', 'parametrosService', function ($scope, usuario, $routeParams, $location, $localStorage, $window, parametrosService) {
  if ((!$localStorage.usuario) || ($localStorage.usuario = {})) {
     var nombre = $routeParams.nombreUsuario;
     //usuario.nombre = nombre;
     $localStorage.usuario = {
       'nombre' : nombre
     };
     
     parametrosService.leerCallback($scope, "Vendedor",
        function(response){
          $localStorage.usuario = {
            'nombre' : nombre,
            'idVendedor' : response.data,
            'formaVenta' : "DIR"
          };
          $location.path("/PlantillaVenta");
          $window.location.reload();    
        }
     );
     
     $scope.usuario = function() {
       return $localStorage.usuario;
     }
  }
}]);
