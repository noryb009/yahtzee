var SCORES = {
    fullHouse: 25,
    straightS: 30,
    straightL: 40,
    yahtzee: 50,
};

var FULL_HOUSE_3 = 3;
var FULL_HOUSE_2 = 2;

// number of times `number' is in array `dice'
var occurrences = function(dice, number) {
    return dice.filter(function(i) {return i === number;}).length;
};

// generate a new board, filled with `val'
var fillBoard = function(val) {
    return {
        occur: [val, val, val, val, val, val],
        kind3: val,
        kind4: val,
        fullHouse: val,
        straightS: val,
        straightL: val,
        yahtzee: val,
        chance: val,
        extraYahtzee: val,
    };
};

// get the score if `dice` is scored in any spot
var getScore = function(dice) {
    var ret = fillBoard(0);

    // chance
    ret.chance = dice.reduce(function(x, y) {return x+y;});

    // full house
    var full2 = false, full3 = false;

    for(var i = 0; i < 6; i++) {
        // occurrences
        var occur = occurrences(dice, i+1);
        ret.occur[i] = occur * (i+1);

        // yahtzee
        if(occur === 5)
            ret.yahtzee = SCORES.yahtzee;
        // full house
        else if(occur === FULL_HOUSE_3)
            full3 = true;
        else if(occur === FULL_HOUSE_2)
            full2 = true;

        // 3 and 4 of a kind
        if(occur >= 3)
            ret.kind3 = ret.chance;
        if(occur >= 4)
            ret.kind4 = ret.chance;
    }

    if(full2 && full3)
        ret.fullHouse = SCORES.fullHouse;

    // straights
    // large straight if 1 of each of 5 values, (2, 3, 4, 5, and 1 or 6),
    //   and missing either 1 or 6
    if(ret.occur.filter(function(points){return points > 0;}).length === 5 &&
      (ret.occur[0] === 0 || ret.occur[5] === 0))
        ret.straightL = SCORES.straightL;

    // small straight if at least 4 in a row, starting at 1, 2 or 3
    for(var i = 0; i < 2; i++) {
        var valid = true;
        for(var j = i; j < i+4; j++) {
            if(ret.occur[j] === 0) {
                valid = false;
                break;
            }
        }
        if(valid === true) {
            ret.straightS = SCORES.straightS;
            break;
        }
    }

    return ret;
};

// can't score in same spot twice, so remove anything currently on the `board'
//   from possible scores, `score'
// * modifies score
var removeAlreadyScored = function(score, board) {
    for(var item in board) {
        if(Array.isArray(board[item]))
            removeAlreadyScored(score[item], board[item]);
        else if(board[item] !== null)
            score[item] = false;
    }
}

// returns a board filled with either a number, representing
//   the value of the location if the `dice' are scored there,
//   or false if it can not be scored there
var getValidScores = function(dice, board) {
    var score = getScore(dice);
    var yahtzee = (score.yahtzee === 0 ? false : true);

    // is second yahtzee
    if(yahtzee === true && board.yahtzee !== null) {
        // if top is not scored
        if(board.occur[dice[0]] === null) {
            // can only score in that spot
            var ret = fillBoard(false);
            ret.occur[dice[0]] = score.occur[dice[0]];
            ret.extraYahtzee = true;
            return ret;
        }
        // top is scored, so can score anywhere in lower
        score.fullHouse = SCORES.fullHouse;
        score.straightS = SCORES.straightS;
        score.straightL = SCORES.straightL;
        if(board.yahtzee !== 0)
            score.extraYahtzee = true;
    }

    removeAlreadyScored(score, board);

    return score;
};
