/*
 SCRIPT.js
 Main script for missioncontrol webpage
 
 Kyle Inzunza
 August 07/2019
*/

let ws_control = new WebSocket("ws://192.168.1.100/ws"); //websocket for controller
let ws_nav = new WebSocket("ws://192.168.1.100/ws"); //websocket for navigation

let ws_cnt_control = false; //controler websocket connected
let ws_cnt_nav = false; //navigation websocket connected

//slider values
let xvalue = 0;
let yvalue = 0;


//when websocket opens
ws_control.onopen = function() {
	alert("Control board connected.");
	ws_cnt_control = true;
};

ws_nav.onopen = function() {
	alert("Navigation board connected.");
	ws_cnt_nav = true;
};

//when websocket recieves message
ws_control.onmessage = function(evt) {
	let message = String(evt.data);
	alert(message);
};

ws_nav.onmessage = function(evt) {
	let message = String(evt.data);
	updateNav(message);
};


//runs when webpage is fully loaded
window.addEventListener('load', function() {
	//standard update
	window.setInterval(function(){

		updateSliders();

		//if the staus of the controller has changed
		if(updateGP()){
			
			let a = Math.trunc(gamepads[0].axes[0]*100);
			let b = Math.trunc(gamepads[0].axes[1]*50 + 50);

			//if control websocket is connected
			if(ws_cnt_control){
				//ws.send(gamepads[0].message()); //send controller data to esp32
				ws_control.send(a + "," + b);
			}
			
			console.log(a + "," + b);


			let id = "";
			for (let i = 0; i < 4; i++){
				id = "axis" + i
				document.getElementById(id).innerHTML = (i+1) + ": " + gamepads[0].axes[i];
			}
		}

	},50);

	//ping update
	window.setInterval(function(){
		//update controller status
		updateGP();

		//if websocket is connected
		if(ws_cnt_control){
			ws_control.send(gamepads[0].message()); //send controller data to esp32
		}

		document.getElementById("controller1").innerHTML = "Gamepad 1: " + gamepads[0].connected + " - " + gamepads[0].message();
		document.getElementById("controller2").innerHTML = "Gamepad 2: " + gamepads[1].connected + " - " + gamepads[1].message();

		
	},300);

});

//updates navigation values on webpage
function updateWebNav(){
	document.getElementById("pitch").innerHTML = pitch;
	document.getElementById("roll").innerHTML = roll;
	document.getElementById("compass").innerHTML = bearing;
	document.getElementById("lat").innerHTML = latitude;
	document.getElementById("long").innerHTML = longtitude;
}

//updates slider values and sends over websocket
function updateSliders(){
	//get values of sliders
	let xvalue_temp = document.getElementById("xslider");
	let yvalue_temp = document.getElementById("yslider");
	
	//if slider values have changed
	if(xvalue_temp.value != xvalue || yvalue_temp.value != yvalue){
		//update webpage and values
		document.getElementById("xslider_value").innerHTML = "XSLIDER: " + xvalue_temp.value;
		document.getElementById("yslider_value").innerHTML = "YSLIDER: " + yvalue_temp.value;
		xvalue = xvalue_temp;
		yvalue = yvalue_temp;

		if(ws_cnt_nav){
			ws_nav.send(String(xvalue) + "," + String(yvalue) + "_");
		}

	}
}

//send 360 servo data
function updateServo3(){
	let leftBtn = document.getElementById("left");
	let rightBtn = document.getElementById("right");

	if (ws_cnt_nav){
		if(leftBtn.clicked){
			ws_nav.send("l");
		}
		else if(rightBtn.clicked){
			ws_nav.send("r");
		}
	}
}

