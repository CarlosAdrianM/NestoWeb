var modelo347Controller = modelo347Module.controller('modelo347Controller', ['$scope', 'modelo347Service', 'SERVIDOR', '$mdToast', '$routeParams', function ($scope, modelo347Service, SERVIDOR, $mdToast, $routeParams) {
    $scope.mostrarMayor = false;
    $scope.hoy = new Date();
    $scope.cliente = $routeParams.cliente;
    $scope.NIF = $routeParams.NIF;

    $scope.cargarModelo = function() {
        $scope.mostrarMayor = false;
        modelo347Service.getModelo($scope);
    }
    
    $scope.mostrarError = function($texto) {
        $mdToast.show(
            $mdToast.simple()
            .content($texto)
            .position('top right')
            .hideDelay(10000)
        );
    }
}]);