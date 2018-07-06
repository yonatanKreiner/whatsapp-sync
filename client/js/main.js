// const uuid = require('uuid');

function activateQRCode(image) {
	let container = $("#bootstrap-container");
	container.prepend($("<img>").attr("src", image));
	$("#button-contacts").attr("disabled", false);
}

$(document).ready(function() {
	$("#button-contacts").click(function() {
		window.location.href = '/contacts?id=123'; 
	});

	$.getJSON('/connect?id=123', data => {
		activateQRCode(data.image)
	});

	$("#button-disconnect").click(function() {
		console.log('disconnect');		
	});
});
