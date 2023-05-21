const {
  PendingWalletVerification,
} = require("../models/pendingWalletVerification.js");

const removeExpiredPendingVerification = async () => {
  const pendingVerification = await PendingWalletVerification.find({});
  if (pendingVerification.length === 0) {
    return;
  }
  for (let i = 0; i < pendingVerification.length; i++) {
    const { createdAt } = pendingVerification[i];
    const currentDate = new Date();
    const verificationDate = new Date(createdAt);
    const difference = currentDate.getTime() - verificationDate.getTime();
    const millisecondsInMinute = 60000;
    const differenceInMinutes = Math.round(difference / millisecondsInMinute);
    if (differenceInMinutes > 5) {
      await PendingWalletVerification.deleteOne({
        _id: pendingVerification[i]._id,
      });
      return;
    }
  }
};

module.exports = {
  removeExpiredPendingVerification,
};
