var app = angular.module('threadApp', []);
app.controller('threadCtrl', function($scope) {
	
	$scope.username = "";
	$scope.tier = "SV OU";
	$scope.week = "1";
	$scope.tourNumber = 0;
	$scope.title = "";
	$scope.initial = true;
	$scope.season = "";
	
	$scope.generateOP = function() {
		$scope.initial = false;
		var date = new Date();
		var d = date.getDay();
		if(d === 5) {
			$scope.tourNumber = 1;
		}
		if(d === 6) {
			if (date.getHours() < 12) {
				$scope.tourNumber = 2;
			} else {
				$scope.tourNumber = 3;
			}
		}
		if(d === 0) {
			$scope.tourNumber = 4;
		}
		$scope.title = "Season " + $scope.season + " (Week " + $scope.week + " [" + $scope.tier + " #" + $scope.tourNumber + "])";
	}
	
	$scope.reset = function() {
		$scope.username = "";
		$scope.tier = "SV OU";
		$scope.week = "1";
		$scope.tourNumber = 0;
		$scope.title = "";
		$scope.initial = true;
		$scope.season = "";
	}
});
