const mongoose = require("mongoose");

const VotingRoundSchema = new mongoose.Schema(
  {
    serverId: {
      type: String,
    },
    votingRoundId: {
      type: String,
    },
    // Quadratic Voting (Tokens In Wallet), Quadratic Voting (Same Voting Powe), Basic Voting , Single Choice Voting
    votingSystem: {
      type: String,
      default: "Quadratic Voting",
    },
    onlyTokenHolderCanVote: {
      type: Boolean,
    },
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
    votingTokenIdentifer: {
      type: String,
    },
    votingTokenName: {
      type: String,
    },
    blockchain: {
      type: String,
      default: "Cardano",
    },
    votingRoundName: {
      type: String,
    },
    votingRoundPurpose: {
      type: String,
    },
    snapbrilliaWalletAuth: {
      type: Boolean,
    },
    whitelistTokenIdentifier: {
      type: String,
    },
    whitelistTokenName: {
      type: String,
    },
    whitelistTokenBlockchain: {
      type: String,
    },
    uniqueVoters: {
      type: Number,
      default: 0,
    },
    proposalsSubmitted: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports.VotingRound = mongoose.model("VotingRound", VotingRoundSchema);
