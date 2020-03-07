const statusObj = {
  isRemoteConnected: false,
  changeStatus: bool => {
    statusObj.isRemoteConnected = bool;
  },
  getStatus: () => {
    return statusObj.isRemoteConnected;
  }
};

module.exports = statusObj;
