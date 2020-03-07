const arrow = document.querySelector(".header-arrow");
const body = document.querySelector("body");

//if it winodws change arrow position and reverse body flex
console.log(process.platform);
if (process.platform === "win32") {
  console.log("changing style");
  body.style.flexDirection = "column-reverse";
  arrow.style.transform = "rotate(180deg)";
  arrow.style.borderColor =
    "transparent transparent var(--light-color) transparent";
}
