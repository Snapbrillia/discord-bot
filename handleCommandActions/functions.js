const {
  getPrimaryButton,
  getSelectVotingSystemButton,
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
  getVoteProposalButton,
} = require("../sharedDiscordComponents/buttons");
const { DiscordUser } = require("../models/discordUser.model.js");
const { VotingRound } = require("../models/votingRound.model.js");
const { checkIfVerified } = require("./utils");
const {
  getVotingSystemsEmbed,
  getQuadraticVotingResultsEmbed,
  getVerifyCardanoWalletEmbed,
  getRegisterProposalEmbed,
  getVerifyEthereumWalletEmbed,
  getVoteProposalEmbed,
  getDownVoteProposalEmbed,
  getAlreadyVerifiedCardanoWalletEmbed,
  getPendingVerifiedCardanoWalletEmbed,
  getAlreadyVerifiedEthereumWalletEmbed,
  getPendingVerifiedEthereumWalletEmbed,
  getHelpCommandEmbed,
} = require("../sharedDiscordComponents/embeds");
const {
  getVotingResult,
  getAllProposalsInfo,
} = require("../api/quadraticVoting.js");

const handleVerifyCardanoWalletCommand = async (interaction) => {
  const userVerified = await DiscordUser.findOne({
    discordId: interaction.user.id,
    serverId: interaction.guildId,
    cardanoIsVerified: true,
  });
  const alreadyVerifiedWalletEmbed = getAlreadyVerifiedCardanoWalletEmbed();
  if (userVerified) {
    await interaction.reply({
      embeds: [alreadyVerifiedWalletEmbed],
    });
    return;
  }

  const userPending = await DiscordUser.findOne({
    discordId: interaction.user.id,
    serverId: interaction.guildId,
    cardanoIsVerified: false,
  });

  if (userPending) {
    await interaction.reply({
      embeds: [getPendingVerifiedCardanoWalletEmbed()],
      components: [getVerifyCardanoWalletButton()],
    });
    return;
  }

  const verifyCardanoWalletButton = getVerifyCardanoWalletButton();
  const verifyCardanoWalletEmbed = getVerifyCardanoWalletEmbed();
  interaction.reply({
    embeds: [verifyCardanoWalletEmbed],
    components: [verifyCardanoWalletButton],
  });
};

const handleVerifyEthereumWalletCommand = async (interaction) => {
  const userVerified = await DiscordUser.findOne({
    discordId: interaction.user.id,
    serverId: interaction.guildId,
    ethereumIsVerified: true,
  });
  if (userVerified) {
    await interaction.reply({
      embeds: [getAlreadyVerifiedEthereumWalletEmbed()],
    });
    return;
  }

  const userPending = await DiscordUser.findOne({
    discordId: interaction.user.id,
    serverId: interaction.guildId,
    ethereumIsVerified: false,
  });

  if (userPending) {
    await interaction.reply({
      embeds: [getPendingVerifiedEthereumWalletEmbed()],
      components: [getVerifyEthereumWalletButton()],
    });
    return;
  }

  const verifyEthereumWalletButton = getVerifyEthereumWalletButton();
  const verifyEthereumWalletEmbed = getVerifyEthereumWalletEmbed();
  interaction.reply({
    embeds: [verifyEthereumWalletEmbed],
    components: [verifyEthereumWalletButton],
  });
};

const handleStartRoundCommand = async (interaction) => {
  const activeVotingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "active",
  });
  const serverOwner = await interaction.guild.fetchOwner();

  if (activeVotingRound) {
    return interaction.reply("There is already an active voting round");
  }
  if (serverOwner.user.id !== interaction.user.id) {
    return interaction.reply(
      `You must be the owner of this server to start a voting round.`
    );
  }

  const startVotingRoundButton = getSelectVotingSystemButton();

  const embed = getVotingSystemsEmbed();

  return interaction.reply({
    embeds: [embed],
    components: [startVotingRoundButton],
  });
};

// TODO: change this to find an active fund
const handleRegisterProposalCommand = async (interaction) => {
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
  });
  if (!votingRound) {
    interaction.reply("No active voting round");
    return false;
  }
  const isVerifiedAndActiveVotingRound = await checkIfVerified(
    interaction,
    votingRound
  );
  if (!isVerifiedAndActiveVotingRound) {
    return;
  }
  const registerProposalButton = getPrimaryButton(
    "registerProposal",
    "Register Proposal"
  );
  const registerProposalEmbed = getRegisterProposalEmbed();
  await interaction.reply({
    embeds: [registerProposalEmbed],
    components: [registerProposalButton],
  });
};

const handleVoteProposalCommand = async (interaction) => {
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
  });
  if (!votingRound) {
    return interaction.reply("No active voting round");
  }
  const isVerifiedAndActiveVotingRound = await checkIfVerified(
    interaction,
    votingRound
  );
  if (!isVerified) {
    return;
  }
  const voteProposalButton = getVoteProposalButton();
  const voteProposalEmbed = getVoteProposalEmbed();
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
