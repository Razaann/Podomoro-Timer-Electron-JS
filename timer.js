const { ipcRenderer } = require('electron');

function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent =
        `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function playSound() {
    const alarm = document.getElementById('alarm');
    alarm.currentTime = 0;
    alarm.play().catch(e => console.error("Sound error:", e));
}

// IPC listeners
ipcRenderer.on('timer-update', (event, timeLeft) => {
    updateDisplay(timeLeft);
});

ipcRenderer.on('timer-finished', () => {
    playSound();
    updateDisplay(25 * 60); // Reset display to 25:00
});

// Event listeners
document.getElementById('start').addEventListener('click', () => {
    ipcRenderer.send('start-timer');
});

document.getElementById('pause').addEventListener('click', () => {
    ipcRenderer.send('pause-timer');
});

document.getElementById('reset').addEventListener('click', () => {
    ipcRenderer.send('reset-timer');
});
