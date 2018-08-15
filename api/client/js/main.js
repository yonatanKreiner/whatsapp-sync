$(document).ready(function() {
	var user = uuidv4();

	$("#button-contacts").click(function() {
		clearInterval(refreshIntervalId);
		window.location.href = '/contacts?id=' + user; 
	});

	$.getJSON('/connect?id=' + user, data => {
		$("#bootstrap-container img").attr("src", data.image);
		$("#button-contacts").attr("disabled", false);
	});

	var refreshIntervalId = setInterval(() => {
		$.getJSON('/refresh?id=' + user, data => {
			if (data.image == "scanned") {
				clearInterval(refreshIntervalId);
				$("#bootstrap-container img").remove();
				$("#bootstrap-container").prepend("<h2>Click import</h2>");
			} else {
				$("#bootstrap-container img").attr("src", data.image);
			}
		})
	}, 18000);

	$("#button-disconnect").click(function() {
		console.log('disconnect');		
	});
});
