const fs = require("fs");
const crypto = require("crypto");
const qrcode = new QRCode("qrcode", { width: 160, height: 160 });

//get a 6 digit no. using node crypto module
const randbytes = parseInt(crypto.randomBytes(3).toString("hex"), 16);
const uniquieId = randbytes.toString().slice(0, 6);

//array of ids which we are gonna select
const { mediaKeys, gameKeys, arrowKeys } = require("./presets");
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

//also generate a qr code
qrcode.makeCode(config.id);

const keyIds = ["top", "left", "middle", "right", "bottom"];
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
    console.log(e.key);
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
  "loginPage"
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
  elements.loginPage.style.display = "none";
  elements.settingsPage.style.display = "flex";
});

