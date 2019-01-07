window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'UA-124216952-1');

function event(name, params) {
    try {
        gtag('event', name, params);
    } catch (err) {
        console.error(err.message);
    }
}

function connectionFailedEvent(statusCode, errorMessage) {
    event('exception', {description: `connect failed with status ${statusCode}, error- ${errorMessage}`, fatal: true});
}