const robot = require("robotjs");


const simulateMediaKeys = key => {
  switch (key.key) {
    case "up":
      robot.keyToggle("audio_vol_up", key.event);
      break;
    case "left":
      robot.keyToggle("audio_prev", key.event);
      break;
    case "middle":
      robot.keyToggle("audio_play", key.event);
      break;
    case "right":
      robot.keyToggle("audio_next", key.event);
      break;
    case "down":
      robot.keyToggle("audio_vol_down", key.event);
      break;

    default:
      break;
  }
};

const simulateGameKeys = key => {
  switch (key.key) {
    case "up":
      robot.keyToggle("w", key.event);
      break;
    case "left":
      robot.keyToggle("a", key.event);
      break;
    case "middle":
      robot.keyToggle("s", key.event);
      break;
    case "right":
      robot.keyToggle("d", key.event);
      break;
    case "down":
      robot.keyToggle("space", key.event);
      break;
    default:
      break;
  }
};

const simulateArrowKeys = key => {
  console.log(key);
  if (key.key === "middle") {
    robot.keyToggle("space", key.event);
  } else {
    robot.keyToggle(key.key, key.event);
  }
};

//it will accept the array

const simulateCustomKey = (key, customKeys) => {
  console.log(customKeys);
  
  //we will loop through all the general keys and press
  customKeys[key.key].general.forEach(el => {
    console.log(el);
    //simulate key combination
    robot.keyToggle(el, key.event, customKeys[key.key].modifier);
    // robot.keyTap(el, customKeys[key.key].modifier);
  });
};

const simulateKey = (key, preset, customKeys) => {
  switch (preset) {
    case "media":
      simulateMediaKeys(key);
      break;
    case "arrow":
      simulateArrowKeys(key);
      break;
    case "game":
      simulateGameKeys(key);
      break;
    case "custom":
      simulateCustomKey(key, customKeys);
      break;
    default:
      break;
  }
};

module.exports = {
  mediaKeys: ["Vol Up", "Prv Track", "Play/Pause", "Next Tack", "Vol Down"],
  gameKeys: ["w", "a", "s", "d", "space"],
  arrowKeys: ["Up", "Left", "Space", "Right", "Down"],
  simulateKey
};
