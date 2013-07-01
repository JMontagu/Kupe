var KUPE = KUPE || {};

KUPE.settlement = function (terrainTiles) {
	var self = this,
		_terrainTiles = terrainTiles,
		_resourceGainedCallback = [];

	var resourceGainedEvent = function(callback) {
		_resourceGainedCallback.push(callback);
	};

	var resourceCreated = function(resourceCard) {
		console.log("Settlement gained: " + resourceCard.getName());
		
		for(var i = 0; i < _resourceGainedCallback.length; i++) {
			_resourceGainedCallback[i](resourceCard, 1);
		}
	};


	for(var i = 0; i < _terrainTiles.length; i++) {
		_terrainTiles[i].resourceCreatedSubscription(resourceCreated);
	}


	return {
		registerResourceGained : resourceGainedEvent
	};
};