// JavaScript Document
/*jshint esversion: 6 */

//	******************************************************************************************************************************
//  ******************************************************** CONSTANTS ***********************************************************
//	******************************************************************************************************************************
const gameGrid = {				//defines grid by row and gives a number to each square to corrospond to white square picture
	0: [0,1,2,3,4,5,6,7,8,9,10,11],
	1: [12,13,14,15,16,17,18,19,20,21,22,23,24,25],
	2: [26,27,28,29,30,31,32,33,34,35,36,37,38,39],
	3: [40,41,42,43,44,45,46,47,48,49,50,51]
};

const gridCoords = {			//	coords to be calculated for letter picture placement
	y: [21, 92, 163, 234],
	x: [25, 79, 134, 188, 242, 297, 352, 406, 461, 515, 570, 625, 680, 734]
};

const letterNumber = {0: "a",1: "e",2: "i",3: "o",4: "u",5: "b",6: "k",7: "s",8: "c",9: "d",10: "f",11: "g",12: "h",13: "j",14: "l",15: "m",16: "n",17: "p",18: "q",19: "r",20: "t",21: "v",22: "w",23: "x",24: "y",25: "z"};		//	numerical reference to letters, used for checks

let correctCounter = 0;		//	tracks number of correct letters in puzzle
let leftoverCount = 12;		//	number of spaces in top row of grid
let masterMask = [];			//	holds template of letter placement in grid

// ****************************************************************************************************************************
// **************************************************** FIND EMPTY SPACES  ****************************************************
// ****************************************************************************************************************************
function findSpaces(spaces) {
	if (spaces % 2 == 0) {													//evenly split spaces
		startSpace = spaces / 2;
	} else {																				// split spaces as evenly as possible
		startSpace = Math.floor(spaces / 2);
	}
	return startSpace;
}

// ****************************************************************************************************************************
// ******************************************************* CREATE MASK  *******************************************************
// ****************************************************************************************************************************
function fillGameGrid(answer) {
	let lastWords, lastWords2, lastWords3, startSpace, startSpace1, startSpace2, startSpace3, startSpace4, spaces, r1Space, r2Space, r3Space, r4Space, r1Text, r2Text, r3Text, r4Text, i, q;
	let r1 = [];
	let r2 = [];
	let r3 = [];
	let r4 = [];
	let text = answer.toLowerCase();																			// Make answer lower case
	let textLength = text.length;
  const lines = text.split(" ");																				// Split text on spaces
	if (DEBUG) {
		console.log("line length: ", lines.length);
	}
	if (textLength <= 14) {																						// Check answer length to fit on single row, not row 0
		spaces = gameGrid[1].length - textLength;														// spaces free on row 
		startSpace = findSpaces(spaces);
		maskDisplay(1, textLength, startSpace, text, "single");
	} else {																													// If length is more than 14
		if (lines.length <= 4) {																						// Check to see if answer split into words is less than 4 (# of rows)
			for (i = 0; i < lines.length; i++) {															// iterate each word
				spaces = gameGrid[i].length - lines[i].length;									// spaces free on row
				startSpace = findSpaces(spaces);
				maskDisplay(i, lines[i].length, startSpace, lines[i], "multi");
			}
		} else if (textLength <= 12) {
		//	ANSWER CAN FIT ON ONE ROW	--------------------------------------------
			spaces = gameGrid[0].length - textLength;															// spaces free on row 
			startSpace = findSpaces(spaces);																			// spaces evenly spread out 
			maskDisplay(0, textLength, startSpace, text, "multi");								// create mask
		} else if (textLength <= 26) {
		//	ANSWER CAN FIT ON TWO ROWS	--------------------------------------------
			lastWords = rowCalc(textLength, lines, 12, lines.length);														// how many words are on 2nd row 
			for (let l = 0; l < lines.length; l++) {
				if (l == lines.length - lastWords[0]) {															// minus last words
					r2.push(lines[l]);																								// push words to row 2
					lastWords[0]--;																										// redo count if not last word
				} else {
					r1.push(lines[l]);																								// push words to row 1
				}
			}
			r1Text = r1.join(' ');																								// array to text
			r2Text = r2.join(' ');
			r1Space = gameGrid[0].length - r1Text.length;													// spaces free on row
			r2Space = gameGrid[1].length - r2Text.length;
			startSpace1 = findSpaces(r1Space);																		// spaces evenly spread out
			startSpace2 = findSpaces(r2Space);
			maskDisplay(0, r1Text.length, startSpace1, r1Text, "multi");					// create mask
			maskDisplay(1, r2Text.length, startSpace2, r2Text, "multi");
		} else if (textLength <= 40) {
		//	ANSWER CAN FIT ON THREE ROWS	--------------------------------------------
			lastWords = rowCalc(textLength, lines, 26, lines.length);							// how many words are on 3rd row 
			let cut = lines.length - lastWords[0];																// lines length minus last words
			for (let l = lines.length - lastWords[0]; l < lines.length; l++) {
				r3.push(lines[l]);																									// push words to row 3
			}
			let tmpLines = lines.slice(0, cut);																		// lines minus last words
			lastWords2 = rowCalc(lastWords[1], tmpLines, 12, cut);											// how many words are on 2nd row 
			for (let m = 0; m < tmpLines.length; m++) {
				if (m >= (tmpLines.length - lastWords2[0])) {												// minus last words
					r2.push(lines[m]);																								// push words to row 2
				} else {
					r1.push(lines[m]);																								// push words to row 1
				}
			}
			r1Text = r1.join(' ');																								// array to text
			r2Text = r2.join(' ');
			r3Text = r3.join(' ');
			r1Space = gameGrid[0].length - r1Text.length;													// spaces free on row
			r2Space = gameGrid[1].length - r2Text.length;
			r3Space = gameGrid[2].length - r3Text.length;
			startSpace1 = findSpaces(r1Space);																		// spaces evenly spread out
			startSpace2 = findSpaces(r2Space);
			startSpace3 = findSpaces(r3Space);
			maskDisplay(0, r1Text.length, startSpace1, r1Text, "multi");					// create mask
			maskDisplay(1, r2Text.length, startSpace2, r2Text, "multi");
			maskDisplay(2, r3Text.length, startSpace3, r3Text, "multi");
		} else {
		//	ANSWER CAN FIT ON ALL ROWS	--------------------------------------------
			lastWords = rowCalc(textLength, lines, 40, lines.length);							// how many words are on 4th row
			for (let l = lines.length - lastWords[0]; l < lines.length; l++) {
				r4.push(lines[l]);																									// push words to row 4
			}
			let cut = lines.length - lastWords[0];																// lines length minus last words
			let tmpLines = lines.slice(0, cut);																		// lines minus last words
			lastWords2 = rowCalc(lastWords[1], tmpLines, 26, cut);								// how many words are on 3rd row 
			for (let m = lines.length - (lastWords[0] + lastWords2[0]); m < tmpLines.length; m++) {
				r3.push(lines[m]);																									// push words to row 3
			}
			let cut2 = lines.length - (lastWords[0] + lastWords2[0]);							// lines length minus last two row words
			let tmpLines3 = lines.slice(0, cut2);																	// lines minus last words
			lastWords3 = rowCalc(lastWords2[1], tmpLines3, 12, cut2);							// how many words are on 2nd row
			for (let j = 0; j < tmpLines3.length; j++) {
				if (j >= (tmpLines3.length - lastWords3[0])) {
					r2.push(lines[j]);																								// push words to row 2
				} else {
					r1.push(lines[j]);																								// push words to row 1
				}
			}
			r1Text = r1.join(' ');																								// array to text
			r2Text = r2.join(' ');
			r3Text = r3.join(' ');
			r4Text = r4.join(' ');
			r1Space = gameGrid[0].length - r1Text.length;													// spaces free on row
			r2Space = gameGrid[1].length - r2Text.length;
			r3Space = gameGrid[2].length - r3Text.length;
			r4Space = gameGrid[3].length - r4Text.length;
			startSpace1 = findSpaces(r1Space);																		// spaces evenly spread out
			startSpace2 = findSpaces(r2Space);
			startSpace3 = findSpaces(r3Space);
			startSpace4 = findSpaces(r4Space);
			maskDisplay(0, r1Text.length, startSpace1, r1Text, "multi");					// create mask
			maskDisplay(1, r2Text.length, startSpace2, r2Text, "multi");
			maskDisplay(2, r3Text.length, startSpace3, r3Text, "multi");
			maskDisplay(3, r4Text.length, startSpace4, r4Text, "multi");
		}
	}
}

// ****************************************************************************************************************************
// ***************************************************** ROW CALCULATIONS *****************************************************
// ****************************************************************************************************************************
function rowCalc(textLength, lines, maxRow, lineLength) {
	if (DEBUG) {
		console.log(textLength, lines, maxRow, lineLength);
	}
	let lengthRemain, lastWords; 
	if (lineLength == 1) {
		const oneLength = lines[lines.length - 1].length;					//	char length for word one
		const oneTotal = textLength - (oneLength + 1);						//	line length minus word one and the space
		lastWords = 1;
		lengthRemain = oneTotal;								//	remaining length after word
	}
	else if (lineLength == 2) {
		const oneLength = lines[lines.length - 1].length;					//	char length for word one
		const oneTotal = textLength - (oneLength + 1);						//	line length minus word one and the space
		const twoLength = lines[lines.length - 2].length;					//	char length for word two
		const twoTotal = textLength - ((twoLength + oneLength) + 2);//	line length minus word 1&2 and the spaces
		if (oneTotal <= maxRow){									//	if one word can fit on row
			lastWords = 1;
			lengthRemain = oneTotal;								//	remaining length after word
		} else if (twoTotal <= maxRow) {					//	if two words can fit on row
			lastWords = 2;
			lengthRemain = twoTotal;								//	remaining length after words
		}
	}
	else if (lineLength == 3) {
		const oneLength = lines[lines.length - 1].length;					//	char length for word one
		const oneTotal = textLength - (oneLength + 1);						//	line length minus word one and the space
		const twoLength = lines[lines.length - 2].length;					//	char length for word two
		const twoTotal = textLength - ((twoLength + oneLength) + 2);//	line length minus word 1&2 and the spaces
		const threeLength = lines[lines.length - 3].length;				//	char length for word three
		const threeTotal = textLength - ((threeLength + twoLength + oneLength) + 3);//	line length minus word 1&2&3 and the spaces
		if (oneTotal <= maxRow){									//	if one word can fit on row
			lastWords = 1;
			lengthRemain = oneTotal;								//	remaining length after word
		} else if (twoTotal <= maxRow) {					//	if two words can fit on row
			lastWords = 2;
			lengthRemain = twoTotal;								//	remaining length after words
		} else if (threeTotal <= maxRow) {				//	if three words can fit on row
			lastWords = 3;
			lengthRemain = threeTotal;							//	remaining length after words
		}
	}
	else if (lineLength == 4) {
		const oneLength = lines[lines.length - 1].length;					//	char length for word one
		const oneTotal = textLength - (oneLength + 1);						//	line length minus word one and the space
		const twoLength = lines[lines.length - 2].length;					//	char length for word two
		const twoTotal = textLength - ((twoLength + oneLength) + 2);//	line length minus word 1&2 and the spaces
		const threeLength = lines[lines.length - 3].length;				//	char length for word three
		const threeTotal = textLength - ((threeLength + twoLength + oneLength) + 3);//	line length minus word 1&2&3 and the spaces
		const fourLength = lines[lines.length - 4].length;				//	char length for word four
		const fourTotal = textLength - ((fourLength + threeLength + twoLength + oneLength) + 4);//	line length minus word 1&2&3&4 and the spaces
		if (oneTotal <= maxRow){									//	if one word can fit on row
			lastWords = 1;
			lengthRemain = oneTotal;								//	remaining length after word
		} else if (twoTotal <= maxRow) {					//	if two words can fit on row
			lastWords = 2;
			lengthRemain = twoTotal;								//	remaining length after words
		} else if (threeTotal <= maxRow) {				//	if three words can fit on row
			lastWords = 3;
			lengthRemain = threeTotal;							//	remaining length after words
		} else if (fourTotal <= maxRow) {					//	if four words can fit on row
			lastWords = 4;
			lengthRemain = fourTotal;								//	remaining length after words
		}
	}
	else if (lineLength == 5) {
		const oneLength = lines[lines.length - 1].length;					//	char length for word one
		const oneTotal = textLength - (oneLength + 1);						//	line length minus word one and the space
		const twoLength = lines[lines.length - 2].length;					//	char length for word two
		const twoTotal = textLength - ((twoLength + oneLength) + 2);//	line length minus word 1&2 and the spaces
		const threeLength = lines[lines.length - 3].length;				//	char length for word three
		const threeTotal = textLength - ((threeLength + twoLength + oneLength) + 3);//	line length minus word 1&2&3 and the spaces
		const fourLength = lines[lines.length - 4].length;				//	char length for word four
		const fourTotal = textLength - ((fourLength + threeLength + twoLength + oneLength) + 4);//	line length minus word 1&2&3&4 and the spaces
		const fiveLength = lines[lines.length - 5].length;				//	char length for word five
		const fiveTotal = textLength - ((fiveLength + fourLength + threeLength + twoLength + oneLength) + 5);//	line length minus word 1&2&3&4 and the spaces
		if (oneTotal <= maxRow){									//	if one word can fit on row
			lastWords = 1;
			lengthRemain = oneTotal;								//	remaining length after word
		} else if (twoTotal <= maxRow) {					//	if two words can fit on row
			lastWords = 2;
			lengthRemain = twoTotal;								//	remaining length after words
		} else if (threeTotal <= maxRow) {				//	if three words can fit on row
			lastWords = 3;
			lengthRemain = threeTotal;							//	remaining length after words
		} else if (fourTotal <= maxRow) {					//	if four words can fit on row
			lastWords = 4;
			lengthRemain = fourTotal;								//	remaining length after words
		} else if (fiveTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 5;
			lengthRemain = fiveTotal;								//	remaining length after words
		}
	}
	else if (lineLength == 6) {
		const oneLength = lines[lines.length - 1].length;					//	char length for word one
		const oneTotal = textLength - (oneLength + 1);						//	line length minus word one and the space
		const twoLength = lines[lines.length - 2].length;					//	char length for word two
		const twoTotal = textLength - ((twoLength + oneLength) + 2);//	line length minus word 1&2 and the spaces
		const threeLength = lines[lines.length - 3].length;				//	char length for word three
		const threeTotal = textLength - ((threeLength + twoLength + oneLength) + 3);//	line length minus word 1&2&3 and the spaces
		const fourLength = lines[lines.length - 4].length;				//	char length for word four
		const fourTotal = textLength - ((fourLength + threeLength + twoLength + oneLength) + 4);//	line length minus word 1&2&3&4 and the spaces
		const fiveLength = lines[lines.length - 5].length;				//	char length for word five
		const fiveTotal = textLength - ((fiveLength + fourLength + threeLength + twoLength + oneLength) + 5);//	line length minus word 1&2&3&4 and the spaces
		const sixLength = lines[lines.length - 6].length;					//	char length for word five
		const sixTotal = textLength - ((sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 6);
		if (oneTotal <= maxRow){									//	if one word can fit on row
			lastWords = 1;
			lengthRemain = oneTotal;								//	remaining length after word
		} else if (twoTotal <= maxRow) {					//	if two words can fit on row
			lastWords = 2;
			lengthRemain = twoTotal;								//	remaining length after words
		} else if (threeTotal <= maxRow) {				//	if three words can fit on row
			lastWords = 3;
			lengthRemain = threeTotal;							//	remaining length after words
		} else if (fourTotal <= maxRow) {					//	if four words can fit on row
			lastWords = 4;
			lengthRemain = fourTotal;								//	remaining length after words
		} else if (fiveTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 5;
			lengthRemain = fiveTotal;								//	remaining length after words
		} else if (sixTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 6;
			lengthRemain = sixTotal;								//	remaining length after words
		}
	}
	else if (lineLength == 7) {
		const oneLength = lines[lines.length - 1].length;					//	char length for word one
		const oneTotal = textLength - (oneLength + 1);						//	line length minus word one and the space
		const twoLength = lines[lines.length - 2].length;					//	char length for word two
		const twoTotal = textLength - ((twoLength + oneLength) + 2);//	line length minus word 1&2 and the spaces
		const threeLength = lines[lines.length - 3].length;				//	char length for word three
		const threeTotal = textLength - ((threeLength + twoLength + oneLength) + 3);//	line length minus word 1&2&3 and the spaces
		const fourLength = lines[lines.length - 4].length;				//	char length for word four
		const fourTotal = textLength - ((fourLength + threeLength + twoLength + oneLength) + 4);//	line length minus word 1&2&3&4 and the spaces
		const fiveLength = lines[lines.length - 5].length;				//	char length for word five
		const fiveTotal = textLength - ((fiveLength + fourLength + threeLength + twoLength + oneLength) + 5);//	line length minus word 1&2&3&4 and the spaces
		const sixLength = lines[lines.length - 6].length;					//	char length for word five
		const sixTotal = textLength - ((sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 6);
		const sevenLength = lines[lines.length - 7].length;				//	char length for word five
		const sevenTotal = textLength - ((sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 7);
		if (oneTotal <= maxRow){									//	if one word can fit on row
			lastWords = 1;
			lengthRemain = oneTotal;								//	remaining length after word
		} else if (twoTotal <= maxRow) {					//	if two words can fit on row
			lastWords = 2;
			lengthRemain = twoTotal;								//	remaining length after words
		} else if (threeTotal <= maxRow) {				//	if three words can fit on row
			lastWords = 3;
			lengthRemain = threeTotal;							//	remaining length after words
		} else if (fourTotal <= maxRow) {					//	if four words can fit on row
			lastWords = 4;
			lengthRemain = fourTotal;								//	remaining length after words
		} else if (fiveTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 5;
			lengthRemain = fiveTotal;								//	remaining length after words
		} else if (sixTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 6;
			lengthRemain = sixTotal;								//	remaining length after words
		} else if (sevenTotal <= maxRow) {				//	if five words can fit on row
			lastWords = 7;
			lengthRemain = sevenTotal;							//	remaining length after words
		}
	}
	else if (lineLength == 8) {
		const oneLength = lines[lines.length - 1].length;					//	char length for word one
		const oneTotal = textLength - (oneLength + 1);						//	line length minus word one and the space
		const twoLength = lines[lines.length - 2].length;					//	char length for word two
		const twoTotal = textLength - ((twoLength + oneLength) + 2);//	line length minus word 1&2 and the spaces
		const threeLength = lines[lines.length - 3].length;				//	char length for word three
		const threeTotal = textLength - ((threeLength + twoLength + oneLength) + 3);//	line length minus word 1&2&3 and the spaces
		const fourLength = lines[lines.length - 4].length;				//	char length for word four
		const fourTotal = textLength - ((fourLength + threeLength + twoLength + oneLength) + 4);//	line length minus word 1&2&3&4 and the spaces
		const fiveLength = lines[lines.length - 5].length;				//	char length for word five
		const fiveTotal = textLength - ((fiveLength + fourLength + threeLength + twoLength + oneLength) + 5);//	line length minus word 1&2&3&4 and the spaces
		const sixLength = lines[lines.length - 6].length;					//	char length for word five
		const sixTotal = textLength - ((sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 6);
		const sevenLength = lines[lines.length - 7].length;				//	char length for word five
		const sevenTotal = textLength - ((sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 7);
		const eightLength = lines[lines.length - 8].length;				//	char length for word five
		const eightTotal = textLength - ((eightLength + sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 8);
		if (oneTotal <= maxRow){									//	if one word can fit on row
			lastWords = 1;
			lengthRemain = oneTotal;								//	remaining length after word
		} else if (twoTotal <= maxRow) {					//	if two words can fit on row
			lastWords = 2;
			lengthRemain = twoTotal;								//	remaining length after words
		} else if (threeTotal <= maxRow) {				//	if three words can fit on row
			lastWords = 3;
			lengthRemain = threeTotal;							//	remaining length after words
		} else if (fourTotal <= maxRow) {					//	if four words can fit on row
			lastWords = 4;
			lengthRemain = fourTotal;								//	remaining length after words
		} else if (fiveTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 5;
			lengthRemain = fiveTotal;								//	remaining length after words
		} else if (sixTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 6;
			lengthRemain = sixTotal;								//	remaining length after words
		} else if (sevenTotal <= maxRow) {				//	if five words can fit on row
			lastWords = 7;
			lengthRemain = sevenTotal;							//	remaining length after words
		} else if (eightTotal <= maxRow) {				//	if five words can fit on row
			lastWords = 8;
			lengthRemain = eightTotal;							//	remaining length after words
		}
	}
	else if (lineLength == 9) {
		const oneLength = lines[lines.length - 1].length;					//	char length for word one
		const oneTotal = textLength - (oneLength + 1);						//	line length minus word one and the space
		const twoLength = lines[lines.length - 2].length;					//	char length for word two
		const twoTotal = textLength - ((twoLength + oneLength) + 2);//	line length minus word 1&2 and the spaces
		const threeLength = lines[lines.length - 3].length;				//	char length for word three
		const threeTotal = textLength - ((threeLength + twoLength + oneLength) + 3);//	line length minus word 1&2&3 and the spaces
		const fourLength = lines[lines.length - 4].length;				//	char length for word four
		const fourTotal = textLength - ((fourLength + threeLength + twoLength + oneLength) + 4);//	line length minus word 1&2&3&4 and the spaces
		const fiveLength = lines[lines.length - 5].length;				//	char length for word five
		const fiveTotal = textLength - ((fiveLength + fourLength + threeLength + twoLength + oneLength) + 5);//	line length minus word 1&2&3&4 and the spaces
		const sixLength = lines[lines.length - 6].length;					//	char length for word five
		const sixTotal = textLength - ((sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 6);
		const sevenLength = lines[lines.length - 7].length;				//	char length for word five
		const sevenTotal = textLength - ((sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 7);
		const eightLength = lines[lines.length - 8].length;				//	char length for word five
		const eightTotal = textLength - ((eightLength + sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 8);
		const nineLength = lines[lines.length - 9].length;				//	char length for word five
		const nineTotal = textLength - ((nineLength + eightLength + sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 9);
		if (oneTotal <= maxRow){									//	if one word can fit on row
			lastWords = 1;
			lengthRemain = oneTotal;								//	remaining length after word
		} else if (twoTotal <= maxRow) {					//	if two words can fit on row
			lastWords = 2;
			lengthRemain = twoTotal;								//	remaining length after words
		} else if (threeTotal <= maxRow) {				//	if three words can fit on row
			lastWords = 3;
			lengthRemain = threeTotal;							//	remaining length after words
		} else if (fourTotal <= maxRow) {					//	if four words can fit on row
			lastWords = 4;
			lengthRemain = fourTotal;								//	remaining length after words
		} else if (fiveTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 5;
			lengthRemain = fiveTotal;								//	remaining length after words
		} else if (sixTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 6;
			lengthRemain = sixTotal;								//	remaining length after words
		} else if (sevenTotal <= maxRow) {				//	if five words can fit on row
			lastWords = 7;
			lengthRemain = sevenTotal;							//	remaining length after words
		} else if (eightTotal <= maxRow) {				//	if five words can fit on row
			lastWords = 8;
			lengthRemain = eightTotal;							//	remaining length after words
		} else if (nineTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 9;
			lengthRemain = nineTotal;								//	remaining length after words
		}
	}
	else if (lineLength == 10) {
		const oneLength = lines[lines.length - 1].length;					//	char length for word one
		const oneTotal = textLength - (oneLength + 1);						//	line length minus word one and the space
		const twoLength = lines[lines.length - 2].length;					//	char length for word two
		const twoTotal = textLength - ((twoLength + oneLength) + 2);//	line length minus word 1&2 and the spaces
		const threeLength = lines[lines.length - 3].length;				//	char length for word three
		const threeTotal = textLength - ((threeLength + twoLength + oneLength) + 3);//	line length minus word 1&2&3 and the spaces
		const fourLength = lines[lines.length - 4].length;				//	char length for word four
		const fourTotal = textLength - ((fourLength + threeLength + twoLength + oneLength) + 4);//	line length minus word 1&2&3&4 and the spaces
		const fiveLength = lines[lines.length - 5].length;				//	char length for word five
		const fiveTotal = textLength - ((fiveLength + fourLength + threeLength + twoLength + oneLength) + 5);//	line length minus word 1&2&3&4 and the spaces
		const sixLength = lines[lines.length - 6].length;				//	char length for word five
		const sixTotal = textLength - ((sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 6);
		const sevenLength = lines[lines.length - 7].length;				//	char length for word five
		const sevenTotal = textLength - ((sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 7);
		const eightLength = lines[lines.length - 8].length;				//	char length for word five
		const eightTotal = textLength - ((eightLength + sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 8);
		const nineLength = lines[lines.length - 9].length;				//	char length for word five
		const nineTotal = textLength - ((nineLength + eightLength + sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 9);
		const tenLength = lines[lines.length - 10].length;				//	char length for word five
		const tenTotal = textLength - ((tenLength + nineLength + eightLength + sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 10);
		if (oneTotal <= maxRow){									//	if one word can fit on row
			lastWords = 1;
			lengthRemain = oneTotal;								//	remaining length after word
		} else if (twoTotal <= maxRow) {					//	if two words can fit on row
			lastWords = 2;
			lengthRemain = twoTotal;								//	remaining length after words
		} else if (threeTotal <= maxRow) {				//	if three words can fit on row
			lastWords = 3;
			lengthRemain = threeTotal;							//	remaining length after words
		} else if (fourTotal <= maxRow) {					//	if four words can fit on row
			lastWords = 4;
			lengthRemain = fourTotal;								//	remaining length after words
		} else if (fiveTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 5;
			lengthRemain = fiveTotal;								//	remaining length after words
		} else if (sixTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 6;
			lengthRemain = sixTotal;								//	remaining length after words
		} else if (sevenTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 7;
			lengthRemain = sevenTotal;								//	remaining length after words
		} else if (eightTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 8;
			lengthRemain = eightTotal;								//	remaining length after words
		} else if (nineTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 9;
			lengthRemain = nineTotal;								//	remaining length after words
		} else if (tenTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 10;
			lengthRemain = tenTotal;								//	remaining length after words
		}
	}
	else if (lineLength == 11) {
		const oneLength = lines[lines.length - 1].length;					//	char length for word one
		const oneTotal = textLength - (oneLength + 1);						//	line length minus word one and the space
		const twoLength = lines[lines.length - 2].length;					//	char length for word two
		const twoTotal = textLength - ((twoLength + oneLength) + 2);//	line length minus word 1&2 and the spaces
		const threeLength = lines[lines.length - 3].length;				//	char length for word three
		const threeTotal = textLength - ((threeLength + twoLength + oneLength) + 3);//	line length minus word 1&2&3 and the spaces
		const fourLength = lines[lines.length - 4].length;				//	char length for word four
		const fourTotal = textLength - ((fourLength + threeLength + twoLength + oneLength) + 4);//	line length minus word 1&2&3&4 and the spaces
		const fiveLength = lines[lines.length - 5].length;				//	char length for word five
		const fiveTotal = textLength - ((fiveLength + fourLength + threeLength + twoLength + oneLength) + 5);//	line length minus word 1&2&3&4 and the spaces
		const sixLength = lines[lines.length - 6].length;					//	char length for word five
		const sixTotal = textLength - ((sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 6);
		const sevenLength = lines[lines.length - 7].length;				//	char length for word five
		const sevenTotal = textLength - ((sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 7);
		const eightLength = lines[lines.length - 8].length;				//	char length for word five
		const eightTotal = textLength - ((eightLength + sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 8);
		const nineLength = lines[lines.length - 9].length;				//	char length for word five
		const nineTotal = textLength - ((nineLength + eightLength + sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 9);
		const tenLength = lines[lines.length - 10].length;				//	char length for word five
		const tenTotal = textLength - ((tenLength + nineLength + eightLength + sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 10);
		const elevenLength = lines[lines.length - 11].length;			//	char length for word five
		const elevenTotal = textLength - ((elevenLength + tenLength + nineLength + eightLength + sevenLength + sixLength + fiveLength + fourLength + threeLength + twoLength + oneLength) + 11);
		if (oneTotal <= maxRow){									//	if one word can fit on row
			lastWords = 1;
			lengthRemain = oneTotal;								//	remaining length after word
		} else if (twoTotal <= maxRow) {					//	if two words can fit on row
			lastWords = 2;
			lengthRemain = twoTotal;								//	remaining length after words
		} else if (threeTotal <= maxRow) {				//	if three words can fit on row
			lastWords = 3;
			lengthRemain = threeTotal;							//	remaining length after words
		} else if (fourTotal <= maxRow) {					//	if four words can fit on row
			lastWords = 4;
			lengthRemain = fourTotal;								//	remaining length after words
		} else if (fiveTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 5;
			lengthRemain = fiveTotal;								//	remaining length after words
		} else if (sixTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 6;
			lengthRemain = sixTotal;								//	remaining length after words
		} else if (sevenTotal <= maxRow) {				//	if five words can fit on row
			lastWords = 7;
			lengthRemain = sevenTotal;							//	remaining length after words
		} else if (eightTotal <= maxRow) {				//	if five words can fit on row
			lastWords = 8;
			lengthRemain = eightTotal;							//	remaining length after words
		} else if (nineTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 9;
			lengthRemain = nineTotal;								//	remaining length after words
		} else if (tenTotal <= maxRow) {					//	if five words can fit on row
			lastWords = 10;
			lengthRemain = tenTotal;								//	remaining length after words
		} else if (elevenTotal <= maxRow) {				//	if five words can fit on row
			lastWords = 11;
			lengthRemain = elevenTotal;							//	remaining length after words
		}
	}
	return [lastWords, lengthRemain];					//	return # of words and remaining length
}

// ****************************************************************************************************************************
// **************************************************** SHOW MASK ON BOARD ****************************************************
// ****************************************************************************************************************************
function maskDisplay(grid, textLength, startSpace, text, lines) {
	let mask = [];
	let l, i, j;
	if (lines == "single") {											// fits on single row 1
		let tMask = [];
		for (l = 0; l < gameGrid[0].length; l++) {	// fills row 0 with 0's
			tMask.push(0);
		}
		masterMask.push(tMask);											//push to master mask
	}
	for (i = 0; i < gameGrid[grid].length; i++) {
		if (i < startSpace) {												// fills empty space with 0
			mask.push(0);
		} else if (textLength > 0) {							// checks if text still remains
			if (text[i - startSpace] != " ") {				// if not blank
				mask.push(text[i - startSpace]);				// place text letter to mask
				textLength -= 1;												// adjust count
			} else {
				mask.push(0);														// push 0
				textLength -= 1;												// adjust count
			}
		} else {																	//	push 0
			mask.push(0);
		}
	}
	masterMask.push(mask);											// fill master mask
	for (j = 0; j < mask.length; j++) {		// adds white square pic, adjust counter, and adds category text
		if (mask[j] != 0) {												// if letter is present
			correctCounter += 1;										// adjust counter
			let sqName = "sqBlank_" + gameGrid[grid][j];
			let imName = "images/squares_u/square_" + gameGrid[grid][j] + ".png";
			elements.push(new component(sqName, bgW, bgH, imName, 0, 0, "background", "default"));
			catTxt = new component("catTxt", "22px", "Arial Rounded MT", "rgb(0,0,0)", 230, 355, "text", "default");
			catTxt.text = "Category:  " + categories;
		}
	}
}

// ****************************************************************************************************************************
// ************************************************** CHECK LETTER SELECTION **************************************************
// ****************************************************************************************************************************
function crossCheck(letter, onAVowel) {
	let correct = false;
	let i, j, offset;
		for (i = 0; i < masterMask.length; i++) {												//	iterate mask
			if (i === 0 || i === 3) {																			//	offset the row sizes
				offset = 1;
			} else {offset = 0;}
			for (j = 0; j < masterMask[i].length; j++) {									//	iterate mask row
				if (masterMask[i][j] == letter) {														//	checks the mask to user selected letter
					correct = true;
					let imName = "images/letters_u2/" + letter + ".png";				//	push letter pic
					elements.push(new component("letter", 51, 66, imName, gridCoords.x[offset + j], gridCoords.y[i], "image", "default"));
					correctCounter -= 1;																			//	adjust counter
					if (correctCounter == 0 || questionTime) {								//	if all letters have been selected and filled
						onlyOnce = true;
					}
					if (!onAVowel) {																					//	not a vowel selected
						if (freebie) {																					//	if free play, constant is only 500
							players[playerTurn] += 500;
						} else {
							players[playerTurn] += wheelValues[section];					//	else, contant is worth the wheel value
						}
					}
				}
			}
		}
		if (!correct && !onAVowel) {								//	if selected letter is not correct and not a vowel
			playerRound();														//	next player
		}
	freebie = false;															//	free play is over after selection
}
