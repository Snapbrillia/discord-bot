const mongoose = require("mongoose");

const tokenInWalletSchema = new mongoose.Schema(
  {
    tokenName: {
      type: String,
    },
    tokenIdentifier: {
      type: String,
    },
  },
  { _id: false }
);

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
    serversUserIsIn: [
      {
        type: String,
      },
    ],
    discordUsername: {
      type: String,
    },
    snapbrilliaWalletAuthToken: {
      type: String,
    },
    email: {
      type: String,
    },
    cardanoTokensInWallet: [tokenInWalletSchema],
    ethereumTokensInWallet: [tokenInWalletSchema],
  },
  { timestamps: true }
);

module.exports.DiscordUser = mongoose.model("DiscordUser", DiscordUserSchema);
