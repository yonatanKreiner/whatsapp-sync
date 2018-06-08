
function sleep(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(), ms);
	});
}

$(document).ready(function() {
	let bootstrapInfo = {
		activateQRCode: image => {
			let container = $("#bootstrap-container").removeClass("hidden").children("#bootstrap-container-content");
			container.children("button").addClass("hidden")
			container.append($("<img>").attr("src", image));
			$("#main-container").addClass("hidden");
		},
		deactivate: () => {
			$("#bootstrap-container").addClass("hidden");
			$("#main-container").removeClass("hidden");
			$("#button-disconnect").html("Disconnect").attr("disabled", false);
		}
	};

	$.getJSON('/test', data => {
		bootstrapInfo.activateQRCode(data.image)
	});

	$("#button-disconnect").click(function() {
		console.log('disconnect');		
	});
});
