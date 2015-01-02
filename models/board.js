var boardModel = function() {
    var self = this;
    self.board = ko.observable();
    self.dice = ko.observable(new diceModel());

    self.restart = function() {
        var newBoard = fillBoard(null);
        newBoard.extraYahtzee = 0;
        self.board(newBoard);
        self.dice().generate();
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
        var addDisplay = function(label, board, score) {
            if(board !== null)
                ret.push({label: label, display: board, hover: null});
            else if(score === false)
                ret.push({label: label, display: null, hover: null});
            else
                ret.push({label: label, display: null, hover: score});
        };

        for(var i = 0; i < 6; i++) {
            addDisplay((i+1) + '\'s', self.board().occur[i], self.score().occur[i]);
        }
        addDisplay('Subtotal', self.subtotal());
        addDisplay('Bonus', self.bonus());
        addDisplay('3 of a kind', self.board().kind3, self.score().kind3);
        addDisplay('4 of a kind', self.board().kind4, self.score().kind4);
        addDisplay('Full House', self.board().fullHouse, self.score().fullHouse);
        addDisplay('Small Straight', self.board().straightS, self.score().straightS);
        addDisplay('Large Straight', self.board().straightL, self.score().straightL);
        addDisplay('Yahtzee', self.board().yahtzee, self.score().yahtzee);
        addDisplay('Chance', self.board().chance, self.score().chance);
        addDisplay('Extra Yahtzees', self.board().extraYahtzee);
        addDisplay('Total', self.total());
        return ret;
    });

    self.onClick = function(row) {
        console.log(row);
    };
};
