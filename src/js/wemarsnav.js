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
let longtitude = 0;

//updates all navigation variables
function updateNav(message){
	let data = message.spit(','); //split values into individual strings

	pitch = Number(data[0]);
	roll = Number(data[1]);
	bearing = Number(data[2]);
	latitude = Number(data[3]);
	longtitude = Number(data[4]);
}


//TODO: fix this
//converts bearing to compass direction
function bearingToCompass(b){
	let res = 22.5; //how many degrees in each compass direction
	let start = 360 - res/2; //where the counting starts for the loop
	let dir = ["N","NNE","NE","NEE","E","SEE","SSE","S","SSW","SW","SWW","W","NWW","NW","NNW"];
	let trueDir;

	//loop through possible directions
	for(let c = 0; c < 360/res; c++){
		//if bearing is in range
		if(b >= start && b <= start + res*(c+1)){
			trueDir = dir[b];
			break;
		}
		else{
			start += res*(c+1);
		}
	}

	return trueDir;
}