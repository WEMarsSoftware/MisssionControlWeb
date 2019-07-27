let status = "OFF"; //status of gamepad
let timerCounter = 0;
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

		timerCounter++; //give program a chance to define gamepad before attempting to update
		if (status === "ON" && timerCounter > 50){
			
			//if controller has changed
			if(gamepadAPI.updateBtn(0) || gamepadAPI.updateAxes(0)){
				for (let i = 0; i < 4; i++){
					id = "axis" + i
					document.getElementById(id).innerHTML = (i+1) + ": " + gamepadAPI.pad[0].axes[i];
				}
			}


			
		}

	}, timer);

});


//when gamepad is connected
//runs for every new gamepad
window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
  	gamepadAPI.addController(e.gamepad);
  	

  	status = "ON";
});

//when gamepad is disconnected
window.addEventListener("gamepaddisconnected", function(e) {
  alert("Gamepad disconnected from index " + String(e.gamepad.index) + ": " + String(e.gamepad.id));
  status = "OFF";
});