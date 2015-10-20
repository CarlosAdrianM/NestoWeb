var parametrosService = myApp.service('parametrosService', ['$localStorage', '$http', 'SERVIDOR', '$q', function($localStorage, $http, SERVIDOR, $q) {
  
  this.leerCallback = function($scope, clave, callback){
     $http({
        method: "GET",
        url: SERVIDOR.API_URL + "/ParametrosUsuario",
        params: {empresa : SERVIDOR.EMPRESA_POR_DEFECTO, usuario : $localStorage.usuario.nombre, clave : clave},
        headers: { 'Content-Type': 'application/json' }
    }).then(function successCallback(response) {
        callback(response);
    }, function errorCallback(response) {
        throw new Error("Error al leer el parámetro");
    });
    
  };
  
  this.leer = function(clave) {
    var deferred = $q.defer();
    $http({
        method: "GET",
        url: SERVIDOR.API_URL + "/ParametrosUsuario",
        params: {empresa : SERVIDOR.EMPRESA_POR_DEFECTO, usuario : $localStorage.usuario.nombre, clave : clave},
        headers: { 'Content-Type': 'application/json' }
    }).then(function successCallback(response) {
        deferred.resolve(response.data);
    }, function errorCallback(response) {
        deferred.reject("Error al leer el parámetro");
    });
    
    return deferred.promise;
  }

}]);