/*
 WEMARSGP.js
 Gamepad object for Mars Rover
 
 Kyle Inzunza
 July 26/2019
*/


/*
 XBOX layout

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
	padCounter: 0, //number of gamepads 

	//new controller created
	addController: function(g){
		gamepadAPI.pad[gamepadAPI.padCounter] = new WeMarsGamePad(g); 
		console.log("Controller #" + (gamepadAPI.padCounter + 1) + " id: " + gamepadAPI.pad[gamepadAPI.padCounter].controller.id);
		gamepadAPI.padCounter++;
	},

	//TODO: add removeController


	//TODO: fix update function
	//returns id of buttons that have changed status
	updateBtn: function(n){
		gamepadAPI.buttonsStatus = []; //empty cache

		
		let c = gamepadAPI.pad[n].controller; //for ease of reading

		let btnChange = []; //id of changed buttons
		let k = 0; //counter

		//loop through buttons
		for(let i = 0; i < c.buttons.length; i++){
			//if state is different
			if(c.buttons[i].pressed !== gamepadAPI.pad[n].btnStatus[i]){
				btnChange[k] = i; //add index to list
				gamepadAPI.pad[n].btnStatus = !gamepadAPI.pad[n].btnStatus; //invert status
			}
		}

		return btnChange;
	},


	btnName: ["A","B","X","Y","LB","RB","LT","BACK","START","L AXIS","R AXIS","DPAD up", "DPAD down"]
};


//construtor
function WeMarsGamePad(g){
	this.controller = g; //gamepad object
	this.btnStatus = []; //status of all buttons
	this.axisStatus = []; //status of all axes
	this.id = g.id; //id of gamepad

	for (let i = 0; i < g.buttons.length; i++){
		this.btnStatus[i] = false; //assume buttons all unpressed at start
	}

}