// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// Stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var monster = {};
var princessesCaught = 0;
var death = 0;
var level = 1;
var numStones = 0;
var stones = new Array(5);
var monsters = new Array(5);


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	localStorage.setItem("princessSaved", princessesCaught);
	localStorage.setItem("levelSaved", level);
	
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	
	// Throw the princess somewhere on the screen randomly
	do{
		princess.x = 32 + (Math.random() * (canvas.width - 90));
		princess.y = 32 + (Math.random() * (canvas.height - 98));
	}while(isEqual(hero, princess));	
	if(princessesCaught > 10){
		level++;
		princessesCaught = 0;
	}
	numStones = princessesCaught;
	numMonsters = princessesCaught / 2;
	if(level > 1 && princessesCaught == 0){
		numStones = level - 1;
		numMonsters = level - 1;
	}
	if(princessesCaught > 5){
		numStones = 5;
		numMonsters = 3;
	}
	var firstStone = true;
	var firstMonster = true;
	//Stones
	for(i = 0; i < numStones; i++){
		var stone = {};
		stones[i] = stone;
		if(firstStone){
			firstStone = false;
			do{
				stones[i].x = 32 + (Math.random() * (canvas.width - 90));
				stones[i].y = 32 + (Math.random() * (canvas.height - 98));
			}while(isEqual(stones[i], princess) && isEqual(stones[i], hero));	
		}
		else{
			do{
				stones[i].x = 32 + (Math.random() * (canvas.width - 90));
				stones[i].y = 32 + (Math.random() * (canvas.height - 98));
			}while(isEqual(stones[i], stones[i-1]) && isEqual(stones[i], princess) && isEqual(stones[i], hero));
		}
	}
	//Monster
	for(i = 0; i < numMonsters; i++){
		if(level <= 1){
			var monster = {
				speed: 0
			};
		}
		if(level > 1){
			var monster = {
				speed: 2.5*level
			};	
		}	
		monsters[i] = monster;
		if(firstMonster){
			firstMonster = false;
			do{
				monsters[i].x = 32 + (Math.random() * (canvas.width - 90));
				monsters[i].y = 32 + (Math.random() * (canvas.height - 98));
			}while(isEqual(monsters[i], princess) && isEqualStones(monsters[i]) && isEqual(stones[i], hero));	
		}
		else{
			do{
				monsters[i].x = 32 + (Math.random() * (canvas.width - 90));
				monsters[i].y = 32 + (Math.random() * (canvas.height - 98));
			}while(isEqual(monsters[i], monsters[i-1]) && isEqual(monsters[i], princess) && isEqualStones(monsters[i]) && isEqual(stones[i], hero));
		}	
	}
};

var isEqual = function(elem1, elem2){
	if(elem1.x <= (elem2.x + 100) && elem2.x <= (elem1.x + 100) && elem1.y <= (elem2.y + 100) && elem2.y <= (elem1.y + 100)){
		return true;
	}	
	else{
		return false;
	}	
};

var isEqualStones = function(elem){
	for(i = 0; i < numStones; i++){
		if(elem.x <= (stones[i].x + 70) && stones[i].x <= (elem.x + 70) && elem.y <= (stones[i].y + 70) && stones[i].y <= (elem.y + 70)){
			return true;
		}	
		else{
			return false;
		}	
	}	
};

var canmoveup = function(elem){
	for(i = 0; i < numStones; i++){
		if(!(elem.y >= stones[i].y + 25 || elem.y <= stones[i].y - 20 || elem.x >= stones[i].x + 25 || elem.x <= stones[i].x - 25)){
			return false;
		}
	}
	return true;
}

var canmovedown = function(elem){
	for(i = 0; i < numStones; i++){
		if(!(elem.y <= stones[i].y - 25 || elem.y >= stones[i].y + 20 || elem.x >= stones[i].x + 25 || elem.x <= stones[i].x - 25)){
			return false;
		}
	}
	return true;
}

var canmoveleft = function(elem){
	for(i = 0; i < numStones; i++){
		if(!(elem.y >= stones[i].y + 25 || elem.y <= stones[i].y - 25 || elem.x >= stones[i].x + 25 || elem.x <= stones[i].x - 20)){
			return false;
		}
	}
	return true;
}

var canmoveright = function(elem){
	for(i = 0; i < numStones; i++){
		if(!(elem.y >= stones[i].y + 25 || elem.y <= stones[i].y - 25 || elem.x >= stones[i].x + 20 || elem.x <= stones[i].x - 25)){
			return false;
		}
	}
	return true;
}


// Update game objects
var update = function (modifier) {
	if (38 in keysDown && hero.y > 30 && canmoveup(hero)) { // Player holding up
		hero.y -= hero.speed * modifier;
		if(numMonsters > 0){
			if(canmoveup(monsters[0]) && monsters[0].y > 30){
					monsters[0].y -= monsters[0].speed*Math.random();
				}
		}
	}
	if (40 in keysDown && hero.y < canvas.height - 70 && canmovedown(hero)) { // Player holding down
		hero.y += hero.speed * modifier;
		if(numMonsters > 0){
			if(canmoveup(monsters[0]) && monsters[0].y < canvas.height - 70){
					monsters[0].y += monsters[0].speed*Math.random();
				}
		}
	}
	if (37 in keysDown && hero.x > 30 && canmoveleft(hero)) { // Player holding left
		hero.x -= hero.speed * modifier;
		if(numMonsters > 0){
			if(canmoveup(monsters[0]) && monsters[0].x > 30){
					monsters[0].x -= monsters[0].speed*Math.random();
				}
		}	
	}
	if (39 in keysDown && hero.x < canvas.width - 70 && canmoveright(hero)) { // Player holding right
		hero.x += hero.speed * modifier;
		if(numMonsters > 0){
			if(canmoveup(monsters[0]) && monsters[0].x < canvas.width - 70){
					monsters[0].x += monsters[0].speed*Math.random();
				}
		}
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		reset();
	}
	for(i = 0; i < numMonsters; i++){
		if (
			hero.x <= (monsters[i].x + 16)
			&& monsters[i].x <= (hero.x + 16)
			&& hero.y <= (monsters[i].y + 16)
			&& monsters[i].y <= (hero.y + 32)
		) {
			++death;
			reset();
		}
	}	
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}
	if (stoneReady) {
		for(var i = 0; i < numStones; i++){
			ctx.drawImage(stoneImage, stones[i].x, stones[i].y);
		}
	}
	if (monsterReady) {
		for(var i = 0; i < numMonsters; i++){
			ctx.drawImage(monsterImage, monsters[i].x, monsters[i].y);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught + "    Death: " + death + "    Level: " + level , 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

if(localStorage.getItem("princessSaved") != null){
	princessesCaught = localStorage.getItem("princessSaved"); 
}
if(localStorage.getItem("levelSaved") != null){
	level = localStorage.getItem("levelSaved"); 
}


// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
