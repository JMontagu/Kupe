var KUPE = KUPE || {};

KUPE.settlement = function (terrainTiles) {
	var self = this,
		_terrainTiles = terrainTiles,
		_resourceGainedCallback = [];

	/**
	 * Registers the callback function, which will be invoked when 
	 * @param {callback}
	 */
	var resourceGainedEvent = function(callback) {
		_resourceGainedCallback.push(callback);
	};

	/**
	 * 
	 * @param resourceCard
	 */
	var resourceCreated = function(resourceCard) {
		console.log("Settlement gained: " + resourceCard.getName());
		
		for(var i = 0; i < _resourceGainedCallback.length; i++) {
			_resourceGainedCallback[i](resourceCard, 1);
		}
	};

	/**
	 * Draws this settlement
	 */
    function draw() {
		if(!_3dObject) {
			var height = 10,
				width = 12;

			var settlementPts = [];
			settlementPts.push( new THREE.Vector2 (0, 0) );
			settlementPts.push( new THREE.Vector2 (0, width) );
			settlementPts.push( new THREE.Vector2 (height, width) );
			settlementPts.push( new THREE.Vector2 (height*1.5, width/2) );
			settlementPts.push( new THREE.Vector2 (height, 0) );
			//settlementPts.push( new THREE.Vector2 (12,0) );

			var settlementShape = new THREE.Shape(settlementPts);
			var extrusionSettings = {
				amount: width*1.5, bevelEnabled: false
			};
			var geometry = settlementShape.extrude(extrusionSettings);

			var settlement = new THREE.CubeGeometry(20, 20, 60)
			var material = new THREE.MeshPhongMaterial({ shininess: 80, ambient: 0x444444, color: 0xffffff, specular: 0xffffff});
			var mesh = new THREE.Mesh(geometry, material);

			// Todo: get my 3d coords sorted!
			mesh.position.z = settlement.height+10/2;
			mesh.rotation.y = -90 * Math.PI / 180;
			mesh.castShadow = true;

			_3dObject = mesh;
		}
    };

	for(var i = 0; i < _terrainTiles.length; i++) {
		_terrainTiles[i].resourceCreatedSubscription(resourceCreated);
	}


	return {
		draw: draw,
		registerResourceGained : resourceGainedEvent
	};
};