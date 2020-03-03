const { app, BrowserWindow, ipcMain, Tray } = require("electron");
const path = require("path");

let tray = undefined;
let window = undefined;

// Don't show the app in the doc
app.dock.hide();

app.on("ready", () => {
  createTray();
  createWindow();
});

const createTray = () => {
  tray = new Tray((path.join(__dirname,"/icons/icon.png")));
  tray.on("click", function(event) {
    toggleWindow();
  });
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
};

const createWindow = () => {
  window = new BrowserWindow({
    // width: 320,
    // height: 420,
    width: 1000,
    height: 750,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true
    }
  });

  window.loadURL(`file://${path.join(__dirname, "/app/index.html")}`);

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
