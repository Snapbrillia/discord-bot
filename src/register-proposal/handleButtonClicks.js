const { Proposal } = require("../../models/projectProposal.model");
const { getEmailModal, getEmailOTPModal } = require("./modals");
const { getProposalRegisteredEmbed } = require("./embeds");
const { getRegisterProposalModal } = require("./modals");

const handleConfirmRegisterProposalButton = async (interaction) => {
  const proposal = await Proposal.findOne({
    discordId: interaction.user.id,
    status: "pending",
  });

  // await issueRegistrationCredential(proposal, interaction.user.id);

  proposal.status = "active";
  await proposal.save();

  const embed = getProposalRegisteredEmbed();
  await interaction.reply({
    embeds: [embed],
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

const handleRegisterProposalButton = async (interaction) => {
  const modal = getRegisterProposalModal();
  await interaction.showModal(modal);
};

module.exports = {
  handleConfirmRegisterProposalButton,
  handleEnterEmailButton,
  handleEnterEmailOTPButton,
  handleRegisterProposalButton,
};
