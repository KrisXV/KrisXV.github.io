var app = angular.module('urlApp', []);
app.controller('urlCtrl', function($scope, $http) {
	$scope.raw_html = "";
	$scope.url = "";
	
	$scope.getHTML = function(){
		$http.get($scope.url).then(function(response) {
			$scope.raw_html = response.data;
		});
	}
});