// JavaScript Document

//  ******** CONSTANTS
let correctAnswer;
const scoreRef = [0, 500, 1000, 2000, 3000, 5000, 7000, 10000, 20000, 30000, 50000, 100000, 250000, 500000, 1000000];
const questionBank = {
	//	******************* TEMPORARY QUESTION BANK, REPLACE WITH REAL BANK	
	0 : ["In the Star Trek series, the part of Ensign Chekov was played by who?",
			 "Walter Koenig",
			 "Brent Spiner",
			 "Leonard Nimoy",
			 "Kirk",],
	1 : ["What actor played the part of Data in Star Trek, the Next Generation?",
			 "Brent Spiner",
			 "Walter Koenig",
			 "Leonard Nimoy",
			 "Kirk",],
	2 : ["In 1995, 13 books were sold every minute in U.S. on what subject?",
			 "Star Trek",
			 "The Twilight Zone",
			 "Spot",
			 "Twilight",],
	3 : ["Apart from Star Trek, the actors Kirk, Scott, Spock, and Sulu appeared on what other program?",
			 "The Twilight Zone",
			 "Star Wars",
			 "FTU",
			 "The Outer Limits",],
	4 : ["What was used as Dr McCoy's medical scanner in Star Trek?",
			 "A Salt Shaker",
			 "Spot",
			 "Spiner",
			 "Twilight",]
}

//  ******************* LEVEL LOGIC
function scoreUpdate() {
	let scoreImage = "images/score_u/score_" + gameArea.level + ".png";		
	elements[0].image.src = scoreImage;																		//	update score image
	gameArea.score = scoreRef[gameArea.level];														//  update score
	if (gameArea.score == scoreRef[scoreRef.length - 1]) {
		gameArea.stop();																										//	stop game at million
	}
	// remove current Q&A's
	elements.pop();
	elements.pop();
	elements.pop();
	elements.pop();
	elements.pop();
	//	generate new Q&A's
	askAway();
}

//  ******************* ANSWER CHECK LOGIC
function finalYesCheck() {
	fiftyOnce = false;
	//  ********* TEMP ACTION, REPLACE WITH LOGIC	
	gameArea.level += 1;
	afterFifty();
	scoreUpdate();
	//  **********	END TEMP ACTION
}

//  ******************* 50:50 LOGIC
function check5050() {
	fiftyOnce = true;
	//  ********* TEMP ACTION, REPLACE WITH LOGIC
	fifty.splice(2,3);
	elements[12].image.src = "";
	elements[13].image.src = "";
	cTxt.text = "";
	dTxt.text = "";
	//  **********	END TEMP ACTION 
}

//	******************* Q&A PUSH TO SCREEN
function askAway() {
	let bankSelect = getRandomInt(0, Object.keys(questionBank).length - 1);	//	random number selection between 0 and length of questionBank object.
	let tList = tempList();	//	numbered list in random order for randomizing the answer placement, example: [3,4,1,2]
	//	images push
	elements.push(new component("q", 1102, 145, "images/q_u.png", ((bgW-1102)/2), 350, "image", "default"));
	elements.push(new component("a", ansW, ansH, "images/a_u.png", ansSpace, topAnsRow, "image", "pointer"));
	elements.push(new component("b", ansW, ansH, "images/b_u.png", ansSpace, btmAnsRow, "image", "pointer"));
	elements.push(new component("c", ansW, ansH, "images/c_u.png", ((ansSpace * 2) + ansW), topAnsRow, "image", "pointer"));
	elements.push(new component("d", ansW, ansH, "images/d_u.png", ((ansSpace * 2) + ansW), btmAnsRow, "image", "pointer"));
	//	question text push
	question = new component("question", "30px", "Arial Rounded MT", "rgb(255,255,255)", 144, 425, "text");
	question.text = questionBank[bankSelect][0];
	textAdjust(question);
	//	answers text push
	aTxt = new component("aTxt", "30px", "Arial Rounded MT", "rgb(255,255,255)", ansSpace + 100, 550, "text");
	aTxt.text = questionBank[bankSelect][tList[0]];
	bTxt = new component("bTxt", "30px", "Arial Rounded MT", "rgb(255,255,255)", ansSpace + 100, 650, "text");
	bTxt.text = questionBank[bankSelect][tList[1]];
	cTxt = new component("cTxt", "30px", "Arial Rounded MT", "rgb(255,255,255)", ((ansSpace * 2) + ansW + 100), 550, "text");
	cTxt.text = questionBank[bankSelect][tList[2]];
	dTxt = new component("dTxt", "30px", "Arial Rounded MT", "rgb(255,255,255)", ((ansSpace * 2) + ansW + 100), 650, "text");
	dTxt.text = questionBank[bankSelect][tList[3]];
	//  ***********	 correct answer selection 
	for (let k = 0; k < 4; k++) {
		if (tList[k] == 1) {
			correctAnswer = [k, questionBank[bankSelect][1]];
		}}
}

//	*******************	TEXT ADJUST TO FIT IN IMAGE
function textAdjust(el) {
	if (el.text.length > 64 && el.text.length < 70) {
		el.width = "28px";
	} else if (el.text.length > 70) {
		el.width = "20px";
	}}

//	*******************	TEMP NUMBERED LIST IN RANDOM ORDER BUILD
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
