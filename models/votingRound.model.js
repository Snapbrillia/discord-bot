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
    },
    onlyTokenHolderCanVote: {
      type: Boolean,
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
    tokenIdentiferOnBlockchain: {
      type: String,
    },
    tokenName: {
      type: String,
    },
    blockchain: {
      type: String,
    },
    votingRoundName: {
      type: String,
    },
    votingRoundDescription: {
      type: String,
    },
    storeVotesOnChain: {
      type: Boolean,
    },
    knowYourCustomerSSIEnabled: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports.VotingRound = mongoose.model("VotingRound", VotingRoundSchema);
