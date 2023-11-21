const { DiscordUser } = require("../models/discordUser.model");
const {
  PendingWalletVerification,
} = require("../models/pendingWalletVerification");
const { Proposal } = require("../models/projectProposal.model");
const {
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
} = require("../src/link-wallet/buttons");
const { getVerifyWalletEmbed } = require("../src/link-wallet/embeds");

const numberRegex = /^[0-9]+$/;

// TODO: Fix findOne Method since servers user is in is an array
const checkIfVerified = async (interaction, votingRound) => {
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
  });
  if (votingRound.blockchain === "Cardano") {
    const hasTokenInWallet = discordUser.cardanoTokensInWallet.some(
      (token) => token.tokenIdentifier === votingRound.votingTokenIdentifer
    );
    if (!hasTokenInWallet) {
      interaction.reply({
        embeds: [getVerifyWalletEmbed("ADA", "Cardano Wallet")],
        components: [getVerifyCardanoWalletButton()],
      });
      return false;
    }
  } else {
    const hasTokenInWallet = discordUser.ethereumTokensInWallet.some(
      (token) => token.tokenIdentifier === votingRound.votingTokenIdentifer
    );
    if (!hasTokenInWallet) {
      interaction.reply({
        embeds: [
          getVerifyWalletEmbed(votingRound.votingTokenName, "Ethereum Wallet"),
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
  } catch (err) {}
};

// helper functions
const formatDate = (date) => {
  const d = new Date(date);
  const day = `0${d.getUTCDate()}`.slice(-2);
  const year = d.getUTCFullYear();
  const month = `0${d.getUTCMonth() + 1}`.slice(-2);
  const hours = `0${d.getUTCHours()}`.slice(-2);
  const minutes = `0${d.getUTCMinutes()}`.slice(-2);
  const seconds = `0${d.getUTCSeconds()}`.slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} GMT`;
};

const getVotingRoundConfigurationText = (config) => {
  const {
    votingSystem,
    onChainVotes,
    onlyTokenHolderCanVote,
    votingTokenName,
    whitelistTokenName,
    snapbrilliaWalletAuth,
    roundDurationInDays,
    votingRoundName,
    votingRoundPurpose,
  } = config;

  let text = `🔧** Voting Round Info**🔧\n
      ** Voting System **: ${votingSystem}\n \n`;

  if (onChainVotes !== undefined) {
    text += `** Voting Method **: ${
      onChainVotes ? "Store votes on-chain" : "Store votes off-chain"
    }\n \n`;
  }
  if (votingTokenName) {
    text += `** Voting Token **: ${votingTokenName}\n \n`;
  }
  if (onlyTokenHolderCanVote !== undefined) {
    text += `** Participation Permissions **: ${
      onlyTokenHolderCanVote
        ? "Only people who hold a specific token can participate"
        : "Anybody can vote as long as they are verified"
    }\n \n`;
  }
  if (whitelistTokenName) {
    text += `** Whitelist Token **: ${whitelistTokenName}\n \n`;
  }
  if (snapbrilliaWalletAuth !== undefined) {
    text += `** Snapbrillia Wallet Auth **: ${
      snapbrilliaWalletAuth ? "Enabled" : "Disabled"
    }\n \n`;
  }
  if (roundDurationInDays) {
    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + roundDurationInDays * 24 * 60 * 60 * 1000
    );

    text += `** Voting Round Start**: ${formatDate(
      startDate
    )}\n\n ** Voting Round End **: ${formatDate(endDate)}\n\n`;
  }
  if (votingRoundName) {
    text += `** Voting Round Name **: ${votingRoundName}\n\n`;
  }
  if (votingRoundPurpose) {
    text += `** Voting Round Purpose **: ${votingRoundPurpose}\n\n`;
  }

  return text;
};

module.exports = {
  numberRegex,
  randomNumber,
  checkIfVerified,
  checkIfUserHasParticipatedInRound,
  removeDupilcateTokens,
  verifyUsers,
  formatDate,
  getVotingRoundConfigurationText,
};
