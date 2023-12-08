import * as path from 'path';
import * as fs from 'fs';

// For Electron
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import electronDebug from 'electron-debug';
import electronReloader from 'electron-reloader';
// Personal imports
import { getArgs } from './helpers/args.helper';

//* Init
console.info('Electron:: main.ts -> start');

// Get Values from args
const args = getArgs();
let win: BrowserWindow | null = null;

//? Create a new window
const createWindow = () => {
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  console.info('Electron:: main.ts -> createWindow() -> start', {
    screenSize,
    ...args,
  });
  const { isProd, port } = args;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: screenSize.width,
    height: screenSize.height,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      devTools: isProd ? false : true,
      contextIsolation: false,
    },
  });
  win.maximize();

  if (!isProd) {
    console.info('Electron:: main.ts -> Dev mode');
    electronDebug({
      isEnabled: true,
      devToolsMode: 'undocked',
      showDevTools: true,

    });
    electronReloader(module);
    win.webContents.openDevTools();
    win.loadURL(`http://localhost:${port}`);
  } else {
    // Path when running electron executable
    let pathIndex = './view/index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/view/index.html'))) {
      // Path when running electron in local folder
      console.info('Electron:: main.ts -> Local mode');
      pathIndex = '../dist/view/index.html';
    } else console.info('Electron:: main.ts -> Prod mode');

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Desactivar el menú predeterminado de Electron
  win.removeMenu();

  win.webContents.setWindowOpenHandler((data) => {
    const { url } = data;
    require('electron').shell.openExternal(url);
    console.info('Electron: Url opened in browser:', url);
    return { action: 'deny' };
  });

  // Escucha el evento para reiniciar el proceso de renderizado
  ipcMain.on('restart-renderer', (_channel, data) => {
    console.info('Electron:: main.ts -> restart-renderer', data);
    // Envía un mensaje al proceso de renderizado para reiniciar
    win!.webContents.send('restart-renderer');
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
};

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  // app.on('ready', () => setTimeout(createWindow, 400));
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) createWindow();
  });
} catch (error) {
  // Catch Error
  throw { message: 'Error opening Electron', error };
}
