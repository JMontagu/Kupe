KUPE.player = function(colour, name) {
	var _colour = colour,
		_name = name,
		_settlements = [],
		_resourceCards = [];

	var collectResource = function(resourceCard, quantity) {
		console.log("Player " + _name + " has gained " + quantity + " cards of type " + resourceCard.getName());
		
		for(var i = 0; i < quantity; i++) {
			_resourceCards.push(resourceCard);
		}
	};

	var createSettlement = function(settlement) {
		settlement.registerResourceGained(collectResource);
		_settlements.push(settlement);
		
		console.log(_name + " has built a settlement. Now has " + _settlements.length);
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
		createSettlement : createSettlement
	}

};