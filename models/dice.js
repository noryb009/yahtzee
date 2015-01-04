var diceModel = function() {
    var self = this;
    self.values = ko.observableArray([
        new dieModel(), new dieModel(), new dieModel(),
        new dieModel(), new dieModel()
    ]);

    // on game restart
    self.restart = function() {
        self.values().map(function(die) {
            die.restart();
        });
    };

    // force reroll of all dice
    self.generate = function() {
        self.values().map(function(die) {
            die.generate();
        });
    };

    // reroll, if not kept
    self.regenerate = function() {
        self.values().map(function(die) {
            die.regenerate();
        });
    };

    // get an array of integers between 1 and 6, representing
    //   the values of the dice
    self.getValues = ko.pureComputed(function() {
        return self.values().map(function(die) {
            return die.value();
        });
    });
};
