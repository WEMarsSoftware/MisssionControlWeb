/*
 WEMARSGP.js
 Gamepad object for Mars Rover
 
 Kyle Inzunza
 July 27/2019
*/


/*
 XBOX button layout

0 A
1 B
2 X
3 Y
4 LB
5 RB
6 LT
7 RT
8 BACK 
9 START
10 L AXIS
11 R AXIS
12 DPAD up
13 DPAD down
14 DPAD left
15 DPAD right
16 POWER
*/

//gamepad objects
let gamepads = [];
gamepads[0] = new WeMarsGamePad(0);
gamepads[1] = new WeMarsGamePad(1);


function updateGP(){
	let changed = false; //if gamepad status has changed
	let gp = navigator.getGamepads();

	//loop through all gamepads
	for(let c = 0; c < gp.length; c++){

		gamepads[c].connected = true;
		let map = getBtnMap(gp[c]);

		//if map is not the same
		if (map !== gamepads[c].btnMap){
			changed = true;
			gamepads[c].btnMap = map; //update map
		}

		//loop through axes
		for(let i = 0; i < gp[c].axes.length; i++){
			let axis = deadzone(gp[c].axes[i]); //account for deadzone

			//if axis has changed
			if (axis !== gamepads[c].axes[i]){
				changed = true; 
				gamepads[c].axes[i] = axis; //update axis
			}
		}
	}

	return changed;
}

function getBtnMap(gp){
	let map = 0;
	
	for(let i = 0; i < gp.buttons.length; i++){
		//if button i is pressed
		if (gp.buttons[i].pressed){
			map |= (1 << i); //add status to map
		}
	}

	return map;
}

//elimiates deadzone in axis
function deadzone(v) {
		const DEADZONE = 0.2;

		if (Math.abs(v) < DEADZONE) {
			v = 0;
		} else {
			// Smooth
			v = v - Math.sign(v) * DEADZONE;
			v /= (1.0 - DEADZONE);
		}

		return v;
	}

//construtor for gamepad
function WeMarsGamePad(n){
	this.btnMap = 0; //status of all buttons
	this.axes = [0,0,0,0]; //axes positions
	this.connected = false;
	this.id = n;

	this.message = function(){
		let m = (this.id) + "," + this.btnMap;

		//loop through axes
		for(let i = 0; i < this.axes.length; i++){
			m += ("," + Math.trunc(this.axes[i]*32767)); //set to max size of arduino integer
		}

		m += "_"

		return m;
	};
}