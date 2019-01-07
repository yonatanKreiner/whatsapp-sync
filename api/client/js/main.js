$(document).ready(function() {
	new WOW().init();
	var user = uuidv4();

	$("#button-contacts").click(function() {
		clearInterval(refreshIntervalId);
		window.location.href = '/contacts?id=' + user; 
		event('import_contacts', { user });
	});

	$.getJSON('/connect?id=' + user)
	.done(data => {
		$("#qrcode").attr("src", data.image);
		$("#button-contacts").attr("disabled", false);
		event('connect_whatsapp', { user });
	}).fail(err => {
		connectionFailedEvent(err.status, err.responseText);
	});

	var refreshIntervalId = setInterval(() => {
		$.getJSON('/refresh?id=' + user)
		.done(data => {
			if (data.image == "scanned") {
				clearInterval(refreshIntervalId);
				$("#qrcode").remove();
				$("#qr").prepend("<h2>Click import</h2>");
			} else {
				$("#qrcode").attr("src", data.image);
				event('refreshed_qrcode', { user });
			}
		}).fail(err => {
			connectionFailedEvent(err.status, err.responseText);
		})
	}, 18000);
});
