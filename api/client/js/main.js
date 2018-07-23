function activateQRCode(image) {
	let container = $("#bootstrap-container");
	container.prepend($("<img>").attr("src", image));
	$("#button-contacts").attr("disabled", false);
}

$(document).ready(function() {
	var user = uuidv4();

	$("#button-contacts").click(function() {
		window.location.href = '/contacts?id=' + user; 
	});

	$.getJSON('/connect?id=' + user, data => {
		activateQRCode(data.image)
	});

	$("#button-disconnect").click(function() {
		console.log('disconnect');		
	});
});
