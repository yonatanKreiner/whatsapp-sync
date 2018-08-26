function checkProgress(user) {
    var progressIntervalId = setInterval(() => {
        $.getJSON('/progress?id=' + user, data => {
            console.log(data)
            if (data === 'No such user') {
                clearInterval(progressIntervalId);
                $.getJSON('/disconnect?id=' + user, data => {
                    alert(data);
                });
            } else {
                $('#progress').text(`${data.percentage}%`);
            }
        });
    }, 3000);
}

var user = "<%= user %>";
checkProgress(user);