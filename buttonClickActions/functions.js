const {
  getCardanoWalletAddressModal,
  getRegisterProposalModal,
  getStartRoundModal,
  getVoteProposalModal,
  getDownVoteProposalModal,
  getVerificationMethodModal,
  getSelectTokenModal,
  getEthereumWalletAddressModal,
} = require("../shared/modals");
const {
  getConfirmVotingRoundInfoEmbed,
  getConfirmProposalEmbed,
  getConfirmVoteProposalEmbed,
} = require("../shared/embeds");

const handleStartRoundButton = async (interaction) => {
  if (interaction.guild.ownerId !== interaction.user.id)
    return interaction.reply("Only the server owner can start a voting round");

  const modal = getStartRoundModal();
  await interaction.showModal(modal);
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
  const confirmVotingRoundInfoEmbed = getConfirmVotingRoundInfoEmbed();
  await interaction.reply({
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
