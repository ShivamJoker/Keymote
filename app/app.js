const fs = require("fs");
const crypto = require("crypto");
const ip = require("ip");
// const WebSocket = require("ws");
const robot = require("robotjs");
const { ipcRenderer } = require("electron");

const https = require("https");
const remote = require("electron").remote;

console.log(remote.getGlobal("status").isRemoteConnected);

import "./changeOnWin.js";

const qrcode = new QRCode("qrcode", { width: 160, height: 160 });

//get a 6 digit no. using node crypto module
const randbytes = parseInt(crypto.randomBytes(3).toString("hex"), 16);
const uniquieId = randbytes.toString().slice(0, 6);

//array of ids which we are gonna selectj
const { mediaKeys, gameKeys, arrowKeys, simulateKey } = require("./presets");
const filePath = "config.json";

let config = { preset: "media", id: null };

try {
  config = JSON.parse(fs.readFileSync(filePath));
  console.log(config);
} catch (error) {
  //if no file then assign the new id
  config.id = uniquieId;
  console.log(error);
}

const keyIds = ["up", "left", "middle", "right", "down"];
let keyElements = [];

keyIds.forEach(e => {
  keyElements.push(document.querySelector(`#${e}`));
});
const setValueInKeyInputs = preset => {
  keyElements.forEach((el, i) => {
    el.value = preset[i];
  });
};

const changePreset = preset => {
  switch (preset) {
    case "media":
      setValueInKeyInputs(mediaKeys);
      break;
    case "gaming":
      setValueInKeyInputs(gameKeys);
      break;
    case "arrow":
      setValueInKeyInputs(arrowKeys);
      break;
    default:
      elements.controllerValues.reset(); //reset all the values
      break;
  }
};

let code;
keyElements.forEach((el, i) => {
  el.addEventListener("keydown", e => {
    e.preventDefault();
    console.log(e);
    //only change value when custom is selected
    if (config.preset === "custom") {
      if (!code) {
        code = e.key;
      } else {
        code += `+${e.key}`;
      }
      el.value = code;
    }
  });
  el.addEventListener("focus", () => {
    code = "";
  });
});

const otherIDs = [
  "presets",
  "resetBtn",
  "saveBtn",
  "controllerValues",
  "loginCode",
  "settingsBtn",
  "settingsPage",
  "loginPage",
  "lanBtn",
  "wanBtn",
  "ip",
  "connectedPage",
  "statusIndicator"
];
let elements = {};

otherIDs.forEach(e => {
  elements[e] = document.querySelector(`#${e}`);
});

elements.resetBtn.addEventListener("click", () => {
  elements.controllerValues.reset();
  config.preset = "custom";
  elements.presets.value = config.preset;
  code = "";
});

elements.loginCode.value = config.id;

elements.presets.value = config.preset;
changePreset(config.preset);

elements.presets.addEventListener("change", e => {
  console.log(e.target.value);
  const value = e.target.value;
  config.preset = value;
  changePreset(value);
});

elements.saveBtn.addEventListener("click", () => {
  fs.writeFileSync(filePath, JSON.stringify(config));
  elements.loginPage.style.display = "flex";
  elements.settingsPage.style.display = "none";
});

//when user clicks on setting the settings view
elements.settingsBtn.addEventListener("click", () => {
  if (remote.getGlobal("status").isRemoteConnected == true) {
    elements.loginPage.style.display = "none";

    if (elements.settingsPage.style.display == "flex") {
      elements.settingsPage.style.display = "none";
      elements.connectedPage.style.display = "flex";
    } else {
      elements.settingsPage.style.display = "flex";
      elements.connectedPage.style.display = "none";
    }
  } else {
    elements.connectedPage.style.display = "none";

    if (elements.settingsPage.style.display == "flex") {
      elements.settingsPage.style.display = "none";
      elements.loginPage.style.display = "flex";
    } else {
      elements.settingsPage.style.display = "flex";
      elements.loginPage.style.display = "none";
    }
  }
});

//configure the wan and wan button
elements.wanBtn.addEventListener("click", () => {
  elements.wanBtn.classList.add("active");
  elements.lanBtn.classList.remove("active");
  elements.ip.parentElement.style.display = "none";
});

//configure the lan and wan button
elements.lanBtn.addEventListener("click", () => {
  elements.wanBtn.classList.remove("active");
  elements.lanBtn.classList.add("active");
  elements.ip.parentElement.style.display = "inline";
});

//get and set ip
elements.ip.innerText = ip.address();

//also generate a qr code with ip and code
const info = JSON.stringify({ ip: ip.address(), code: config.id });
qrcode.makeCode(info);

//handle connection using web sockets
// const wss = new WebSocket.Server({ port: 7698, maxPayload: 50 });

// const wss = new WebSocket(`wss://keymote.creativeshi.com/ws/${config.id}`);

// console.log("reached here");

// wss.on("connection", (wss, req) => {
//   const channel = req.url;
//   console.log(channel);
//   if (channel === config.id) {

//     // send connected notification
//     let myNotification = new Notification('Keymote', {
//       body: 'Remote Connected!'
//     })

// //ui update to show the connected screen
// elements.connectedPage.style.display = "flex";
// elements.loginPage.style.display = "none";
// elements.statusIndicator.style.display = "none";

// //change variable
// remote.getGlobal("status").isRemoteConnected = true;

//   }

//   ws.on("message", message => {
//     console.log(req.url);
//     const keyInfo = JSON.parse(message);
//     simulateKey(keyInfo, config.preset);
//     console.log("received: %s", message);
//   });

//   ws.on("close", () => {
//     console.log("disconnected");
//     remote.getGlobal("status").isRemoteConnected = false;

//     //send disconnect notification
//     let myNotification = new Notification('Keymote', {
//       body: 'Remote Disconnected!'
//     })

//     //ui update to show the login screen
//     elements.connectedPage.style.display = "none";
//     elements.loginPage.style.display = "flex";
//     elements.statusIndicator.style.display = "flex";
//   });
// });

let ws;

let wasSocketConnected = false;

const connectToServer = info => {
  ws = new WebSocket(`wss://keymote.creativeshi.com/ws/`);

  ws.onopen = e => {
    //change variable
    remote.getGlobal("status").isRemoteConnected = true;
    wasSocketConnected = true;
  };

  ws.onclose = e => {
    console.log(
      "Socket is closed. Reconnect will be attempted in 1 second.",
      e.reason
    );
    if (wasSocketConnected) {
      setTimeout(() => {
        connectToServer();
      }, 1000);
    }
  };

  ws.onerror = err => {
    console.error("Socket encountered error: ", err.message, "Closing socket");
    ws.close();
  };

  ws.onmessage = e => {
    //ui update to show the connected screen
    elements.connectedPage.style.display = "flex";
    elements.loginPage.style.display = "none";
    elements.statusIndicator.style.display = "none";
    // console.log(req.url);

    console.log(e);
    // const keyInfo = JSON.parse(e.data);
    // simulateKey(keyInfo, config.preset);
    // console.log("received: %s", e.data);
  };
};

connectToServer();

ipcRenderer.on("show-notification", (event, title, body) => {
  const myNotification = new Notification(title, { body });
});

// wscat -c ws://192.168.31.84:8080/350335
