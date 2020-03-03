const crypto = require("crypto");

// const randomValueHex = len => {
//   return parseInt(crypto
//     .randomBytes(Math.ceil(len / 2))
//     .toString("hex")
//     .slice(0, len), 16);
// };


// const randomNum = len => {
//     const minimum = 1;
//     const maximum = Math.pow(10, len);
//     const maxDec = Number.MAX_SAFE_INTEGER / 10;
//     const randbytes = parseInt(crypto.randomBytes(len).toString('hex'), 16);
//     const result = Math.floor(randbytes/maxDec*(maximum-minimum+1)+minimum);
//     return result;
//   };
  
// module.exports = randomNum;
const randbytes = parseInt(crypto.randomBytes(3).toString('hex'), 16);
console.log(randbytes.toString().slice(0,6))
  