var KUPE = KUPE || {};

KUPE.numberTile = function (number, colour) {
    var _number = number,
		_colour = colour,
        _callback;

    var diceRollEvent = function (msg, data) {
		console.log("Rolled");
        if (data === _number) {
            _callback();
        }
    };

    var activated = function (callback) {
        _callback = callback;
    };
	
	var draw = function(scene, posX, posY) {
		var numberPosX = (_number < 10) ? 125 : 100;
		
		// Number
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		ctx.font = "Bold 80px Arial";
		ctx.fillStyle = _colour;
	    ctx.fillText(_number, numberPosX, 100);
	    
		// canvas contents will be used for a texture
		var numberTexture = new THREE.Texture(canvas) 
		numberTexture.needsUpdate = true;

		// Create 'token'
		var patchMaterial = new THREE.MeshLambertMaterial({map: numberTexture });
		var numberToken = new THREE.Mesh(new THREE.CircleGeometry( 16, 64 ), patchMaterial );

		numberToken.rotation.x = -90 * Math.PI / 180;
		numberToken.position.y = 1;
		numberToken.position.x = posX;
		numberToken.position.z = posY;

		scene.add(numberToken);
	};

    return {
        getNumber: function () {
            return _number;
        },
		draw: draw,
        activated: activated,
        diceRolled: diceRollEvent
    }
};

