let isRemoteConnected = false;
const changeStatus = bool => {
  isRemoteConnected = bool;
};

const getStatus = () => {
  return isRemoteConnected;
};
module.exports = { changeStatus, getStatus };
