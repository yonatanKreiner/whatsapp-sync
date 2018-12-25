function checkProgress(user) {
    var progressIntervalId = setInterval(() => {
        $.getJSON('/progress?id=' + user).done(data => {
            if (data.hasOwnProperty('message') && data.message === 'finished') {
                clearInterval(progressIntervalId);
                move(100);
            } else {
                $('#progress').text(`${data.percentage}%`);
                move(data.percentage);
            }
        }).fail(err => {
            clearInterval(progressIntervalId);
            console.error(err.responseText);
        });
    }, 3000);
}

function move(width) {
    $('#progress').width(width + '%');
    $('#progress').html(width * 1 + '%');
}