const { DiscordUser } = require("../models/discordUser.model");
const { Proposal } = require("../models/projectProposal.model");
const {
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
} = require("../sharedDiscordComponents/buttons");
const {
  getVerifyWalletEmbed,
  getNoWhitelistTokenFound,
} = require("../sharedDiscordComponents/embeds");

const numberRegex = /^[0-9]+$/;

// TODO: Fix findOne Method since servers user is in is an array
const checkIfVerified = async (interaction, votingRound) => {
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
  });
  if (votingRound.blockchain === "Cardano") {
    const hasTokenInWallet = discordUser.cardanoTokenInWallet.some(
      (token) =>
        token.tokenIdentifier === votingRound.tokenIdentiferOnBlockchain
    );
    if (!hasTokenInWallet) {
      interaction.reply({
        embeds: [getVerifyWalletEmbed("ADA", "Ethereum Waller")],
        components: [getVerifyCardanoWalletButton()],
      });
      return false;
    }
  } else {
    const hasTokenInWallet = discordUser.ethereumTokenInWallet.some(
      (token) =>
        token.tokenIdentifier === votingRound.tokenIdentiferOnBlockchain
    );
    if (!hasTokenInWallet) {
      interaction.reply({
        embeds: [
          getNoWhitelistTokenFound(votingRound.tokenName, "Ethereum Wallet"),
        ],
        components: [getVerifyEthereumWalletButton()],
      });
      return false;
    }
  }
  return true;
};

const checkIfUserHasParticipatedInRound = async (discordUser, votingRound) => {
  const proposal = await Proposal.find({
    votingRoundId: votingRound._id,
    discordId: discordUser.discordId,
  });
  const votes = await Votes.find({
    votingRoundId: votingRound._id,
    discordId: discordUser.discordId,
  });
  if (proposal.length > 0 || votes.length > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  numberRegex,
  checkIfVerified,
  checkIfUserHasParticipatedInRound,
};
