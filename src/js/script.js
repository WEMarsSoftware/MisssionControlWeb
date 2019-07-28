/*
 SCRIPT.js
 Main script for missioncontrol webpage
 
 Kyle Inzunza
 July 27/2019
*/

let gp; //holder for gamepad object
let ws_status = false;

let ipadress = "ws://192.168.1.3/ws";
let ws;

gamepadAPI.connected[0] = false;
gamepadAPI.connected[1] = false;


//when window is loaded
window.addEventListener('load', function() {
	console.log("Window loaded...");

	//start timer for updating gamepad
	window.setInterval(function(){
		let id = "";

		for(let k = 0; k < 2; k++){
			document.getElementById("controller" + (k+1)).innerHTML = "Controller" + (k+1) + ": " + gamepadAPI.connected[k];

			if (gamepadAPI.connected[k]){
				//if controller has changed
				if(gamepadAPI.updateBtn(k) || gamepadAPI.updateAxes(k)){
					gp = gamepadAPI.pad[k];
					for (let i = 0; i < 4; i++){
						id = "axis" + i
						document.getElementById(id).innerHTML = (i+1) + ": " + gp.axes[i];
					}
				}
			}
		}

	}, 10);

	//start timer for pinging esp
	window.setInterval(function(){
		
		//if websocket connected
		if(ws_status){
			//loop through controllers
			for(let k = 0; k < 2; k++){
				let c_status = getControllerStatus(k);
				if(c_status !== 0){
					ws.send(c_status);
				}
			}
		}
	}, 300);

});


//when gamepad is connected
//runs for every new gamepad
window.addEventListener("gamepadconnected", function(e) {
  	gamepadAPI.addController(e);
  	alert("Gamepad connected at index " + e.gamepad.id + " buttons " + e.gamepad.buttons.length + " axes " + e.gamepad.axes.length);
  	
  	ws = new WebSocket(ipadress); //start new websocket

	//when websocket opens
	ws.onopen = function() {
		console.log = ("Connected");
		ws_status = true;


		//send message every second
		window.setInterval(function(){
			ws.send("Message >:(");
		},1000)
	};

	//when websocket recieves message
	ws.onmessage = function(evt) {
		message = String(evt.data);
		alert(message);
	};

  	
});

//when gamepad is disconnected
window.addEventListener("gamepaddisconnected", function(e) {
	gamepadAPI.deleteController(e);
  	alert("Gamepad disconnected from index " + String(e.gamepad.index) + ": " + String(e.gamepad.id));
});

function getControllerStatus(n){
	let c_status = 0;

	//if gamepad is connected
	if(gamepadAPI.connected[n]){
		gp = gamepadAPI.pad[n];
		c_status = n + "," + gp.btnMap;
		for(let j = 0; j < gp.axes.length; j++){
			c_status += "," +  gp.axes[j];
		}
	}
	return c_status;
}