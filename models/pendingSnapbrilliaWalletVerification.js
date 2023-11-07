const mongoose = require("mongoose");

const PendingSnapbrilliaWalletVerificationSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
    },
    challengeId: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.PendingSnapbrilliaWalletVerification = mongoose.model(
  "PendingSnapbrilliaWalletVerification",
  PendingSnapbrilliaWalletVerificationSchema
);
