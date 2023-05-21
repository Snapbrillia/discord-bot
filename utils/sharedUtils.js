const { DiscordUser } = require("../models/discordUser.model");
const {
  PendingWalletVerification,
} = require("../models/pendingWalletVerification");
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
    const hasTokenInWallet = discordUser.cardanoTokensInWallet.some(
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
    const hasTokenInWallet = discordUser.ethereumTokensInWallet.some(
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

const removeDupilcateTokens = (currentTokens, tokensInWallet) => {
  let uniqueTokens = [...currentTokens];
  for (let i = 0; i < tokensInWallet.length; i++) {
    const token = tokensInWallet[i];
    const tokenExists = uniqueTokens.some(
      (uniqueToken) => uniqueToken.tokenIdentifier === token.tokenIdentifier
    );
    if (!tokenExists) {
      uniqueTokens.push(token);
    }
  }
  return uniqueTokens;
};

const randomNumber = (min, max) => {
  const int = Math.floor(Math.random() * (max - min)) + min;
  return int / 1000000;
};

const verifyUsers = async (
  blockchain,
  walletField,
  tokenField,
  checkFn,
  getTokensFn
) => {
  try {
    const pendingVerification = await PendingWalletVerification.find({
      blockchain: blockchain,
    });
    if (pendingVerification.length === 0) {
      return;
    }

    for (let i = 0; i < pendingVerification.length; i++) {
      const { walletAddress, sendAmount, discordId } = pendingVerification[i];
      const verified = await checkFn(walletAddress, sendAmount);

      if (verified) {
        const discordUser = await DiscordUser.findOne({ discordId });
        const tokensInWallet = await getTokensFn(walletAddress);
        const uniqueTokens = removeDupilcateTokens(
          discordUser[tokenField],
          tokensInWallet
        );
        discordUser[tokenField] = uniqueTokens;
        discordUser[walletField].push(walletAddress);
        await discordUser.save();
        await PendingWalletVerification.deleteOne({
          _id: pendingVerification[i]._id,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  numberRegex,
  randomNumber,
  checkIfVerified,
  checkIfUserHasParticipatedInRound,
  removeDupilcateTokens,
  verifyUsers,
};
