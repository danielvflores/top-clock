// filepath: electron-main.cjs
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 400,
    minWidth: 300,
    minHeight: 180,
    maxWidth: 450,
    maxHeight: 400,
    resizable: true,
    alwaysOnTop: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  win.setMenu(null);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});