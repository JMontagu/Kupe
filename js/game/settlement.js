var KUPE = KUPE || {};

KUPE.Settlement = function (terrainTiles, playerColour) {
	if(terrainTiles === null) {
		throw new Error("Settlement(): terrainTiles is null");
	}
	this.terrainTiles = terrainTiles;
	this.playerColour = playerColour;
	this.resourceGainedCallbacks = [];
	this.resourceStats = {};
	this.object;

	// Subscribe this settlement to all of its terrain tile resource created events
	for(var i = 0; i < this.terrainTiles.length; i++) {
		this.terrainTiles[i].resourceCreatedSubscription(this.resourceCreated.bind(this));
	}

	this.draw();
};

/**
 * Envoked when a resource tile this settlement occupies creates a resource
 * @param  {[type]} resourceCard
 */
KUPE.Settlement.prototype.resourceCreated = function(resourceCard) {
	var resourceName = resourceCard.getName();
	console.log("Settlement gained: " + resourceName);
	
	if(!this.resourceStats[resourceName]) {
		this.resourceStats[resourceName] = 0;
	}

	this.resourceStats[resourceName] += 1;


	console.log("Settlement stats:");
	for(var i = 0; i < this.resourceStats.length; i++) {
		console.log(this.resourceStats[i]);
	}

	for(var i = 0; i < this.resourceGainedCallbacks.length; i++) {
		this.resourceGainedCallbacks[i](resourceCard, 1);
	}
};

KUPE.Settlement.prototype.registerResourceGained = function(callback) {
	if(!callback) {
		throw new Error("registerResourceGained(): callback required");
	}
	if(typeof(callback) !== 'function') {
		throw new Error("registerResourceGained(): callback must be a function");
	}
	
	this.resourceGainedCallbacks.push(callback);
};

KUPE.Settlement.prototype.draw = function() {
	if(!this.object) {
		var height = 10,
			width = 12;

		var settlementPts = [];
		settlementPts.push( new THREE.Vector2 (0, 0) );
		settlementPts.push( new THREE.Vector2 (0, width) );
		settlementPts.push( new THREE.Vector2 (height, width) );
		settlementPts.push( new THREE.Vector2 (height*1.5, width/2) );
		settlementPts.push( new THREE.Vector2 (height, 0) );

		var settlementShape = new THREE.Shape(settlementPts);
		var extrusionSettings = {
			amount: width*1.5, bevelEnabled: false
		};
		var geometry = settlementShape.extrude(extrusionSettings);

		var material = new THREE.MeshPhongMaterial({ shininess: 0, ambient: 0x444444, color: this.playerColour, specular: this.playerColour});
		var mesh = new THREE.Mesh(geometry, material);

		var centerTileX = 0,
			centerTileZ = 0,
			terrainTileSize = this.terrainTiles[0].tileSize();

		for(var i = 0; i < this.terrainTiles.length; i++) {
			centerTileX += this.terrainTiles[i].object.position.x;
			centerTileZ += this.terrainTiles[i].object.position.z;
		}
		
		//mesh.position.z = settlement.height;
		mesh.rotation.y = -90 * Math.PI / 180;
		mesh.position.x = (centerTileX/3);
		mesh.position.y = (centerTileZ/3);
		mesh.position.z = 3;
		mesh.castShadow = true;

		this.object = mesh;
	}

	this.terrainTiles[0].object.add(this.object);
};

// 	var self = this,
// 		_terrainTiles = terrainTiles,
// 		_resourceGainedCallback = [];

// 	/**
// 	 * Registers the callback function, which will be invoked when 
// 	 * @param {callback}
// 	 */
// 	var resourceGainedEvent = function(callback) {
// 		_resourceGainedCallback.push(callback);
// 	};

// 	/**
// 	 * 
// 	 * @param resourceCard
// 	 */
// 	var resourceCreated = function(resourceCard) {
// 		console.log("Settlement gained: " + resourceCard.getName());
		
// 		for(var i = 0; i < _resourceGainedCallback.length; i++) {
// 			_resourceGainedCallback[i](resourceCard, 1);
// 		}
// 	};

// 	/**
// 	 * Draws this settlement
// 	 */
//     function draw() {
// 		if(!_3dObject) {
// 			var height = 10,
// 				width = 12;

// 			var settlementPts = [];
// 			settlementPts.push( new THREE.Vector2 (0, 0) );
// 			settlementPts.push( new THREE.Vector2 (0, width) );
// 			settlementPts.push( new THREE.Vector2 (height, width) );
// 			settlementPts.push( new THREE.Vector2 (height*1.5, width/2) );
// 			settlementPts.push( new THREE.Vector2 (height, 0) );
// 			//settlementPts.push( new THREE.Vector2 (12,0) );

// 			var settlementShape = new THREE.Shape(settlementPts);
// 			var extrusionSettings = {
// 				amount: width*1.5, bevelEnabled: false
// 			};
// 			var geometry = settlementShape.extrude(extrusionSettings);

// 			var settlement = new THREE.CubeGeometry(20, 20, 60)
// 			var material = new THREE.MeshPhongMaterial({ shininess: 80, ambient: 0x444444, color: 0xffffff, specular: 0xffffff});
// 			var mesh = new THREE.Mesh(geometry, material);

// 			// Todo: get my 3d coords sorted!
// 			mesh.position.z = settlement.height+10/2;
// 			mesh.rotation.y = -90 * Math.PI / 180;
// 			mesh.castShadow = true;

// 			_3dObject = mesh;
// 		}
//     };

// 	for(var i = 0; i < _terrainTiles.length; i++) {
// 		_terrainTiles[i].resourceCreatedSubscription(resourceCreated);
// 	}


// 	return {
// 		draw: draw,
// 		registerResourceGained : resourceGainedEvent
// 	};
// };