var KUPE = KUPE || {};

KUPE.numberTile = function (number) {
    var _number = number,
        _callback;

    var diceRollEvent = function (msg, data) {
        if (data === _number) {
            _callback();
        }
    };

    var activated = function (callback) {
        _callback = callback;
    };

    return {
        getNumber: function () {
            return _number;
        },
        activated: activated,
        diceRolled: diceRollEvent
    }
};

