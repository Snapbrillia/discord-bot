const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

const getVoteProposalQVFModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("voteProposalQVFModal")
    .setTitle("Vote Proposal");

  const percentageAllocatedInput = new TextInputBuilder()
    .setCustomId("percentageAllocatedInput")
    .setLabel("The percentage of voting power to allocate")
    .setStyle(TextInputStyle.Short);

  const secondActionRow = new ActionRowBuilder().addComponents(
    percentageAllocatedInput
  );

  modal.addComponents(secondActionRow);
  return modal;
};

module.exports = {
  getVoteProposalQVFModal,
};
