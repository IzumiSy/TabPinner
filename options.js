
// options.js

document.getElementById('save').onclick = function() {
	localStorage.EmergencyBtnIgnoreQueries = document.getElementById('ignores').value;
	window.close();	
};

document.body.onload = function() {
	var current = localStorage.EmergencyBtnIgnoreQueries;
	if (current) { 
		document.getElementById('ignores').value = current;
	}
};
