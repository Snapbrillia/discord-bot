const mongoose = require("mongoose");

const VotesSchema = new mongoose.Schema(
  {
    voterDiscordId: {
      type: String,
    },
    serverId: {
      type: String,
    },
    votingRoundId: {
      type: String,
    },
    status: {
      type: String,
    },
    proposalId: {
      type: String,
    },
    percentageAllocated: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports.Votes = mongoose.model("votes", VotesSchema);
