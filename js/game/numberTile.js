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
		// Draw number
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		ctx.font = "Bold 10px Arial";
		ctx.fillText('2', 0, 50);
		
		var numberTexture = new THREE.Texture(canvas);
		var numberMaterials = [
			new THREE.MeshBasicMaterial( { color: 0xffffff } )
		]

		// Number
		var canvas1 = document.createElement('canvas');
		var context1 = canvas1.getContext('2d');
		context1.font = "Bold 80px Arial";
		context1.fillStyle = _colour;
	    context1.fillText(_number, 100, 100);
	    
		// canvas contents will be used for a texture
		var texture1 = new THREE.Texture(canvas1) 
		texture1.needsUpdate = true;

		// Create 'token'
		var patchMaterial = new THREE.MeshLambertMaterial({map: texture1 });
		var numberToken = new THREE.Mesh(new THREE.CircleGeometry( 16, 64 ), patchMaterial );

		numberToken.position.x = posX;
		numberToken.position.y = posY;
		numberToken.position.z = 1;

		scene.add(numberToken);

		//scene.add( mesh1 );
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

