const {
  getPrimaryButton,
  getSelectVotingSystemButton,
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
  getVoteProposalButton,
} = require("../shared/buttons");
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
} = require("../shared/embeds");
const {
  getVotingResult,
  getAllProposalsInfo,
} = require("../api/quadraticVoting.js");

const handleVerifyCardanoWalletCommand = async (message) => {
  const userVerified = await DiscordUser.findOne({
    discordId: message.author.id,
    serverId: message.guildId,
    cardanoIsVerified: true,
  });
  const alreadyVerifiedWalletEmbed = getAlreadyVerifiedCardanoWalletEmbed();
  if (userVerified) {
    await message.reply({
      embeds: [alreadyVerifiedWalletEmbed],
    });
    return;
  }

  const userPending = await DiscordUser.findOne({
    discordId: message.author.id,
    serverId: message.guildId,
    cardanoIsVerified: false,
  });

  if (userPending) {
    await message.reply({
      embeds: [getPendingVerifiedCardanoWalletEmbed()],
      components: [getVerifyCardanoWalletButton()],
    });
    return;
  }

  const verifyCardanoWalletButton = getVerifyCardanoWalletButton();
  const verifyCardanoWalletEmbed = getVerifyCardanoWalletEmbed();
  message.reply({
    embeds: [verifyCardanoWalletEmbed],
    components: [verifyCardanoWalletButton],
  });
};

const handleVerifyEthereumWalletCommand = async (message) => {
  const userVerified = await DiscordUser.findOne({
    discordId: message.author.id,
    serverId: message.guildId,
    ethereumIsVerified: true,
  });
  if (userVerified) {
    await message.reply({
      embeds: [getAlreadyVerifiedEthereumWalletEmbed()],
    });
    return;
  }

  const userPending = await DiscordUser.findOne({
    discordId: message.author.id,
    serverId: message.guildId,
    ethereumIsVerified: false,
  });

  if (userPending) {
    await message.reply({
      embeds: [getPendingVerifiedEthereumWalletEmbed()],
      components: [getVerifyEthereumWalletButton()],
    });
    return;
  }

  const verifyEthereumWalletButton = getVerifyEthereumWalletButton();
  const verifyEthereumWalletEmbed = getVerifyEthereumWalletEmbed();
  message.reply({
    embeds: [verifyEthereumWalletEmbed],
    components: [verifyEthereumWalletButton],
  });
};

const handleStartRoundCommand = async (message) => {
  const activeVotingRound = await VotingRound.findOne({
    serverId: message.guildId,
    status: "active",
  });
  if (activeVotingRound) {
    return message.reply("There is already an active voting round");
  }
  if (message.guild.ownerId !== message.author.id) {
    return message.reply(
      `You must be the owner of this server to start a voting round.`
    );
  }

  const startVotingRoundButton = getSelectVotingSystemButton();

  const embed = getVotingSystemsEmbed();

  await message.reply({
    embeds: [embed],
    components: [startVotingRoundButton],
  });
};

// TODO: change this to find an active fund
const handleRegisterProposalCommand = async (message) => {
  const votingRound = await VotingRound.findOne({
    serverId: message.guildId,
  });
  if (!votingRound) {
    message.reply("No active voting round");
    return false;
  }
  const isVerifiedAndActiveVotingRound = await checkIfVerified(
    message,
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
  await message.reply({
    embeds: [registerProposalEmbed],
    components: [registerProposalButton],
  });
};

const handleVoteProposalCommand = async (message) => {
  const votingRound = await VotingRound.findOne({
    serverId: message.guildId,
  });
  if (!votingRound) {
    message.reply("No active voting round");
    return false;
  }
  const isVerifiedAndActiveVotingRound = await checkIfVerified(
    message,
    votingRound
  );
  if (!isVerifiedAndActiveVotingRound) {
    return;
  }
  const voteProposalButton = getVoteProposalButton();
  const voteProposalEmbed = getVoteProposalEmbed();
  await message.reply({
    embeds: [voteProposalEmbed],
    components: [voteProposalButton],
  });
};

const handleDownVoteProposalCommand = async (message) => {
  const votingRound = await VotingRound.findOne({
    serverId: message.guildId,
  });
  const isVerifiedAndActiveVotingRound = await checkIfVerified(message);
  if (!isVerifiedAndActiveVotingRound) {
    return;
  }
  const voteProposalButton = getPrimaryButton(
    "downVoteProposal",
    "Down Vote Proposal"
  );
  const downVoteProposalEmbed = getDownVoteProposalEmbed();
  await message.reply({
    embeds: [downVoteProposalEmbed],
    components: [voteProposalButton],
  });
};

const handleGetVotingRoundResultsCommand = async (message) => {
  const votingRoundInfo = await getVotingResult();
  const projectInfo = await getAllProposalsInfo();
  const embed = getQuadraticVotingResultsEmbed(votingRoundInfo, projectInfo);
  message.reply({
    embeds: [embed],
  });
};

const handleHelpCommand = async (message) => {
  await message.reply({
    content: `**Commands**\n
    **/verify** - Verify your wallet address\n
    **/register-proposal** - Register your proposal\n
    **/vote-proposal** - Vote for a proposal\n
    **/down-vote-proposal** - Down vote a proposal\n
    **/help** - Show this message\n`,
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
