// generate an integer between 1 and 6
var generateDie = function() {
    // doesn't need to be cryptographically secure
    return Math.floor(Math.random() * 6) + 1;
};

var dieModel = function() {
    var self = this;
    self.value = ko.observable();
    self.keep = ko.observable(); // reroll or keep value

    // on game restart
    self.restart = function() {
        self.value(0);
        self.keep(false);
    };

    // force reroll
    self.generate = function() {
        self.value(generateDie());
        self.keep(false);
    };
    // reroll, unless being kept
    self.regenerate = function() {
        if(self.keep() === false)
            self.value(generateDie());
    };

    // toggle if should be kept or rerolled
    self.toggleKeep = function() {
        self.keep(!self.keep());
    };
    // source of dice image
    self.imgSource = ko.pureComputed(function() {
        var src = "img/dice-" + self.value();
        if(self.keep() === true)
            src += "-locked";
        src += ".png";
        return src;
    });
    // class to apply to die
    self.style = ko.pureComputed(function() {
        if(self.keep() === true)
            return 'unlocked';
        else
            return 'locked';
    });
}
