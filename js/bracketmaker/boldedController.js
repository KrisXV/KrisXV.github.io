var app = angular.module('boldedApp', ['textAngular']);
app.controller('boldedCtrl', function ($scope) {
	$scope.pairings = "";
	$scope.newPairings = [];
	$scope.pairingsGenerated = false;
	
	var winners = [];
	
	$scope.clear = function () {
		$scope.pairings = "";
		$scope.pairingsGenerated = false;
	}
	
	$scope.generatePairings = function () {
		var temp1 = $scope.pairings.split("<!--StartFragment-->");
		var temp2 = temp1[1].split("<!--EndFragment-->");
		if (!$scope.pairings.includes('</a>')) {
			console.log(temp2[0]);
			temp2[0] = temp2[0].replaceAll(' style="font-size: 13.3333px;text-align: left;"', "");
			temp2[0] = temp2[0].replaceAll(' style="font-size: 13.3333px;text-align: left;float: none;"', "");
			$scope.newPairings = temp2[0].split("<br/>");
		} else {
			temp2[0] = temp2[0].replaceAll('<span style="font-size: 13.3333px;text-align: left;float: none;"> vs </span>', "");
			temp2[0] = temp2[0].replaceAll('<span style="font-size: 13.3333px;text-align: left;float: none;"> vs. </span>', "");
			temp2[0] = temp2[0].replaceAll('<span style="font-size: 13.3333px;text-align: left;float: none;"> VS </span>', "");
			temp2[0] = temp2[0].replaceAll('<span style="font-size: 13.3333px;text-align: left;float: none;"> VS. </span>', "");
			temp2[0] = temp2[0].replaceAll('<br style="font-size: 13.3333px;text-align: left;"/>', "");
			$scope.newPairings = temp2[0].split("</a>");
			for (var i = 0; i < $scope.newPairings.length - 1; i += 2) {
				$scope.newPairings[i] = $scope.newPairings[i] + "</a>";
				$scope.newPairings[i + 1] = $scope.newPairings[i+1] + "</a>";
				if ($scope.newPairings[i].indexOf("<b>") !== -1) {
					$scope.newPairings[i] = $scope.newPairings[i].replaceAll("<b>", "");
					$scope.newPairings[i] = $scope.newPairings[i].replaceAll("</b>", "");
					winners.push($scope.newPairings[i]);
				} else if ($scope.newPairings[i + 1].indexOf("<b>") !== -1) {
					$scope.newPairings[i + 1] = $scope.newPairings[i + 1].replaceAll("<b>", "");
					$scope.newPairings[i + 1] = $scope.newPairings[i + 1].replaceAll("</b>", "");
					winners.push($scope.newPairings[i+1]);
				} else {
					winners.push("(" + $scope.newPairings[i] +
							"<span style=\"font-size: 13.3333px;text-align: left;float: none;\"> vs </span>"
							+ $scope.newPairings[i+1] + ")");
				}
			}
			makePairingsFromWinners();
		} 
	}
	
	var makePairingsFromWinners = function () {
		$scope.pairings = "<!--StartFragment-->"
		while (winners.length > 0) {
			var j = Math.floor(Math.random() * winners.length);
			var player1 = winners[j];
			winners.splice(j, 1);
			var player2 = "";
			if (winners.length !== 0) {
				var k = Math.floor(Math.random() * winners.length);
				var player2 = winners[k];
				winners.splice(k, 1);
			} else {
				player2 = "Bye";
			}
			$scope.pairings = $scope.pairings + player1 +
					'<span style="font-size: 13.3333px;text-align: left;float: none;"> vs </span>'
					+ player2 + "<br/>";
		}
		$scope.pairingsGenerated = true;
	}
	
	String.prototype.replaceAll = function (find, replace) {
	    var str = this;
	    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
	};
//	.config(function ($provide) {
//		taTools.toolbar = [
//		                     ['html', 'bold']
//		                 ];
//	}
});