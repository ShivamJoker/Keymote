const robot = require("robotjs");

const simulateMediaKeys = key => {
  switch (key) {
    case "up":
      robot.keyTap("audio_vol_up");
      break;
    case "left":
      robot.keyTap("audio_prev");
      break;
    case "middle":
      robot.keyTap("audio_play");
      break;
    case "right":
      robot.keyTap("audio_next");
      break;
    case "down":
      robot.keyTap("audio_vol_down");
      break;

    default:
      break;
  }
};

const simulateGameKeys = key => {
  switch (key) {
    case "up":
      robot.keyTap("w");
      break;
    case "left":
      robot.keyTap("a");
      break;
    case "middle":
      robot.keyTap("s");
      break;
    case "right":
      robot.keyTap("d");
      break;
    case "down":
      robot.keyTap("space");
      break;
    default:
      break;
  }
};

const simulateArrowKeys = key => {
  if (key === "middle") {
    robot.keyTap("enter");
  } else {
    robot.keyTap(key);
  }
};

const simulateKey = (key, preset) => {
  switch (preset) {
    case "media":
      simulateMediaKeys(key);
      break;
    case "arrow":
      simulateArrowKeys(key);
    default:
      break;
  }
};

module.exports = {
  mediaKeys: ["Vol Up", "Prv Track", "Play/Pause", "Next Tack", "Vol Down"],
  gameKeys: ["w", "a", "s", "d", "space"],
  arrowKeys: ["Up", "Left", "Enter", "Right", "Down"],
  simulateKey
};
