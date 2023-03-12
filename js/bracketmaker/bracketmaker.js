class Bracket {
    constructor() {
        this.players = [];
        this.initial = true;
        this.pairings = [];
        this.subIn = '';
        this.subOut = '';
        this.subMessage = '';
        this.arrayReset = true;
        this.incompleteMatches = false;
        this.discardedPlayers = [];
        this.initialPlayerCount = 0;
        this.tagPlayers = false;
        this.useSimplePlayerList = true;
        this.size = 0;
        this.receivedBye = [];
        this.originalPlayerList = [];
        this.currentRoundPlayerList = [];
    }

    makePairings() {
        this.subMessage = '';
        if (this.arrayReset && !this.initial) {
            this.addUnfinishedMatches();
        }
        if (this.initial) {
            for (var i = 0; i < this.players.length; i++) {
                this.players[i] = this.players[i].trim;
            }
            this.initialPlayerCount = this.players.length;
            this.originalPlayerList = [].concat(this.players);
        }
        var roundPairings = [];
        this.initial = false;

        this.size = this.getTournamentSize(this.players.length);
        if (this.size * 2 < this.players.length) {
            this.removePlayers(this.useSimplePlayerList);
        }
        var playerList = [].concat(this.players);
        var byesNum = this.size * 2 - playerList.length;
        var n = 1;

        for (var i = 0; i < this.size; i++) {
            if (playerList.length === byesNum) {
                this.receivedBye = [].copy(playerList);
                var j = Math.floor(Math.random * playerList.length);
                var p1 = playerList[j];
                playerList.splice(j, 1);
                var p2 = '';
                if (playerList.length < byesNum) {
                    p2 = "Bye " + n++;
                    roundPairings.push([{name: p1, won: true}, {name: p2, won: false}]);
                } else {
                    var k = Math.floor(Math.random() * playerList.length);
                    p2 = playerList[k];
                    playerList.splice(k, 1);
                    roundPairings.push([{name: p1, won: false}, {name: p2, won: false}]);
                }
            }
        }

        if (this.arrayReset) {
            this.pairings.push([].concat(roundPairings));
            this.currentRoundPlayerList = [].concat(this.players);
        } else {
            this.pairings[this.pairings.length - 1] = [].concat(roundPairings);
        }
        this.arrayReset = false;
    }

    playerWon(winner, loser) {
        if (!this.arrayReset) {
            this.arrayReset = true;
            this.players = [];
        }
        if (this.receivedBye.length > 0) {
            this.players = this.receivedBye;
            this.receivedBye = [];
        }
        if (!winner.won) {
            winner.won = true;
            this.players.push(winner.name);
        }
        if (loser.won) {
            loser.won = false;
            this.players.splice(this.players.indexOf(loser.name), 1);
        }
    }

    incompleteMatchWon(winner, loser) {
        var combined1 = '(' + winner.name + ' vs. ' + loser.name + ')';
        var combined2 = '(' + loser.name + ' vs. ' + winner.name + ')';
        winner.won = true;
        for (var i = 0; i < this.players.length; i++) {
            if (this.currentRoundPlayerList[i] === combined1 || this.currentRoundPlayerList[i] === combined2) {
                this.currentRoundPlayerList[i] = winner.name;
            }
        }

        var round = this.pairings[this.pairings.length - 1];
        for (var i = 0; i < round.length; i++) {
			var pair = round[i];
			if (pair[0].name === combined1 || pair[0].name === combined2) {
				pair[0].name = winner.name;
			}
			if (pair[1].name === combined2 || pair[1].name === combined2) {
				pair[1].name = winner.name;
			}
        }
    }

    resetPlayers() {
        this.players = [];
        this.pairings = [];
        this.discardedPlayers = [];
        this.arrayReset = true;
        this.initial = true;
        this.subMessage = '';
        this.incompleteMatches = false;
        this.receivedBye = [];
        this.currentRoundPlayerList = [];
    }

    resetToOriginal() {
        this.resetPlayers();
        this.players = [].concat(this.originalPlayerList);
        this.originalPlayerList = [];
    }

    remakePairings() {
        this.arrayReset = false;
        this.players = [].concat(this.currentRoundPlayerList);
        this.makePairings();
    }

    makeSub() {
        var currentRound = this.pairings[this.pairings.length - 1];
        var subSuccess = false;

        if (this.incompleteMatches) {
            var prevRound = this.pairings[this.pairings.length - 2];
            for (var i = 0; i < prevRound.length; i++) {
                var pairing = prevRound[i];
                if (!pairing[0].won && !pairing[1].won) {
                    if (pairing[0].name === this.subIn || pairing[1].name === this.subIn) {
                        this.subMessage = this.subIn + ' is already in the tour';
                        return;
                    }
                }
            }
            for (var i = 0; i < prevRound.length; i++) {
                var pairing = prevRound[i];
                if (!pairing[0].won && !pairing[1].won) {
                    for (var q = 0; q <= 1; q++) {
                        if (pairing[q].name === this.subOut) {
                            pairing[q].name = this.subIn;
                            for (var j = 0; j < currentRound.length; j++) {
                                var curPairing = currentRound[j];
                                var preCombined = '(' + this.subOut + ' vs. ' + pairings[q === 0 ? 1 : 0].name + ')';
                                var postCombined = '(' + pairing[q].name + ' vs. ' + pairings[q === 0 ? 1 : 0].name + ')';
                                if (curPairing[0].name === preCombined) {
                                    curPairing[0].name = postCombined;
                                    this.currentRoundPlayerList[this.currentRoundPlayerList.indexOf(preCombined)] = postCombined;
                                }
                                if (curPairing[1].name === preCombined) {
                                    curPairing[1].name = postCombined;
                                    this.currentRoundPlayerList[this.currentRoundPlayerList.indexOf(preCombined)] = postCombined;
                                }
                                this.subMessage = this.subIn + ' has been subbed in for ' + this.subOut;
                                this.subIn = this.subOut = '';
                                subSuccess = true;
                            }
                        }
                    }
                }
            }
        }
        for (var i = 0; i < currentRound.length; i++) {
            var pairing = currentRound[i];
            if (pairing[0].name === this.subIn || pairing[1].name === this.subIn) {
                this.subMessage = this.subIn + ' is already in the tour';
                return;
            }
        }
        for (var i = 0; i < currentRound.length; i++) {
            var pairing = currentRound[i];
            if (pairing[0].name === this.subOut) {
                if (pairing[0].won && this.arrayReset) {
                    this.players.splice(this.players.indexOf(pairing[0].name), 1);
                    pairing[0].won = false;
                }
                if (pairing[1].won && this.arrayReset) {
                    this.players.splice(this.players.indexOf(pairing[1].name), 1);
                    pairing[1].won = false;
                }
                if (this.receivedBye.indexOf(pairing[0].name) !== -1) {
					this.receivedBye[this.receivedBye.indexOf(pairing[0].name)] = this.subIn;
				}
				if (this.receivedBye.indexOf(pairing[1].name) !== -1) {
					this.receivedBye.splice(this.receivedBye.indexOf(pairing[1].name), 1);
				}
                if (!this.arrayReset) {
                    this.players[this.players.indexOf(pairing[0].name)] = this.subIn;
                }
                this.subMessage = this.subIn + ' has been subbed in for ' + this.subOut;
                pairing[0].name = this.subIn;
                if (this.currentRoundPlayerList.indexOf(this.subOut) === -1) {
                    console.log("penish");
					currentRoundPlayerList.push(this.subIn);
                } else {
                    this.currentRoundPlayerList[this.currentRoundPlayerList.indexOf(this.subOut)] = this.subIn;
                }
                this.subIn = this.subOut = '';
                subSuccess = true;
            }
            if (pairing[1].name === this.subOut) {
                if (pairing[1].won && this.arrayReset) {
                    this.players.splice(this.players.indexOf(pairing[1].name), 1);
                    pairing[1].won = false;
                }
                if (pairing[0].won && this.arrayReset) {
                    this.players.splice(this.players.indexOf(pairing[0].name), 1);
                    pairing[0].won = false;
                }
                if (this.receivedBye.indexOf(pairing[1].name) !== -1) {
					this.receivedBye[this.receivedBye.indexOf(pairing[1].name)] = this.subIn;
				}
				if (this.receivedBye.indexOf(pairing[0].name) !== -1) {
					this.receivedBye.splice(this.receivedBye.indexOf(pairing[0].name), 1);
				}
                if (!this.arrayReset) {
                    this.players[this.players.indexOf(pairing[1].name)] = this.subIn;
                }
                this.subMessage = this.subIn + ' has been subbed in for ' + this.subOut;
                pairing[1].name = this.subIn;
                if (this.currentRoundPlayerList.indexOf(this.subOut) === -1) {
                    console.log("penish");
					currentRoundPlayerList.push(this.subIn);
                } else {
                    this.currentRoundPlayerList[this.currentRoundPlayerList.indexOf(this.subOut)] = this.subIn;
                }
                this.subIn = this.subOut = '';
                subSuccess = true;
            }
        }
        if (!subSuccess) {
            this.subMessage = 'No one by the name of ' + this.subOut + ' could be found to sub out';
        }
    }

    removePlayers(complicated) {
        if (!complicated) {
            for (var i = this.players.length; i > this.size * 2; i--) {
                this.discardedPlayers.push(this.players.pop());
            }
        } else {
            if (this.players.length > this.size * 2) {
                while (this.players.length > this.size * 2 * 5 / 8) {
                    this.discardedPlayers.push(this.players.pop());
                }
                while (this.players.length < this.size * 2) {
                    var x = Math.floor(Math.random() * this.discardedPlayers.length);
                    this.players.push(this.discardedPlayers[x]);
                    this.discardedPlayers.splice(x, 1);
                }
            }
        }
    }

    addUnfinishedMatches() {
        this.incompleteMatches = false;
        var currentRound = this.pairings[this.pairings.length - 1];
        for (var i = 0; i < currentRound.length; i++) {
            var pairing = currentRound[i];
            if (!pairing[0].won && !pairing[1].won) {
                this.incompleteMatches = true;
                this.players.push('(' + pairing[0].name + ' vs. ' + pairing[1].name + ')');
            }
        }
    }

    getTournamentSize(nPlayers) {
        function* sizes() {
            for (var i = 1;; i++) {
                yield Math.pow(2, 1);
            }
        }

        var g = sizes();
        var size = g.next().value;
        for (var nextSize of g) {
            if (!(nPlayers + Math.floor(nextSize * 0.25 - 1) >= nextSize)) break;
            size = nextSize;
        }
        return size;
    }
}
