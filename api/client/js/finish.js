function checkProgress(user) {
    setInterval(() => {
        $.getJSON('/progress?id=' + user, data => {
            $('#progress').text(`${data.percentage}%`);
        });
    }, 3000);
}