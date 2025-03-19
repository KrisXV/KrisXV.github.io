var app = angular.module('bracketApp', []);
app.controller('bracketCtrl', function ($scope) {
	$scope.players = []; //initial players
	$scope.initial = true;
	$scope.pairings = []; //pairings produced by makePairings
	$scope.subIn = '';
	$scope.subOut = '';
	$scope.subMessage = '';
	$scope.arrayReset = true; //if player array has been reset by a winner being selected
	$scope.incompleteMatches = false;
	$scope.discardedPlayers = [];
	$scope.initialPlayerCount = 0;
	$scope.tagPlayers = true;
	$scope.useSimplePlayerList = true;
	
	var length = 0; //the number of pairings that need to be created
	var receivedBye = []; //list of players that received a bye
	var originalPlayerList = []; //original list of players that was put in at the start
	var currentRoundPlayerList = []; //list of players that was used to generate current round
	
	
	//This method will generate random pairings from the
	//player list present, account for byes, and a larger playerlist
	$scope.makePairings = function() {
		$scope.subMessage = '';
		if ($scope.arrayReset && !$scope.initial) {
			addUnfinishedMatches();
		}
		if ($scope.initial) {
			for (var i = 0; i < $scope.players.length; i++) {
				$scope.players[i] = $scope.players[i].trim();
			}
			$scope.initialPlayerCount = $scope.players.length;
			originalPlayerList = angular.copy($scope.players);
		}
		var roundPairings = [];
		$scope.initial = false;
		//save initial player count
		//figure out number of rounds that need to be played
		getTournamentSize($scope.players.length);
		//check if player list is too large
		if (length < $scope.players.length) {
			if ($scope.useSimplePlayerList) {
				removePlayersSimple();
			} else {
				removePlayersComplicated();
			}
		}
		var playerList = angular.copy($scope.players);
		var numberOfByes = length-playerList.length;
		var n = 1; //number of byes that have been used so far
		//special case for round robin final
		if (playerList.length === 3) {
			roundPairings.push([{name: playerList[0], won: false}, {name: playerList[1], won: false}]);
			roundPairings.push([{name: playerList[1], won: false}, {name: playerList[2], won: false}]);
			roundPairings.push([{name: playerList[2], won: false}, {name: playerList[0], won: false}]);
		} else {
			for (var i = 0; i < length / 2; i++) {
				if (playerList.length === numberOfByes) {
					receivedBye = angular.copy(playerList);
				}
				var j = Math.floor(Math.random() * playerList.length);
				var player1 = playerList[j];
				playerList.splice(j, 1);
				var player2 = "";
				if (playerList.length < numberOfByes) {
					player2 = "Bye" + n++;
					roundPairings.push([{name: player1, won: true}, {name: player2, won: false}]);
				} else {
					var k = Math.floor(Math.random() * playerList.length);
					player2 = playerList[k];
					playerList.splice(k, 1);
					roundPairings.push([{name: player1, won: false}, {name: player2, won: false}]);
				}
			}
		}
		if ($scope.arrayReset) {
			$scope.pairings.push(angular.copy(roundPairings));
			currentRoundPlayerList = angular.copy($scope.players);
		} else {
			$scope.pairings[$scope.pairings.length - 1] = angular.copy(roundPairings);
		}
		$scope.arrayReset = false;
	};
	
	//method that will set a players win value and add them to the player list for next round
	$scope.playerWon = function (winner, loser) {
		if (!$scope.arrayReset) {
			$scope.arrayReset = true;
			$scope.players = [];
		}
		if (receivedBye.length > 0) {
			$scope.players = receivedBye;
			receivedBye = [];
		}
		if (!winner.won) {
			winner.won = true;
			$scope.players.push(winner.name);
		}
		if (loser.won) {
			loser.won = false;
			$scope.players.splice($scope.players.indexOf(loser.name), 1);
		}
	};
	
	$scope.incompleteMatchWon = function (winner, loser) {
		var combined1 = '(' + winner.name + ' vs ' + loser.name + ')';
		var combined2 = '(' + loser.name + ' vs ' + winner.name + ')';
		winner.won = true;
		for (var i = 0; i < $scope.players.length; i++) {
			if (currentRoundPlayerList[i] === combined1) {
				currentRoundPlayerList[i] = winner.name;
			}
			if (currentRoundPlayerList[i] === combined2) {
				currentRoundPlayerList[i] = winner.name;
			}
		}
		
		var round = $scope.pairings[$scope.pairings.length - 1];
		for (i=0;i<round.length;i++) {
			var pair = round[i];
			if (pair[0].name === combined1) {
				pair[0].name = winner.name;
			}
			if (pair[0].name === combined2) {
				pair[0].name = winner.name;
			}
			if (pair[1].name === combined1) {
				pair[1].name = winner.name;
			}
			if (pair[1].name === combined2) {
				pair[1].name = winner.name;
			}
		}
	};
	
	//resets all of the necessary values so a tour can be run from scratch
	$scope.resetPlayers = function () {
		$scope.players = [];
		$scope.pairings = [];
		$scope.discardedPlayers = [];
		$scope.arrayReset = true;
		$scope.initial = true;
		$scope.subMessage = '';
		$scope.incompleteMatches = false;
		receivedBye = [];
		currentRoundPlayerList = [];
	};
	
	//resets the tournament with the original playerlist
	$scope.resetToOriginal = function () {
		$scope.resetPlayers();
		$scope.players = angular.copy(originalPlayerList);
		originalPlayerList = [];
	};
	
	//removed because of potential of abuse from tour hosts
	$scope.remakePairings = function () {
		$scope.arrayReset = false;
		$scope.players = angular.copy(currentRoundPlayerList);
		$scope.makePairings();
	};
	
	//subs a player out from the tournament, if they have an incomplete match in a previous round it will
	//sub them out from it as well
	$scope.makeSub = function () {
		var currentRound = $scope.pairings[$scope.pairings.length - 1];
		var subSuccess = false;
		//sub out from previous round
		if ($scope.incompleteMatches) {
			var preRound = $scope.pairings[$scope.pairings.length - 2];
			for (var i = 0; i < preRound.length; i++) {
				var pairing = preRound[i];
				if (!pairing[0].won && !pairing[1].won) { //if match was an incomplete match
					if (pairing[0].name === $scope.subIn || pairing[1].name === $scope.subIn) {
						$scope.subMessage = $scope.subIn + ' is already in the tour';
						return;
					}
				}
			}
			for (var i = 0; i < preRound.length; i++) {
				var pairing = preRound[i];
				if (!pairing[0].won && !pairing[1].won) { //if match was an incomplete match
					if (pairing[0].name === $scope.subOut) { //if the first player is the sub
						pairing[0].name = $scope.subIn;
						//loops through next rounds pairings and changes the subs name
						for (var i = 0; i < currentRound.length; i++) {
							var currentPairing = currentRound[i];
							var preCombined = '(' + $scope.subOut + ' vs ' + pairing[1].name + ')';
							var postCombined = '(' + pairing[0].name + ' vs ' + pairing[1].name + ')';
							if (currentPairing[0].name === preCombined) {
								currentPairing[0].name = postCombined;
								currentRoundPlayerList[currentRoundPlayerList.indexOf(preCombined)] = postCombined;
							}
							if (currentPairing[1].name === preCombined) {
								currentPairing[1].name = postCombined;
								currentRoundPlayerList[currentRoundPlayerList.indexOf(preCombined)] = postCombined;
							}
						}
						$scope.subMessage = $scope.subIn + ' has been subbed in for ' + $scope.subOut;
						$scope.subIn = '';
						$scope.subOut = '';
						subSuccess = true;
					}
					if (pairing[1].name === $scope.subOut) {
						pairing[1].name = $scope.subIn;
						for (var i = 0; i < currentRound.length; i++) {
							var currentPairing = currentRound[i];
							var preCombined = '(' + pairing[0].name + ' vs ' + $scope.subOut + ')';
							var postCombined = '(' + pairing[0].name + ' vs ' + pairing[1].name + ')';
							if (currentPairing[0].name === preCombined) {
								currentPairing[0].name = postCombined;
								currentRoundPlayerList[currentRoundPlayerList.indexOf(preCombined)] = postCombined;
							}
							if (currentPairing[1].name === preCombined) {
								currentPairing[1].name = postCombined;
								currentRoundPlayerList[currentRoundPlayerList.indexOf(preCombined)] = postCombined;
							}
						}
						$scope.subMessage = $scope.subIn + ' has been subbed in for ' + $scope.subOut;
						$scope.subIn = '';
						$scope.subOut = '';
						subSuccess = true;
					}
				}
			}
		}
		for (var i = 0; i < currentRound.length; i++) {
			var pairing = currentRound[i];
			if (pairing[0].name === $scope.subIn || pairing[1].name === $scope.subIn) {
				$scope.subMessage = $scope.subIn + ' is already in the tour';
				return
			}
		}
		for (var i = 0; i < currentRound.length; i++) {
			var pairing = currentRound[i];
			if (pairing[0].name === $scope.subOut) {
				//if player won that is being subbed out reset it
				if (pairing[0].won && $scope.arrayReset) {
					$scope.players.splice($scope.players.indexOf(pairing[0].name), 1);
					pairing[0].won = false;
				}
				//if player whos opponent is being subbed out won, reset it
				if (pairing[1].won) {
					$scope.players.splice($scope.players.indexOf(pairing[1].name), 1);
					pairing[1].won = false;
				}
				//if player being subbed out received a bye, change it on the list
				if (receivedBye.indexOf(pairing[0].name) !== -1) {
					receivedBye[receivedBye.indexOf(pairing[0].name)] = $scope.subIn;
				}
				//if opponenet of player being subbed out received bye, remove bye
				if (receivedBye.indexOf(pairing[1].name) !== -1) {
					receivedBye.splice(receivedBye.indexOf(pairing[1].name), 1);
				}
				if (!$scope.arrayReset) {
					$scope.players[$scope.players.indexOf(pairing[0].name)] = $scope.subIn;
				}
				$scope.subMessage = $scope.subIn + ' has been subbed in for ' + $scope.subOut;
				pairing[0].name = $scope.subIn;
				if (currentRoundPlayerList.indexOf($scope.subOut) === -1) {
					console.log("penish");
					currentRoundPlayerList.push($scope.subIn);
				} else {
					currentRoundPlayerList[currentRoundPlayerList.indexOf($scope.subOut)] = $scope.subIn;
				}
				$scope.subIn = '';
				$scope.subOut = '';
				subSuccess = true;
			}
			if (pairing[1].name === $scope.subOut) {
				//if player won that is being subbed out reset it
				if (pairing[1].won && $scope.arrayReset) {
					$scope.players.splice($scope.players.indexOf(pairing[1].name), 1);
					pairing[1].won = false;
				}
				//if player whos opponent is being subbed out won, reset it
				if (pairing[0].won) {
					$scope.players.splice($scope.players.indexOf(pairing[0].name), 1);
					pairing[0].won = false;
				}
				//if player being subbed out received a bye, change it on the list
				if (receivedBye.indexOf(pairing[1].name) !== -1) {
					receivedBye[receivedBye.indexOf[pairing[1].name]] = $scope.subIn;
				}
				//if opponenet of player being subbed out received bye, remove bye
				if (receivedBye.indexOf(pairing[0].name) !== -1) {
					receivedBye.splice(receivedBye.indexOf(pairing[0].name), 1);
				}
				if (!$scope.arrayReset) {
					$scope.players[$scope.players.indexOf(pairing[1].name)] = $scope.subIn;
				}
				$scope.subMessage = $scope.subIn + ' has been subbed in for ' + $scope.subOut;
				pairing[1].name = $scope.subIn;
				if (currentRoundPlayerList.indexOf($scope.subOut) === -1) {
					currentRoundPlayerList.push($scope.subIn);
				} else {
					currentRoundPlayerList[currentRoundPlayerList.indexOf($scope.subOut)] = $scope.subIn;
				}
				$scope.subIn = '';
				$scope.subOut = '';
				subSuccess = true;
			}
		}
		if (!subSuccess) {
				$scope.subMessage = 'No one by the name of ' + $scope.subOut + ' could be found to sub out';
		}
	};
	
	//removes excess players from the list on a first come first serve basis
	var removePlayersSimple = function () {
		for (var i = $scope.players.length; i > length; i--) {
			$scope.discardedPlayers.push($scope.players.pop());
		}
	};
	
	//removes excess players on a first 5/8ths in last 3/8ths random basis
	var removePlayersComplicated = function () {
		if ($scope.players.length > length) {
			while ($scope.players.length > length * 5 / 8) {
				$scope.discardedPlayers.push($scope.players.pop());
			}
			while ($scope.players.length < length) {
				var x = Math.floor(Math.random() * $scope.discardedPlayers.length);
				$scope.players.push($scope.discardedPlayers[x]);
				$scope.discardedPlayers.splice(x, 1);
			}
		}
	};
	
	//adds pairings with no winner to the next round
	var addUnfinishedMatches = function () {
		$scope.incompleteMatches = false;
		var currentRound = $scope.pairings[$scope.pairings.length - 1];
		for (var i = 0; i < currentRound.length; i++) {
			var pairing = currentRound[i];
			if (!pairing[0].won && !pairing[1].won) {
				$scope.incompleteMatches = true;
				$scope.players.push('(' + pairing[0].name + ' vs ' + pairing[1].name + ')');
			}
		}
	};

	var getTournamentSize = function (nPlayers) {
		var sizes = function* () {
			for (var i = 1;; i++) {
				yield Math.pow(2, i);
				// yield Math.pow(2, i) + Math.pow(2, i - 1);
			}
		};

		for (var size of sizes()) {
			if (nPlayers >= nextSize) {
				return size;
			}
		}

		console.log('error')
		throw new Error('Shouldn\'t happen');
	};

	/* determines the length of the tournament depending on the amount of players in the round
	var getTournamentSize = function (arrayLength) {
		if (arrayLength === 0) {
			return length = 0;
		} else if (1 <= arrayLength && arrayLength <= 2) {
			return length = 2;
		} else if (3 <= arrayLength && arrayLength <= 5) {
			return length = 4;
		} else if (6 <= arrayLength && arrayLength <= 11) {
			return length = 8;
		} else if (12 <= arrayLength && arrayLength <= 23) {
			return length = 16;
		} else if (24 <= arrayLength && arrayLength <= 47) {
			return length = 32;
		} else if (48 <= arrayLength && arrayLength <= 95) {
			return length = 64;
		} else if (96 <= arrayLength && arrayLength <= 191) {
			return length = 128;
		} else if (192 <= arrayLength && arrayLength <= 383) {
			return length = 256;
		} else {
			return length = 512;
		}
	}; */
});
