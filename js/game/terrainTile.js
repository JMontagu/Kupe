var KUPE = KUPE || {};

KUPE.terrainTile = function (position, terrain, resourceCard, numberToken) {
    var _position = position,
		_resourceCard = resourceCard,
        _numberToken = numberToken,
		_terrain = terrain,
        _resourceSubscriptions = [],
		_3dObjects = [],
		_robber;

	var hasRobber = function() {
		return _robber !== 'undefined';
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
	
	var draw = function(scene, offsetX, offsetY) {
		var width = 120,
			height = 120,
			cx = (_position.x + offsetX) * width - (_position.y + offsetY) * width / 2,
			cy = (_position.y + offsetY) * (3/4 * height);
		
		// Rect
		var terrainTile = new THREE.Shape();
		terrainTile.moveTo(cx, cy - height/2);
		terrainTile.lineTo(cx + width/2, cy - height/4);
		terrainTile.lineTo(cx + width/2, cy + height/4);
		terrainTile.lineTo(cx, cy + height/2);
		terrainTile.lineTo(cx - width/2, cy + height/4);
		terrainTile.lineTo(cx - width/2, cy - height/4);
		terrainTile.lineTo(cx, cy - height/2);
		
		var meshGeometry = new THREE.ShapeGeometry( terrainTile );
		
		terrainTile.lineTo(cx + width/2, cy - height/4);
		var lineGeometry = new THREE.ShapeGeometry( terrainTile );
		
		var material = [
			new THREE.MeshLambertMaterial({ 
				color: _terrain.Colour
			} )
		];

		var lineMaterial = new THREE.LineBasicMaterial( { color: '#000', linewidth: 1} );
		
		var mesh = THREE.SceneUtils.createMultiMaterialObject( meshGeometry, material );
		var line = new THREE.Line( lineGeometry, lineMaterial, THREE.LineStrip );
		
		// mesh.position.set(0,-200,0);
		// line.position.set(0,-200,0);

		_3dObjects.push(mesh);
		_3dObjects.push(line);
		
		scene.add(mesh);
		scene.add(line);
		
		// Number token
		if(_numberToken){
			_numberToken.draw(scene, width, cx, cy);
		}

		// if(hasRobber()) {
			// console.log("Robber!");
			// _robber.draw(scene, cx, cy);
		// }
		// var numberToken = new THREE.Shape();
		// numberToken.arc(cx, cy, 1, 0,  Math.PI * 2, true );
		// numberToken.fill();
		// scene.add(numberToken);
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
		draw: draw,
		animate: animate,
        resourceCreatedSubscription: resourceCreatedSubscription
    }
};
