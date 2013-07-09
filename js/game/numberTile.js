var KUPE = KUPE || {};

KUPE.NumberTile = function(number, colour) {
	this.number = number;
	this.colour = colour;
	this.callback;

	this.getNumber = function() {
		return this.number;
	};
};

/**
 * Called each time the dice is rolled. 
 * If the dice number matches this tokens number, invoke the registered callback function.
 * @param  {string} msg The dice rolled message
 * @param  {integer} diceNumber The number of the dice roll
 */
KUPE.NumberTile.prototype.diceRolled = function(msg, diceNumber) {
	if(diceNumber === this.number) {
		if(this.callback && typeof(this.callback) === 'function') {
        	this.callback();
        } else {
        	throw new Error("diceRollEvent(): no callback function registered");
        }
	}
};

/**
 * Registers a callback function to be invoked if a dice roll 
 * matches the value of this number token
 * @param  {Function} callback The callback function to be invoked
 */
KUPE.NumberTile.prototype.activated = function(callback) {
	this.callback = callback;
};

/**
 * Draws this numberTile object onto the scene, at the given coordinates
 * @param  {THREE.3dObject} scene The scene to attach this object too
 * @param  {number} posX The X-coord this object will display at
 * @param  {number} posY The Y-coord this object will display at
 */
KUPE.NumberTile.prototype.draw = function(scene, position) {
	var numberPosX = (this.number < 10) ? 125 : 100;
		
	var token = new THREE.CylinderGeometry(10.0, 10.0, 2, 100.0, 10.0, false);

	// Number
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	ctx.font = "Bold 90px Arial";
	ctx.fillStyle = this.colour;
    ctx.fillText(this.number, numberPosX, 100);
    
	// canvas contents will be used for a texture
	var numberTexture = new THREE.Texture(canvas) 
	numberTexture.needsUpdate = true;

	// Create 'token'
	var patchMaterial =	new THREE.MeshLambertMaterial({map: numberTexture });
	var numberToken = new THREE.Mesh(new THREE.CircleGeometry( 16, 64 ), patchMaterial );
	//var numberToken = new THREE.Mesh(token, patchMaterial);

	numberToken.rotation.x = -90 * Math.PI / 180;
	numberToken.position = position;
	numberToken.position.y = 1;
	numberToken.castShadow = true;

	scene.add(numberToken);
};