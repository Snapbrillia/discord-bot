const {
  getCardanoWalletAddressModal,
  getRegisterProposalModal,
  getVoteProposalModal,
  getDownVoteProposalModal,
  getSelectTokenModal,
  getEthereumWalletAddressModal,
  getNameOfVotingRoundModal,
  getEmailModal,
  getEmailOTPModal,
} = require("../sharedDiscordComponents/modals");
const {
  getConfirmVotingRoundInfoEmbed,
  getConfirmProposalEmbed,
  getConfirmVoteProposalEmbed,
  getNotifyNewVotingRoundEmbed,
} = require("../sharedDiscordComponents/embeds");
const { VotingRound } = require("../models/votingRound.model");
const { getImage } = require("../sharedDiscordComponents/image");
const { issueRegistrationCredential } = require("../utils/ssiUtils");
const { Proposal } = require("../models/projectProposal.model");
const { DiscordServer } = require("../models/discordServer.model");

const handleNameOfVotingRoundButton = async (interaction) => {
  const modal = getNameOfVotingRoundModal();
  await interaction.showModal(modal);
};

const handleSelectTokenButton = async (interaction) => {
  const modal = getSelectTokenModal();
  await interaction.showModal(modal);
};

const handleVerifyCardanoWalletButton = async (interaction) => {
  const modal = getCardanoWalletAddressModal();
  await interaction.showModal(modal);
};

const handleVerifyEthereumWalletButton = async (interaction) => {
  const modal = getEthereumWalletAddressModal();
  await interaction.showModal(modal);
};

const handleRegisterProposalButton = async (interaction) => {
  const modal = getRegisterProposalModal();
  await interaction.showModal(modal);
};

const handleVoteProposalButton = async (interaction) => {
  const modal = getVoteProposalModal();
  await interaction.showModal(modal);
};

const handleDownVoteProposalButton = async (interaction) => {
  const modal = getDownVoteProposalModal();
  await interaction.showModal(modal);
};

const handleConfirmVotingRoundInfoButton = async (interaction, client) => {
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  votingRound.status = "active";
  votingRound.save();

  const server = await DiscordServer.findOne({
    serverId: interaction.guildId,
  });

  const userChannels = server.userChannels;
  const notifyNewVotingRoundEmbed = getNotifyNewVotingRoundEmbed();

  userChannels.forEach((channel) => {
    client.channels.cache.get(channel).send({
      embeds: [notifyNewVotingRoundEmbed],
    });
  });

  const confirmVotingRoundInfoEmbed = getConfirmVotingRoundInfoEmbed();
  const image = getImage();
  return interaction.reply({
    embeds: [confirmVotingRoundInfoEmbed],
    files: [image],
  });
};

const handleConfirmRegisterProposalButton = async (interaction) => {
  const proposal = await Proposal.findOne({
    discordId: interaction.user.id,
    status: "pending",
  });

  await issueRegistrationCredential(proposal, interaction.user.id);

  proposal.status = "active";
  await proposal.save();

  const confirmRegisterProposalEmbed = getConfirmProposalEmbed();
  await interaction.reply({
    embeds: [confirmRegisterProposalEmbed],
  });
};

const handleConfirmVoteProposalButton = async (interaction) => {
  const confirmVoteProposalEmbed = getConfirmVoteProposalEmbed();
  await interaction.reply({
    embeds: [confirmVoteProposalEmbed],
  });
};

const handleEnterEmailButton = async (interaction) => {
  const modal = getEmailModal();
  await interaction.showModal(modal);
};

const handleEnterEmailOTPButton = async (interaction) => {
  const modal = getEmailOTPModal();
  await interaction.showModal(modal);
};

module.exports = {
  handleVerifyCardanoWalletButton,
  handleRegisterProposalButton,
  handleVoteProposalButton,
  handleNameOfVotingRoundButton,
  handleDownVoteProposalButton,
  handleSelectTokenButton,
  handleConfirmVotingRoundInfoButton,
  handleConfirmRegisterProposalButton,
  handleConfirmVoteProposalButton,
  handleVerifyEthereumWalletButton,
  handleEnterEmailButton,
  handleEnterEmailOTPButton,
};
