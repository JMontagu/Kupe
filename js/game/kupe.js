/// <reference path="dice.js" />
/// <reference path="numberTile.js" />
/// <reference path="resource.js" />
/// <reference path="resourceTile.js" />
/// <reference path="pubsub.js" />
/// <reference path="robber.js" />

var KUPE = KUPE || {};

KUPE.tileGenerator = function () {
	var TOKEN_COLOUR_NORMAL = '#000000',
		TOKEN_COLOUR_SPECIAL = '#FF0000';

    var resources = [   { 
							Terrain: { 
								Name: "Forest", 
								Colour: '#0d3b02'
							},
							Resource: new KUPE.resourceCard('Lumber', '#659D32'), 
							Quantity: 4 
						},
                        { 
							Terrain: {
								Name: "Pasture", 
								Colour: '#91d653'
							},
							Resource: new KUPE.resourceCard('Wool', ''), 
							Quantity: 4 
						},
                        { 
							Terrain: {
								Name: "Fields", 
								Colour: '#d0b336'
							},
							Resource: new KUPE.resourceCard('Grain', ''), 
							Quantity: 4 
						},
                        { 
							Terrain: {
								Name: "Hills", 
								Colour: '#ac5b19'
							},
							Resource: new KUPE.resourceCard('Brick', ''), 
							Quantity: 3 
						},
                        { 
							Terrain: {
								Name: "Mountains", 
								Colour: '#2e4257',
								Image: 'assets/terrainTiles/mountain.jpg'
							},
							Resource: new KUPE.resourceCard('Ore', ''), 
							Quantity: 3
						},
						{ 
							Terrain: {
								Name: "Desert", 
								Colour: '#EDC9AF'
							},
							Resource: null,
							Quantity: 1,
							HasRobber: true
						}]

    var numberTokens = [{ Number: 2, Quantity: 1, Colour: TOKEN_COLOUR_NORMAL },
                        { Number: 3, Quantity: 2, Colour: TOKEN_COLOUR_NORMAL },
                        { Number: 4, Quantity: 2, Colour: TOKEN_COLOUR_NORMAL },
                        { Number: 5, Quantity: 2, Colour: TOKEN_COLOUR_NORMAL },
                        { Number: 6, Quantity: 2, Colour: TOKEN_COLOUR_SPECIAL },
                        // ROBBER 7
                        { Number: 8, Quantity: 2, Colour: TOKEN_COLOUR_SPECIAL },
                        { Number: 9, Quantity: 2, Colour: TOKEN_COLOUR_NORMAL },
                        { Number: 10, Quantity: 2, Colour: TOKEN_COLOUR_NORMAL },
                        { Number: 11, Quantity: 2, Colour: TOKEN_COLOUR_NORMAL },
                        { Number: 12, Quantity: 1, Colour: TOKEN_COLOUR_NORMAL }];

    var getResource = function () {
        var i = Math.floor(Math.random() * resources.length);
        var resource = resources[i];

        if (resource.Quantity > 0) {
            resource.Quantity -= 1;
            return resource;
        } else {
            return getResource();
        }
    };

    var getNumberToken = function () {
        var i = Math.floor(Math.random() * numberTokens.length);
        var numberToken = numberTokens[i];

        if (numberToken.Quantity > 0) {
            numberToken.Quantity -= 1;
            return new KUPE.numberTile(numberToken.Number, numberToken.Colour);
        } else {
            return getNumberToken();
        }
    }

    var createTiles = function (callback) {
        var tilePattern = [3,4,5,4,3],
			tiles = [],
			startX = 0;

		for(var i = 0; i < tilePattern.length; i++) {
			var posX = startX;
			
			for(var rowCount = 0; rowCount < tilePattern[i]; rowCount++) {
				var resource = getResource(),
					numberToken = null,
					tile = null;

				if(!resource.HasRobber) {
					numberToken = getNumberToken();
				}

				tile = new KUPE.terrainTile({x: posX, y: i}, resource.Terrain, resource.Resource, numberToken);

				if(resource.HasRobber) {
					console.log("Robber");
					tile.takeRobber(new KUPE.robber());
				}

				tiles.push(tile);
				posX += 1;
			}
			
			if(tilePattern[i] > tilePattern[i+1]) {
				startX += 1;
			}
		}

        return tiles;
    };

    return {
        createTiles: createTiles
    }
};

KUPE.game = (function () {
    var self = this,
		players = new SortedCircularDoublyLinkedList(),
        terrainTiles = [],
        robber,
		dice,
        currentPlayer,
		gameHasStarted = false,
		diceHasBeenRolled = false,
		tileGenerator;
		
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 75, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	var lastTimeMsec = null;
	var angularSpeed = 0.1;

	var camera, controls, scene, renderer, parent, container;
		

	var PLAYER_COLOURS = ['Red', 'Blue', 'White', 'Orange'];
    var DICE_ROLLED = "diceRolled";

    var game = function (container) {
		self.tileGenerator = new KUPE.tileGenerator();
        self.dice = new KUPE.dice();
		self.container = container;
		
		init();
    };
	
	var init = function() {
		camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		camera.position.z = 500;
		//camera.position.set( 0, -200, 400 );
		//.rotation.x = 20 * (Math.PI / 180);
		
		controls = new THREE.OrbitControls(camera);
		controls.addEventListener('change', render);

		scene = new THREE.Scene();

		var light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set( 0, 0, 1);
		scene.add( light );

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

		THREEx.WindowResize(renderer, camera);

		self.container.append( renderer.domElement );
	};

	function drawBoard() {
		parent = new THREE.Object3D();
		
		scene.add(parent);
		
		for (var i = terrainTiles.length; i--;) {
			terrainTiles[i].draw(parent, -1, 0);
		}
		
		scene.add(parent);
		
		parent.position.set(0,-200,0);
	};
	
	function render() {
		renderer.render(scene, camera);
	}
	
	function animate() {
		// var time = (new Date()).getTime();
  //       var timeDiff = Math.min(200, time - lastTimeMsec);
  //       lastTimeMsec = time;

  //       var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;

		
		 
		requestAnimationFrame(animate);
        controls.update();
	};
	
	var getPlayer = function() {
		if(!self.currentPlayer) {
			self.currentPlayer = players.head;
		}
		return self.currentPlayer.datum;
	};
	
	var getNextPlayer = function() {
		self.currentPlayer = self.currentPlayer.next;
		
		return getPlayer();
	};
	
	var startGame = function() {
		terrainTiles = self.tileGenerator.createTiles(function(numberToken) {
			PubSub.subscribe(DICE_ROLLED, numberToken.diceRolled);
		});

		self.robber = new KUPE.robber();
		PubSub.subscribe(DICE_ROLLED, self.robber.diceRolled);
		
        self.dice = new KUPE.dice();
		
		drawBoard();
		animate();
		
		console.log("Game started");
		gameHasStarted = true;
		getPlayer();
		startTurn();
	};
	
	var startTurn = function() {
		if(!gameHasStarted) {
			return;
		}
		
		console.log(getPlayer().getName() + " turn");
	};
	
	var endTurn = function() {
		if(!gameHasStarted) {
			throw "game has not started";
		}
		if(!diceHasBeenRolled) {
			return "Please roll the dice";
		}	
		if(self.robber.isActive()) {
			return "Please place the Robber";
		}
		
		getNextPlayer();
		diceHasBeenRolled = false;
		startTurn();
	};

    var createPlayer = function(name) {
		if(gameHasStarted) {
			throw "cannot create a new player as the game has started";
		}
		
        var newPlayer = new KUPE.player(PLAYER_COLOURS.pop(), name);
        players.insert(newPlayer);
        console.log("New player joined: " + name);

		return newPlayer;
    }

    var rollDice = function () {
		if(!gameHasStarted || diceHasBeenRolled) {
			return;
		}
		
        var number = self.dice.rollPair();
        PubSub.publish(DICE_ROLLED, number);
		diceHasBeenRolled = true;
		
		console.log("Dice rolled: " + number);
		
        return number;
    }

    game.prototype = {
        constructor: game,
		start : startGame,
        rollDice: rollDice,
		endTurn: endTurn,
        createPlayer: createPlayer,
		players: function() {
			return players;
		},
        getCurrentPlayer: currentPlayer,
        getResourceTiles: function() {
            return terrainTiles;
        }
    };

    return game;
})(KUPE);