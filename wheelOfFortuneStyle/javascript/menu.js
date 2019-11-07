// JavaScript Document
/*jshint esversion: 6 */

// *********************************************************************************************************************
// ***************************************************** CONSTANTS *****************************************************
// *********************************************************************************************************************
const DEBUG = false;						//	DEBUG info in console

const menuW = 1280;
const menuH = 720;
let menuRatio;
let menuRatioX;
let menuRatioY;
let rulesOverlay;								//	Overlay object
let rulesTxt;										//	Rules text object
let rulesCloseTxt;							//	Rules close text object
let rulesClose;									//	Rules close object
let menuBackground;							//	Background object
let mainMenu;										//	Menu image object
let menuNewGame;								//	Continue Game button object
let menuOptions;								//	New Game button object
let menuRules;									//	Rules button object
let menuQuit;										//	Quit button object
let recallisTeams = false;			//	show info for marque
let recallnumberOfPlayers = 0;
let recallplayers = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0};
let marque = "";
let marqueShow;
let marqWidth;
let menuBtnW = 315;
let menuBtnH = 104;
let menuBtnX = 490;
let rPg = 1;										// rules page counter
let clickLoc = {x: 0, y: 0};		// Gives mouse click start location for no errors
let moveLoc = {x: 0, y: 0};			// Gives mouse start location for no errors
let viewRules = false;
let menuElements = [];					//	Overlay object
let rulesElements = [];					//	Overlay object
const optionSpeed = 50;					//	Overlay object

//Event listeners
optionSave.addEventListener("click", handleSave, false);
optionBack.addEventListener("click", handleBack, false);

// ****************************************************************************************************************************
// ***************************************************** MENU AREA OBJECT *****************************************************
// ****************************************************************************************************************************
const menuArea = {
	// ***********************************
	// ********** canvas set-up **********
	// ***********************************
	canvas: document.getElementById("menu"),
	// ************************************
	// ********** menuArea start **********
	// ************************************
	start: function () {
		this.canvas.width = menuW;
		this.canvas.height = menuH;
		this.context = this.canvas.getContext("2d");
		this.framNo = 0;																				//start frame counter
		this.interval = setInterval(updateMenuArea, 20);				//update game every 20 milliseconds
		window.addEventListener('load', this.resize, false);
		window.addEventListener('resize', this.resize, false);	//window resize listener
	},
	// **************************************
	// ********** menuArea refresh **********
	// **************************************
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);	//clear canvas every update
	},
	// **********************************************
	// ********** menuArea stop (end game) **********
	// **********************************************
	stop: function() {
		this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
		clearInterval(this.interval);
		document.getElementById("canvas").style.display = "block";
		document.getElementById("menu").style.display = "none";
		startGame();
	},
	reset: function() {
		location.reload();
	},
	// *************************************
	// ********** menuArea resize **********
	// *************************************
	resize: function() {
		let height = window.innerHeight;
		menuRatio = this.canvas.width/this.canvas.height;
		let width = height * menuRatio;
		this.canvas.style.width = width+'px';
		this.canvas.style.height = height+'px';
		// *******************************
		//  other resize ratios
		// *******************************
		menuRatioX = menuArea.canvas.offsetWidth / menuArea.canvas.width; 
		menuRatioY = menuArea.canvas.offsetHeight / menuArea.canvas.height;
	}
};

// ********************************************************************
// ********************** MOUSE LOCATION ON CLICK *********************
// ********************************************************************
function menuMouse(event) {
	clickLoc = menuToCanvas(event.clientX, event.clientY);
}

// ********************************************************************
// ********************** MOUSE LOCATION ON MOVEMENT ******************
// ********************************************************************
function menuClick(event) {
	moveLoc = menuToCanvas(event.clientX, event.clientY);
	document.body.style.cursor = "default";	//placed here so mouse didn't flash
	menuNewGame.image.src = "images/cGame_u.png";
	menuOptions.image.src = "images/newGame_u.png";
	menuRules.image.src = "images/rules_u.png";
	menuQuit.image.src = "images/quit_u.png";
}

// ********************************************************************
// ********************** CALCULATE MOUSE COORDS **********************
// ********************************************************************
function menuToCanvas(x, y) {
	let r = menuArea.canvas.getBoundingClientRect();
	return {x: x- r.left * (menuArea.canvas.width / r.width),
				  y: y - r.top * (menuArea.canvas.height / r.height)};
}

// **********************************************************************************************************************
// ***************************************************** MENU START *****************************************************
// **********************************************************************************************************************
//Called on load
function startMenu() {	
	let b = randomBackground();
	menuBackground = new menuComponent("bg", menuW, menuH, b, 0, 0, "background", "default");
	mainMenu = new menuComponent("mm", menuW, menuH, "images/menu_u2.png", 0, 0, "background", "default");
	menuNewGame = new menuComponent("mng", menuBtnW, menuBtnH, "images/cGame_u.png", menuBtnX, 350, "background", "default");
	menuOptions = new menuComponent("mo", menuBtnW, menuBtnH, "images/newGame_u.png", menuBtnX, 425, "background", "default");
	menuRules = new menuComponent("mr", menuBtnW, menuBtnH, "images/rules_u.png", menuBtnX, 500, "background", "default");
	menuQuit = new menuComponent("quit", menuBtnW, menuBtnH, "images/quit_u.png", menuBtnX, 575, "background", "default");
	loadMenuEls();		// Loads letter hit boxes
	menuArea.start();	//Start game area object
	try {		// try to call up previous game info
		recallPrevGame();
		let p;
		let m = "";
		if (recallisTeams == "true") {
			p = "   Team ";
		} else {
			p = "   Player ";
		}
		let pMid = ": ";
		let pEnd;
		for (let i = 0; i < Object.keys(recallplayers).length; i++) {
			if (recallplayers[i] > 0) {
				if (Object.keys(recallplayers).length == i) {
					pEnd = "";
				} else {
					pEnd = ",";
				}
				m += p + (i + 1) + pMid + recallplayers[i] + pEnd;
			}
		}
		marque = m.slice(0, m.length - 1);
		marqueShow = new menuComponent("marque", "50px", "Arial Rounded MT", "rgba(0,0,0,1)", menuW, menuH - 15, "text");
		marqueShow.text = marque;
	} catch(err) {console.log("marque: ", err);}
	
	//Mouse movement event listeners
	menuArea.canvas.addEventListener("mousedown", menuMouse, false);
	menuArea.canvas.addEventListener("mousemove", menuClick, false);
}

// **********************************************************************************************************************
// ***************************************************** GAME AREA UPDATE ***********************************************
// **********************************************************************************************************************
function updateMenuArea() {
	// ***************************************
	// ********** game loop updates **********
	// ***************************************
	menuArea.resize();																//checks for window resize
	menuArea.clear();																	//clear menu area
	menuBackground.update();													//background update
	mainMenu.update();																//menu update
	try {																							// try to show previous game info
		marqueShow.newPos(-3);
		marqueShow.update();
	} catch(err) {console.log(err);}
	menuNewGame.update();															//continue game button update
	menuOptions.update();															//new game button update
	menuRules.update();																//rules button update
	menuQuit.update();																//quit button update
	menuArea.framNo += 1;															//frame up-count
	//	ELEMENTS UPDATE	
	for (let i = 0; i < menuElements.length; i++) {	
		menuElements[i].update();
	}
	//	RULES UPDATE
	if (viewRules) {
		for (let j = 0; j < rulesElements.length; j++) {	
			rulesElements[j].update();
		}
	}
}

// ***********************************************************************************************************************
// ***************************************************** MENU COMPONENT BUILD ********************************************
// ***********************************************************************************************************************
function menuComponent(name, width, height, color, x, y, type, cursor) {
	this.selected = false;
	this.name = name;
	this.type = type;
	this.cursor = cursor;
	this.newX = this.x * menuRatioX;
	this.newY = this.y * menuRatioY;
	this.newW = this.width * menuRatioX;
	this.newH = this.height * menuRatioY;
	this.objRight = this.newX +this. newW;
	this.objBottom = this.newY + this.newH;
	if (type == "image" || type == "background" || type == "wheel") {
		this.image = new Image();
		this.image.src = color;
	}
	this.alpha = 1;
	this.speedx = 1;
	this.speedy = 1;
	this.y = y;
	this.x = x;
	this.width = width;
	this.height = height;
	// ***************************************
	// ********** components update **********
	// ***************************************
	this.update = function() {
		this.newX = this.x * menuRatioX;
		this.newY = this.y * menuRatioY;
		this.newW = this.width * menuRatioX;
		this.newH = this.height * menuRatioY;
		this.objRight = this.newX + this.newW;
		this.objBottom = this.newY + this.newH;
		if (this.cursor == "pointer") {
			this.hoverOver();
			this.clicked();
		}
		ctx = menuArea.context;
		if (type == "image" || type == "background") {			//	background/image update	//
				ctx.shadowColor = "rgba(0,0,0,0)";
				ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
		} else if (type == "text") {																					//	text update //
			ctx.font = this.width + " " + this.height;
			ctx.shadowOffsetX = 3;
			ctx.shadowOffsetY = 3;
			if (color == "rgb(0,0,0)") {ctx.shadowColor="white";} 							//	different text shadow based on text color									
				else {ctx.shadowColor="black";}																			
			ctx.shadowBlur=3;																										//	shadow blur
			ctx.fillStyle = color;
			if (!viewRules || this.name == "rulesClose" || this.name == "rulesNext") {											// stops repeat of text on single line
				if (this.name == "marque") {
					marqWidth = ctx.measureText(this.text).width;
				}
				ctx.fillText(this.text, this.x, this.y);
			} else if (this.name == 'rulesTxt') {
				rulesMultiLine(ctx, this.text, this.x, this.y);
			} 
		} else {																															// *all other component updates*	//
			ctx.shadowColor = "rgba(0,0,0,0)";
			ctx.fillStyle = color || "rgba(0,0,0,1)";
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};
	
//	function textAdjust(ctx, text, maxWidth, x, y, answer) {
//		let width = ctx.measureText(text).width;
	// **********************************************
	// ************ components animation ************
	// **********************************************
	this.newPos = function(speed) {
		this.x += speed;
		
		if (this.name == "marque") {
			if (this.x < -(marqWidth)) {	//	restart animation
				this.x = menuW;
			}
		}
	};
	// **********************************************
	// ********** components hover handler **********
	// **********************************************
	this.hoverOver = function() {
		if (this.objBottom > moveLoc.y && this.newY < moveLoc.y && this.objRight > moveLoc.x && this.newX < moveLoc.x) {
			document.body.style.cursor = "pointer";
			if (this.name == "mb_0") {
				//	Continue Game
				menuNewGame.image.src = "images/cGameHover_u.png";
			} else if (this.name == "mb_1") {
				//	New Game
				menuOptions.image.src = "images/newGameHover_u.png";
			} else if (this.name == "mb_2") {
				//	Rules
				menuRules.image.src = "images/rulesHover_u.png";
			} else if (this.name == "mb_3") {
				//	Quit
				menuQuit.image.src = "images/quitHover_u.png";
			}
		}
	};
	// **********************************************
	// ********** components click handler **********
	// **********************************************
	this.clicked = function() {
		if (this.selected == false) {
			if ((this.objBottom > clickLoc.y) && (this.newY < clickLoc.y) && (this.objRight > clickLoc.x) && (this.newX < clickLoc.x)) {
				if (this.name == "mb_0") {
					//	Continue Game
					loadPrevGame();
					menuArea.stop();
				} else if (this.name == "mb_1") {
					//	New Game
					menuNewGame.newPos(optionSpeed);
					menuOptions.newPos(optionSpeed);
					menuRules.newPos(optionSpeed);
					menuQuit.newPos(optionSpeed);
					document.getElementById("inputQuestions").style.display = "block";
					document.getElementById("inputPlayers").style.display = "block";
					document.getElementById("optionPlayers").style.display = "block";
					document.getElementById("optionBack").style.display = "block";
					document.getElementById("optionSave").style.display = "block";
					if (menuNewGame.x > menuW) {
						for (let i = 0; i < 4; i++) {
							menuElements.shift();
						}
					}
				} else if (this.name == "mb_2") {
					//	Rules
					clickLoc = {x: 0, y: 0};
					viewRules = true;
					showRules();
				} else if (this.name == "mb_3") {
					//	Quit
					self.close();
				} else if (this.name == "cb") {
					rPg = 1;
					rulesElements = [];
					viewRules = false;
				} else if (this.name == "nxtBtn") {
					//	Rules Next Button
					clickLoc = {x: 0, y: 0};
					switch(rPg) {
						case 0:
							rulesElements[rulesElements.length - 1].text = "~ RULES ~\nIn the main game, contestants have\nthree options:\n\nspin the wheel and call a consonant\nor\nbuy a vowel for 250 points\nor\nsolve the puzzle";
							rPg++;
							break;
						case 1:
							rulesElements[rulesElements.length - 1].text = "~ RULES ~\nEach consonant is worth the value\nof the wedge the wheel lands on.";
							rPg++;
							break;
						case 2:
							rulesElements[rulesElements.length - 1].text = "~ RULES ~\nContestants can continue spinning\nthe wheel until they:\n\nmiss a letter\nor\nspin a Bankrupt\nor\nlose a Turn";
							rPg++;
							break;
						case 3:
//							rulesElements[rulesElements.length - 1].width = "30px";
							rulesElements[rulesElements.length - 1].text = "~ RULES ~\nThe Free Play wedge allows a\ncontestant to choose any letter:\n\n-without losing a turn if that\nletter is not in the puzzle\n-vowels are free\n-consonants reward the contestant with\n500 points apiece.";
							rPg++;
							break;
						case 4:
							rulesElements[rulesElements.length - 1].text = "~ RULES ~\nMultiple choice questions will be\nasked throughout the game.\n\nIf a contestant answers wrong,\nit is considered as 'lose a Turn'.";
							rPg++;
							break;
						case 5:
							rulesElements[rulesElements.length - 1].text = "~ RULES ~\nA round ends when puzzle is solved.\n\nThe contestant who solves the\npuzzle keeps full points,\nother contestants lose half\nof their points.";
							rPg++;
							break;
						case 6:
							rulesElements[rulesElements.length - 1].text = "~ RULES ~\nIf an attempt is made to\nsolve the puzzle but the answer is wrong,\nit is considered as 'lose a Turn'.";
							rPg++;
							break;
						case 7:
							rulesElements[rulesElements.length - 1].text = "~ RULES ~\nThe contestant with the most points wins.";
							rPg++;
							break;
						case 8:
							rulesElements[rulesElements.length - 1].text = "";
							rulesElements.push(new menuComponent("rulesSnap", bgW, bgH, "images/rulesSnap_main_u.png", 0, 0, "background", "default"));
							break;
					}
				}
			}
		}
	};
}

function showRules() {
	rulesElements.push(new menuComponent("ov", bgW, bgH, "rgba(0,0,0,0.9)", 0, 0, "overlay", "default"));
	// close button
	rulesElements.push(new menuComponent("rulesClose", "50px", "Arial Rounded MT", "rgba(245,9,13,1.00)", menuW - 65, 50, "text"));
	rulesElements[rulesElements.length - 1].text = "X";
	rulesElements.push(new menuComponent("cb", 30, 40, "rgba(0,0,0,0.1)", menuW - 80, 12, "overlay", "pointer"));
	// next button
	rulesElements.push(new menuComponent("rulesNext", "30px", "Arial Rounded MT", "rgba(9,245,123,1.00)", menuW - 150, menuH - 50, "text"));
	rulesElements[rulesElements.length - 1].text = "Next Page >>";
	rulesElements.push(new menuComponent("nxtBtn", 200, 25, "rgba(0,0,0,0.1)", menuW - 245, menuH - 72, "overlay", "pointer"));
	// rules text
	rulesElements.push(new menuComponent("rulesTxt", "50px", "Consolas", "rgb(255,255,255)", (bgW / 2), 75, "text"));
	rulesElements[rulesElements.length - 1].text = "~ RULES ~\nIn the main game, contestants have\nthree options:\n\nspin the wheel and call a consonant\nor\nbuy a vowel for 250 points\nor\nsolve the puzzle";
}
// ***************************************************************************************************************************
// ***************************************************** MULTI-LINE TEXT *****************************************************
// ***************************************************************************************************************************
function rulesMultiLine(ctx, text, x, y) {
  const lineHeight = ctx.measureText("M").width * 2.5;
  const lines = text.split("\n");
	ctx.textAlign = 'center';
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y);
    y += lineHeight;
  }
}

// ***************************************************************************************************************************
// **************************************************** LOAD MENU BUTTONS ****************************************************
// ***************************************************************************************************************************
function loadMenuEls() {
	let i;
	let mName = "mb_";
	let btnW = 260;
	let btnH = 50;
	let btnX = 510;
	let btnInterval = 75;					//	Y Gap
	let btnStart = 370;						//	First button Y
	for (i = 0; i < 4; i++) {
		let btnI;
		if (i == 0) {
			btnI = btnStart;
		} else {
			btnI = btnStart + (btnInterval * i);
		}
		menuElements.push(new menuComponent(mName + i, btnW, btnH, "rgba(0,0,0,0.01)", btnX, btnI, "mark", "pointer"));
	}
}
	
// ***************************************************************************************************************************
// ****************************************************** BACK BUTTON ********************************************************
// ***************************************************************************************************************************
function handleBack() {
	clickLoc = {x: 0, y: 0};			//	Reset click coords
	loadMenuEls();								//	Reload menu buttons
	//	HIDE NEW GAME ELEMENTS
	document.getElementById("inputQuestions").style.display = "none";
	document.getElementById("inputPlayers").style.display = "none";
	document.getElementById("optionPlayers").style.display = "none";
	document.getElementById("optionBack").style.display = "none";
	document.getElementById("optionSave").style.display = "none";
	//	RESET BUTTON MOVEMENT	
	menuNewGame.speedX = 0;
	menuNewGame.x = menuBtnX;
	menuOptions.speedX = 0;
	menuOptions.x = menuBtnX;
	menuRules.speedX = 0;
	menuRules.x = menuBtnX;
	menuQuit.speedX = 0;
	menuQuit.x = menuBtnX;
}

// ***************************************************************************************************************************
// ************************************************* NEW GAME START OPTIONS **************************************************
// ***************************************************************************************************************************
function handleSave() {
	loadMenuEls();
	clickLoc = {x: 0, y: 0};
	// **********************************************
	// ************** question option ***************
	// **********************************************
	let optionQ = document.getElementsByName("optionQ");
	for (let i = 0; i < optionQ.length; i++) {
		if (optionQ[i].checked) {
			if (optionQ[i].value == "true") {
				questionTime = true;
			}
		}
	}
	// **********************************************
	// ******** teams or player option option *******
	// **********************************************
	let optionP = document.getElementsByName("optionP");
	for (let j = 0; j < optionP.length; j++) {
		if (optionP[j].checked) {
			isTeams = optionP[j].value;
		}
	}
	// **********************************************
	// ****** number of players or teams option *****
	// **********************************************
	if (optionPlayers.value > 10) {
		numberOfPlayers = 10;
	} else if (optionPlayers.value >= 1 && optionPlayers.value <= 10) {
		numberOfPlayers = optionPlayers.value;
	} else {
		numberOfPlayers = 1;
	}
	menuArea.stop();
}	 
			 
// ***************************************************************************************************************************
// ***************************************************** SAVE/LOAD GAME ******************************************************
// ***************************************************************************************************************************
function saveScores() {																								//	saves score with local storage or cookies
	try {
		localStorage.setItem("questionTime", questionTime);													//	teams or players
		localStorage.setItem("isTeams", isTeams);													//	teams or players
		localStorage.setItem("numberOfPlayers", numberOfPlayers);					//	# of teams or players
		localStorage.setItem("players", JSON.stringify(players));					//	player score
	} catch(e) {
		setCookie("questionTime", questionTime, 10);																//	teams or players
		setCookie("isTeams", isTeams, 10);																//	teams or players
		setCookie("numberOfPlayers", numberOfPlayers, 10);								//	# of teams or players
		setPlayerCookie();																								//	player score (loop had to be in sep. function)
	}
}

function removeScores(item) {																					//	remove an item from local storage
	localStorage.removeItem(item);
}

function loadPrevGame() {																							//	load score with local storage or cookies
	try {
		questionTime = localStorage.getItem("questionTime");												//	load teams or players
		isTeams = localStorage.getItem("isTeams");												//	load teams or players
		numberOfPlayers = localStorage.getItem("numberOfPlayers");				//	load # of teams or players
		players = JSON.parse(localStorage.players);												//	load player score
	} catch(e) {
		questionTime = getCookie("questionTime");																		//	load teams or players
		isTeams = getCookie("isTeams");																		//	load teams or players
		numberOfPlayers = Number(getCookie("numberOfPlayers"));						//	load # of teams or players
		getPlayerCookie();																								//	load player score (loop had to be in sep. function)
	}
}
			 
function setCookie(cname, cvalue, exdays) {
  let d = new Date();																									//	current date
  d.setTime(d.getTime() + (exdays*24*60*60*1000));										//	sets experation date
  let expires = "expires="+ d.toUTCString();													//	string for cookie
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";	//	creates cookie
}
			 
function getCookie(cname) {
  let name = cname + "=";																				//	cat name
  let decodedCookie = decodeURIComponent(document.cookie);			//	decode cookie
  let ca = decodedCookie.split(';');														//	splits cookie into different sections
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];																							//	each cookie section
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
} 

function getPlayerCookie() {
	let ta = [];												//	temporary array
	let tg = {};												//	temporary object
	for (let h = 0; h < 10; h++) {			//	h = max players
			let n = "player" + h;
			let s = Number(getCookie(n));		//	integer form of cookie
			tg[h] = s;											//	push to temp object
			ta.push(s);											//	push to temp array
		}
	players = tg;												//	adds score to game
	playForward(ta);										//	highest score is first to play
}

function setPlayerCookie() {
	for (let g = 0; g < 10; g++) {
		let n = "player" + g;
		setCookie(n, players[g], 10);			//	sets cookie
	}
}

function playForward(arr) {
	let mx = Math.max.apply(null, arr);		//	takes array and finds max score
	playerTurn = arr.indexOf(mx);					//	finds index of max score and sets as first to play
}

function recallPrevGame() {																							//	load score with local storage or cookies
	try {
		recallquestionTime = localStorage.getItem("questionTime");												//	load teams or players
		recallisTeams = localStorage.getItem("isTeams");												//	load teams or players
		recallnumberOfPlayers = localStorage.getItem("numberOfPlayers");				//	load # of teams or players
		recallplayers = JSON.parse(localStorage.players);												//	load player score
	} catch(e) {
		recallquestionTime = getCookie("questionTime");																		//	load teams or players
		recallisTeams = getCookie("isTeams");																		//	load teams or players
		recallnumberOfPlayers = Number(getCookie("numberOfPlayers"));						//	load # of teams or players
		recallgetPlayerCookie();																								//	load player score (loop had to be in sep. function)
	}
}

function recallgetPlayerCookie() {
	let ta = [];												//	temporary array
	let tg = {};												//	temporary object
	for (let h = 0; h < 10; h++) {			//	h = max players
			let n = "player" + h;
			let s = Number(getCookie(n));		//	integer form of cookie
			tg[h] = s;											//	push to temp object
			ta.push(s);											//	push to temp array
		}
	recallplayers = tg;									//	adds score to game
}
