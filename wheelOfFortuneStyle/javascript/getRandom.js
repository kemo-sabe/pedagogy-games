// JavaScript Document
/*jshint esversion: 6 */

function getRandomInt(min, max) {
  const min = Math.ceil(min);							//	round min
  const max = Math.floor(max);						//	round max
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function randomBackground() {
	const b = "images/bg";									//	path
	const bEnd = ".png";										//	end
	const bNumb = getRandomInt(0, 7);				//	random number
	if (DEBUG) {console.log("background number: ", bNumb);}
	return b + bNumb + bEnd;
}
