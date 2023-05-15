const {
  getCardanoWalletAddressModal,
  getRegisterProposalModal,
  getStartRoundModal,
  getVoteProposalModal,
  getDownVoteProposalModal,
  getVerificationMethodModal,
  getSelectTokenModal,
  getEthereumWalletAddressModal,
  getNameOfVotingRoundModal,
  getVerifySSIEmailModal,
  getEnterSSIEmailCodeModal,
  getEnterSSIPhoneNumberCodeModal,
  getEnterSSIPhoneCodeModal,
} = require("../sharedDiscordComponents/modals");
const {
  getConfirmVotingRoundInfoEmbed,
  getConfirmProposalEmbed,
  getConfirmVoteProposalEmbed,
} = require("../sharedDiscordComponents/embeds");
const { VotingRound } = require("../models/votingRound.model");
const { initateFund } = require("../api/quadraticVoting");
const { getImage } = require("../sharedDiscordComponents/image");
const { issueCredentialEmailAndPhoneCredential } = require("../utils/ssiUtils");

const handleStartRoundButton = async (interaction) => {
  console.log("handleStartRoundButton");
};

const handleNameOfVotingRoundButton = async (interaction) => {
  const modal = getNameOfVotingRoundModal();
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
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  votingRound.status = "active";
  votingRound.save();
  const confirmVotingRoundInfoEmbed = getConfirmVotingRoundInfoEmbed();
  const image = getImage();
  return interaction.reply({
    embeds: [confirmVotingRoundInfoEmbed],
    files: [image],
  });
};

const handleConfirmRegisterProposalButton = async (interaction) => {
  await createProposalInDatabase(interaction);
  await issueCredentialEmailAndPhoneCredential(interaction.user.id);

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

const hanldeVerifySSIEmailButton = async (interaction) => {
  const modal = getVerifySSIEmailModal();
  await interaction.showModal(modal);
};

const handleEnterSSIEmailVerificationButton = async (interaction) => {
  const modal = getEnterSSIEmailCodeModal();
  await interaction.showModal(modal);
};

const handleEnterSSIPhoneVerificationButton = async (interaction) => {
  const modal = getEnterSSIPhoneNumberCodeModal();
  await interaction.showModal(modal);
};

const handleEnterSSIPhoneCodeButton = async (interaction) => {
  const modal = getEnterSSIPhoneCodeModal();
  await interaction.showModal(modal);
};

module.exports = {
  handleVerifyCardanoWalletButton,
  handleRegisterProposalButton,
  handleStartRoundButton,
  handleVoteProposalButton,
  handleNameOfVotingRoundButton,
  handleDownVoteProposalButton,
  handleVerificationMethodButton,
  handleSelectTokenButton,
  handleConfirmVotingRoundInfoButton,
  handleConfirmRegisterProposalButton,
  handleConfirmVoteProposalButton,
  handleVerifyEthereumWalletButton,
  hanldeVerifySSIEmailButton,
  handleEnterSSIEmailVerificationButton,
  handleEnterSSIPhoneVerificationButton,
  handleEnterSSIPhoneCodeButton,
};
