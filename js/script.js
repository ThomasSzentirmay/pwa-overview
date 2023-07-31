function clock() {
    const timeDisplay = document.querySelector('#time');

    setInterval(() => {
        timeDisplay.innerText = `Current Time ${dayjs().format('hh:mm:ssa')}`;
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
            .catch(error => {
                console.error('SW Registration failed:', error);
            });
    } else {
        alert('This app cannot be installed until you activate service workers');
    }
}

function saveAlarm() {
    const alarmInput = document.querySelector('#alarm-input');
    const time = alarmInput.value.trim();
    const validTimePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!validTimePattern.test(time)) {
        alert('Please enter a valid time in the format HH:mm.');
        return;
    }

    // Convert time to 12-hour format with AM/PM
    const formattedTime = dayjs(time, 'HH:mm').format('h:mmA');

    const existingAlarms = JSON.parse(localStorage.getItem('alarms')) || [];
    existingAlarms.push(formattedTime); // Save the time in the desired format

    localStorage.setItem('alarms', JSON.stringify(existingAlarms));

    alarmInput.value = '';

    displayAlarms();
}

function displayAlarms() {
    console.log("Running displayAlarms");
    const alarmsContainer = document.querySelector('.alarms-container');
    console.log('Alarms container:', alarmsContainer);

    if (!alarmsContainer) {
        console.error("Alarms container not found.");
        return;
    }

    alarmsContainer.innerHTML = '';

    const existingAlarms = JSON.parse(localStorage.getItem('alarms')) || [];
    if (existingAlarms.length === 0) {
        alarmsContainer.innerHTML = '<p>No alarms have been added yet.</p>';
        return;
    }

    existingAlarms.forEach(alarmTime => {
        const alarmDiv = document.createElement('div');
        alarmDiv.classList.add('alarm');

        // Parse alarmTime in 24-hour format and then format to 12-hour with AM/PM
        const parsedTime = dayjs(alarmTime, 'HH:mm');
        const formattedTime = parsedTime.isValid() ? parsedTime.format('h:mmA') : 'Invalid Date';

        alarmDiv.innerHTML = `
            <p>${formattedTime}</p>
            <button class="stop-alarm" data-time="${alarmTime}">Stop</button>
        `;
        alarmsContainer.appendChild(alarmDiv);
    });

    const stopButtons = document.querySelectorAll('.stop-alarm');
    stopButtons.forEach(button => button.addEventListener('click', stopAlarm));
}

function stopAlarm(event) {
    const alarmTime = event.target.dataset.time;

    const existingAlarms = JSON.parse(localStorage.getItem('alarms')) || [];
    const updatedAlarms = existingAlarms.filter(time => time !== alarmTime);
    localStorage.setItem('alarms', JSON.stringify(updatedAlarms));

    displayAlarms();
}

function checkAlarms() {
    const existingAlarms = JSON.parse(localStorage.getItem('alarms')) || [];
    const currentTime = dayjs();

    existingAlarms.forEach(alarmTime => {
        const alarmDateTime = dayjs(alarmTime, 'HH:mm');
        if (currentTime.isSame(alarmDateTime, 'second')) {
            const audio = new Audio('alarm_sound.mp3');
            audio.loop = true;
            audio.play();

            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
                stopAlarm({ target: { dataset: { time: alarmTime } } });
            }, 60000);
        }
    });
}

function init() {
    const alarmBtn = document.querySelector('#set-alarm');

    // Register SW
    registerSW();

    // Start clock
    clock();

    // Load saved alarms from local storage and display them
    displayAlarms();

    // Alarm event listener
    alarmBtn.addEventListener('click', saveAlarm);

    // Check for alarms every second
    setInterval(checkAlarms, 1000);
}

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', init);