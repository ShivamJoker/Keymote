const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  win,
  Menu,
  remote
} = require("electron");

const path = require("path");
// const remote = require("electron").remote;

let isWindows = false;
let tray = undefined;
let window = undefined;
let isQuiting = undefined;
let browserWindow = undefined;

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

global.status = { isRemoteConnected: false };

const createTray = () => {
  //if its windows we will use cwd and show an icon
  const iconPath = path.join(__dirname, "build/icon.ico");
  if (isWindows) {
    tray = new Tray(iconPath);
  } else {
    tray = new Tray(path.join(__dirname, "build/icons/iconTemplate.png"));
  }

  // Don't show the app in the mac doc
  if (app.dock) app.dock.hide();

  tray.on("click", () => {
    toggleWindow();
  });

  tray.on("right-click", event => {
    console.log(remote);
    console.log("status: ", global.status.isRemoteConnected);

    const isRemoteConnected = global.status.isRemoteConnected;

    // showWindow(remote.getGlobal("status"));
    // return 0;
    tray.popUpContextMenu(
      Menu.buildFromTemplate([
        {
          label: `Status: ${isRemoteConnected ? "Connected": "Not Connected"}`,
          enabled: false
        },
        {type:'separator'},
        {
          label: "Show App",
          click: () => {
            showWindow();
          }
        },
        {
          label: "Quit",
          click: () => {
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
    const y = Math.round(trayBounds.y + trayBounds.height - 475);
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
    skipTaskbar: true,
    show: true,
    frame: false,
    fullscreenable: true,
    resizable: true,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true
    }
  });

  // browserWindow = new BrowserWindow({
  //   show: false,
  //   webPreferences: {
  //     backgroundThrottling: false,
  //     nodeIntegration: true
  //   }

  // });

  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);

  window.on("close", function(event) {
    if (!isQuiting) {
      event.preventDefault();
      window.hide();
      event.returnValue = false;
    }
  });

  window.loadURL(`file://${path.join(__dirname, "/app/index.html")}`);

  // browserWindow.loadURL(`file://${path.join(
  //   isWindows ? process.cwd() : __dirname,
  //   "/app/notification.html"
  // )}`);

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
  // window.webContents.send(
  //   'show-notification',
  //   'Keymote',
  //   'App is running...'
  // );
};

ipcMain.on("show-window", () => {
  showWindow();
});
