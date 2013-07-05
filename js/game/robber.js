var KUPE = KUPE || {};

KUPE.robber = function () {
    var _isActive = false;

    var diceRollEvent = function (msg, data) {
        if (data === 7) {
            _isActive = true;
            console.log("Robber activated!");
        } else {
            _isActive = false;
        }
    };

    var draw = function(scene, posX, posY) {
        var robber = new THREE.CubeGeometry(20, 50, 20)
        var material = new THREE.MeshBasicMaterial({color: 0x000000});
        var mesh = new THREE.Mesh(robber, material);
		// mesh.rotation.x = 90 * (Math.PI/180);
        mesh.position.x = posX;
        mesh.position.y = robber.height/2;
		mesh.position.z = posY;

        scene.add(mesh);
    };

    return {
        isActive: function () {
            return _isActive;
        },
        draw: draw,
        diceRolled: diceRollEvent
    }
};
