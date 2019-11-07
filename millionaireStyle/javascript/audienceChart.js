// JavaScript Document

//	different percentages to use, index 0 is the highest but the others are not needed to be in order
const audChoice = [
	[78,7,7,8],
	[50,20,15,15],
	[97,1,0,2],
	[79,6,5,10],
	[48,1,3,48],
	[55,7,24,14],
	[31,25,24,20],
	[64,10,3,23],
	[71,10,10,9],
	[84,4,10,2],
	[65,3,14,18],
	[75,12,2,11],
];

// ******************* RANDOM NUMBER FUNCTION
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

// ******************* AUDIENCE CHOICE SELECTION
function audChance(letter) {
	let theChoice = audChoice[getRandomInt(0, audChoice.length - 1)];			//	random #
	if (letter == "A") {
		return [theChoice[0], theChoice[1], theChoice[2], theChoice[3]]			//	return list for A
	} else if (letter == "B") {
		return [theChoice[1], theChoice[0], theChoice[2], theChoice[3]]			//	return list for B
	} else if (letter == "C") {
		return [theChoice[3], theChoice[2], theChoice[0], theChoice[1]]			//	return list for C
	} else {
		return [theChoice[3], theChoice[2], theChoice[1], theChoice[0]]			//	return list for D
	}
}

// ******************* CHART FUNCTION
function chartIt() {
	document.getElementById("canvas-container").style.display = "block";			//	display 2nd canvas
	const labelIt = ["A","B","C","D"];																				//	chart labels (x axis)
	const dataIt = audChance(labelIt[correctAnswer[0]]);											//	randomize the choices
	const canvas1 = document.getElementById("audienceChart");
	const ctx1 = canvas1.getContext("2d");
	canvas1.style.backgroundColor = "#f1f1f1";																//	chart background
	let chart = new Chart(ctx1, {
		type: 'bar',																														//	bar type chart
		data: {
			labels: labelIt,																											//	labels on x axis
			datasets: [{
				label: 'Audience Results',																					//	legend
				backgroundColor: 'rgba(34,7,170,0.7)',															//	bar background color
				borderColor: 'rgba(79,79,79,0.5)',																	//	bar border color
				borderWidth: 3,																											//	border width
				data: dataIt,																												//	y axis
			}]
		},
		options: {
			scales: {
				//	y axis setup
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Percentage (%)'																		// label on y axis
					},
					ticks: {
						beginAtZero: true,
						max: 100,
						stepSize: 10
					}
				}]
			}
		},
	});
}

// ******************* UN-CHART FUNCTION
function unchartIt() {
	document.getElementById("canvas-container").style.display = "none";				//	hide 2nd canvas
}
