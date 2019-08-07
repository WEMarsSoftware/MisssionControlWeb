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