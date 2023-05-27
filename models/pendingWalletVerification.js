const mongoose = require("mongoose");

const PendingWalletVerificationSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
    },
    // Ethereum, Cardano
    blockchain: {
      type: String,
    },
    walletAddress: {
      type: String,
    },
    // pending, active, ended
    sendAmount: {
      type: Number,
    },
    channelId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.PendingWalletVerification = mongoose.model(
  "PendingWalletVerification",
  PendingWalletVerificationSchema
);
