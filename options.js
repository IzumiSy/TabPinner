
// options.js

document.getElementById('save').onclick = function() {
	localStorage.EmergencyBtnQueries = document.getElementById('queryData').value;
	window.close();	
};
document.body.onload = function() {
	var current = localStorage.EmergencyBtnQueries;
	
	if (current) { 
		document.getElementById('queryData').value = current;
	}
};
