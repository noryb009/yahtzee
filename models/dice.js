var diceModel = function() {
    var self = this;
    self.values = ko.observableArray([
        new dieModel(), new dieModel(), new dieModel(),
        new dieModel(), new dieModel()
    ]);

    self.restart = function() {
        self.values().map(function(die) {
            die.restart();
        });
    };

    self.generate = function() {
        self.values().map(function(die) {
            die.generate();
        });
    };

    self.regenerate = function() {
        self.values().map(function(die) {
            die.regenerate();
        });
    };

    self.getValues = ko.pureComputed(function() {
        return self.values().map(function(die) {
            return die.value();
        });
    });
};
