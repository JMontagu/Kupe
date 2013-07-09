var KUPE = KUPE || {};

KUPE.resourceCard = function(name, colour) {
	if(name === null) throw new Error("ResourceCard(): name cannot be null");
	if(colour === null) throw new Error("ResourceCard(): colour cannot be null");
	
	this.name = name;
	this.colour = colour;

	this.getName = function() {
		return this.name;
	};

	this.getColour = function() {
		return this.colour;
	};
};