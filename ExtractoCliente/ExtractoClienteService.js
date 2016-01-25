var extractoClienteService = extractoClienteModule.service('extractoClienteService', ['$http', 'SERVIDOR', '$filter', 'usuario', '$window', 'CacheFactory', '$mdToast', '$mdDialog', function ($http, SERVIDOR, $filter, usuario, $window, CacheFactory, $mdToast, $mdDialog) {
    this.getClientes = function ($scope) {
        $scope.promesaClientes = $http({
            method: "GET",
            url: SERVIDOR.API_URL + "/Clientes",
            params: usuario.idVendedor ? { empresa : SERVIDOR.EMPRESA_POR_DEFECTO, vendedor : usuario.idVendedor, filtro : $scope.model.filtro} : { empresa : SERVIDOR.EMPRESA_POR_DEFECTO, filtro : $scope.model.filtro},
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.clientes = data;
            if (!data.length) {
                $scope.mostrarError("No se ha encontrado ningún cliente");
            }
            
        }).error(function (data, status) {
            $scope.mostrarError('Se ha producido un error al cargar los clientes');
        });
        return $scope.promesaClientes;
    };
    
    this.getDeuda = function ($scope, cliente) {
        $scope.promesaDeuda = $http({
            method: "GET",
            url: SERVIDOR.API_URL + "/ExtractosCliente",
            params: { cliente : cliente},
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.movimientosDeuda = data;
            if (!data.length) {
                $scope.mostrarError("Este cliente no tiene deuda");
            }
            
        }).error(function (data, status) {
            $scope.mostrarError('Se ha producido un error al cargar la deuda');
        });
        return $scope.promesaDeuda;
    };
}]);