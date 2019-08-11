let ws_nav = new WebSocket("ws://192.168.1.101/ws"); //websocket for navigation
let ws_cnt_nav = false;

ws_nav.onopen = function(){
	alert("Navigation board connected");
	ws_cnt_nav = true;
}

ws_nav.onmessage = function(evt) {
	let message = String(evt.data);
	//alert(message);
	updateNav(message);
};

window.addEventListener("load",function(){
	window.setInterval(function(){
		updateWebNav();
	},150);
});

//updates navigation values on webpage
function updateWebNav(){
	document.getElementById("pitch").innerHTML = "Pitch: " + pitch;
	document.getElementById("roll").innerHTML = "Roll: " + roll;
	document.getElementById("compass").innerHTML = "Compass bearing: " + bearing;
	document.getElementById("lat").innerHTML = "Latitude: " + latitude;
	document.getElementById("long").innerHTML = "Longitude " + longitude;
}
