/*
 SCRIPT.js
 Main script for missioncontrol webpage
 
 Kyle Inzunza
 August 07/2019
*/

let ws_control = new WebSocket("ws://192.168.1.100/ws"); //websocket for controller
let ws_nav = new WebSocket("ws://192.168.1.101/ws"); //websocket for navigation
let ws_arm = new WebSocket("ws://192.168.1.102/ws");



let ws_cnt_control = false; //controler websocket connected
let ws_cnt_nav = false; //navigation websocket connected
let ws_cnt_arm = false;

//slider values
let xvalue = 0;
let yvalue = 0;


ws_arm.onopen = function(){
	alert("Arm board connnected");
	ws_cnt_arm = true;
}

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
	//alert(message);
	updateNav(message);
};

ws_arm.onopen = function(){
	alert("Arm board connected.");
	ws_cnt_arm = true;
}


//runs when webpage is fully loaded
window.addEventListener('load', function() {
	//standard update
	window.setInterval(function(){

		updateSliders();
		//updateServo3();


		//if the staus of the controller has changed
		if(updateGP()){
			
			//let a = Math.trunc(gamepads[0].axes[0]*100);
			//et b = Math.trunc(gamepads[0].axes[1]*50 + 50);

			//if control websocket is connected
			if(ws_cnt_control){
				ws_control.send(gamepads[0].message()); //send controller data to esp32
				//ws_control.send(gamepads[0].message());
			}
			if(ws_cnt_arm){
				ws_arm.send(gamepads[1].message());
			}
			

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
		updateWebNav();
		updateGP();

		//if websocket is connected
		if(ws_cnt_control){
			ws_control.send(gamepads[0].message()); //send controller data to esp32
		}
		if(ws_cnt_arm){
			ws_control.send(gamepads[1].message());
		}

		document.getElementById("controller1").innerHTML = "Gamepad 1: " + gamepads[0].connected + " - " + gamepads[0].message();
		document.getElementById("controller2").innerHTML = "Gamepad 2: " + gamepads[1].connected + " - " + gamepads[1].message();

		
	},300);

});

//updates navigation values on webpage
function updateWebNav(){
	document.getElementById("pitch").innerHTML = "Pitch: " + pitch;
	document.getElementById("roll").innerHTML = "Roll: " + roll;
	document.getElementById("compass").innerHTML = "Compass bearing: " + bearing;
	document.getElementById("lat").innerHTML = "Latitude: " + latitude;
	document.getElementById("long").innerHTML = "Longitude " + longitude;
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
		xvalue = xvalue_temp.value;
		yvalue = yvalue_temp.value;

		if(ws_cnt_nav){
			ws_nav.send(xvalue + "," + yvalue + "_");
		}

	}
}

//send 360 servo data
function updateServo3(){
	let leftBtn = document.getElementById("left");
	let rightBtn = document.getElementById("right");

	if (ws_cnt_nav){
		if(leftBtn.clicked){
			alert("CLICKED");
			ws_nav.send("l");
		}
		else if(rightBtn.clicked){
			ws_nav.send("r");
		}
	}
}

