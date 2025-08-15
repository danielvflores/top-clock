import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function createWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 350,
    frame: false, 
    resizable: true, 
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    alwaysOnTop: true, 
  });
    win.setMenu(null); 

  // isDeveloping? with using app.isPackaged
  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});