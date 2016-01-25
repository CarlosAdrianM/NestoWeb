var extractoClienteController = extractoClienteModule.controller('extractoClienteController', ['$scope', 'extractoClienteService', 'usuario', 'SERVIDOR', '$mdToast', function ($scope, extractoClienteService, usuario, SERVIDOR, $mdToast) {
    $scope.usuario = usuario;
    $scope.mostrarClientes = true;
    
    $scope.cargarClientes = function() {
        extractoClienteService.getClientes($scope);
    }
    
    $scope.cargarDeuda = function(cliente) {
        $scope.mostrarClientes = false;
        extractoClienteService.getDeuda($scope, cliente.cliente)
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