const mongoose = require("mongoose");

const PendingVerificationSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
    },
    serverId: {
      type: String,
    },
    // Ethereum Wallet, Cardano Wallet, Discord Verification, SSI
    verificationMethod: {
      type: String,
    },
    // pending, active, ended
    sendAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports.PendingVerification = mongoose.model(
  "PendingVerification",
  PendingVerificationSchema
);
