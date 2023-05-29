const { DiscordUser } = require("../models/discordUser.model.js");
const { VotingRound } = require("../models/votingRound.model.js");
const { checkIfVerified } = require("../utils/sharedUtils");
const {
  getVotingSystemsEmbed,
  getQuadraticVotingResultsEmbed,
  getVerifyWalletEmbed,
  getRegisterProposalEmbed,
  getLinkWalletEmbed,
  getVoteProposalEmbed,
  getNoPermessionToStartVotingRoundEmbed,
  getDownVoteProposalEmbed,
  getAlreadyVerifiedCardanoWalletEmbed,
  getPendingVerifiedCardanoWalletEmbed,
  getAlreadyVerifiedEthereumWalletEmbed,
  getPendingVerifiedEthereumWalletEmbed,
  getHelpCommandEmbed,
  getWalletLinkedSuccessfullyEmbed,
  getViewPersonalInfoEmbed,
} = require("../sharedDiscordComponents/embeds.js");
const {
  getSelectVotingSystemMenu,
  getListOfProposalMenu,
  getSelectLinkWalletMenu,
  getListOfVotingRoundMenu,
  getViewPeronalInfoMenu,
} = require("../sharedDiscordComponents/selectMenu.js");
const { getImage } = require("../sharedDiscordComponents/image");
const { ActionRow } = require("discord.js");
const { ActionRowBuilder } = require("@discordjs/builders");
const { DiscordServer } = require("../models/discordServer.model");
const { Proposal } = require("../models/projectProposal.model");

const handleLinkWalletCommand = async (interaction) => {
  const linkWalletEmbed = getLinkWalletEmbed();
  const linkWalletMenu = getSelectLinkWalletMenu();
  const image = getImage();

  return interaction.reply({
    embeds: [linkWalletEmbed],
    components: [linkWalletMenu],
    files: [image],
  });
};

const handleStartRoundCommand = async (interaction) => {
  const server = await DiscordServer.findOne({
    serverId: interaction.guildId,
  });
  const image = getImage();
  if (interaction.channelId !== server.adminChannel) {
    const embed = getNoPermessionToStartVotingRoundEmbed();
    return interaction.reply({
      embeds: [embed],
      files: [image],
    });
  }
  const selectMenu = getSelectVotingSystemMenu();
  const embed = getVotingSystemsEmbed();
  return interaction.reply({
    embeds: [embed],
    components: [selectMenu],
    files: [image],
  });
};

// TODO: change this to find an active fund
const handleRegisterProposalCommand = async (interaction) => {
  const votingRound = await VotingRound.find({
    serverId: interaction.guildId,
    status: "active",
  });
  if (!votingRound) {
    interaction.reply("No active voting round");
    return false;
  }
  const registerProposalEmbed = getRegisterProposalEmbed();
  const image = getImage();

  const listOfProposalMenu = getListOfVotingRoundMenu(votingRound);
  await interaction.reply({
    embeds: [registerProposalEmbed],
    components: [listOfProposalMenu],
    files: [image],
  });
};

const handleVoteProposalCommand = async (interaction) => {
  const votingRound = await VotingRound.find({
    serverId: interaction.guildId,
    status: "active",
  });
  if (!votingRound) {
    interaction.reply("No active voting round");
    return false;
  }

  const voteProposalEmbed = getVoteProposalEmbed();
  const listOfProposalMenu = getListOfVotingRoundMenu(votingRound);
  await interaction.reply({
    embeds: [voteProposalEmbed],
    components: [listOfProposalMenu],
  });
};

const handleGetVotingRoundResultsCommand = async (interaction) => {
  const votingRoundInfo = await getVotingResult();
  const projectInfo = await getAllProposalsInfo();
  const embed = getQuadraticVotingResultsEmbed(votingRoundInfo, projectInfo);
  return interaction.reply({
    embeds: [embed],
  });
};

const handleHelpCommand = async (interaction) => {
  const helpCommandEmbed = getHelpCommandEmbed();
  return interaction.reply({
    embeds: [helpCommandEmbed],
  });
};

const handleViewPersonalInfoCommand = async (interaction) => {
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
  });
  const embed = getViewPersonalInfoEmbed();
  const image = getImage();
  const personalInfoMenu = getViewPeronalInfoMenu();
  return interaction.reply({
    embeds: [embed],
    files: [image],
    components: [personalInfoMenu],
  });
};

module.exports = {
  handleLinkWalletCommand,
  handleRegisterProposalCommand,
  handleStartRoundCommand,
  handleVoteProposalCommand,
  handleGetVotingRoundResultsCommand,
  handleHelpCommand,
  handleViewPersonalInfoCommand,
};
