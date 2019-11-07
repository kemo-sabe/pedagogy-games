// JavaScript Document
/*jshint esversion: 6 */

/*
	TO DO:
		- repeat missed questions?
*/

// *********************************************************************************************************************
// ***************************************************** CONSTANTS *****************************************************
// *********************************************************************************************************************
let ratio;
let ratioX;
let ratioY;
let background;									// background object
let foreground;									// foreground object
let marker;											// current player marker
let pick;												// random number selected for angle
let wheel;											// wheel object
let catTxt;											// category text
let currentPlayer;							// current player number
let spinBtn;										// spin button object
let solveBtn;										// solve button object
let backBtn;										// return to menu button object
let overlay;										// overlay object
//let rulesSnap;
let showRuleOvl = false;				// show rules during game play
let onlyOnce = false;						// Allows certain actions to be taken only once
let showOnce = true;						// controls spin
let startSpin = true;						// controls spin
let playerTurnRepeat = false;		// free play 
let solving = false;						// if solve button is selected
let isTeams = "false";					// teams or players(default)
let freebie = false;						// free play
let timeForResult = false;			// q&a result
let frameCount = 0;							// timer count for q&a result
let playerTurn = 0;							// player turn count
let pushed = 0;									// push count
let friction = 0.2;							// speed of wheel slow down
let currentAngle = 0;						// angle
let section = 0;								// wheel section
let numberOfPlayers = 5;				// ********** MAX: 10 **********
let elements = [];							// Array for game components
const playerScores = [];				// Array for player scores display
let mainRulesElements = [];			// during game rules elements
const wheelValues = [600,1000,700,450,350,800,"lose a turn",300,400,600,"bankrupt",900,"free play",1000,900,300,400,550,"bankrupt",500,300,600,300,3500];
let loc = {x: 0, y: 0};					// Gives mouse click start location for no errors
let mouseLoc = {x: 0, y: 0};		// Gives mouse start location for no errors
let players = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0};				// Array for player score count

//Image measurements and math
const bgW = 1280;
const bgH = 720;
const wheelW = 367;
const wheelH = 366;
const wheelX = 753;
const wheelY = 533;

//Document set-up
try{
//	this.moveTo(0,0);
	this.resizeTo(bgW+250, bgH+250);
} catch(err) {console.log("Reset Error");}

//Event listeners
const solveInput = document.getElementById("solveInput");
const solveSubmit = document.getElementById("solveSubmit");

solveSubmit.addEventListener("click", handleSolve, false);
canvas.addEventListener("mousedown", handleMouse, false);
canvas.addEventListener("mousemove", handlePoint, false);

// ****************************************************************************************************************************
// ***************************************************** GAME AREA OBJECT *****************************************************
// ****************************************************************************************************************************
const gameArea = {
	// ***********************************
	// ********** canvas set-up **********
	// ***********************************
	canvas: document.getElementById("canvas"),
	// ************************************
	// ********** gameArea start **********
	// ************************************
	start: function () {
		this.canvas.width = bgW;
		this.canvas.height = bgH;
		this.context = this.canvas.getContext("2d");
		this.framNo = 0;																				//start frame counter
		this.interval = setInterval(updateGameArea, 20);				//update game every 20 milliseconds
		window.addEventListener('load', this.resize, false);
		window.addEventListener('resize', this.resize, false);	//window resize listener
		window.addEventListener('keydown', function(e) {				//keyboard listener
			gameArea.keys = (gameArea.keys || []);
			gameArea.keys[e.keyCode] = true;
		});
		window.addEventListener('keyup', function(err) {
			try {
				gameArea.keys[err.keyCode] = false;
			} catch(err) {console.log(err.name);}
		});
		fillGameGrid(roundAnswer);
	},
	// **************************************
	// ********** gameArea refresh **********
	// **************************************
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);	//clear canvas every update
	},
	// **********************************************
	// ********** gameArea stop (end game) **********
	// **********************************************
	stop: function() {
		location.reload();
	},
	// *************************************
	// ********** gameArea resize **********
	// *************************************
	resize: function() {
		let height = window.innerHeight;
		ratio = this.canvas.width/this.canvas.height;
		let width = height * ratio;
		this.canvas.style.width = width+'px';
		this.canvas.style.height = height+'px';
		// *******************************
		//  other resize ratios
		// *******************************
		ratioX = gameArea.canvas.offsetWidth / gameArea.canvas.width; 
		ratioY = gameArea.canvas.offsetHeight / gameArea.canvas.height;
//		if (DEBUG) {
//			console.log("ratio: ", ratioY);
//			console.log(mouseLoc);
//		}
	}
};

// ****************************************************************************************************************************
// *************************************************** PLAYER DISPLAY SET-UP **************************************************
// ****************************************************************************************************************************
function setupPlayers() {
	let adjustY = 69.5;														//	image height
	let offsetY = 59;															//	gap
	let tY;
	for (let i = 0; i < numberOfPlayers; i++) {
		tY = (adjustY * i) + offsetY;
		let pName = "p" + (i+1);
		if (i == 0) {
			pName = "p1";
			tY = offsetY;
		}
		//		PLAYER SCORE DISPLAY
		playerScores.push(new component(pName, "20px", "Consolas", "rgb(0,0,0)", bgW - 250, tY, "text", "default"));
		playerScores[i].text = players[i];
		//		PLAYER IMAGE DISPLAY	
		if (isTeams === "true") {
			let t = "team_" + i;
			elements.push(new component(t, bgW, bgH, "images/teams_u/" + t + ".png", 0, 0, "image", "default"));
		} else if (isTeams === "false") {
			let p = "player_" + i;
			elements.push(new component(p, bgW, bgH, "images/players_u/" + p + ".png", 0, 0, "image", "default"));
		}
	}
}

// ****************************************************************************************************************************
// ******************************************************** PLAYER TURN *******************************************************
// ****************************************************************************************************************************
function playerRound() {
	if (!playerTurnRepeat) {										// if not free play
		playerTurn++;
	}
	if (playerTurn >= numberOfPlayers) {				// reset counter
		playerTurn = 0;
	}
	let tempN = "images/markers_u/marker_" + playerTurn + ".png";
	currentPlayer.image.src = tempN;						// mover marker image to current player
}

// ********************************************************************
// ********************** MOUSE LOCATION ON CLICK *********************
// ********************************************************************
function handleMouse(event) {
	loc = windowToCanvas(event.clientX, event.clientY);
}

// ********************************************************************
// ********************** MOUSE LOCATION ON MOVEMENT ******************
// ********************************************************************
function handlePoint(event) {
	mouseLoc = windowToCanvas(event.clientX, event.clientY);
	document.body.style.cursor = "default";	//placed here so mouse didn't flash
}

// ********************************************************************
// ********************** CALCULATE MOUSE COORDS **********************
// ********************************************************************
function windowToCanvas(x, y) {
	let r = gameArea.canvas.getBoundingClientRect();
	return {x: x- r.left * (gameArea.canvas.width / r.width),
				  y: y - r.top * (gameArea.canvas.height / r.height)};
}

// ********************************************************************
// ********************** MULTI-LINE TEXT *****************************
// ********************************************************************
function fillTextMultiLine(ctx, text, x, y) {
  const lineHeight = ctx.measureText("M").width * 1.4;
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y);
    y += lineHeight;
  }
}

// **********************************************************************************************************************
// ***************************************************** GAME START *****************************************************
// **********************************************************************************************************************
//Called on load
function startGame() {
	bankSelect = getRandomInt(0, Object.keys(questionBank).length - 1);	//	random number selection between 0 and length of questionBank object.
	roundAnswer = questionBank[bankSelect][5];													//	gather answer
	categories = questionBank[bankSelect][6];														//	gather category
	//	DEBUG
	if(DEBUG == true) {
		console.log(roundAnswer);
		console.log(categories);
	}
	let b = randomBackground();
	document.getElementById("sideNav").style.display = "block";
	background = new component("bg", bgW, bgH, b, 0, 0, "background", "default");
	foreground = new component("fg", bgW, bgH, "images/bg_plain_u.png", 0, 0, "background", "default");
	wheel = new component("wheel", wheelW, wheelH, "images/wheel_u2.png", wheelX, wheelY, "wheel", "default");
	marker = new component("marker", bgW, bgH, "images/markers_u/marker_main.png", 0, 0, "image", "default");
	let tempN = "images/markers_u/marker_" + playerTurn + ".png";																							//highest score from last game as player 1
	currentPlayer = new component("currentPlayer", bgW, bgH, tempN, 0, 0, "image", "default");
	spinBtn = new component("spinBtn", 106, 73, "images/spin_u.png", 770, 295, "image", "pointer");
	solveBtn = new component("solveBtn", 149, 87, "images/solve_u.png", 800, 14, "image", "pointer");
	loadEls();					// Loads letter hit boxes
	setupPlayers();			// display player info
	gameArea.start();		//Start game area object
}

// **********************************************************************************************************************
// ***************************************************** LETTER HIT BOXES ***********************************************
// **********************************************************************************************************************
function loadEls() {
	let i, j;
	let elName = "sel";
	const selW = 53;
	const selH = 68;
	const selX = 104;
	const selY = 478;
	// **************************************
	// *************** Vowel's **************
	// **************************************
	const selVowX = 158;
	const selVowY = 386;
	// FIRST HIT BOX, excluded from loop //
	elements.push(new component(elName + "_0", selW, selH, "rgba(0,0,0,0.01)", selVowX, selVowY, "mark", "pointer"));
	for (j = 1; j <= 4; j++) { // starts at 1 so that selNewVowY doesn't = 0
		let selNewVowX = selVowX + ((selW + 2) * j);	//new Y = (height + 2px * row(or j) + y)
		elements.push(new component(elName + "_" + j, selW, selH, "rgba(0,0,0,0.01)", selNewVowX, selVowY, "mark", "pointer"));
	}
	// **************************************
	// ************* Consonant's ************
	// **************************************
	// FIRST HIT BOX FOR EACH ROW, excluded from loop //
	elements.push(new component(elName + "_5", selW, selH, "rgba(0,0,0,0.01)", selX, selY, "mark", "pointer"));
	elements.push(new component(elName + "_6", selW, selH, "rgba(0,0,0,0.01)", selX, (selY + selH) + 2, "mark", "pointer"));
	elements.push(new component(elName + "_7", selW, selH, "rgba(0,0,0,0.01)", selX, (selY + (selH * 2)) + 5, "mark", "pointer"));
	for (i = 1; i <= 18; i++) {		// starts at 1 so that selNewY doesn't = 0
		if (i > 6 && i <= 12) {			
			// ******* second row *******
			let selNewX = selX + ((selW + 2) * (i - 6));		//new X = (width + 2px) * (column(or i) + 1st row)
			let selNewY = selY + (selH + 2);								
			elements.push(new component(elName + "_" + (i + 7), selW, selH, "rgba(0,0,0,0.01)", selNewX, selNewY, "mark", "pointer"));
		} else if (i > 12) {				
			// ******* third row *******
			let selNewX = selX + ((selW + 2) * (i - 12));		//new X = (width + 2px) * (column(or i) + 2nd row)
			let selNewY = (selY + (selH * 2)) + 5;
			elements.push(new component(elName + "_" + (i + 7), selW, selH, "rgba(0,0,0,0.01)", selNewX, selNewY, "mark", "pointer"));
		}else {											
			// ******* first row *******
			let selNewX = selX + ((selW + 2) * i);					//new X = (width + 2px) * column(or i)
			elements.push(new component(elName + "_" + (i + 7), selW, selH, "rgba(0,0,0,0.01)", selNewX, selY, "mark", "pointer"));
		}
	}
}

// **********************************************************************************************************************
// ***************************************************** GAME AREA UPDATE ***********************************************
// **********************************************************************************************************************
function updateGameArea() {
	// ***************************************
	// ********** game loop updates **********
	// ***************************************
	gameArea.resize();																//checks for window resize
	gameArea.clear();																	//clear game area
	background.update();															//update background
	wheel.update();																		//update wheel image
	marker.update();																	//update marker image
	foreground.update();															//update board
	currentPlayer.update();														//update player count
	spinBtn.update();																	//update spin button
	solveBtn.update();																//update solve button
	gameArea.framNo += 1;															//frame up-count
	//	ELEMENTS UPDATE
	for (let i = 0; i < elements.length; i++) {				
		elements[i].update();
	}
	//	PLAYER SCORE TEXT UPDATE
	for (let i = 0; i < playerScores.length; i++) {		
		playerScores[i].update();
	}
	letsSpin();																				//spin wheel
	catTxt.update();																	//category text update
	//	IF SOLVE BUTTON CLICKED
	if (solving) {
		overlay.update();
	}
	//	DISPLAY QUESTION
	if (timeForQuestion) {
		overlay.update();
		for (let i = 0; i < questionElements.length; i++) {				//question elements update
			questionElements[i].update();
		}
	}  
	//	ANSWERED QUESTION RESULT
	if (timeForResult) {
		correctShow.linearYMove(-3);
		if (correctShow.y <= 0) {
			correctShow.y = 0;
		}
		correctShow.update();
		if (everyInterval(100)) {
			timeForResult = false;
			correctShow = "";
		}
	} 
	//	DISPLAY QUESTION AT END OF ROUND
	if (correctCounter == 0 && onlyOnce) {
		questionTime = false;
		loc = {x: 0, y: 0};
		qAndA();
		onlyOnce = false;
	}
	//	DISPLAY RULES
	if (showRuleOvl) {
		for (let q = 0; q < mainRulesElements.length; q++) {				//rules elements update
			mainRulesElements[q].update();
		}
	}
}

// **********************************************************************************************************************
// *************************************************** RULES ELEMENTS SET-UP ********************************************
// **********************************************************************************************************************
function showMainRules() {
	mainRulesElements.push(new component("ov", 970, bgH, "rgba(0,0,0,0.9)", 0, 0, "ov", "default"));
	mainRulesElements.push(new component("rulesClose", "50px", "Arial Rounded MT", "rgba(245,9,13,1.00)", 920, 50, "text"));
	mainRulesElements[mainRulesElements.length - 1].text = "X";
	
	mainRulesElements.push(new component("rulesTxt", "14px", "Consolas", "rgb(255,255,255)", 5, 10, "text"));
	mainRulesElements[mainRulesElements.length - 1].text = "~ RULES ~\n\nContestants have three options: spin the wheel and call a consonant, buy a vowel for 250 points, or solve the puzzle.\n\nEach consonant is worth the value of the wedge the wheel lands on.\n\nContestants can continue spinning the wheel until they: miss a letter, spin a Bankrupt, or lose a Turn.\n\nThe Free Play wedge allows a contestant to choose any letter without losing a turn if that letter is not in the puzzle,\nvowels are free, consonants reward the contestant with 500 points apiece.\n\nMultiple choice questions will be asked throughout the game.\n\nIf a contestant answers wrong, it is considered as 'lose a Turn'.\n\nA round ends when puzzle is solved.\n\nThe contestant who solves the puzzle keeps full points, other contestants lose half of their points.\n\nIf an attempt is made to solve the puzzle but the answer is wrong, it is considered as 'lose a Turn'.\n\nThe contestant with the most points wins."
	
	mainRulesElements.push(new component("rulesSnap", bgW, bgH, "images/rulesSnap_u3.png", 100, 0, "background", "default"));
	mainRulesElements.push(new component("rcb", 30, 40, "rgba(0,0,0,0.01)", 920, 10, "overlay", "pointer"));
}

// **********************************************************************************************************************
// **************************************************** Q & A RESULT TIMER **********************************************
// **********************************************************************************************************************
function everyInterval(n) {
	frameCount++;
	if ((frameCount / n) % 1 == 0) {frameCount = 0; return true;}
	return false;
};

// **********************************************************************************************************************
// ******************************************************** WHEEL SPIN **************************************************
// **********************************************************************************************************************
function letsSpin(pushSpin) {
	if (pushSpin == true) {
		pushed = getRandomInt(0, 40);
	}
	if (gameArea.keys && gameArea.keys[39] && !solving || pushSpin == true && !solving) {
		loc = {x: 0, y: 0};													// resets mouse click location when using spin button
		if(pushed < 80) {														// Max push power (around 5 seconds)
			showOnce = true;													// When button hit, showOnce is reset to true
			pick = getRandomInt(0, 360);							// Pick a random number for an angle to land on
//			pick = 32;															// los: 95; br: 155; fp: 190; br: 275
			if (pick % 15 == 0) {pick++;} 						// Pick pushed one degree for clear angle
			pushed += 0.25;														// 1 added every frame as long as arrow is held
		}
		startSpin = false;
	} else {
		if (!startSpin) {
			currentAngle += pushed;										// Set angle to the push count from above
			pushed -= friction;												// Reduce push count by the frictionr.image.src = "images/marker_u.png";
			if (currentAngle >= 360) {								// Reset number if it hits 360
					currentAngle = 0;
				}
			if (pushed <= 0.7 && currentAngle < currentAngle + 45) {											// Allow the spin to slow down only to a certain speed
					pushed = 0.7;
				if (Math.floor(currentAngle) == pick) {		// When the wheel spins, if it matches the number choosen from above
					currentAngle = pick;										// Stops the wheel at the picked number
					if (showOnce) {													// Only push the score once
						playerTurnRepeat = false;
						if (wheelValues[section] == "lose a turn") {
							playerRound();
						} else if (wheelValues[section] == "free play") {
							playerTurnRepeat = true;
							freebie = true;
						} else if (wheelValues[section] == "bankrupt") {
							players[playerTurn] = 0;
							playerRound();
							console.log("bankrupt");
						}
						showOnce = false;											// Resets the showOnce so this acion doesn't repeat for this round
						startSpin = true;
						//	IF QUESTION IS TO BE ASKED EVERY SPIN
						if (questionTime && wheelValues[section] != "lose a turn" && wheelValues[section] != "bankrupt" && wheelValues[section] != "free play") {
							solving = true;
							qAndA();
						}
					}
				}
			}
		}
	}
}

// ***********************************************************************************************************************
// ***************************************************** GAME COMPONENT BUILD ********************************************
// ***********************************************************************************************************************
function component(name, width, height, color, x, y, type, cursor) {
	this.selected = false;
	this.name = name;
	this.type = type;
	this.cursor = cursor;
	this.newX = this.x * ratioX;
	this.newY = this.y * ratioY;
	this.newW = this.width * ratioX;
	this.newH = this.height * ratioY;
	this.objRight = this.newX +this. newW;
	this.objBottom = this.newY + this.newH;
	if (type == "image" || type == "background" || type == "wheel") {
		this.image = new Image();
		this.image.src = color;
	}
	this.y = y;
	this.x = x;
	this.width = width;
	this.height = height;
	// ***************************************
	// ********** components update **********
	// ***************************************
	this.update = function() {
		this.newX = this.x * ratioX;
		this.newY = this.y * ratioY;
		this.newW = this.width * ratioX;
		this.newH = this.height * ratioY;
		this.objRight = this.newX + this.newW;
		this.objBottom = this.newY + this.newH;
		if ((this.cursor == "pointer" && !solving) && (!showRuleOvl) || this.name == "a" || this.name == "b" || this.name == "c" || this.name == "d" || this.name == "rcb") {
			this.hoverOver();
			this.clicked();
		} else {
			spinBtn.image.src = "images/spin_u.png";
			solveBtn.image.src = "images/solve_u.png";
			if (timeForQuestion) {
				questionElements[1].image.src = "images/a_u.png";
				questionElements[2].image.src = "images/b_u.png";
				questionElements[3].image.src = "images/c_u.png";
				questionElements[4].image.src = "images/d_u.png";
			}
		}
		ctx = gameArea.context;
		if (type == "image" || type == "background" || type == "wheel") {			//	background/image update	//
			if (type != "wheel") {
				ctx.shadowColor = "rgba(0,0,0,0)";
				ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
			} else {
				this.newPos();																										// wheel spin logic/math
			}
		} else if (type == "text") {
			if (this.name.slice(0,1) == "p" && this.name != "pick") {
					this.text = "";
					if (this.name != "p10") {
						this.text = players[(this.name.slice(1,2)-1)];
					} else {
						this.text = players[(this.name.slice(1,3)-1)];
					}
				}
			ctx.font = this.width + " " + this.height;
			ctx.shadowOffsetX = 3;
			ctx.shadowOffsetY = 3;
			if (color == "rgb(0,0,0)") {ctx.shadowColor="white";} 							//	different text shadow based on text color									
				else {ctx.shadowColor="black";}																			
			ctx.shadowBlur=3;																										//	shadow blur
			ctx.fillStyle = color;
			if (this.name == "question") { // || this.name == "correctShow") {
				textAdjust(ctx, this.text, 990, this.x, this.y, false);
			} else if (this.name == "aTxt" || this.name == "bTxt" || this.name == "cTxt" || this.name == "dTxt") {
				textAdjust(ctx, this.text, 1000, this.x, this.y, true);
			} else if (this.name == "rulesTxt") {
				fillTextMultiLine(ctx, this.text, this.x, this.y)
			} else {
				ctx.fillText(this.text, this.x, this.y);
			}
		} else {																															// *all other component updates*	//
			if (this.name == "overlay") {
				let grad = ctx.createLinearGradient(640,290, 640,bgH);
				grad.addColorStop(0,"rgba(0,0,0,0)");
				grad.addColorStop(0.2,"rgba(0,0,0,0.5)");
				grad.addColorStop(0.5,"rgba(0,0,0,0.9)");
				grad.addColorStop(1,"rgba(0,0,0,1)");
				ctx.fillStyle = grad;
			} else {
				ctx.shadowColor = "rgba(0,0,0,0)";
				ctx.fillStyle = color || "rgba(0,0,0,1)";
			}
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};
	// **********************************************
	// ********** components animation **********
	// **********************************************
	this.newPos = function() {
		ctx.save();																															//save state of wheel
		if (currentAngle == 360) {																							//reset angle to 0 if 360 is reached
			currentAngle = 0;
		}
		section = Math.floor((currentAngle) / 15);													//calc section of wheel (div15 b/c 15deg per sec.)
		if (section <= 0) {																											//reset section count if it goes below 0
			section = 0;
		}
		ctx.translate(this.x, this.y);																						//keeps wheel image in same pos
		ctx.rotate(currentAngle * Math.PI / 180);																//rotation math using angle
		ctx.drawImage(this.image, -(this.width / 2), -(this.height / 2));				//draw image from center of image
		ctx.restore();																													//restore save state
	};
	// **********************************************
	// ********* components linear animation ********
	// **********************************************
	this.linearYMove = function(speed) {
		this.y += speed;
	};
	// **********************************************
	// ********** components hover handler **********
	// **********************************************
	this.hoverOver = function() {
		if (this.objBottom > mouseLoc.y && this.newY < mouseLoc.y && this.objRight > mouseLoc.x && this.newX < mouseLoc.x) {
			document.body.style.cursor = "pointer";
			if (this.name == "spinBtn") {
				spinBtn.image.src = "images/spin_u2.png";
			} else if (this.name == "solveBtn") {
				solveBtn.image.src = "images/solve_u2.png";
			} 
			if (timeForQuestion) {
				if (this.name == "a") {
					questionElements[1].image.src = "images/aHover_u.png";
				} else if (this.name == "b") {
					questionElements[2].image.src = "images/bHover_u.png";
				} else if (this.name == "c") {
					questionElements[3].image.src = "images/cHover_u.png";
				} else if (this.name == "d") {
					questionElements[4].image.src = "images/dHover_u.png";
				} 
			}
		}
	};
	// **********************************************
	// ********** components click handler **********
	// **********************************************
	this.clicked = function() {
		if (this.selected == false) {
			if ((this.objBottom > loc.y) && (this.newY < loc.y) && (this.objRight > loc.x) && (this.newX < loc.x)) {
				if (this.name == "spinBtn") {
					letsSpin(true);
				} else if (this.name == "solveBtn") {
					solveScreen();
				} 
				else if (this.name == "a" || this.name == "b" || this.name == "c" || this.name == "d") {
					this.selected = true;
					solving = false;
					answerCheck(this.name);
				} else if (this.name == "rcb") {
					closeRuleBtn();
				} else if (correctlyAnswered || freebie || players[playerTurn] >= 250 || questionTime == false) {
						this.selected = true;
						this.cursor = "default";
						let splitName = this.name.split("_")[1];
						let letter = letterNumber[splitName];
						if (letter == "a" || letter == "e" || letter == "i" || letter == "o" ||letter == "u") {
							if (players[playerTurn] >= 250 && !freebie) {
								players[playerTurn] -= 250;
								elements.push(new component(this.name, this.width, this.height, "rgba(255,255,255,0.5)", this.x, this.y, "mark", "default"));
								crossCheck(letter, true);
							} else if (freebie) {
								elements.push(new component(this.name, this.width, this.height, "rgba(255,255,255,0.5)", this.x, this.y, "mark", "default"));
								crossCheck(letter, true);
							} else {
								console.log("not enough points");
								this.selected = false;
								this.cursor = "pointer";
								correctlyAnswered = true;
								return;
							}
						} else if (correctlyAnswered || freebie || questionTime == false) {
							elements.push(new component(this.name, this.width, this.height, "rgba(255,255,255,0.5)", this.x, this.y, "mark", "default"));
							crossCheck(letter, false);
						}
					else {
						this.selected = false;
						this.cursor = "pointer";
					}
					correctlyAnswered = false;
				} 
			}
		}
	};
}

// ***************************************************************************************************************************
// ***************************************************** SOLVING SCREEN  *****************************************************
// ***************************************************************************************************************************
function solveScreen() {
	solving = true;
	overlay = new component("overlay", bgW, bgH, "rgba(0,0,0,0.8)'", 0, 0, "overlay", "default");
	solveInput.style.display = "block";
	solveSubmit.style.display = "block";
}

function handleSolve() {
	loc = {x: 0, y: 0};
	if (solveInput.value.toLowerCase() == roundAnswer.toLowerCase()) {
		questionTime = false;
		qAndA();
	} else {
		solving = false;
	}
	solveInput.style.display = "none";
	solveSubmit.style.display = "none";
}

// ***************************************************************************************************************************
// ********************************************* SHOWING RULES DURING GAME PLAY  *********************************************
// ***************************************************************************************************************************
function openRuleBtn() {
	showMainRules();
	showRuleOvl = true;
}

function closeRuleBtn() {
	loc = {x: 0, y: 0};
	mainRulesElements = [];
	showRuleOvl = false;
}
