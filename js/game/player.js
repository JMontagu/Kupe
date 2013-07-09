var KUPE = KUPE || {};

KUPE.Player = function(colour, name) {
	var MAX_SETTLEMENTS = 5;
		MAX_CITIES = 4;
		MAX_ROADS = 15;

	this.colour = colour;
	this.playerName = name;

	this.resourceCards = [];
	this.developmentCards = [];
	this.cities = [];
	this.settlements = [];
	this.roads = [];

	this.getName = function() {
		return this.playerName;
	};
};

/**
 * Callback invoked by settlements when a resource has been produced
 * @param  {[type]} resourceCard The resource produced
 * @param  {[type]} quantity The number of resource cards produced
 * @return {[type]}
 */
KUPE.Player.prototype.collectSettlementResource = function(resourceCard, quantity) {
	console.log("Player " + this.getName() + " has gained " + quantity + " card of type " + resourceCard.getName());
		
	for(var i = 0; i < quantity; i++) {
		this.resourceCards.push(resourceCard);
	}

	console.log("Resources: ");
	for(var i = 0; i < this.resourceCards.length; i++){
		console.log(this.resourceCards[i].getName());
	}
};

/**
 * Creates a settlement boardering the provided terrain tiles. If a terrain tile produces a resource, this settlement will collect it.
 * @param  {Array} terrainTiles The three terrain tiles this settlement will collect from
 */
KUPE.Player.prototype.createSettlement = function(terrainTiles) {
	var settlement = new KUPE.Settlement(terrainTiles, this.colour);
	settlement.registerResourceGained(this.collectSettlementResource.bind(this));

	this.settlements.push(settlement);
	
	console.log(this.getName() + " has built a settlement. Will get resources for:");
	for(var i = 0; i < terrainTiles.length; i++) {
		if(!terrainTiles[i].getResourceCard()) continue;

		var resourceCard = terrainTiles[i].getResourceCard(),
			resourceName = resourceCard ? resourceCard.getName() : " Nothing";


		console.log(""+ terrainTiles[i].getNumber() + ": " + resourceName);
	}
};

/**
 * Upgrades the settlement
 * @param  {[type]} settlement
 * @return {[type]}
 */
KUPE.Player.prototype.upgradeSettlement = function(settlement) {
	settlement.registerResourceGained(this.collectSettlementResource.bind(this));

	this.settlements.push(settlement);
	
	console.log(this.getName() + " has updated a settlement to a city. Will now get 2x resources for:");
	for(var i = 0; i < terrainTiles.length; i++) {
		if(!terrainTiles[i].getResourceCard()) continue;

		var resourceCard = terrainTiles[i].getResourceCard(),
			resourceName = resourceCard ? resourceCard.getName() : " Nothing";


		console.log(""+ terrainTiles[i].getNumber() + ": " + resourceName);
	}
};