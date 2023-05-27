const mongoose = require("mongoose");

const DiscordServerSchema = new mongoose.Schema(
  {
    adminChannel: {
      type: String,
    },
    serverOwner: {
      type: String,
    },
    serverId: {
      type: String,
    },
    userChannels: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports.DiscordServer = mongoose.model(
  "DiscordServer",
  DiscordServerSchema
);
