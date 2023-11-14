const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

const getRegisterProposalModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("registerProposalModal")
    .setTitle("Confirm Register Proposal");

  const proposalNameInput = new TextInputBuilder()
    .setCustomId("proposalNameInput")
    .setLabel("Please enter your proposal name")
    .setStyle(TextInputStyle.Short);

  const proposalDescriptionInput = new TextInputBuilder()
    .setCustomId("proposalDescriptionInput")
    .setLabel("Please enter your proposal description")
    .setStyle(TextInputStyle.Paragraph);

  const firstActionRow = new ActionRowBuilder().addComponents(
    proposalNameInput
  );

  const secondActionRow = new ActionRowBuilder().addComponents(
    proposalDescriptionInput
  );

  modal.addComponents(firstActionRow, secondActionRow);
  return modal;
};

module.exports = {
  getRegisterProposalModal,
};
