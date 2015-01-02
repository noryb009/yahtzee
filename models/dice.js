var dieModel = function() {
    var self = this;
    self.value = ko.observable();
    self.keep = ko.observable();

    self.generate = function() {
        self.value(generateDie());
        self.keep(false);
    };
    self.regenerate = function() {
        if(keep() === false)
            self.value(generateDie());
    };

    self.toggleKeep = function() {
        self.keep(!self.keep());
    };
    self.imgSource = ko.pureComputed(function() {
        var src = "img/dice-" + self.value();
        if(self.keep() === true)
            src += "-locked";
        src += ".png";
        return src;
    });
}

var diceModel = function() {
    var self = this;
    self.values = ko.observableArray([
        new dieModel(), new dieModel(), new dieModel(),
        new dieModel(), new dieModel()
    ]);

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
