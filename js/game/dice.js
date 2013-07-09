var KUPE = KUPE || {};

/**
 * Single dice object
 * @param  {number} min
 * @param  {number} max
 */
KUPE.Dice = function(min, max) {
    if(min === undefined || isNaN(min)) {
        throw new Error("Dice(): min value number required");
    }
    if(max === undefined || isNaN(max)) {
        throw new Error("Dice(): max value number required");
    }

    this.min = min;
    this.max = max;
}

/**
 * Rolls dice
 * @return {number}
 */
KUPE.Dice.prototype.roll = function() {
    return Math.round(this.min + (Math.random() * (this.max - this.min)));
};