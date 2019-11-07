// JavaScript Document

// ******************* CONSTANTS
let ratio;
let ratioX;
let ratioY;
let logo;
let background;
let host;
let lights;
let overlay;
let directionTxt;
let question;
let aTxt;
let bTxt;
let cTxt;
let dTxt;
let lifeOver;
let friend;
let friendTxt;
let closeBtn;
let closeBtnTxt;
let playBtn;
let playBtnClk;
let finalYes;
let finalYesTxt;
let finalNo;
let finalNoTxt;
let finalConf;
let finalConfTxt;
let finalNoClk;
let finalYesClk;
let loc = {x: 0, y: 0};				// Gives mouse start location for no errors
let mouseLoc = {x: 0, y: 0};	// Gives mouse start location for no errors
const elements = [];					// Array for game components
const fifty = ["a","b","c","d"];
let onlyOnce = true;					// Allows certain actions to be taken only once
let finalAns = false;					// True when answer is selected and used to confirm selection
let fiftyOnce = false;				// True when 50:50 used
let introSeq = true;					// False when game starts
let lifeLine = false;					// Used for when a lifeline is selected
let phoneFriend = false;			// When phone a friend is selected
let askAudience = false;			// Whe ask audience is selected
const friendHelp = ["I\nthink the\nanswer is\nA.", "I\nthink the\nanswer is\nB.", "I\nthink the\nanswer is\nC.", "I\nthink the\nanswer is\nD."];

//Image measurements and math
const bgW = 1216;
const bgH = 722;
const ansW = 474;
const ansH = 100;
const topAnsRow = 500;
const btmAnsRow = 600;
const ansSpace = (bgW - (ansW * 2)) / 3;
const llW = 129.097;
const llH = 76;
const llY = 25;
const finalW = 300;
const friendImages = 3;				// Number of different phone a friend images

//Intro animation
let brLights;
let blLights;
let brCount = 0;
let blCount = 13;
let restartAnim = false;	

//Document set-up
this.moveTo(0,0);
this.resizeTo(bgW+250, bgH+250);

//Mouse movement event listeners
canvas.addEventListener("mousedown", handleMouse, false);
canvas.addEventListener("mousemove", handlePoint, false);

// ******************* GAME AREA OBJECT
const gameArea = {
	// ********** canvas set-up
	canvas: document.getElementById("canvas"),
	// ********** gameArea start
	start: function () {
		this.canvas.width = bgW;
		this.canvas.height = bgH;
		this.context = this.canvas.getContext("2d");
		this.framNo = 0;																				//start frame counter
		this.level = 0;																					//start level counter to progress the game
		this.score = 0;																					//start score counter
		this.interval = setInterval(updateGameArea, 20);				//update game every 20 milliseconds
		window.addEventListener('load', this.resize, false);
		window.addEventListener('resize', this.resize, false);	//window resize listener
	},
	// ********** gameArea refresh
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);	//clear canvas every update
	},
	// ********** gameArea stop (end game)
	stop: function() {
		background.update();
		lights.update();
		host.update();
		for (let i = 0; i < elements.length; i++) {		// Removes elements so they don't show on last screen
			elements[i] = "";
		}
		finalYes = "";
		finalYesTxt = "";
		finalNo = "";
		finalNoTxt = "";
		finalConf = "";
		finalConfTxt = "";
		logo = new component("logo", bgW, bgH, "images/logo_u.png", 0, 0, "background", "default");	//Adds logo
		logo.update();
		this.context.fillStyle = "rgba(255,255,255,0.73)";
		this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
		
		clearInterval(this.interval);
		canvas.style.cursor = "default";
		
		self.close();
	},
	// ********** gameArea resize
	resize: function() {
		let height = window.innerHeight;
		ratio = this.canvas.width/this.canvas.height;
		let width = height * ratio;
		this.canvas.style.width = width+'px';
		this.canvas.style.height = height+'px';
		//  ask the audience chart resize
		let container = document.getElementById("canvas-container");
		ratioX = gameArea.canvas.offsetWidth / gameArea.canvas.width; 
		ratioY = gameArea.canvas.offsetHeight / gameArea.canvas.height;
		let newX = 220 * ratioX;
		let newY = 180 * ratioY;
		container.style.left = newX + "px";
		container.style.top = newY + "px";
	}
};

// ******************* GAME START
//Called on load
function startGame() {
	background = new component("bg", bgW, bgH, "images/bg_u2.png", 0, 0, "background", "default");
	host = new component("host", bgW, bgH, "images/host_u.png", 0, 0, "background", "default");
	lights = new component("bg", bgW, bgH, "images/lights_u/lights.png", 0, 0, "background", "default");
	
	directionTxt = new component("directionTxt", "50px", "Consolas", "rgb(255,255,255)", (bgW / 2), 75, "text");
	directionTxt.text = "~ HOW TO PLAY ~\n\nAnswer 15 multiple-choice questions\nin a row correctly to win.\n\nUse up to 3 lifelines to help you\nselect an answer.";
	gameArea.start();	//Start game area object
}

// ******************* GAME AREA UPDATE
function updateGameArea() {
	// ********** game loop updates
	gameArea.resize();
	gameArea.clear();			
	background.update();
	gameArea.framNo += 1;
	if (!introSeq) {
		lights.update();
		host.update();
		// ********** after intro, setup screen elements **********
		if (gameArea.framNo == 1) {
			elements.push(new component("sc", bgW, bgH, "images/score_u/score.png", 0, 0, "image", "default"));
			elements.push(new component("5050", bgW, bgH, "images/5050_u.png", 0, 0, "image", "default"));
			elements.push(new component("5050clk", llW, llH, "rgba(0,0,0,0.01)", 287, llY, "overlay", "pointer"));
			elements.push(new component("phone", bgW, bgH, "images/phone_u.png", 0, 0, "image", "default"));
			elements.push(new component("phoneclk", llW, llH, "rgba(0,0,0,0.01)", 543, llY, "overlay", "pointer"));
			elements.push(new component("ask", bgW, bgH, "images/ask_u.png", 0, 0, "image", "default"));
			elements.push(new component("askclk", llW, llH, "rgba(0,0,0,0.01)", 800, llY, "overlay", "pointer"));
			elements.push(new component("walk", bgW, bgH, "images/walk_u.png", 0, 0, "image", "default"));
			elements.push(new component("walkclk", llW, llH, "rgba(0,0,0,0.01)", 1055, llY, "overlay", "pointer"));
			askAway();	//	LOADS Q&A'S
		}
		// ********** update elements
		for (let i = 0; i < elements.length; i++) {
			elements[i].update();
		}
		question.update();
		aTxt.update();
		bTxt.update();
		cTxt.update();
		dTxt.update();
		// ********** display other elements at different stages
		if (finalAns) {
			finalAnswer();
			overlay.update();
			finalConf.update();
			finalConfTxt.update();
			finalYes.update();
			finalYesTxt.update();
			finalNo.update();
			finalNoTxt.update();
			finalNoClk.update();
			finalYesClk.update();
		} else if (lifeLine) {	//lifeline updates when selected
			overlay.update();
			lifeOver.update();
			closeBtnTxt.update();
			closeBtn.update();
			if (phoneFriend) {		//phone lifeline update
				friend.update();
				friendTxt.update();
			}
		}
	} else {
		introSequence();
	}
}

// ******************* GAME COMPONENT BUILD
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
	if (type == "image" || type == "background") {
		this.image = new Image();
		this.image.src = color;
	}
	//	provides q&a components a place off screen and target for animation effect
	if (this.name == "q" || this.name == "a" || this.name == "b" || this.name == "c" || this.name == "d") {
		this.targetY = y;
		this.y = gameArea.canvas.height + 100;
	} else if (this.name == "question") {
		this.targetY = y;
		this.y = gameArea.canvas.height + 175;
	} else if (this.name == "aTxt" || this.name == "bTxt" || this.name == "cTxt" || this.name == "dTxt") {
		this.targetY = y;
		this.y = gameArea.canvas.height + 150;
	} else {
	//	all other components keep the atributes passed
		this.y = y;
	}
	this.x = x;
	this.width = width;
	this.height = height;
	// ********** components update
	this.update = function() {
		this.newX = this.x * ratioX;
		this.newY = this.y * ratioY;
		this.newW = this.width * ratioX;
		this.newH = this.height * ratioY;
		this.objRight = this.newX + this.newW;
		this.objBottom = this.newY + this.newH;
		
		if (this.cursor == "pointer") {
			this.hoverOver();
			this.clicked();
		}
		ctx = gameArea.context;
		if (type == "image" || type == "background") {												//	background/image update	//
			ctx.shadowColor = "rgba(0,0,0,0)";
			ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
			if (this.name == "q" || this.name == "question") {									// Q&A image animation (text-line: 326)
				animateQ(this);
			} else if (this.name == "a" || this.name == "b" || this.name == "c" || this.name == "d") {
				animateA(this);
			}
		} else if (this.type == "text") {																			//	text update //
			ctx.font = this.width + " " + this.height;
			ctx.shadowOffsetX = 3;
			ctx.shadowOffsetY = 3;
			if (color == "rgb(0,0,0)") {ctx.shadowColor="white";} 							//	different text shadow based on text color
				else if (introSeq) {ctx.shadowColor= "#2F4F4F";} 										
				else {ctx.shadowColor="black";}																			
			ctx.shadowBlur=3;																										//	shadow blur
			ctx.fillStyle = color;
			if (!introSeq) {
				ctx.textAlign = "start";																					//	change alignment for intro text
				if (!phoneFriend || this.name == "closeBtn") {										//	alignment correction and close button to render
					ctx.fillText(this.text, this.x, this.y);
				}
			}
			if (this.name == "question") {animateQ(this);} 											// Q&A text animation (image-line: 302)
				else if (this.name == "aTxt" || this.name == "bTxt" || this.name == "cTxt" || this.name == "dTxt") {animateA(this);} 
				else if (this.name == 'directionTxt' || this.name == "friendTxt") {fillTextMultiLine(ctx, this.text, this.x, this.y);}	// alignment correction
		} else {																															// *all other component updates*	//
			ctx.shadowColor = "rgba(0,0,0,0)";
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
};
	// ********** components hover handler
	this.hoverOver = function() {
		if (this.objBottom > mouseLoc.y && this.newY < mouseLoc.y && this.objRight > mouseLoc.x && this.newX < mouseLoc.x) {
			document.body.style.cursor = "pointer";
			if (this.name == "playBtnClk") {															//	intro button hover effect
				playBtn.image.src = "images/play_hover_u2.png";
				playBtn.update();
			}
		}
	};
	// ********** components click handler
	this.clicked = function() {
		if ((this.objBottom > loc.y) && (this.newY < loc.y) && (this.objRight > loc.x) && (this.newX < loc.x)) {
			this.selected = true;
			if (onlyOnce) {
				if (this.name == "a") {																			//a button event
					finalAns = true;
					this.image.src = "images/a_sel_u.png";
					checkFifty(this.name);	// handle 50:50 lifeline use
				} else if (this.name == "b") {															//b button event
					finalAns = true;
					this.image.src = "images/b_sel_u.png";
					checkFifty(this.name);	// handle 50:50 lifeline use
				} else if (this.name == "c") {															//c button event
					finalAns = true;
					this.image.src = "images/c_sel_u.png";
					checkFifty(this.name);	// handle 50:50 lifeline use
				} else if (this.name == "d") {															//d button event
					finalAns = true;
					this.image.src = "images/d_sel_u.png";
					checkFifty(this.name);	// handle 50:50 lifeline use
				} else if (this.name == "5050clk") {												//50:50 button event
					elements[1].image.src = "images/5050_used_u.png";
					this.cursor = "default";
					onlyOnce = true;
					lifeLines(0);
					return;
				} else if (this.name == "phoneclk") {												//phone a friend button event
					elements[3].image.src = "images/phone_used_u.png";
					this.cursor = "default";
					onlyOnce = true;
					lifeLines(1);
					return;
				} else if (this.name == "askclk") {													//ask audience button event
					elements[5].image.src = "images/ask_used_u.png";
					this.cursor = "default";
					onlyOnce = true;
					lifeLines(2);
					return;
				} else if (this.name == "cb") {															//lifeline close button event
					elements[10].cursor = "pointer";
					elements[11].cursor = "pointer";
					elements[12].cursor = "pointer";
					elements[13].cursor = "pointer";
					lifeLine = false;
					onlyOnce = true;
					phoneFriend = false;
					askAudience = false;
					unchartIt();
					return;
				} else if (this.name == "walkclk") {												//walk away button event
					if (confirm("This will Quit the game. Are you sure?")) {
						gameArea.stop();
					} else {
						loc = {x: 0, y: 0};	// Reset click location
					}
					onlyOnce = true;
					return;
				} else if (this.name == "playBtnClk") {											//intro play button event
					loc = {x: 0, y: 0};	// Reset click location
					introSeq = false;
					gameArea.framNo = 0;
					onlyOnce = true;
					return;
				}
				onlyOnce = false;
			}
			// ************ final answer selection handler
			else if (this.name == "finalNoClk") {
				finalAns = false;
				onlyOnce = true;
				checkFifty();			// handle 50:50 lifeline use
			} else if (this.name == "finalYesClk") {
				finalAns = false;
				onlyOnce = true;
				finalYesCheck();	// ANSWER CHECK LOGIC
			}
		}
	};
}

// ******************* MOUSE LOCATION ON CLICK
function handleMouse(event) {
	loc = windowToCanvas(event.clientX, event.clientY);
}

// ******************* MOUSE LOCATION ON MOVEMENT
function handlePoint(event) {
	mouseLoc = windowToCanvas(event.clientX, event.clientY);
	document.body.style.cursor = "default";	//placed here so mouse didn't flash
}

// ******************* CALCULATE MOUSE COORDS
function windowToCanvas(x, y) {
	let r = gameArea.canvas.getBoundingClientRect();
	return {x: x- r.left * (gameArea.canvas.width / r.width),
				  y: y - r.top * (gameArea.canvas.height / r.height)};
}

// ******************* MULTI-LINE TEXT
function fillTextMultiLine(ctx, text, x, y) {
  const lineHeight = ctx.measureText("M").width * 2.5;
  const lines = text.split("\n");
	ctx.textAlign = 'center';
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y);
    y += lineHeight;
  }
}

// ******************* INTRO ANIMATION
function introAnimate() {
	overlay = new component("ov", bgW, bgH, "rgba(0,0,0,0.8)", 0, 0, "overlay", "default");
	playBtn = new component("playBtn", bgW, bgH, "images/play_u.png", 0, 0, "image", "default");
	playBtnClk = new component("playBtnClk", 190, 116, "rgba(0,0,0,0.01)", 514, 555, "overlay", "pointer");
	brLights = new component("bg", bgW, bgH, "images/lights_u/intro/intro_0.png", 0, 0, "background", "default");
	blLights = new component("bg", bgW, bgH, "images/lights_u/introAlt/intro_0.png", 0, 0, "background", "default");
	//	restarts animation after cycling through
	if (brCount >= 13) {
		restartAnim = true;
	} else if (brCount <= 0) {
		restartAnim = false;
	}
	//	animation counter to trigget restart boolean
	if (!restartAnim) {
		brCount += 1;				//	count up
		blCount -= 1;				//	count down
	} else {							//	opposite count to cycle
		brCount -= 1;
		blCount += 1;
	}
	let brSrc = "images/lights_u/intro/intro_" + brCount + ".png";
	let blSrc = "images/lights_u/introAlt/intro_" + blCount + ".png";
	brLights.image.src = brSrc;
	blLights.image.src = blSrc;
}

// ******************* INTRO SEQUENCE
function introSequence() {
	introAnimate()
	brLights.update();
	blLights.update();
	host.update();
	overlay.update();
	directionTxt.update();
	playBtn.update();
	playBtnClk.update();
}

// ******************* ANIMATE QUESTION
function animateQ(el) {
	el.y -= 11;											//	speed of animation
	if (el.y <= el.targetY) {				//	stop animation
		el.y = el.targetY;
	}
}

// ******************* ANIMATE ANSWERS
function animateA(el) {
	el.y -= 7;											//	speed of animation
	if (el.y <= el.targetY) {				//	stop animation
		el.y = el.targetY;
	}
}

// ******************* FINAL ANSWER ELEMENTS SETUP
function finalAnswer() {
	//	Images
	finalConf = new component("finConf", 900, 100, "images/q_u.png", ((bgW - 900) / 2), 200, "image", "default");
	finalYes = new component("finalYes", finalW, 50, "images/finalYes_u.png", ((bgW - (finalW * 2)) / 3), finalW, "image", "default");
	finalNo = new component("finalNo", finalW, 50, "images/finalNo_u.png", ((((bgW - (finalW * 2)) / 3) * 2) + finalW), finalW, "image", "default");
	//	Text
	finalConfTxt = new component("finalConfTxt", "50px", "Consolas", "rgb(255,255,255)", (((bgW - 900) / 2) + 290), 260, "text", "default");
	finalConfTxt.text = "Final Answer?";
	finalYesTxt = new component("finalYesTxt", "30px", "Consolas", "rgb(255,255,255)", (((bgW - (finalW * 2)) / 3) + 125), 333, "text", "default");
	finalYesTxt.text = "Yes";
	finalNoTxt = new component("finalNoTxt", "30px", "Consolas", "rgb(255,255,255)", ((((bgW - (finalW * 2)) / 3) * 2) + 440), 333, "text", "default");
	finalNoTxt.text = "No";
	//	Hit boxes
	finalNoClk = new component("finalNoClk", 290, 40, "rgba(0,0,0,0.01)", 715, 305, "overlay", "pointer"); 
	finalYesClk = new component("finalYesClk", 290, 40, "rgba(0,0,0,0.01)", 210, 305, "overlay", "pointer");
}

// ******************* LIFE LINE CLICK HANDLER
function lifeLines(pick) {
	if (pick != 0) {	//	not 50:50, choices are not clickable until close
		elements[10].cursor = "default";
		elements[11].cursor = "default";
		elements[12].cursor = "default";
		elements[13].cursor = "default";
		lifeLine = true;
		lifeOver = new component("ph", 800, 500, "rgba(55,82,168,0.9)", ((bgW / 2) - 400), ((bgH / 2) - 250), "overlay", "default");
		closeBtnTxt = new component("closeBtn", "50px", "Arial Rounded MT", "rgba(245,9,13,1.00)", ((bgW / 2) + 350), ((bgH / 5) + 15), "text");
		closeBtnTxt.text = "X";
		closeBtn = new component("cb", 50, 50, "rgba(0,0,0,0.01)", ((bgW / 2) + 350), ((bgH / 5) - 30), "overlay", "pointer");
		switch (pick) {
			case 1:
				//	**************	phone a friend	**************
				let friendChoice = getRandomInt(0, friendImages);				//	random number to pick different image each game, function in audienceChart.js
				let friendImage = "images/phoneOver_u_" + friendChoice + ".png";
				friend = new component("friend", 741, 472, friendImage, ((bgW / 2) - 420), ((bgH / 2) - 235), "image", "default");
				friendTxt = new component("friendTxt", "50px", "Arial Rounded MT", "rgb(0,0,0)", (bgW / 2) + 55, 220, "text");
				friendTxt.text = friendHelp[getRandomInt(0, 3)];
				phoneFriend = true;
				break;
			case 2:
				//	**************	ask the audience	**************
				chartIt();								//	chart function in audienceChart.js
				askAudience = true;
				break;
			default:
				console.log("Lifeline Default");
				break;
		}
	} else {
		//	**************	50:50	**************
		check5050();	// 50:50 LOGIC, function in qa_logic.js
	}
}

// ******************* 50:50 HANDLER
function checkFifty(ansSel) {
	if (fiftyOnce) {
		for (let j = 0; j < fifty.length; j++) {
			afterFifty(fifty[j], ansSel);
		}
	} 
	else {
		switch(ansSel) {
				case "a":
					elements[11].image.src = "images/b_u.png";
					elements[12].image.src = "images/c_u.png";
					elements[13].image.src = "images/d_u.png";
					break;
				case "b":
					elements[10].image.src = "images/a_u.png";
					elements[12].image.src = "images/c_u.png";
					elements[13].image.src = "images/d_u.png";
					break;
				case "c":
					elements[10].image.src = "images/a_u.png";
					elements[11].image.src = "images/b_u.png";
					elements[13].image.src = "images/d_u.png";
					break;
				case "d":
					elements[10].image.src = "images/a_u.png";
					elements[11].image.src = "images/b_u.png";
					elements[12].image.src = "images/c_u.png";
					break;
				default:
					elements[10].image.src = "images/a_u.png";
					elements[11].image.src = "images/b_u.png";
					elements[12].image.src = "images/c_u.png";
					elements[13].image.src = "images/d_u.png";
					break;
		}
	}
}

// ******************* AFTER 50:50 HANDLER
function afterFifty(show, selected) {
	switch(show) {
		case "a":
			if (selected == "a") {
				elements[10].image.src = "images/a_sel_u.png";
			} else {
				elements[10].image.src = "images/a_u.png";
			}
			break;
		case "b":
			if (selected == "b") {
				elements[11].image.src = "images/b_sel_u.png";
			} else {
				elements[11].image.src = "images/b_u.png";
			}
			break;
		case "c":
			if (selected == "c") {
				elements[12].image.src = "images/c_sel_u.png";
			} else {
				elements[12].image.src = "images/c_u.png";
			}
			break;
		case "d":
			if (selected == "d") {
				elements[13].image.src = "images/d_sel_u.png";
			} else {
				elements[13].image.src = "images/d_u.png";
			}
			break;
		default:
			elements[10].image.src = "images/a_u.png";
			elements[11].image.src = "images/b_u.png";
			elements[12].image.src = "images/c_u.png";
			elements[13].image.src = "images/d_u.png";
			break;
	}
}
