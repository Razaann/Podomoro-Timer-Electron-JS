const { app, BrowserWindow, powerSaveBlocker, ipcMain } = require('electron');

let mainWindow;
let timer;
let timeLeft = 25 * 60; // 25 minutes
let powerSaveId;

function createWindow() {
    powerSaveId = powerSaveBlocker.start('prevent-app-suspension');

    mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('will-quit', () => {
    powerSaveBlocker.stop(powerSaveId);
});

// Timer control functions
function startTimer() {
    if (timer) return; // Prevent multiple intervals
        timer = setInterval(() => {
            timeLeft--;
            mainWindow.webContents.send('timer-update', timeLeft);
            if (timeLeft <= 0) {
            clearInterval(timer);
            timer = null;
            mainWindow.webContents.send('timer-finished');
            }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = 25 * 60;
    mainWindow.webContents.send('timer-update', timeLeft);
}

// IPC handlers
ipcMain.on('start-timer', startTimer);
ipcMain.on('pause-timer', pauseTimer);
ipcMain.on('reset-timer', resetTimer);
