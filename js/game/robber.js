var KUPE = KUPE || {};

KUPE.Robber = (function () {
	"use strict";
	
    var _isActive = false,
		_activeTerrainTile,
		_3dObject;
		
	/**
	 * Called each time the dice is rolled. If the dice number 
	 * is a 7, then active this robber.
	 * @param  {[type]} msg
	 * @param  {number} diceNumber The rolled dice number
	 */
    function diceRollEvent(msg, diceNumber) {
        if (diceNumber === 7) {
            this.isActive = true;
            console.log("Robber activated!");
        } else {
            this.isActive = false;
        }
    };
	
    /**
     * Moves this robber to the provided terrainTile.
     * @param  {KUPE.terrainTile} terrainTile The terrain tile this robber will move to
     */
	function moveToTile(terrainTile) {
		if(!_isActive) {
			throw new Error("moveToTile(): Cannot move an inactive robber");
		}
		
		// Old tile
		if(_activeTerrainTile !== undefined) {
			_activeTerrainTile.loseRobber();
		}

		_activeTerrainTile = terrainTile;
		_activeTerrainTile.takeRobber();
		
		draw();
	};
	
	/**
	 * Draws this robber ontop of the terrain tile it's currently occupying
	 */
    function draw() {
		if(!_3dObject) {
			var robber = new THREE.CubeGeometry(20, 20, 60)
			var material = new THREE.MeshPhongMaterial({ shininess: 80, ambient: 0x444444, color: 0xffffff, specular: 0xffffff});
			var mesh = new THREE.Mesh(robber, material);

			// Todo: get my 3d coords sorted!
			//mesh.position = _activeTerrainTile.object().position.clone();
			mesh.position.z = robber.height+10/2;
			mesh.castShadow = true;
			mesh.receiveShadow = true;

			_3dObject = mesh;
		}
        		
        _activeTerrainTile.object().add(_3dObject);
    };
	
	/**
	 * Constructs this new robber object on top of the startingTerrainTile
	 * @param  {KUPE.terrainTile} startingTerrainTile The terrainTile this robber will begin the game at
	 */
	var robber = function(startingTerrainTile) {
		if(startingTerrainTile == null) {
			throw new Error("robber(): startingTerrainTile required");
		}

		console.log("Robber init");
		_isActive = true;
		moveToTile(startingTerrainTile);
		_isActive = false;
	};

    robber.prototype = {
		constructor: robber,
		moveToTile: moveToTile,
        isActive: function () {
            return _isActive;
        },
        draw: draw,
        object: function() {
        	return _3dObject;
        },
        diceRolled: diceRollEvent
    }
	
	return robber;
})();
