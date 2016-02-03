var modelo347Service = modelo347Module.service('modelo347Service', ['$http', 'SERVIDOR', '$filter', '$window', 'CacheFactory', '$mdToast', '$mdDialog', function ($http, SERVIDOR, $filter, $window, CacheFactory, $mdToast, $mdDialog) {
    this.getModelo = function ($scope) {
        $scope.promesaModelo = $http({
            method: "GET",
            url: SERVIDOR.API_URL + "/ExtractosCliente/Mod347",
            params: { empresa : SERVIDOR.EMPRESA_POR_DEFECTO, cliente : $scope.cliente, NIF : $scope.NIF},
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.modelo = data;           
        }).error(function (data, status) {
            $scope.mostrarError('Se ha producido un error al cargar el modelo 347');
        });
        return $scope.promesaModelo;
    }
}]);