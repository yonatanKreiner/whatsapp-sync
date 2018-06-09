
function sleep(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(), ms);
	});
}

function activateQRCode(image) {
	let container = $("#bootstrap-container");
	container.append($("<img>").attr("src", image));
}

$(document).ready(function() {
	$.getJSON('/test', data => {
		activateQRCode(data.image)
	});

	$("#button-disconnect").click(function() {
		console.log('disconnect');		
	});
});
