function checkProgress(user) {
    var progressIntervalId = setInterval(() => {
        $.getJSON('/progress?id=' + user, data => {
            if (data.hasOwnProperty('error') && data.error === 'No such user') {
                clearInterval(progressIntervalId);
                $.getJSON('/disconnect?id=' + user, data => {
                    console.log(data);
                });
            } else {
                $('#progress').text(`${data.percentage}%`);
            }
        });
    }, 3000);
}