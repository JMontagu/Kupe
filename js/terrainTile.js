var KUPE = KUPE || {};

KUPE.terrainTile = function (terrain, resourceCard, numberToken) {
    var _resourceCard = resourceCard,
        _numberToken = numberToken,
		_terrain = terrain,
        _resourceSubscriptions = [];

    console.log("Terrain: " + _terrain + ". Resource: " + _resourceCard.getName() + ". Number: " + _numberToken.getNumber());

    _numberToken.activated(function () {
        console.log("Created " + _resourceCard.getName());

        for(var i = 0; i < _resourceSubscriptions.length; i++) {
            _resourceSubscriptions[i](_resourceCard);
        }
    });

    var resourceCreatedSubscription = function(callback) {
        _resourceSubscriptions.push(callback);
    };

    return {
        getResource: function () {
            return _resource;
        },
        resourceCreatedSubscription: resourceCreatedSubscription
    }
};
