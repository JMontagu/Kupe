var KUPE = KUPE || {};

KUPE.resource = function (terrain, resource) {
    var _terrain = terrain,
        _resource = resource;

    return {
        terrain: function () {
            return _terrain;
        },
        resource: function () {
            return _resource;
        }
    }
};
