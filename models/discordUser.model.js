const mongoose = require("mongoose");

const DiscordUserSchema = new mongoose.Schema(
  {
    cardanoWallets: [
      {
        walletAddress: {
          type: String,
        },
      },
    ],
    ethereumWallets: [
      {
        walletAddress: {
          type: String,
        },
      },
    ],
    discordId: {
      type: String,
    },
    discordUsername: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.DiscordUser = mongoose.model("DiscordUser", DiscordUserSchema);
