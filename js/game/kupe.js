/// <reference path="dice.js" />
/// <reference path="numberTile.js" />
/// <reference path="resource.js" />
/// <reference path="resourceTile.js" />
/// <reference path="pubsub.js" />
/// <reference path="robber.js" />

var KUPE = KUPE || {};

KUPE.settings = {
	TILE_SIZE : 120
}

KUPE.tileGenerator = function () {
	var TOKEN_COLOUR_NORMAL = '#000000',
		TOKEN_COLOUR_SPECIAL = '#FF0000';

	var oceanTile = {
		Terrain: {
			Name: "Ocean", 
			Colour: '#1C6BA0'
		},
	};

    var resources = [{ 
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
						Quantity: 1
					}];

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
            return new KUPE.NumberTile(numberToken.Number, numberToken.Colour);
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

				if(resource.Resource) {
					numberToken = getNumberToken();
					callback(numberToken);
				}

				var pos = new THREE.Vector3(posX * (KUPE.settings.TILE_SIZE+2), 
											0, 
											i * ((KUPE.settings.TILE_SIZE+1)*0.75));

				// HACK
				if(i === Math.floor(tilePattern.length/2)) {
					pos.x += (KUPE.settings.TILE_SIZE);
				} else if (i === 1 || i === 3) {
					pos.x += (KUPE.settings.TILE_SIZE/2);
				}

				tile = new KUPE.TerrainTile(pos, resource.Terrain, resource.Resource, numberToken);
				
				tiles.push(tile);

				posX += 1;
			}
			
			 if(tilePattern[i] < tilePattern[i+1]){
			 	startX--;
			} else {
				startX++;
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
	var VIEW_ANGLE = 50, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	var lastTimeMsec = null;
	var angularSpeed = 0.1;

	var camera, 
		cameraControls, 
		scene, 
		renderer, 
		projector, 
		parent, 
		container;
		
	var PLAYER_COLOURS = ['Red', 'Blue', 'White', 'Orange'];
    var DICE_ROLLED = "diceRolled",
    	PLAYER_JOINED = "playerJoined";

    var game = function (container) {
		self.tileGenerator = new KUPE.tileGenerator();
        self.dice = [new KUPE.Dice(1,6), new KUPE.Dice(1,6)];
		self.container = container;
		
		init();
    };
	
	var init = function() {
		renderer = new THREE.WebGLRenderer({ 
			antialias: true
		});
		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.physicallyBasedShading = true;
		renderer.setClearColor(0x87CEEB);
		
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		camera.position.z = 600;
		scene.add(camera);

		cameraControls = new THREE.OrbitControls(camera);
		//cameraControls.maxPolarAngle = Math.PI/3; 
		cameraControls.minDistance = 50;
		cameraControls.maxDistance = 600;
		//cameraControls.autoRotate = true;
		cameraControls.addEventListener('change', render);
		
		var light = new THREE.PointLight( 0xffffff, 1 );
		light.position.set( 4, 5, 1 );
		light.position.multiplyScalar( 30 );
		scene.add( light );

		var ambient_clr = new THREE.Color(0.9, 0.9, 0.9);
		var ambientLight = new THREE.AmbientLight(ambient_clr.getHex());
		scene.add(ambientLight);

		scene.add( new THREE.AxisHelper(100) );

		projector = new THREE.Projector();

		self.container.append( renderer.domElement );

		// Wire up events
		document.addEventListener('mousedown', onDocumentMouseDown, false);

		THREEx.WindowResize(renderer, camera);

	};

	function onDocumentMouseDown(event) {
		event.preventDefault();

		var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0.5);
		projector.unprojectVector(vector, camera);

		var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

		var ingameObjects = [];

		for (var i = terrainTiles.length; i--;) {
			ingameObjects.push(terrainTiles[i].object);
		}

		ingameObjects.push(self.robr.object);

		var intersects = raycaster.intersectObjects(ingameObjects);

		if ( intersects.length > 0 ) {
			intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
		}
	};

	function drawBoard() {
		parent = new THREE.Object3D();
		//scene.add(parent);
		
		for (var i = terrainTiles.length; i--;) {
			var tile = terrainTiles[i];
			
			tile.draw(parent);
			
			if(tile.getTerrain().Name === "Desert") {
				// Robber starts game on the Desert tile
				self.robr = new KUPE.Robber(tile);
				PubSub.subscribe(DICE_ROLLED, self.robr.diceRolled);
			}
		}

		scene.add(parent);
		cameraControls.center = terrainTiles[9].position;
	};
	
	function render() {
		renderer.render(scene, camera);
	}
	
	function animate() {
		requestAnimationFrame(animate);
		render();
        cameraControls.update();
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
			PubSub.subscribe(DICE_ROLLED, numberToken.diceRolled.bind(numberToken));
		});
		
		drawBoard();
		animate();

		startTurn();
	};
	
	var startTurn = function() {
		if(!self.robr) {
			// Sanity check
			throw "Robber object has not been added to game";
		}
		
		console.log("Game started");
		gameHasStarted = true;
		getPlayer();
		console.log(getPlayer().getName() + " turn");
	};
	
	var endTurn = function() {
		if(!gameHasStarted) {
			throw "game has not started";
		}
		if(!diceHasBeenRolled) {
			return "Please roll the dice";
		}	
		if(self.robr.isActive) {
			return "Please place the Robber";
		}
		
		diceHasBeenRolled = false;
		getNextPlayer();
		startTurn();
	};

    var createPlayer = function(name) {
		if(gameHasStarted) {
			throw "cannot create a new player as the game has started";
		}
		if(PLAYER_COLOURS.length === 0) {
			throw "Maximum number of players have joined this game";
		}
		
        var newPlayer = new KUPE.player(PLAYER_COLOURS.pop(), name);
        players.insert(newPlayer);

        PubSub.publish(PLAYER_JOINED, newPlayer);
        console.log(name + " has joined the game");

		return newPlayer;
    }

    var rollDice = function () {
		if(!gameHasStarted || diceHasBeenRolled) {
			return;
		}
		
        var number = 0;
        for (var i = 0; i < self.dice.length; i++) {
        	number += self.dice[i].roll();
		}
        diceHasBeenRolled = true;
        PubSub.publish(DICE_ROLLED, number);
		
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
        currentPlayer: getPlayer,
        getResourceTiles: function() {
            return terrainTiles;
        }
    };

    return game;
})(KUPE);