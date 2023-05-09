const mongoose = require("mongoose");

const PendingVerificationSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

module.exports.PendingVerification = mongoose.model(
  "PendingVerification",
  PendingVerificationSchema
);
