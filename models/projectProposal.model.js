const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema(
  {
    discordId: {
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
    name: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.Proposal = mongoose.model("proposal", ProposalSchema);
