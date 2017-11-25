var app = angular.module('christmasApp', ['textAngular']).controller('christmasCtrl', function($scope) {
    let irby = ['Dan', 'Kathy', 'Alex', 'Josh', 'Leah'];
    let thomas = ['Scotty T', 'Susan', 'Evan', 'Collin'];
    let vaughn = ['Billy', 'Linda'];
    let t = 'Thomas';
    let v = 'Vaughn';
    let i = 'Irby';
    $scope.pairings = [];

    $scope.generatePairings = function() {
        $scope.pairings = [];

        var irby2 = shuffleArray(irby);
        var thomas2 = shuffleArray(thomas);
        var vaughn2 = shuffleArray(vaughn);

        var currentPerson, firstPerson, nextPerson, currentFamily, first;
        var j = 0;

        while(j < 11){
            if (j == 0) {
                var startingFamily = getRandomInt(0, 3);
                if (startingFamily == 0) {
                    first = currentPerson = pop(irby2)
                    currentFamily = i;
                } else if (startingFamily == 1) {
                    first = currentPerson = pop(thomas2)
                    currentFamily = t;
                } else {
                    first = currentPerson = pop(vaughn2);
                    currentFamily = v;
                }
            }
            j++;

            var next = Math.round(Math.random);
            if (currentFamily == t) {
                if (next == 0 && irby2.length) {
                    nextPerson = pop(irby2);
                    currentFamily = i;
                } else if (next == 1 && vaughn.length) {
                    nextPerson = pop(vaughn2);
                    currentFamily = v;
                } else if (thomas2.length) {
                    $scope.generatePairings();
                } else {
                    nextPerson = first;
                }
                $scope.pairings.push(currentPerson + ' > ' + nextPerson);
            } else if (currentFamily == i) {
                if (next == 0 && thomas2.length) {
                    nextPerson = pop(thomas2);
                    currentFamily = t;
                } else if (next == 1 && vaughn.length) {
                    nextPerson = pop(vaughn2);
                    currentFamily = v;
                } else if (irby2.length) {
                    $scope.generatePairings();
                } else {
                    nextPerson = first;
                }
                $scope.pairings.push(currentPerson + ' > ' + nextPerson);
            } else {
                if (next == 0 && irby2.length) {
                    nextPerson = pop(irby2);
                    currentFamily = i;
                } else if (next == 1 & thomas.length) {
                    nextPerson = pop(thomas2);
                    currentFamily = t;
                } else if (vaughn2.length) {
                    $scope.generatePairings();
                } else {
                    nextPerson = first;
                }
                $scope.pairings.push(currentPerson + ' > ' + nextPerson);
            }
        }
    }

    var pop = function(arr) {
        var last = arr[arr.length - 1];
        arr = arr.splice(-1, 1);
    }

    var shuffleArray = function(array) {
        for (var k = array.length - 1; k > 0; k--) {
            var h = Math.floor(Math.random() * (k + 1));
            var temp = array[k];
            array[k] = array[h];
            array[h] = temp;
        }
    }

    var getRandomInt = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
});
