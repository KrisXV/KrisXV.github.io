var app = angular.module('threadApp', []);
app.controller('threadCtrl', function($scope) {
	$scope.username = "";
	$scope.tier = "";
	$scope.week = 1;
	$scope.tourNumber = 1;
	$scope.title = "";
	$scope.initial = true;
	
	$scope.generateOP = function() {
		$scope.title = "Season 22 (Week " + $scope.week + " [" + $scope.tier + " #" + $scope.tourNumber + "])";
		$scope.initial = false;
	}
	
	$scope.reset = function() {
		$scope.username = "";
		$scope.tier = "";
		$scope.week = 1;
		$scope.tourNumber = 1;
		$scope.title = "";
		$scope.initial = true;
	}
});