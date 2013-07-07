var KUPE = KUPE || {};

KUPE.terrainTile = (function() {
	var TILE_SIZE = 120;

    var self = this,
    	_arrayPos,
		_position,
		_resourceCard,
        _numberToken,
		_terrain,
        _resourceSubscriptions = [],
		gameObject,
		_hasRobber = false;
	
	function resourceCreated() {
		if(_hasRobber) {
			console.log("Robber stole " + _resourceCard.getName());
			return;
		}

        console.log("Created " + _resourceCard.getName());

        for(var i = 0; i < _resourceSubscriptions.length; i++) {
            _resourceSubscriptions[i](_resourceCard);
        }
	};

    function resourceCreatedSubscription(callback) {
        _resourceSubscriptions.push(callback);
    };
	
	function render(scene) {
		var cx = 0//this.position.x;
		var cz = 0//this.position.z;
		// var mesh = new THREE.Mesh( new THREE.CubeGeometry( TILE_SIZE, TILE_SIZE, TILE_SIZE), new THREE.MeshNormalMaterial() );
		// console.log(this.position);
		// mesh.position.x = this.position.x;
		// mesh.position.z = this.position.z;
		// mesh.position.y = this.position.y;
		// Rect
		var tilePts = [];
		tilePts.push( new THREE.Vector2 (cx, cz - TILE_SIZE/2) );
		tilePts.push( new THREE.Vector2 (cx + TILE_SIZE/2, cz - TILE_SIZE/4) );
		tilePts.push( new THREE.Vector2 (cx + TILE_SIZE/2, cz + TILE_SIZE/4) );
		tilePts.push( new THREE.Vector2 (cx, cz + TILE_SIZE/2) );
		tilePts.push( new THREE.Vector2 (cx - TILE_SIZE/2, cz + TILE_SIZE/4) );
		tilePts.push( new THREE.Vector2 (cx - TILE_SIZE/2, cz - TILE_SIZE/4) );
		tilePts.push( new THREE.Vector2 (cx, cz - TILE_SIZE/2) );
		// var terrainTile = new THREE.Shape();
		// terrainTile.moveTo(cx, cz - TILE_SIZE/2);
		// terrainTile.lineTo(cx + TILE_SIZE/2, cz - TILE_SIZE/4);
		// terrainTile.lineTo(cx + TILE_SIZE/2, cz + TILE_SIZE/4);
		// terrainTile.lineTo(cx, cz + TILE_SIZE/2);
		// terrainTile.lineTo(cx - TILE_SIZE/2, cz + TILE_SIZE/4);
		// terrainTile.lineTo(cx - TILE_SIZE/2, cz - TILE_SIZE/4);
		// terrainTile.lineTo(cx, cz - TILE_SIZE/2);
		//terrainTile.lineTo(cx + TILE_SIZE/2, cz - TILE_SIZE/4);

		var tileShape = new THREE.Shape(tilePts);
		var extrusionSettings = {
			amount: 3, bevelThickness: 1, bevelSize: 1, bevelEnabled: true
			//material: 0, extrudeMaterial: 1
		};
		var geometry = tileShape.extrude(extrusionSettings);

		// var meshGeometry = new THREE.ShapeGeometry( terrainTile );
		// var lineGeometry = new THREE.ShapeGeometry( terrainTile );
		
		var material = [
			new THREE.MeshLambertMaterial({ 
				color: this.terrain.Colour
			})
		];

		// var lineMaterial = new THREE.LineBasicMaterial( { color: '#000', linewidth: 1} );
		
		var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, material );
		// var line = new THREE.Line( lineGeometry, lineMaterial, THREE.LineStrip );
		
		mesh.rotation.x = -90 * Math.PI / 180;
		//mesh.rotation.z = -90 * Math.PI / 180;
		//line.rotation.x = -90 * Math.PI / 180;
		mesh.position = this.position;
		mesh.receiveShadow = true;
		//line.position = this.position;

		gameObject = mesh;

		scene.add(mesh);
		//scene.add(line);
		
		// Number token
		if(this.numberToken){
			var topOfTile = this.position.clone();
			topOfTile.y = 10;
			this.numberToken.draw(scene, topOfTile);
		}
	};

	var terrainTile = function (position, terrain, resourceCard, numberToken) {
		//_arrayPos = arrayPos;
		this.terrain = terrain;
		_resourceCard = resourceCard;
		this.numberToken = numberToken;

		this.position = position;

		if(this.numberToken != null) {
			this.numberToken.activated(resourceCreated);
		}
	};

	terrainTile.prototype = {
		constructor: terrainTile,
		getTerrain: function() {
			return this.terrain;
		},
        getResourceCard: function () {
            return this._resourceCard;
        },
		getPosition: function () {
			return this._position;
		},
		getNumberToken: function () {
			return this._numberToken;
		},
		takeRobber: function() {
			_hasRobber = true;
		},
		loseRobber: function() {
			_hasRobber = false;
		},
		hasRobber: function() {
			return _hasRobber;
		},
		object: function() {
			return gameObject;
		},
		draw: render,
        resourceCreatedSubscription: resourceCreatedSubscription
    };

    return terrainTile;
})();
