var KUPE = KUPE || {};

KUPE.settlement = function (terrainTiles) {
	var self = this,
		_terrainTiles = terrainTiles,
		_resourceGainedCallback = [];

	/**
	 * Registers the callback function, which will be invoked when 
	 * @param {callback}
	 */
	var resourceGainedEvent = function(callback) {
		_resourceGainedCallback.push(callback);
	};

	/**
	 * 
	 * @param resourceCard
	 */
	var resourceCreated = function(resourceCard) {
		console.log("Settlement gained: " + resourceCard.getName());
		
		for(var i = 0; i < _resourceGainedCallback.length; i++) {
			_resourceGainedCallback[i](resourceCard, 1);
		}
	};

	function draw(source) {

	}

	for(var i = 0; i < _terrainTiles.length; i++) {
		_terrainTiles[i].resourceCreatedSubscription(resourceCreated);
	}


	return {
		draw: draw,
		registerResourceGained : resourceGainedEvent
	};
};