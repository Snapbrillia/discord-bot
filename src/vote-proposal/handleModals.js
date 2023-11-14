const { getConfirmVoteButton } = require("./buttons");
const { getVoteProposalInfoEmbed } = require("./embeds");

const handleVoteProposalModal = async (interaction, action) => {
  // const discordUser = await DiscordUser.findOne({
  //   discordId: interaction.user.id,
  //   serverId: interaction.guildId,
  // });
  // const votingRound = await VotingRound.findOne({
  //   serverId: interaction.guildId,
  //   status: "active",
  // });
  // const voteToAddress = await interaction.fields.getTextInputValue(
  //   "proposalWalletAddressInput"
  // );
  const percentageAllocated = await interaction.fields.getTextInputValue(
    "percentageAllocatedInput"
  );
  // let walletAddress = "";
  // if (votingRound.blockchain === "Ethereum") {
  //   walletAddress = discordUser.ethereumWalletAddress;
  // } else {
  //   walletAddress = discordUser.cardanoWalletAddress;
  // }
  // const voteProposalResponse = await voteToProposal(
  //   walletAddress,
  //   votingRound.votingRoundId,
  //   percentageAllocated,
  //   voteToAddress,
  //   action
  // );
  // if (voteProposalResponse.err) {
  //   interaction.reply(voteProposalResponse.message);
  //   return;
  // }
  const embed = getVoteProposalInfoEmbed(percentageAllocated);
  const confirmVoteProposalButton = getConfirmVoteButton();
  interaction.reply({
    embeds: [embed],
    components: [confirmVoteProposalButton],
  });
};

module.exports = {
  handleVoteProposalModal,
};
