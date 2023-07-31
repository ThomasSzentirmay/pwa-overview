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

function saveAlarm() {
    const alarmInput = document.querySelector('#alarm-input');
    const time = dayjs(alarmInput, 'HH:MM');
}

function init() {
    const alarmBtn = document.querySelector('#set-alarm');

    // Register SW
    registerSW();

    // Start clock
    clock();

    // Alarm even listener
    alarmBtn.addEventListener('click', saveAlarm);
}

// Start App
init();