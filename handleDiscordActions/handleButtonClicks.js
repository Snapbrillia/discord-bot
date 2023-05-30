const {
  getCardanoWalletAddressModal,
  getRegisterProposalModal,
  getVoteProposalModal,
  getDownVoteProposalModal,
  getSelectTokenModal,
  getEthereumWalletAddressModal,
  getNameOfVotingRoundModal,
  getEnterSnapbrilliaEmailCodeModal,
  getEnterSnapbrilliaPhoneCodeModal,
} = require("../sharedDiscordComponents/modals");
const {
  getConfirmVotingRoundInfoEmbed,
  getConfirmProposalEmbed,
  getConfirmVoteProposalEmbed,
} = require("../sharedDiscordComponents/embeds");
const { VotingRound } = require("../models/votingRound.model");
const { getImage } = require("../sharedDiscordComponents/image");
const { issueRegistrationCredential } = require("../utils/ssiUtils");
const { Proposal } = require("../models/projectProposal.model");

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

const handleEnterSnapbrilliaEmailCodeButton = async (interaction) => {
  const modal = getEnterSnapbrilliaEmailCodeModal();
  await interaction.showModal(modal);
};

const handleEnterSnapbrilliaPhoneCodeButton = async (interaction) => {
  const modal = getEnterSnapbrilliaPhoneCodeModal();
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
  handleEnterSnapbrilliaEmailCodeButton,
  handleEnterSnapbrilliaPhoneCodeButton,
};
