var app = angular.module('splInfoApp', []);
app.controller('splInfoCtrl', function($scope) {
	$scope.htmlInput = "";
	$scope.players = [];
	$scope.csvExport;
	
	$scope.generateCSV = function(){
		partial = $scope.htmlInput.split('Player Name:');
		partial.forEach(function(p) {
		    if(p.includes('Tiers Played:')){
		    	partial2 = p.split('Tiers Played:');
		    	playerName = partial2[0].trim();
		    	partial3 = partial2[1].split('Timezone');
		    	tiers = partial3[0].trim();
		    	player = { 'Name': playerName }
		    	if(tiers.toLowerCase().includes('sm ou') || tiers.toLowerCase().includes('sumo ou')){
		    		player['SM OU'] = 'Y';
		    	} else { 
		    		player['SM OU'] = 'N';
		    	}
		    	if(tiers.toLowerCase().includes('sm ubers') || tiers.toLowerCase().includes('sumo ubers')){
		    		player['SM UBERS'] = 'Y';
		    	} else { 
		    		player['SM UBERS'] = 'N';
		    	}
		    	if(tiers.toLowerCase().includes('sm lc') || tiers.toLowerCase().includes('sumo lc')){
		    		player['SM LC'] = 'Y';
		    	} else { 
		    		player['SM LC'] = 'N';
		    	}
		    	if(tiers.toLowerCase().includes('doubles')){
		    		player['Doubles'] = 'Y';
		    	} else { 
		    		player['Doubles'] = 'N';
		    	}
		    	if(tiers.toLowerCase().includes('oras')){
		    		player['ORAS OU'] = 'Y';
		    	} else { 
		    		player['ORAS OU'] = 'N';
		    	}
		    	if(tiers.toLowerCase().includes('bw')){
		    		player['BW OU'] = 'Y';
		    	} else { 
		    		player['BW OU'] = 'N';
		    	}
		    	if(tiers.toLowerCase().includes('dpp')){
		    		player['DPP OU'] = 'Y';
		    	} else { 
		    		player['DPP OU'] = 'N';
		    	}
		    	if(tiers.toLowerCase().includes('adv')){
		    		player['ADV OU'] = 'Y';
		    	} else { 
		    		player['ADV OU'] = 'N';
		    	}
		    	if(tiers.toLowerCase().includes('gsc')){
		    		player['GSC OU'] = 'Y';
		    	} else { 
		    		player['GSC OU'] = 'N';
		    	}
		    	if(tiers.toLowerCase().includes('rby')){
		    		player['RBY OU'] = 'Y';
		    	} else { 
		    		player['RBY OU'] = 'N';
		    	}
		    	$scope.players.push(player)
		    }
		});
		
		const replacer = (key, value) => value === null ? '' : value;
		const header = Object.keys($scope.players[0]);
		let csv = $scope.players.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
		csv.unshift(header.join(','));
		csv = csv.join('\r\n');
		$scope.csvExport = csv;
	}
});