/// <reference path="dice.js" />
/// <reference path="numberTile.js" />
/// <reference path="resource.js" />
/// <reference path="resourceTile.js" />
/// <reference path="pubsub.js" />
/// <reference path="robber.js" />

var KUPE = KUPE || {};

KUPE.tileGenerator = function () {
    var resources = [   { Terrain: "Forest", Resource: new KUPE.resourceCard('Lumber', '#659D32'), Quantity: 4 },
                        { Terrain: "Pasture", Resource: new KUPE.resourceCard('Wool', ''), Quantity: 4 },
                        { Terrain: "Fields", Resource: new KUPE.resourceCard('Grain', ''), Quantity: 4 },
                        { Terrain: "Hills", Resource: new KUPE.resourceCard('Brick', ''), Quantity: 3 },
                        { Terrain: "Mountains", Resource: new KUPE.resourceCard('Ore', ''), Quantity: 3 }]

    var numberTokens = [{ Number: 2, Quantity: 1 },
                        { Number: 3, Quantity: 2 },
                        { Number: 4, Quantity: 2 },
                        { Number: 5, Quantity: 2 },
                        { Number: 6, Quantity: 2 },
                        // ROBBER 7
                        { Number: 8, Quantity: 2 },
                        { Number: 9, Quantity: 2 },
                        { Number: 10, Quantity: 2 },
                        { Number: 11, Quantity: 2 },
                        { Number: 12, Quantity: 1 }];

    var getResource = function () {
        var i = Math.floor(Math.random() * resources.length);
        var resource = resources[i];

        if (resource.Quantity > 0) {
            resource.Quantity -= 1;
            return resource;
        } else {
            return getResource();
        }
    };

    var getNumberToken = function () {
        var i = Math.floor(Math.random() * numberTokens.length);
        var numberToken = numberTokens[i];

        if (numberToken.Quantity > 0) {
            numberToken.Quantity -= 1;
            return new KUPE.numberTile(numberToken.Number);
        } else {
            return getNumberToken();
        }
    }

    var createTiles = function () {
        var tiles = [];

        for (i = 0; i < 18; i++) {
            var resource = getResource(),
                numberToken = getNumberToken();

            PubSub.subscribe("diceRolled", numberToken.diceRolled);

            tiles.push(new KUPE.terrainTile(resource.Terrain, resource.Resource, numberToken));
        }

        return tiles;
    };

    return {
        createTiles: createTiles
    }
};

KUPE.game = (function () {
    var self = this,
        terrainTiles = [],
        robber,
        players = [],
        currentPlayer,
        dice;

    var DICE_ROLLED = "diceRolled";

    var game = function () {
        var tileGenerator = new KUPE.tileGenerator();
        terrainTiles = tileGenerator.createTiles();
        robber = new KUPE.robber();

        PubSub.subscribe("diceRolled", robber.diceRolled);
        console.log("Tiles: " + terrainTiles.length);
        self.dice = new KUPE.dice();
    };

    var createPlayer = function(name) {
        var newPlayer = new KUPE.player('Blue', name);
        players.push(newPlayer);
        console.log("New player joined: " + name);
        if(players.length === 1) {
            currentPlayer = players[0];
        }
    }

    var rollDice = function () {
        var number = self.dice.rollPair();
        PubSub.publish(DICE_ROLLED, number);

        return number;
    }

    game.prototype = {
        constructor: game,
        rollDice: rollDice,
        createPlayer: createPlayer,
        getCurrentPlayer: function() {
            return currentPlayer;
        },
        getResourceTiles: function() {
            return terrainTiles;
        }
    };

    return game;
})(KUPE);