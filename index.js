const { app, BrowserWindow, ipcMain, Tray, win, Menu} = require("electron");
const path = require("path");
require('electron-reload')(process.cwd(), {
    electron: path.join(process.cwd(), 'node_modules', '.bin', 'electron.cmd')
});


let tray = undefined;
let window = undefined;
let isQuiting = undefined;


app.on('before-quit', function () {
  isQuiting = true;
});


app.on("ready", () => {
  createTray();
  createWindow();
});

const createTray = () => {
	// Don't show the app in the doc
  	if (app.dock) app.dock.hide();

  tray = new Tray((path.join(process.cwd(),"/icons/iconTemplate.png")));
  tray.on("click", function(event) {

    if (process.platform === 'win32') {
    tray.on('click', tray.popUpContextMenu);
  }
    tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        showWindow();
      }
    },
    {
      label: 'Quit', click: function () {
        isQuiting = true;
        app.quit();
      }
    }
  ]));
  });

  tray.setToolTip('Keymote');
  
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally abpve the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically above the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height - 500);

  return { x: x, y: y };
};

const createWindow = () => {
  window = new BrowserWindow({
    width: 320,
    height: 500,
    // width: 1000,
    // height: 750,
    show: true,
    frame: false,
    fullscreenable: true,
    resizable: false,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true
    }
});

    window.on('close', function (event) {
    if (!isQuiting) {
      event.preventDefault();
      window.hide();
      event.returnValue = false;
    }
  

  });

  window.loadURL(`file://${path.join(process.cwd(), "/app/index.html")}`);

  // Hide the window when it loses focus
  window.on("blur", () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });
};

const toggleWindow = () => {
  window.isVisible() ? window.hide() : showWindow();
};

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
};


ipcMain.on("show-window", () => {
  showWindow();
});
