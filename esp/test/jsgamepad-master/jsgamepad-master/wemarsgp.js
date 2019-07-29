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



let gamepadAPI = {
	
	pad: [], //gamepad objects
	connected: [false, false], //status of all gamepads
	padCounter: 0, //number of gamepads 

	//new controller connected
	addController: function(evt){
		gamepadAPI.pad[gamepadAPI.padCounter] = new WeMarsGamePad(evt.gamepad); 
		console.log("Controller #" + (gamepadAPI.padCounter + 1) + " id: " + gamepadAPI.pad[gamepadAPI.padCounter].controller.id);
		gamepadAPI.connected[gamepadAPI.padCounter].connected = true; 
		gamepadAPI.padCounter++;
	},

	//new controller removed
	removeController: function(evt){
		//loop through gamepads
		for(let i = 0; i < gamepadAPI.pad.length; i++){
			gp = gamepadAPI.pad[i]
			if(evt.gamepad.id === gp.id){
				gamepadAPI.connected[i] = false;
				gamepadAPI.pad.splice(i,1); //remove gamepad
				gamepadAPI.padCounter--; 
			}
		}
	},


	updateBtn: function(n){
		gamepadAPI.buttonsStatus = []; //empty cache

		let gp = gamepadAPI.pad[n];
		let c = gamepadAPI.pad[n].controller; //for ease of reading
		let changed = false; //if status has changed

		let map = 0; //current map of buttons

		//loop through buttons
		for(let i = 0; i < c.buttons.length; i++){
			//if button i is pressed
			if (c.buttons[i].pressed){
				map |= (1 << i); //add status to map
			}
		}

		//if map has changed
		if (gp.btnMap !== map){
			changed = true;
			gp.btnMap = map; //reset map
		}

		return changed;
	},

	updateAxes: function(n){

		let gp = gamepadAPI.pad[n];
		let c = gamepadAPI.pad[n].controller; //for ease of reading
		let changed = false; //if axes position has changed

		//loop through axes
		for(let i = 0; i < c.axes.length; i++){
			//if axis has changed
			if (c.axes[i] != gp.axes[i]){
				changed = true; 
				gp.axes[i] = c.axes[i];
			}
		}

		return changed;
		
	},
	btnName: ["A","B","X","Y","LB","RB","LT","BACK","START","L AXIS","R AXIS","DPAD up", "DPAD down"]
};

//converts axis from float to integer
function convertAxis(a){
	return Math.trunc(a*1000);
}

//construtor for gamepad
function WeMarsGamePad(g){
	this.controller = g; //gamepad object
	this.btnMap = 0; //status of all buttons
	this.axisStatus = []; //status of all axes
	this.id = g.id; //id of gamepad
	this.axes = []; //axes positions

}
