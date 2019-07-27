/*
 SCRIPT.js
 Main script for missioncontrol webpage
 
 Kyle Inzunza
 July 27/2019
*/

let timer = 10

let ipadress = "ws://192.168.43.5/ws";
let ws = new WebSocket(ipadress);

//when window is loaded
window.addEventListener('load', function() {
	console.log("Window loaded...");
	document.getElementById("status").innerHTML = status;
	
	//start timer
	window.setInterval(function(){
		let id = "";
		document.getElementById("status").innerHTML = status;

		for(let k = 0; k < 2; k++){
			if (gamepadAPI.connected[k]){
				//if controller has changed
				if(gamepadAPI.updateBtn(k) || gamepadAPI.updateAxes(k)){
					for (let i = 0; i < 4; i++){
						id = "axis" + i
						document.getElementById(id).innerHTML = (i+1) + ": " + gamepadAPI.pad[k].axes[i];
					}
				}
			}
		}

	}, timer);

});


//when gamepad is connected
//runs for every new gamepad
window.addEventListener("gamepadconnected", function(e) {
  	gamepadAPI.addController(e);
  	console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
  	
});

//when gamepad is disconnected
window.addEventListener("gamepaddisconnected", function(e) {
	gamepadAPI.deleteController(e);
  	alert("Gamepad disconnected from index " + String(e.gamepad.index) + ": " + String(e.gamepad.id));
  	status = "OFF";
});