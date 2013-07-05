var KUPE = KUPE || {};

KUPE.terrainTile = function (arrayPos, terrain, resourceCard, numberToken) {
	var TILE_SIZE = 120;

    var _arrayPos = arrayPos,
		_position = new THREE.Vector3(),
		_resourceCard = resourceCard,
        _numberToken = numberToken,
		_terrain = terrain,
        _resourceSubscriptions = [],
		_3dObjects = [],
		_robber;

	_position.x = _arrayPos.x * TILE_SIZE - (_arrayPos.y * TILE_SIZE) / 2,
	_position.z = _arrayPos.y * (3/4 * TILE_SIZE);
		
	var hasRobber = function() {
		return _robber && _robber !== 'undefined';
	}

	if(_numberToken) {
		_numberToken.activated(function () {
			if(hasRobber()) {
				console.log("Robber stole " + _resourceCard.getName());
				return;
			}

	        console.log("Created " + _resourceCard.getName());

	        for(var i = 0; i < _resourceSubscriptions.length; i++) {
	            _resourceSubscriptions[i](_resourceCard);
	        }
	    });	
	}

    var resourceCreatedSubscription = function(callback) {
        _resourceSubscriptions.push(callback);
    };
	
	var animate = function(angleChange) {
		// for(var i = 0; i < _3dObjects.length; i++) {
			// _3dObjects[i].rotation.z += angleChange;
		// }
	};
	
	var draw = function(scene) {
		var cx = _position.x;
		var cy = _position.z;
		
		// Rect
		var terrainTile = new THREE.Shape();
		terrainTile.moveTo(cx, cy - TILE_SIZE/2);
		terrainTile.lineTo(cx + TILE_SIZE/2, cy - TILE_SIZE/4);
		terrainTile.lineTo(cx + TILE_SIZE/2, cy + TILE_SIZE/4);
		terrainTile.lineTo(cx, cy + TILE_SIZE/2);
		terrainTile.lineTo(cx - TILE_SIZE/2, cy + TILE_SIZE/4);
		terrainTile.lineTo(cx - TILE_SIZE/2, cy - TILE_SIZE/4);
		terrainTile.lineTo(cx, cy - TILE_SIZE/2);
		
		var meshGeometry = new THREE.ShapeGeometry( terrainTile );
		
		terrainTile.lineTo(cx + TILE_SIZE/2, cy - TILE_SIZE/4);
		var lineGeometry = new THREE.ShapeGeometry( terrainTile );
		
		var material = [
			new THREE.MeshLambertMaterial({ 
				color: _terrain.Colour
			} )
		];

		var lineMaterial = new THREE.LineBasicMaterial( { color: '#000', linewidth: 1} );
		
		var mesh = THREE.SceneUtils.createMultiMaterialObject( meshGeometry, material );
		var line = new THREE.Line( lineGeometry, lineMaterial, THREE.LineStrip );
		
		mesh.rotation.x = -90 * Math.PI / 180;
		line.rotation.x = -90 * Math.PI / 180;

		_3dObjects.push(mesh);
		_3dObjects.push(line);
		
		scene.add(mesh);
		scene.add(line);
		
		// Number token
		if(_numberToken){
			_numberToken.draw(scene, cx, -cy);
		}

		if(hasRobber()) {
			_robber.draw(scene, cx, -cy);
		}
	};

    return {
        getResourceCard: function () {
            return _resourceCard;
        },
		getPosition: function () {
			return _position;
		},
		getNumberToken: function () {
			return _numberToken;
		},
		hasRobber: hasRobber,
		takeRobber: function(robber) {
			_robber = robber;
		},
		giveRobber: function() {
			var r = _robber;
			_robber = null;
			return r;
		},
		draw: draw,
		animate: animate,
        resourceCreatedSubscription: resourceCreatedSubscription
    }
};
