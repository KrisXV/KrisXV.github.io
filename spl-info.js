var app = angular.module('splInfoApp', []);
app.controller('splInfoCtrl', function($scope) {
	$scope.htmlInput = [];
	$scope.players = [];
	$scope.csvExport;
	$scope.buttonCount = 0
	
	$scope.generateCSV = function(){
		$scope.buttonCount += 1;
		var player;
		$scope.htmlInput.forEach(function(line) {
			if(line.includes('Player name:') || line.includes('Player Name:') || line.includes('player name')) {
				var playerName = line.split(/(Player name:|Player Name:|player name:)/g)[2];
				player = { 'Name': playerName }
			}
			if(line.includes('Tiers Played:') || line.includes('Tiers played:') || line.includes('tiers played:') || line.includes('Tiers:') || line.includes('tiers:')) {
				if(line.toLowerCase().includes('sm ou') || line.toLowerCase().includes('sumo ou')){
		    		player['SM OU'] = 'Y';
		    	} else { 
		    		player['SM OU'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('sm ubers') || line.toLowerCase().includes('sumo ubers')){
		    		player['SM Ubers'] = 'Y';
		    	} else { 
		    		player['SM Ubers'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('sm lc') || line.toLowerCase().includes('sumo lc')){
		    		player['SM LC'] = 'Y';
		    	} else { 
		    		player['SM LC'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('doubles') || line.toLowerCase().includes('dubs')){
		    		player['Doubles'] = 'Y';
		    	} else { 
		    		player['Doubles'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('oras')){
		    		player['ORAS OU'] = 'Y';
		    	} else { 
		    		player['ORAS OU'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('bw')){
		    		player['BW OU'] = 'Y';
		    	} else { 
		    		player['BW OU'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('dpp')){
		    		player['DPP OU'] = 'Y';
		    	} else { 
		    		player['DPP OU'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('adv')){
		    		player['ADV OU'] = 'Y';
		    	} else { 
		    		player['ADV OU'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('gsc')){
		    		player['GSC OU'] = 'Y';
		    	} else { 
		    		player['GSC OU'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('rby')){
		    		player['RBY OU'] = 'Y';
		    	} else { 
		    		player['RBY OU'] = 'N';
		    	}
			}
			if(!line.includes('Last edited:')){
				if(line.includes(', Today') || line.includes(', Yesterday') || line.includes(', Monday') || line.includes(', Tuesday') || line.includes(', Wednesday')
						 || line.includes('Thursday') || line.includes(', Friday') || line.includes(', Saturday') || line.includes(', Sunday')
						 || line.includes(', Jan') || line.includes(', Feb') || line.includes(', Mar') || line.includes(', Apr') || line.includes(', May')
						 || line.includes(', Jun') || line.includes(', Jul') || line.includes(', Aug') || line.includes(', Sep')
						 || line.includes(', Oct') || line.includes(', Nov') || line.includes(', Dec')) {
					if(player){
						player['Name'] = line.split(/(, Today|, Yesterday|, Monday|, Tuesday|, Wednesday|, Thursday|, Friday|, Saturday|, Sunday|, Jan|, Feb|, Mar|, Apr|, May|, Jun|, Jul|, Aug|, Sep|, Oct|, Nov|, Dec)/g)[0];
						$scope.players.push(player);
						player = null;
					}
				}
			}
				
		});
			
		const replacer = (key, value) => value === null ? '' : value;
		const header = Object.keys($scope.players[0]);
		let csv = $scope.players.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
		csv.unshift(header.join(','));
		csv = csv.join('\r\n');
		$scope.csvExport = csv;
	}
	
	$scope.reset = function() {
		$scope.htmlInput = "";
		$scope.players = [];
		$scope.csvExport;
	}
});
