const fs = require("fs");
//array of ids which we are gonna select
const { mediaKeys, gameKeys, arrowKeys } = require("./presets");
const filePath = "config.json";

let config = { preset: "media", id: null };

try {
  config = JSON.parse(fs.readFileSync(filePath));
  console.log(config);
} catch (error) {
  console.log(error);
}

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

keyElements.forEach((el, i) => {
  let code;
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
});

const otherIDs = ["presets", "resetBtn", "saveBtn", "controllerValues"];
let elements = {};

otherIDs.forEach(e => {
  elements[e] = document.querySelector(`#${e}`);
});

elements.resetBtn.addEventListener("click", () => {
  elements.controllerValues.reset();
});

elements.presets.value = config.preset;
changePreset(config.preset);

elements.presets.addEventListener("change", e => {
  console.log(e.target.value);
  const value = e.target.value;
  config.preset = value;
  changePreset(value);

  fs.writeFileSync(filePath, JSON.stringify(config));
});
