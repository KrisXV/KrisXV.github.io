var app = angular.module('snakeInfoApp', []);
app.controller('snakeInfoCtrl', function($scope) {
	$scope.htmlInput = [];
	$scope.players = [];
	$scope.dumbasses = [];
	$scope.csvExport = undefined;
	$scope.buttonCount = 0
	
	$scope.generateCSV = function(){
		$scope.buttonCount += 1;
		var player;
		$scope.htmlInput.forEach(function(line) {
			
			if(line.toLowerCase().includes('tiers played:') || line.toLowerCase().includes('tiers:') || 
					line.toLowerCase().includes('tiers :') || line.toLowerCase().includes('tiers played :') ||
					line.toLowerCase().includes('tier played:') || line.toLowerCase().includes('tier:')) {
				player = {'Name': ''}
				if(line.toLowerCase().includes('ou') || line.toLowerCase().includes('sm ou')){
		    		player['SM OU'] = 'Y';
		    	} else { 
		    		player['SM OU'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('ubers')){
		    		player['SM Ubers'] = 'Y';
		    	} else { 
		    		player['SM Ubers'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('lc')){
		    		player['SM LC'] = 'Y';
		    	} else { 
		    		player['SM LC'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('uu')){
		    		player['SM UU'] = 'Y';
		    	} else { 
		    		player['SM UU'] = 'N';
		    	}
		    	if(line.toLowerCase().includes('ru')){
		    		player['SM RU'] = 'Y';
		    	} else { 
		    		player['SM RU'] = 'N';
		    	}
                if(line.toLowerCase().includes('nu')){
		    		player['SM NU'] = 'Y';
		    	} else { 
		    		player['SM NU'] = 'N';
		    	}
                if(line.toLowerCase().includes('doubles')){
		    		player['SM Doubles'] = 'Y';
		    	} else { 
		    		player['SM Doubles'] = 'N';
		    	}
			}
			if(!line.includes('Last edited:')){
				if(line.includes(', Today') || line.includes(', Yesterday') || line.includes(', Monday') || line.includes(', Tuesday') || line.includes(', Wednesday')
						 || line.includes(', Thursday') || line.includes(', Friday') || line.includes(', Saturday') || line.includes(', Sunday')
						 || line.includes(', Jan') || line.includes(', Feb') || line.includes(', Mar') || line.includes(', Apr') || line.includes(', May')
						 || line.includes(', Jun') || line.includes(', Jul') || line.includes(', Aug') || line.includes(', Sep')
						 || line.includes(', Oct') || line.includes(', Nov') || line.includes(', Dec')) {
					if(player){
						player['Name'] = line.split(/(, Today|, Yesterday|, Monday|, Tuesday|, Wednesday|, Thursday|, Friday|, Saturday|, Sunday|, Jan|, Feb|, Mar|, Apr|, May|, Jun|, Jul|, Aug|, Sep|, Oct|, Nov|, Dec)/g)[0];
						$scope.players.push(player);
						player = null;
					} else {
						dumbass = line.split(/(, Today|, Yesterday|, Monday|, Tuesday|, Wednesday|, Thursday|, Friday|, Saturday|, Sunday|, Jan|, Feb|, Mar|, Apr|, May|, Jun|, Jul|, Aug|, Sep|, Oct|, Nov|, Dec)/g)[0];
						if(!dumbass.includes('Discussion in') && !dumbass.includes('removed from public view')){
							$scope.dumbasses.push(dumbass + ' -- ' + $scope.buttonCount)
						}
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
		$scope.htmlInput = [];
		$scope.players = [];
		$scope.csvExport = undefined;
        $scope.dumbasses = [];
        $scope.buttonCount = 0;
	}
});
