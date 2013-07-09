var KUPE = KUPE || {};

KUPE.numberTile = function (number, colour) {
    var _number = number,
		_colour = colour,
        _callback;

    /**
     * Called each time the dice is rolled. If the dice number matches
     * this number token, invoke the registered callback function.
     * @param  {string} msg The dice rolled message
     * @param  {integer} diceNumber The number of the dice roll
     */
    function diceRollEvent(msg, diceNumber) {
        if (diceNumber === _number) {
            if(_callback && typeof(_callback) === 'function') {
            	_callback();
            } else {
            	throw new Error("diceRollEvent(): registered callback not a function");
            }
        }
    };

    /**
     * Registers a callback function to be invoked if a dice roll 
     * matches the value of this number token
     * @param  {Function} callback The callback function to be invoked
     */
    function activated(callback) {
        _callback = callback;
    };
	
	/**
	 * Draws this numberTile object onto the scene, at the given coordinates
	 * @param  {THREE.3dObject} scene The scene to attach this object too
	 * @param  {number} posX The X-coord this object will display at
	 * @param  {number} posY The Y-coord this object will display at
	 */
	function draw(scene, position) {
		var numberPosX = (_number < 10) ? 125 : 100;
		
		var token = new THREE.CylinderGeometry(10.0, 10.0, 2, 100.0, 10.0, false);

		// Number
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		ctx.font = "Bold 90px Arial";
		ctx.fillStyle = _colour;
	    ctx.fillText(_number, numberPosX, 100);
	    
		// canvas contents will be used for a texture
		var numberTexture = new THREE.Texture(canvas) 
		numberTexture.needsUpdate = true;

		// Create 'token'
		var patchMaterial =	new THREE.MeshLambertMaterial({map: numberTexture });
		//var numberToken = new THREE.Mesh(new THREE.CircleGeometry( 16, 64 ), patchMaterial );
		var numberToken = new THREE.Mesh(token, patchMaterial);

		//numberToken.rotation.x = -90 * Math.PI / 180;
		numberToken.position = position;
		numberToken.position.y = 0;
		numberToken.castShadow = true;
		//numberToken.position.y = 50;

		scene.add(numberToken);
	};

    return {
        getNumber: function () {
            return this.number;
        },
		draw: draw,
        activated: activated,
        diceRolled: diceRollEvent
    }
};

