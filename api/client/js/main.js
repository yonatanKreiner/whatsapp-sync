$(document).ready(function() {
	new WOW().init();
	var user = uuidv4();

	$("#button-contacts").click(function() {
		clearInterval(refreshIntervalId);
		window.location.href = '/contacts?id=' + user; 
	});

	$.getJSON('/connect?id=' + user, data => {
		$("#qrcode").attr("src", data.image);
		$("#button-contacts").attr("disabled", false);
	});

	var refreshIntervalId = setInterval(() => {
		$.getJSON('/refresh?id=' + user, data => {
			if (data.image == "scanned") {
				clearInterval(refreshIntervalId);
				$("#qrcode").remove();
				$("#qr").prepend("<h2>Click import</h2>");
			} else {
				$("#qrcode").attr("src", data.image);
			}
		})
	}, 18000);
});
