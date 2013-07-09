﻿var KUPE = KUPE || {};

KUPE.Robber = function(startingTerrainTile) {
	if(startingTerrainTile === null) {
		throw new Error("robber(): startingTerrainTile required");
	}

	this.isActive = false;
	this.activeTerrainTile = startingTerrainTile;
	this.object;

	console.log("Robber init");
	this.isActive = true;
	this.moveToTile(startingTerrainTile);
	this.isActive = false;
};

/**
 * Called each time the dice is rolled. If the dice number 
 * is a 7, then active this robber.
 * @param  {[type]} msg
 * @param  {number} diceNumber The rolled dice number
 */
KUPE.Robber.prototype.diceRolled = function(msg, diceNumber) {
	if (diceNumber === 7) {
        this.isActive = true;
        console.log("Robber activated!");
    } else {
        this.isActive = false;
    }
};

/**
 * Moves this robber to the provided terrainTile.
 * @param  {KUPE.TerrainTile} terrainTile The terrain tile this robber will move to
 */
KUPE.Robber.prototype.moveToTile = function(terrainTile) {
		if(!this.isActive) {
			throw new Error("moveToTile(): Cannot move an inactive robber");
		}
		
		// Old tile
		if(this.activeTerrainTile !== undefined) {
			this.activeTerrainTile.hasRobber = false;
		}

		this.activeTerrainTile = terrainTile;
		this.activeTerrainTile.hasRobber = true;
		
		this.draw();
};

/**
 * Draws this robber onto the terrain tile it currently occupies
 */
KUPE.Robber.prototype.draw = function() {
	var geometry,
		material,
		mesh;

	if(!this.object) {	
		geometry = new THREE.CubeGeometry(20, 20, 60)
		material = new THREE.MeshPhongMaterial({ shininess: 80, ambient: 0x444444, color: 0xffffff, specular: 0xffffff});
		mesh = new THREE.Mesh(geometry, material);

		// Todo: get my 3d coords sorted!
		//mesh.position = _activeTerrainTile.object().position.clone();
		mesh.position.z = geometry.depth/2;
		mesh.castShadow = true;

		this.object = mesh;
	}
    		
    this.activeTerrainTile.object.add(this.object);
};