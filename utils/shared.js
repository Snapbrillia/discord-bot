const { DiscordUser } = require("../models/discordUser.model");
const { Proposal } = require("../models/projectProposal.model");
const {
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
} = require("../sharedDiscordComponents/buttons");
const { getVerifyWalletEmbed } = require("../sharedDiscordComponents/embeds");

const numberRegex = /^[0-9]+$/;

const formatDate = (date) => {
  const d = new Date(date);
  const day = `0${d.getDate()}`.slice(-2);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  return [year, month, day].join("-");
};

const getStartAndEndDate = (days) => {
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
  const formatedStartDate = formatDate(startDate);
  const formatedEndDate = formatDate(endDate);
  return { startDate: formatedStartDate, endDate: formatedEndDate };
};

const checkIfVerified = async (interaction, votingRound) => {
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
    serverId: interaction.guildId,
  });

  switch (votingRound.verificationMethod) {
    case "Cardano Wallet":
      if (discordUser.cardanoWallets.length <= 0) {
        interaction.reply({
          embeds: [getVerifyWalletEmbed("ADA")],
          components: [getVerifyCardanoWalletButton()],
        });
        return false;
      }
      break;
    case "Ethereum Wallet":
      if (discordUser.ethereumWallets.length <= 0) {
        interaction.reply({
          embeds: [getVerifyWalletEmbed("ETH")],
          components: [getVerifyEthereumWalletButton()],
        });
        return false;
      }
      break;
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
  formatDate,
  getStartAndEndDate,
  checkIfVerified,
  checkIfUserHasParticipatedInRound,
};
