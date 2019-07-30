/*
 SCRIPT.js
 Main script for missioncontrol webpage
 
 Kyle Inzunza
 July 28/2019
*/

let ipadress = "ws://192.168.1.100/ws";
let ws = new WebSocket(ipadress);
let ws_cnt = false; //websocket connected

//when websocket opens
ws.onopen = function() {
	alert("Connected");
	ws_cnt = true;
};

//when websocket recieves message
ws.onmessage = function(evt) {
	let message = String(evt.data);
	alert(message);
};

//TODO: add websocket disconnect

//runs when webpage is fully loaded
window.addEventListener('load', function() {
	//standard update
	window.setInterval(function(){
		//if the staus of the controller has changed
		if(updateGP()){
			
			let a = Math.trunc(gamepads[0].axes[0]*100);
			let b = Math.trunc(gamepads[0].axes[1]*50 + 50);

			//if websocket is connected
			if(ws_cnt){
				//ws.send(gamepads[0].message()); //send controller data to esp32
				ws.send(a + "," + b);
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
		if(ws_cnt){
			ws.send(gamepads[0].message()); //send controller data to esp32
		}

		document.getElementById("controller1").innerHTML = "Gamepad 1: " + gamepads[0].connected + " - " + gamepads[0].message();
		document.getElementById("controller2").innerHTML = "Gamepad 2: " + gamepads[1].connected + " - " + gamepads[1].message();

		
	},300);

});

