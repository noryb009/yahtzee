// generate a random die
var generateDie = function() {
    // doesn't need to be cryptographically secure
    //   TODO: can use crypto.getRandomValues
    return Math.floor(Math.random() * 6) + 1;
};

var generateDice = function() {
    var dice = new Array(6);
    for(var i = 0; i < 6; i++) {
        dice[i] = generateDie();
    }
    return dice;
};

// regenerate random dice, according to `keep'
var regenerateDice = function(dice, keep) {
    var newDice = new Array[6];
    for(var i = 0; i < 6; i++) {
        if(keep[i] === true)
            newDice[i] = dice[i];
        else
            dice[i] = generateDie();
    }
    return newDice;
};
