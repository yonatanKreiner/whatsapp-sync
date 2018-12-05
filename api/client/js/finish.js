function checkProgress(user) {
    var progressIntervalId = setInterval(() => {
        $.getJSON('/progress?id=' + user, data => {
            if (data.hasOwnProperty('message') && data.message === 'finished') {
                clearInterval(progressIntervalId);
                move(100);
            } else if(data.hasOwnProperty('error') && data.error === 'No such user') {
                clearInterval(progressIntervalId);
                alert('No such user');
            } else {
                $('#progress').text(`${data.percentage}%`);
                move(data.percentage);
            }
        });
    }, 3000);
}

function move(width) {
    $('#progress').width(width + '%');
    $('#progress').html(width * 1 + '%');
}