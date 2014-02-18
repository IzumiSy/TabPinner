
// options.js

document.getElementById('save').onclick = function() {
	localStorage.EmergencyBtnIgnoreQueries = document.getElementById('ignores').value;
	localStorage.EmergencyBtnTargetize = document.getElementById('targetize').checked;
	window.close();	
};

document.body.onload = function() {
	var currentQueries = localStorage.EmergencyBtnIgnoreQueries;
	var targetize = localStorage.EmergencyBtnTargetize;
	if (currentQueries) {
		document.getElementById('ignores').value = currentQueries;
	}
	document.getElementById("targetize").checked = localStorage.EmergencyBtnTargetize == "true" ? true : false;
};
