const { getVoteProposalModal } = require("./modals");
const { getProposalVotedEmbed } = require("./embeds");

const handleVoteProposalButton = async (interaction) => {
  const modal = getVoteProposalModal();
  await interaction.showModal(modal);

  //   const percentageAllocated = 10;
  //   const embed = getVoteProposalInfoEmbed(percentageAllocated);
  //   const confirmVoteButton = getPrimaryButton(
  //     "confirmVoteProposalButton",
  //     "Confirm Vote"
  //   );
  //   interaction.reply({
  //     embeds: [embed],
  //     components: [confirmVoteButton],
  //   });
};

const handleConfirmVoteProposalButton = async (interaction) => {
  const confirmVoteProposalEmbed = getProposalVotedEmbed();
  await interaction.reply({
    embeds: [confirmVoteProposalEmbed],
  });
};

module.exports = {
  handleVoteProposalButton,
  handleConfirmVoteProposalButton,
};
