function clock() {
    const timeDisplay = document.querySelector('#time');

    setInterval(() => {
        timeDisplay.innerText = `Current Time ${dayjs().format('hh:mm:ssa')}`
    }, 1000);
}

function registerSW() {
    // Load service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log(registration);
                console.log('SW Registered');
            })
    } else alert('This app cannot be installed until you activate service workers')
}

function init() {
    // Register SW
    registerSW();

    // Start clock
    clock();
}

// Start App
init();