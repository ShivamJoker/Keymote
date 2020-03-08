
const fs = require("fs");
const crypto = require("crypto");
const ip = require("ip");
const WebSocket = require("ws");
const robot = require("robotjs");
const { ipcRenderer } = require("electron");
const http = require('http');
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
  if (remote.getGlobal("status").isRemoteConnected == true){
  elements.loginPage.style.display = "none";

  if (elements.settingsPage.style.display == "flex") {
    elements.settingsPage.style.display = "none";
    elements.connectedPage.style.display = "flex";
  } else {
    elements.settingsPage.style.display = "flex";
    elements.connectedPage.style.display = "none";
  }
}
else {
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

let ws;

function wanServer() { 

  // ws = new WebSocket('ws://'+ ip+ ':7698');

  ws = new WebSocket('wss://keymote.creativeshi.com/ws/' + config.id);

  ws.onerror = function (e) {
    console.error("Socket encountered error: ", e.message, "Closing socket");
    ws.close();
  }
  ws.onclose = function (e) {
    console.log("disconnected");
    remote.getGlobal("status").isRemoteConnected = false;

    //send disconnect notification
    let myNotification = new Notification('Keymote', {
      body: 'Remote Disconnected!'
    })

    //ui update to show the login screen
    elements.connectedPage.style.display = "none";
    elements.loginPage.style.display = "flex";
    elements.statusIndicator.style.display = "flex";
  }
  ws.onopen = function () {
    console.log('connected');
    // send connected notification
    let myNotification = new Notification('Keymote', {
      body: 'Remote Connected!'
    })

    //ui update to show the connected screen
    elements.connectedPage.style.display = "flex";
    elements.loginPage.style.display = "none";
    elements.statusIndicator.style.display = "none";

    //change variable
    remote.getGlobal("status").isRemoteConnected = true;
    ws.send(JSON.stringify({ join: config.id }));
  }
  ws.onmessage = function (ms) {
    // try {
    // const keyInfo = JSON.parse(ms.data);
    // simulateKey(keyInfo, config.preset);
    // }
    // catch {
    //   console.log("received: %s", ms.data);
    // }

    // try{
    var messag = JSON.parse(ms.data);
    // }catch(e){console.log(e)}
    if (messag.msg) { console.log('message: ', messag) }
    if (messag.key) {
      simulateKey(messag, config.preset);
      console.log("recieved key");
    }
    
  }
};

wanServer();

//handle connection using web sockets
// const wss = new WebSocket.Server({ port: 7698, maxPayload: 50 });

function lanServer(){
  const wss = new WebSocket.Server({ port: 7698, maxPayload: 50 });

  wss.on('connection', ws => {
    ws.room = [];
    ws.send(JSON.stringify({ msg: "user joined" }));
    console.log('connected');
    // send connected notification
    let myNotification = new Notification('Keymote', {
      body: 'Remote Connected!'
    })

    //ui update to show the connected screen
    elements.connectedPage.style.display = "flex";
    elements.loginPage.style.display = "none";
    elements.statusIndicator.style.display = "none";

    //change variable
    remote.getGlobal("status").isRemoteConnected = true;

    ws.on('message', message => {
      // try{
      var messag = JSON.parse(message);
      console.log(messag);
      // }catch(e){console.log(e)}
      if (messag.join) { ws.room.push(messag.join) }
      if (messag.room) { broadcast(message); }
      if (messag.msg) { console.log('message: ', message) }
      if (messag.key) {
        const keyInfo = JSON.parse(message);
        simulateKey(keyInfo, config.preset);
        console.log("recieved key");
      }
    })

    ws.on('error', e => console.log(e))

    ws.on('close', (e) => {
      console.log("disconnected");
      remote.getGlobal("status").isRemoteConnected = false;

      //send disconnect notification
      let myNotification = new Notification('Keymote', {
        body: 'Remote Disconnected!'
      })

      //ui update to show the login screen
      elements.connectedPage.style.display = "none";
      elements.loginPage.style.display = "flex";
      elements.statusIndicator.style.display = "flex";
    })

  })

  function broadcast(message) {
    wss.clients.forEach(client => {
      if (client.room.indexOf(JSON.parse(message).room) > -1) {
        client.send(message)
        console.log("message brodcasted");
      }
    })
  }
 

}

// lanServer();

const connectToServer = info => {

  ws = new WebSocket(`wss://keymote.creativeshi.com/ws/${config.id}`);

  ws.onopen = e => {
    //change variable
    remote.getGlobal("status").isRemoteConnected = true;
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
    
    const keyInfo = JSON.parse(e.data);
    simulateKey(keyInfo, config.preset);
    console.log("received: %s", e.data);
  };
};

// connectToServer();

ipcRenderer.on('show-notification', (event, title, body) => {
  const myNotification = new Notification(title, { body });
});

// wscat -c ws://192.168.31.84:8080/350335
