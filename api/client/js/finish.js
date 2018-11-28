function checkProgress(user) {
    var progressIntervalId = setInterval(() => {
        $.getJSON('/progress?id=' + user, data => {
            if (data.hasOwnProperty('error') && data.error === 'No such user') {
                clearInterval(progressIntervalId);
                $.getJSON('/disconnect?id=' + user, data => {
                    console.log(data);
                    move(100);
                });
            } else {
                $('#progress').text(`${data.percentage}%`);
                move(data.percentage);
            }
        });
    }, 3000);
}

function move(width) {
    $('#progress').width(width + '%');
    $('#progress').html(width * 1 + '%')
    // var elem = document.getElementById("myBar");
    // elem.style.width = width + '%'; 
    // elem.innerHTML = width * 1 + '%';
}