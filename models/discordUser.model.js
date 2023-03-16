const mongoose = require("mongoose");

const DiscordUserSchema = new mongoose.Schema(
  {
    cardanoWalletAddress: {
      type: String,
    },
    ethereumWalletAddress: {
      type: String,
    },
    cardanoIsVerified: {
      type: Boolean,
    },
    ethereumIsVerified: {
      type: Boolean,
    },
    ssiIsVerified: {
      type: Boolean,
    },
    discordId: {
      type: String,
    },
    serverId: {
      type: String,
    },
    discordUsername: {
      type: String,
    },
    confirmAdaAmount: {
      type: Number,
    },
    confirmEthAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports.DiscordUser = mongoose.model("DiscordUser", DiscordUserSchema);
