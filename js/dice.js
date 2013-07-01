var KUPE = KUPE || {};

KUPE.dice = (function () {
    "use strict";

    var min = 1,
        max = 6;

    var dice = function () {};

    function rollDie() {
        return Math.round(min + (Math.random() * (max - min)));
    };

    function rollPair() {
        return rollDie() + rollDie();
    };

    dice.prototype = {
        constructor: dice,
        rollDie: rollDie,
        rollPair: rollPair
    }

    return dice;
})();