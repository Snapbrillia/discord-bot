const mongoose = require("mongoose");

const DiscordUserSchema = new mongoose.Schema(
  {
    cardanoWallets: [
      {
        type: String,
      },
    ],
    ethereumWallets: [
      {
        type: String,
      },
    ],
    discordId: {
      type: String,
    },
    serverId: [
      {
        type: String,
      },
    ],
    discordUsername: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.DiscordUser = mongoose.model("DiscordUser", DiscordUserSchema);
