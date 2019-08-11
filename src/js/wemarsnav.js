/*
 WEMARSNAV.js
 Script for handling navigation board data
 
 Kyle Inzunza
 August 07/2019
*/

//assume x axis is heading of rover

let pitch = 0; //angle about y axis
let roll = 0; //angle about x axis
let bearing = 0; //compass bearing

//gps coordinates
let latitude = 0; 
let longitude = 0;

//updates all navigation variables
function updateNav(message){
	let data = message.split(','); //split values into individual strings

	pitch = Number(data[0]);
	roll = Number(data[1]);
	bearing = Number(data[2]);
	latitude = Number(data[3]);
	longitude = Number(data[4]);
}


//TODO: fix this
//converts bearing to compass direction
function bearingToCompass(b){
	//let dir = ["N","NNE","NE","NEE","E","SEE","SSE","S","SSW","SW","SWW","W","NWW","NW","NNW","N"];
	let dir = ["N","NE","E","SE","S","SW","W","NW","N"];
	let start
	let trueDir;

	//loop through possible directions
	for(let c = 0; c < 9; c++){
		//if bearing is in range
		
	}

	return trueDir;
}