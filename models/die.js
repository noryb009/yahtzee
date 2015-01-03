var generateDie = function() {
    // doesn't need to be cryptographically secure
    return Math.floor(Math.random() * 6) + 1;
};

var dieModel = function() {
    var self = this;
    self.value = ko.observable();
    self.keep = ko.observable();

    self.restart = function() {
        self.value(0);
        self.keep(false);
    };// generate a random die

    self.generate = function() {
        self.value(generateDie());
        self.keep(false);
    };
    self.regenerate = function() {
        if(self.keep() === false)
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
    self.style = ko.pureComputed(function() {
        if(self.keep() === true)
            return 'unlocked';
        else
            return 'locked';
    });
}
