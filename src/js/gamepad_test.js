let status = "OFF"; //status of gamepad
let change; //index of buttons that have changed status
let timerCounter = 0;



//when window is loaded
window.addEventListener('load', function() {
	console.log("Window loaded...");
	
	//start timer
	window.setInterval(function(){
		document.getElementById("status").innerHTML = status;

		timerCounter++; //give program a chance to define gamepad before attempting to update
		if (status === "ON" && timerCounter > 100){
			change = gamepadAPI.updateBtn(0); //update gamepad 0
			console.log(change);

			//if the status has changed for any buttons
			if(change){
				let s = "";
				for(let i = 0; i < change.length; i++){
					s += gamepadAPI[change[i]] + " ";
				}
			}
		}

	}, 10);

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