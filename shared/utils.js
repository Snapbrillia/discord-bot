const { EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

// helper functions
const formatDate = (date) => {
  const d = new Date(date);
  const day = `0${d.getDate()}`.slice(-2);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  return [year, month, day].join("-");
};

const createEmbed = (title, description) => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setAuthor({
      name: "Snapbrillia",
      url: "https://snapbrillia.com",
      iconURL: `attachment://snapicon.png`,
    })
    .setThumbnail(`attachment://snapicon.png`)
    .setColor("#a900a6");
  return embed;
};

const getVotingRoundConfigurationText = (config) => {
  const {
    votingSystem,
    onChainVotes,
    onlyTokenHolderCanVote,
    blockchain,
    tokenName,
    snapbrilliaWalletAuth,
    roundDuration,
    votingRoundName,
    votingRoundPurpose,
  } = config;

  let text = `🔧** Current configuration of voting round **🔧\n
      ** Voting System **: ${votingSystem}\n `;

  if (onChainVotes !== undefined) {
    text += `** Voting Method **: ${
      onChainVotes ? "Store votes on-chain" : "Store votes off-chain"
    }\n`;
  }
  if (onlyTokenHolderCanVote !== undefined) {
    text += `** Participation Permissions **: ${
      onlyTokenHolderCanVote
        ? "Only people who hold a specific token can participate"
        : "Anybody can vote as long as they are verified"
    }\n`;
  }
  if (blockchain) {
    text += `** Blockchain **: ${blockchain}\n`;
  }
  if (tokenName) {
    text += `** Token Used **: ${tokenName}\n`;
  }
  if (snapbrilliaWalletAuth !== undefined) {
    text += `** Snapbrillia Wallet Auth **: ${
      snapbrilliaWalletAuth ? "Enabled" : "Disabled"
    }\n`;
  }
  if (roundDuration) {
    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + roundDuration * 24 * 60 * 60 * 1000
    );
    text += `** Voting Round Start**: ${formatDate(
      startDate
    )}\n ** Voting Round End **: ${formatDate(endDate)}\n`;
  }
  if (votingRoundName) {
    text += `** Voting Round Name **: ${votingRoundName}\n`;
  }
  if (votingRoundPurpose) {
    text += `** Voting Round Purpose **: ${votingRoundPurpose}\n`;
  }

  return text;
};

const buildActionRow = (selectMenu, placeholder, id) => {
  const actionRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(id)
      .setPlaceholder(placeholder)
      .addOptions(selectMenu)
  );
  return actionRow;
};

module.exports = {
  createEmbed,
  getVotingRoundConfigurationText,
  buildActionRow,
};
