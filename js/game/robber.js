var KUPE = KUPE || {};

KUPE.Robber = (function () {
	"use strict";
	
    var _isActive = false,
		_terrainTile,
		_3dObject;
		
    function diceRollEvent(msg, data) {
        if (data === 7) {
            _isActive = true;
            console.log("Robber activated!");
        } else {
            _isActive = false;
        }
    };
	
	function moveToTile(terrainTile) {
		if(!_isActive) {
			throw "Cannot move an inactive robber";
		}
		
		// Old tile
		if(_terrainTile) {
			_terrainTile.loseRobber();
		}

		_terrainTile = terrainTile;
		_terrainTile.takeRobber();
		
		draw();
	};
	
    function draw() {
		if(!_3dObject) {
			var robber = new THREE.CubeGeometry(20, 20, 60)
			var material = new THREE.MeshBasicMaterial({color: 0x000000});
			var mesh = new THREE.Mesh(robber, material);

			// Todo: get my 3d coords sorted!
			mesh.position.x = _terrainTile.getPosition().x;
			mesh.position.y = _terrainTile.getPosition().z;
			mesh.position.z = robber.height/2;

			_3dObject = mesh;
		}
        		
        _terrainTile.object().add(_3dObject);
    };
	
	var robber = function(startingTerrainTile) {
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
        diceRolled: diceRollEvent
    }
	
	return robber;
})();
