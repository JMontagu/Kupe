var KUPE = KUPE || {};

KUPE.TerrainTile = function(position, terrain, resourceCard, numberToken) {
	var TILE_SIZE = 120;

	if(position === null) throw new Error("TerrainTile(): null object: position");
	if(terrain === null) throw new Error("TerrainTile(): null object: terrain");

	this.position = position;
	this.terrain = terrain;
	this.resourceCard = resourceCard;
	this.numberToken = numberToken;

	this.tileHasRobber = false;
	this.resourceSubscriptions = [];
	this.object = {};

	if(this.numberToken != null) {
		this.numberToken.activated(this.resourceCreated.bind(this));
	}

	this.tileSize = function() {
		return TILE_SIZE;
	};

	this.getTerrain = function() {
		return this.terrain;
	};
   	
   	this.getResourceCard = function () {
        return this.resourceCard;
    };
		
	this.getPosition = function () {
		return this.position;
	};

	this.getNumberToken = function () {
		return this.numberToken;
	};

	this.takeRobber = function() {
		this.tileHasRobber = true;
	};

	this.loseRobber = function() {
		this.tileHasRobber = false;
	};

	this.hasRobber = function() {
		return this.tileHasRobber;
	};

	this.getNumber = function() {
		if(this.numberToken) {
			return this.numberToken.getNumber();
		} else {
			return undefined;
		}
	};
};

KUPE.TerrainTile.prototype.resourceCreated = function() {
	if(this.tileHasRobber) {
		console.log("Robber stole " + this.resourceCard.getName());
		return;
	}

    console.log(this.resourceCard.getName() + " produced");

    for(var i = 0; i < this.resourceSubscriptions.length; i++) {
        this.resourceSubscriptions[i](this.resourceCard);
    }
};

/**
 * Registers the callback, which will be invoked when this tile produces a resource
 * @param  {Function} callback Callback to be invoked when this tile produces a resource
 */
KUPE.TerrainTile.prototype.resourceCreatedSubscription = function(callback) {
    this.resourceSubscriptions.push(callback);
};

/**
 * Draws this object onto the scene object provided
 * @param  {[type]} scene
 * @return {[type]}
 */
KUPE.TerrainTile.prototype.draw = function(scene) {
	var tilePts = [],
	 	tileShape,
	 	extrusionSettings,
	 	geometry,
	 	material,
	 	mesh;

	tilePts.push( new THREE.Vector2 (0, -this.tileSize()/2) );
	tilePts.push( new THREE.Vector2 (this.tileSize()/2, -this.tileSize()/4) );
	tilePts.push( new THREE.Vector2 (this.tileSize()/2, this.tileSize()/4) );
	tilePts.push( new THREE.Vector2 (0, this.tileSize()/2) );
	tilePts.push( new THREE.Vector2 (-this.tileSize()/2, this.tileSize()/4) );
	tilePts.push( new THREE.Vector2 (-this.tileSize()/2, -this.tileSize()/4) );
	tilePts.push( new THREE.Vector2 (0, -this.tileSize()/2) );

	tileShape = new THREE.Shape(tilePts);
	extrusionSettings = {
		amount: 3, bevelThickness: 1, bevelSize: 1, bevelEnabled: true
	};
	geometry = tileShape.extrude(extrusionSettings);

	material = new THREE.MeshLambertMaterial( { color: this.terrain.Colour, ambient: this.terrain.Colour, reflectivity: 0.2, refractionRatio: 0.2 } );
	
	mesh = new THREE.Mesh(geometry, material);

	mesh.rotation.x = -90 * Math.PI / 180;
	mesh.position = this.position;
	mesh.position.y =- 4;
	mesh.receiveShadow = true;
	this.object = mesh;

	scene.add(mesh);
	//scene.add(line);
	
	// Number token
	if(this.numberToken != null){
		var topOfTile = this.position.clone();
		topOfTile.y = 10;
		this.numberToken.draw(scene, topOfTile);
	}
};