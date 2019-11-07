// JavaScript Document
/*jshint esversion: 6 */

//	******************************************************************************************************************************
//  ******************************************************** CONSTANTS ***********************************************************
//	******************************************************************************************************************************
let questionElements = [];				// array to hold question elements
let usedQuestions = [];						// array to hold questions that have been asked, to not repeat
let questionTime = false;					// false is questions at end of round/true is with every spin
let timeForQuestion = false;			// displays question
let correctlyAnswered = false;		// handles if question is correctly answered
let bankSelect;										// holds random number for question selection
let roundAnswer;									// holds correct answer
let categories;										// holds category
let correctShow;									// response after selected answer


// ****************************************************************************************************************************
// ************************************************** DISPLAY Q&A TEXT SET-UP *************************************************
// ****************************************************************************************************************************
function textAdjust(ctx, text, maxWidth, x, y, answer) {
	let ansRatio;
	if (answer) {																											// deal with answer text
		let width = ctx.measureText(text).width;												// px width of text
		ansRatio = 40/width;																						// text ratio
		let s = Math.floor(ansRatio * 745);															// round ratio * answer imag width
		if (s >= 40) {																									// if size is larger than wanted
			s = 40;
		}
		let size = s + "px";
		ctx.font = size + " Arial Rounded MT";													// create font
		ctx.fillText(text, x, y);																				// display text
	} else {																													// deal with question text
		let i, j, lineHeight;
		const words = text.split(" ");																	// create array of words
		let lines = [];
		let currentLine = words[0];																			// previous word(s)
		for (i = 1; i < words.length; i++) {
			let word = words[i];																					// current word
			let width = ctx.measureText(currentLine + " " + word).width;	// width of prev + current word
			if (width < maxWidth) {																				// width is smaller than image width
					currentLine += " " + word;																// concat current word to previous
			} else {																											// if width at image width
					lines.push(currentLine);																	// push to array
					currentLine = word;																				// start new line
			}
		}
		lines.push(currentLine);																				// push last line to array 
		if (lines.length > 4) {																					// adjust line height 
			lineHeight = ctx.measureText("M").width * 1.2;
		} else {
			lineHeight = ctx.measureText("M").width * 2;
		}
		for (j = 0; j < lines.length; j++) {														// display text
			ctx.fillText(lines[j], x, y);
			y += lineHeight;
		}
	}
}

// ****************************************************************************************************************************
// ************************************************** QUESTION OVERLAY SET-UP *************************************************
// ****************************************************************************************************************************
function qAndA() {
	timeForQuestion = true;
	let tList = tempList();	//	numbered list in random order for randomizing the answer placement, example: [3,4,1,2]
	overlay = new component("overlay2", bgW, bgH, "rgba(0,0,0,0.5)", 0, 0, "overlay", "default");
	//	image
	questionElements.push(new component("q", bgW, bgH, "images/quest_u.png", 0, 0, "image", "default"));
	questionElements.push(new component("a", 764, 84, "images/a_u.png", 257, 305, "image", "pointer"));
	questionElements.push(new component("b", 764, 84, "images/b_u.png", 257, 405, "image", "pointer"));
	questionElements.push(new component("c", 764, 84, "images/c_u.png", 257, 505, "image", "pointer"));
	questionElements.push(new component("d", 764, 84, "images/d_u.png", 257, 605, "image", "pointer"));
	//	text
	questionElements.push(new component("question", "40px", "Arial Rounded MT", "rgb(255,255,255)", 150, 80, "text"));
	questionElements[questionElements.length - 1].text = questionBank[bankSelect][0];
	questionElements.push(new component("aTxt", "40px", "Arial Rounded MT", "rgb(255,255,255)", 270, 360, "text"));
	questionElements[questionElements.length - 1].text = questionBank[bankSelect][tList[0]];
	questionElements.push(new component("bTxt", "40px", "Arial Rounded MT", "rgb(255,255,255)", 270, 460, "text"));
	questionElements[questionElements.length - 1].text = questionBank[bankSelect][tList[1]];
	questionElements.push(new component("cTxt", "40px", "Arial Rounded MT", "rgb(255,255,255)", 270, 560, "text"));
	questionElements[questionElements.length - 1].text = questionBank[bankSelect][tList[2]];
	questionElements.push(new component("dTxt", "40px", "Arial Rounded MT", "rgb(255,255,255)", 270, 660, "text"));
	questionElements[questionElements.length - 1].text = questionBank[bankSelect][tList[3]];
}

//	************************************************************************************
//  ******************************** ANSWER CHECK LOGIC ********************************
//	************************************************************************************
function answerCheck(el) {
	let elName = el + "Txt";
	for (let e = 0; e < questionElements.length; e++) {						//	loop to check answer
		if (elName == questionElements[e].name && questionElements[e].text == questionBank[bankSelect][1]) {
			correctlyAnswered = true;
		}
	}
	if (correctlyAnswered == true) {	//	*************** right answer ***************
		solving = false;									//	allows elements to change back to pointer cursor
		loc = {x: 0, y: 0};								//	resets click coords
		if (questionTime) {								//	*if question every spin
			searchDups();											//	checks if q&a already used
			timeForQuestion = false;					//	stops display of question
			questionElements = [];						//	clears question elements to use for next time
			correctShow = new component("correctShow", bgW, bgH, "images/correctPlus_u.png", 0, 110, "background", "default");
			timeForResult = true;
		} else {													//	*if question end of round
			for (let i = 0; i < numberOfPlayers; i++) {
				// player to correctly solve keeps points, all others are reduced by half
				if (i != playerTurn) {
					let tempScore = players[i] / 2;
					if (tempScore > 0) {
						players[i] = players[i] / 2;
					} else {
						players[i] = 0;
					}
				}
			}
			gameArea.stop();									//	stop game
		}
	} else {													//	*************** wrong answer ***************
		searchDups(); //**********************************************************************remove for OPTION TO REPEAT MISSED QUESTIONS
		timeForQuestion = false;	//	stops display of question
		questionElements = [];		//	clears question elements to use for next time
		correctShow = new component("correctShow", bgW, bgH, "images/wrongPlus_u.png", 0, 110, "background", "default");
		timeForResult = true;
		playerRound();						//	turn goes to next player
	}
}

////	************************************************************************************************************
////	********************************	TEMP NUMBERED LIST IN RANDOM ORDER BUILD	********************************
////	************************************************************************************************************
function tempList() {
	let tList = [];
	let pList = [1,2,3,4];											//	list of numbers to use in building list
	while (tList.length < 4) {									
		let ns = getRandomInt(1, 4);							//	random #
		for (let p = 0; p < pList.length; p++) {	
				let tn = pList[p];										//	select a # in pList
				if (ns == tn) {												//	# and random # match
						tList.push(ns);										//	push random # to tList
						pList[p] = "";										//	empty placement in pList so that tList has no repeated numbers
				}}
		}
	return tList;																//	returned list
}

////	************************************************************************************************************
////	*****************************************	Q & A DUPLICATE CHECKS	******************************************
////	************************************************************************************************************
function searchDups() {
	let searchDup = true;																							//	while loop var
	while (searchDup) {
		let bs = getRandomInt(0, Object.keys(questionBank).length - 1);	//	random number selection between 0 and length of questionBank object.
		let prevUsed = findDups(usedQuestions, bs);											//	checks if random number already used
		// DEBUG option
		if (DEBUG) {
			console.log("usedQuestions: ", usedQuestions);
			console.log("bs: ", bs);
			console.log("prevUsed: ", prevUsed);
		}
		if (!prevUsed) {							//	not used before
			usedQuestions.push(bs);			//	adds to used array for future checks
			bankSelect = bs;						//	make q&a selection
			searchDup = false;					//	while loop break
		}
	}
}

function findDups(array, check) {
	let i;
	for (i = 0; i < array.length - 1; i++) {	// iterate array
		if (check == array[i]) {								// if already used, true
			return true;													
		}
	}
	return false;															// not used false (loop break)
}
