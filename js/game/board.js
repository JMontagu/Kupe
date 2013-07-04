KUPE.gameBoard = function(tiles) {
	var _tiles = tiles;
	
	var render = function(ctx) {
		for(var i = 0; i < _tiles.length; i++) {
			ctx.beginPath();
		}
	};
	
	return {
		render : render
	}
};