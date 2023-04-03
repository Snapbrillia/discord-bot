const {
  getCardanoWalletAddressModal,
  getRegisterProposalModal,
  getStartRoundModal,
  getVoteProposalModal,
  getDownVoteProposalModal,
  getVerificationMethodModal,
  getSelectTokenModal,
  getEthereumWalletAddressModal,
} = require("../sharedDiscordComponents/modals");
const {
  getConfirmVotingRoundInfoEmbed,
  getConfirmProposalEmbed,
  getConfirmVoteProposalEmbed,
} = require("../sharedDiscordComponents/embeds");
const { VotingRound } = require("../models/votingRound.model");
const { initateFund } = require("../api/quadraticVoting");

const handleStartRoundButton = async (interaction) => {
  console.log("handleStartRoundButton");
};

const handleVerificationMethodButton = async (
  interaction,
  isWalletVerification
) => {
  const modal = getVerificationMethodModal(isWalletVerification);
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

const handleConfirmVotingRoundInfoButton = async (interaction) => {
  const activeVotingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "active",
  });
  if (activeVotingRound) {
    return interaction.reply({
      content: "There is already an active voting round",
      ephemeral: true,
    });
  }
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  const response = await initateFund(
    interaction.guildId,
    votingRound.roundDurationInDays,
    votingRound.assetIdentifierOnChain,
    votingRound.blockchain
  );
  if (response.error) {
    return interaction.reply({
      content: response.message,
      ephemeral: true,
    });
  }
  votingRound.status = "active";
  votingRound.votingRoundId = response.votingRoundId;
  votingRound.save();
  const confirmVotingRoundInfoEmbed = getConfirmVotingRoundInfoEmbed();
  return interaction.reply({
    embeds: [confirmVotingRoundInfoEmbed],
  });
};

const handleConfirmRegisterProposalButton = async (interaction) => {
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

module.exports = {
  handleVerifyCardanoWalletButton,
  handleRegisterProposalButton,
  handleStartRoundButton,
  handleVoteProposalButton,
  handleDownVoteProposalButton,
  handleVerificationMethodButton,
  handleSelectTokenButton,
  handleConfirmVotingRoundInfoButton,
  handleConfirmRegisterProposalButton,
  handleConfirmVoteProposalButton,
  handleVerifyEthereumWalletButton,
};
