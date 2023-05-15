const mongoose = require("mongoose");

const PendingSSIVerificationSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
    },
    // Ethereum, Cardano
    identity: {
      type: String,
    },
    challengeId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.PendingSSIVerification = mongoose.model(
  "PendingSSIVerification",
  PendingSSIVerificationSchema
);
