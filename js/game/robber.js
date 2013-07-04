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
        var robber = new THREE.CubeGeometry(10, 30, 10)
        var material = new THREE.MeshBasicMaterial({color: 0xff0000});
        var mesh = new THREE.Mesh(robber, material);
        mesh.postion.x = posX;
        mesh.postion.Y = posY;

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
