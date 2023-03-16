const mongoose = require("mongoose");

const VotingRoundSchema = new mongoose.Schema(
  {
    serverId: {
      type: String,
    },
    votingRoundId: {
      type: String,
    },
    // Quadratic Voting(Tokens In Wallet), Quadratic Voting(Same Voting Powe), Basic Voting , Single Choice Voting
    votingSystemToUse: {
      type: String,
    },
    // Ethereum Wallet, Cardano Wallet, Discord Verification, SSI
    verificationMethod: {
      type: String,
    },
    roundDurationInDays: {
      type: Number,
    },
    // pending, active, ended
    status: {
      type: String,
    },
    assetIdentifierOnChain: {
      type: String,
    },
    assetName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.VotingRound = mongoose.model("VotingRound", VotingRoundSchema);
