const { app, BrowserWindow, ipcMain, Tray, win, Menu } = require("electron");
const path = require("path");
const robot = require("robotjs");

let isWindows = false;
let tray = undefined;
let window = undefined;
let isQuiting = undefined;

if (process.platform === "win32") {
  isWindows = true;
}

app.on("before-quit", function() {
  isQuiting = true;
});

app.on("ready", () => {
  createTray();
  createWindow();
});

const createTray = () => {
  //if its windows we will use cwd and show an icon
  if (isWindows) {
    tray = new Tray(path.join(process.cwd(), "/icons/iconTemplate.png"));
  } else {
    tray = new Tray(path.join(__dirname, "/icons/iconTemplate.png"));
  }

  // Don't show the app in the mac doc
  if (app.dock) app.dock.hide();

  tray.on("click", event => {
    const { getStatus } = require("./app/status");

    console.log(getStatus());

    if (!getStatus()) {
      showWindow();
      return 0;
    }

    if (isWindows) {
      tray.on("click", tray.popUpContextMenu);
    }

    tray.setContextMenu(
      Menu.buildFromTemplate([
        {
          label: "Show App",
          click: function() {
            showWindow();
          }
        },
        {
          label: "Quit",
          click: function() {
            isQuiting = true;
            app.quit();
          }
        }
      ])
    );
  });

  tray.setToolTip("Keymote");
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  //different position on mac and windows
  if (isWindows) {
    // Center window horizontally abpve the tray icon
    const x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );
    // Position window 4 pixels vertically above the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height - 500);
    return { x: x, y: y };
  } else {
    // Center window horizontally below the tray icon
    const x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );
    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4);
    return { x: x, y: y };
  }
};

const createWindow = () => {
  window = new BrowserWindow({
    width: 320,
    height: 430,
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

  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);

  window.on("close", function(event) {
    if (!isQuiting) {
      event.preventDefault();
      window.hide();
      event.returnValue = false;
    }
  });

  window.loadURL(
    `file://${path.join(
      isWindows ? process.cwd() : __dirname,
      "/app/index.html"
    )}`
  );

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
