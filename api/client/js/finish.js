function checkProgress(user, progressIntervalId) {
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
        connectionFailedEvent(err.status, err.responseText);
    });
}

function checkProgressInterval(user) {
    var progressIntervalId = setInterval(() => {
        checkProgress(user, progressIntervalId)
    }, 3000);

    checkProgress(user, progressIntervalId);
}

function move(width) {
    $('#progress').width(width + '%');
    $('#progress').html(width * 1 + '%');
}

checkProgressInterval(user);