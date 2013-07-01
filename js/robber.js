var KUPE = KUPE || {};

KUPE.robber = function () {
    var _isActive = false;

    var diceRollEvent = function (msg, data) {
        if (data === 7) {
            _isActive = true;
            console.log("Robber activated!");
        } else {
            _isActive = false;
        }
    };

    return {
        getIsActive: function () {
            return _isActive;
        },
        diceRolled: diceRollEvent
    }
};
