const {
  getPrimaryButton,
  getSelectVotingSystemButton,
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
  getVoteProposalButton,
  getRegisterProposalButton,
} = require("../sharedDiscordComponents/buttons");
const { DiscordUser } = require("../models/discordUser.model.js");
const { VotingRound } = require("../models/votingRound.model.js");
const { checkIfVerified } = require("../utils/shared");
const {
  getVotingSystemsEmbed,
  getQuadraticVotingResultsEmbed,
  getVerifyWalletEmbed,
  getRegisterProposalEmbed,
  getVerifyEthereumWalletEmbed,
  getVoteProposalEmbed,
  getDownVoteProposalEmbed,
  getAlreadyVerifiedCardanoWalletEmbed,
  getPendingVerifiedCardanoWalletEmbed,
  getAlreadyVerifiedEthereumWalletEmbed,
  getPendingVerifiedEthereumWalletEmbed,
  getHelpCommandEmbed,
} = require("../sharedDiscordComponents/embeds.js");
const {
  getSelectVotingSystemMenu,
  getListOfProposalMenu,
} = require("../sharedDiscordComponents/selectMenu.js");
const {
  getVotingResult,
  getAllProposalsInfo,
} = require("../api/quadraticVoting.js");
const { getImage } = require("../sharedDiscordComponents/image");
const { ActionRow } = require("discord.js");
const { ActionRowBuilder } = require("@discordjs/builders");

const handleVerifyCardanoWalletCommand = async (interaction) => {
  const verifyCardanoWalletEmbed = getVerifyWalletEmbed("ADA");
  const verifyCardanoWalletButton = getVerifyCardanoWalletButton();
  const image = getImage();

  interaction.reply({
    embeds: [verifyCardanoWalletEmbed],
    components: [verifyCardanoWalletButton],
    files: [image],
  });
};

const handleVerifyEthereumWalletCommand = async (interaction) => {
  const verifyEthereumWalletEmbed = getVerifyWalletEmbed("ETH");
  const verifyEthereumWalletButton = getVerifyEthereumWalletButton();
  const image = getImage();

  interaction.reply({
    embeds: [verifyEthereumWalletEmbed],
    components: [verifyEthereumWalletButton],
    files: [image],
  });
};

const handleStartRoundCommand = async (interaction) => {
  const serverOwner = await interaction.guild.fetchOwner();
  if (serverOwner.user.id !== interaction.user.id) {
    return interaction.reply(
      `You must be the owner of this server to start a voting round.`
    );
  }
  const selectMenu = getSelectVotingSystemMenu();
  const embed = getVotingSystemsEmbed();
  const image = getImage();
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
  const listOfProposalMenu = getListOfProposalMenu(votingRound);
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
  const listOfProposalMenu = getListOfProposalMenu(votingRound);
  await interaction.reply({
    embeds: [voteProposalEmbed],
    components: [voteProposalButton],
  });
};

const handleDownVoteProposalCommand = async (interaction) => {
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
  });
  if (!votingRound) {
    return interaction.reply("No active voting round");
  }
  const isVerified = await checkIfVerified(message);
  if (!isVerified) {
    return;
  }
  const voteProposalButton = getPrimaryButton(
    "downVoteProposal",
    "Down Vote Proposal"
  );
  const downVoteProposalEmbed = getDownVoteProposalEmbed();
  await interaction.reply({
    embeds: [downVoteProposalEmbed],
    components: [voteProposalButton],
  });
};

const handleGetVotingRoundResultsCommand = async (interaction) => {
  const votingRoundInfo = await getVotingResult();
  const projectInfo = await getAllProposalsInfo();
  const embed = getQuadraticVotingResultsEmbed(votingRoundInfo, projectInfo);
  interaction.reply({
    embeds: [embed],
  });
};

const handleHelpCommand = async (interaction) => {
  const helpCommandEmbed = getHelpCommandEmbed();
  await interaction.reply({
    embeds: [helpCommandEmbed],
  });
};

module.exports = {
  handleVerifyCardanoWalletCommand,
  handleRegisterProposalCommand,
  handleStartRoundCommand,
  handleVoteProposalCommand,
  handleDownVoteProposalCommand,
  handleGetVotingRoundResultsCommand,
  handleHelpCommand,
  handleVerifyEthereumWalletCommand,
};
