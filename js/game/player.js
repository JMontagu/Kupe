KUPE.player = function(colour, name) {
	var _colour = colour,
		_name = name,
		_settlements = [],
		_cities = [],
		_roads = [],
		_resourceCards = [],
		_developmentCards = [];
		
	var MAX_SETTLEMENTS = 5;
	var MAX_CITIES = 4;
	var MAX_ROADS = 15;

	var collectResource = function(resourceCard, quantity) {
		console.log("Player " + _name + " has gained " + quantity + " cards of type " + resourceCard.getName());
		
		for(var i = 0; i < quantity; i++) {
			_resourceCards.push(resourceCard);
		}
	};

	var createSettlement = function(settlement) {
		if(!settlement || !(settlement instanceof KUPE.settlement)) {
			throw "invalid settlement object"; 
		}
		if(_settlements.length >= MAX_SETTLEMENTS) {
			throw "max settlements created";
		}
		
		settlement.registerResourceGained(collectResource);
		_settlements.push(settlement);
		
		console.log(_name + " has built a settlement. Now has " + _settlements.length);
	};
	
	var calculatePoints = function() {
	
	};

	return {
		getName : function() {
			return _name;
		},
		getColour : function() {
			return _colour;
		},
		getResourceCards : function() {
			return _resourceCards;
		},
		getSettlements : function() {
			return _settlements;
		},
		getPoints : calculatePoints,
		createSettlement : createSettlement
	}

};