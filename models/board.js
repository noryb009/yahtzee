var boardModel = function() {
    var self = this;
    self.board = ko.observable();
    self.dice = ko.observable(new diceModel());
    self.rollNumber = ko.observable(0);

    self.restart = function() {
        var newBoard = fillBoard(null);
        newBoard.extraYahtzee = 0;
        self.board(newBoard);
        self.dice().restart();
    };
    self.restart();

    self.score = ko.pureComputed(function(board) {
        return getValidScores(self.dice().getValues(), self.board());
    });

    self.subtotal = ko.pureComputed(function() {
        return self.board().occur.reduce(function(total, val) {
            if(val === null)
                return total;
            else
                return total + val;
        }, 0);
    });

    self.bonus = ko.pureComputed(function() {
        if(self.subtotal() >= 63)
            return 35;
        else
            return 0;
    });

    self.total = ko.pureComputed(function() {
        var ret = self.subtotal;
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

    self.indexToVal = function(score, index) {
        if(Number.isInteger(index))
            return score.occur[index];
        else
            return score[index];
    };

    self.saveAtIndex = function(score, index, val) {
        if(Number.isInteger(index))
            score.occur[index] = val;
        else
            score[index] = val;
    };

    self.onClick = function(row) {
        if(self.rollNumber() === 0 || row.index === undefined
          || self.indexToVal(self.score(), row.index) === false)
            return;

        self.saveAtIndex(self.board(), row.index, self.indexToVal(self.score(), row.index));
        if(self.score().extraYahtzee === true)
            self.board().extraYahtzee += 100;
        self.board.valueHasMutated();

        self.rollNumber(0);
    };

    self.onReroll = function() {
        if(self.rollNumber() === 0)
            self.dice().generate();
        else if(self.rollNumber() < 3)
            self.dice().regenerate();
        self.rollNumber(self.rollNumber()+1);
    };

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
    self.btnDisabled = ko.pureComputed(function() {
        if(self.rollNumber() > 2)
            return true;
        return false;
    });
};
