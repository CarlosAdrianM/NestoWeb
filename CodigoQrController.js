var codigoQrController = myApp.controller('codigoQrController', ['$scope', '$routeParams', function($scope, $routeParams){
	$scope.urlCliente = "http://nestoweb.azurewebsites.net/cliente/" + $routeParams.numeroCliente + "/" + $routeParams.contacto;
}]);