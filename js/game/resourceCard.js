var KUPE = KUPE || {};

KUPE.resourceCard = function(name, colour) {
	var _name = name,
		_colour = colour;
		
	return {
		getName: function() {
			return _name;
		},
		getColour: function() {
			return _colour;
		}
	}
};