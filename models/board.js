var boardModel = function() {
    var self = this;
    self.board = ko.observable();
    self.dice = ko.observable(new diceModel());
    self.rollNumber = ko.observable(0);

    // on game restart
    self.restart = function() {
        var newBoard = fillBoard(null); // reset board
        newBoard.extraYahtzee = 0; // can't place on extra yahtzee, init to 0
        self.board(newBoard); // set board
        self.dice().restart(); // reset dice to 0
    };
    self.restart();

    // compute possible scores
    self.score = ko.pureComputed(function(board) {
        return getValidScores(self.dice().getValues(), self.board());
    });

    // compute subtotal (first 6 lines)
    self.subtotal = ko.pureComputed(function() {
        return self.board().occur.reduce(function(total, val) {
            if(val === null)
                return total;
            else
                return total + val;
        }, 0);
    });

    // compute bonus value (35 bonus points if subtotal >= 63)
    self.bonus = ko.pureComputed(function() {
        if(self.subtotal() >= 63)
            return 35;
        else
            return 0;
    });

    // compute total points
    self.total = ko.pureComputed(function() {
        var ret = self.subtotal;

        // spots not yet used are null, so count them as 0
        var zeroIfNull = function(val) {
            if(val === null)
                return 0;
            else
                return val;
        };
        return self.subtotal() + self.bonus()
            + zeroIfNull(self.board().kind3) + zeroIfNull(self.board().kind4)
            + zeroIfNull(self.board().fullHouse) + zeroIfNull(self.board().chance)
            + zeroIfNull(self.board().straightS) + zeroIfNull(self.board().straightL)
            + zeroIfNull(self.board().yahtzee) + zeroIfNull(self.board().extraYahtzee);
    });

    // compute the rows which should be displayed
    //   returns an array of objects. These objects contain:
    //   - label, a "pretty name" for the row
    //   - display, what value should be displayed
    //   - style, the class which should be applied to display
    //   - index (optional), the index of the value in the board
    //     => if an integer, is actually .occur[index]
    self.display = ko.pureComputed(function() {
        var ret = [];
        var addDisplay = function(label, index, info) {
            if(info === true) {
                ret.push({label: label, display: index, style: 'saved'});
                return;
            }
            var board = self.indexToVal(self.board(), index);
            var score = self.indexToVal(self.score(), index);

            if(board !== null)
                ret.push({label: label, display: board, style: 'saved', index: index});
            else if(self.rollNumber() === 0)
                ret.push({label: label, display: "", style: 'saved', index: index});
            else if(score === false)
                ret.push({label: label, display: "", style: 'locked', index: index});
            else
                ret.push({label: label, display: score, style: 'hide', index: index});
        };

        for(var i = 0; i < 6; i++) {
            addDisplay((i+1) + '\'s', i);
        }
        addDisplay('Subtotal', self.subtotal(), true);
        addDisplay('Bonus', self.bonus(), true);
        addDisplay('3 of a kind', 'kind3');
        addDisplay('4 of a kind', 'kind4');
        addDisplay('Full House', 'fullHouse');
        addDisplay('Small Straight', 'straightS');
        addDisplay('Large Straight', 'straightL');
        addDisplay('Yahtzee', 'yahtzee');
        addDisplay('Chance', 'chance');
        addDisplay('Extra Yahtzees', self.board().extraYahtzee, true);
        addDisplay('Total', self.total(), true);
        return ret;
    });

    // get the value at a given index from a scoreboard
    self.indexToVal = function(score, index) {
        if(Number.isInteger(index))
            return score.occur[index];
        else
            return score[index];
    };

    // set the value at a given index of a scoreboard
    self.saveAtIndex = function(score, index, val) {
        if(Number.isInteger(index))
            score.occur[index] = val;
        else
            score[index] = val;
    };

    // when the row is clicked, the roll should be saved, if possible
    self.onClick = function(row) {
        if(self.rollNumber() === 0 || row.index === undefined
          || self.indexToVal(self.score(), row.index) === false)
            return;

        self.saveAtIndex(self.board(), row.index, self.indexToVal(self.score(), row.index));
        if(self.score().extraYahtzee === true)
            self.board().extraYahtzee += 100;
        self.board.valueHasMutated();

        self.rollNumber(0);

        // end game
        if(isGameFinished(self.board())) {
            alert('You have ' + self.total() + ' points!');
        }
    };

    // when the reroll button is clicked
    self.onReroll = function() {
        // on first roll, reroll all dice, regardless of if they are kept
        if(self.rollNumber() === 0) {
            // reset game, if needed
            if(isGameFinished(self.board()))
                self.restart();
            self.dice().generate();
        }
        // on other rolls, reroll dice not kept
        else if(self.rollNumber() < 3)
            self.dice().regenerate();
        self.rollNumber(self.rollNumber()+1);
    };

    // text of the reroll button
    self.btnText = ko.pureComputed(function() {
        switch(self.rollNumber()) {
            case 0:
                return "Start";
            case 1:
                return "Roll 2";
            case 2:
                return "Roll 3";
            default:
                return "Score";
        }
    });
    // determines if the reroll button should be clickable
    self.btnDisabled = ko.pureComputed(function() {
        if(self.rollNumber() > 2)
            return true;
        return false;
    });
};
