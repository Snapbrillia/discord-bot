const { Proposal } = require("../../models/projectProposal.model");
const { Votes } = require("../../models/votes.model");
const { VotingRound } = require("../../models/votingRound.model");
const { getConfirmVoteButton } = require("./buttons");
const { getVoteProposalInfoEmbed } = require("./embeds");

const handleVoteProposalQVFModal = async (interaction) => {
  const percentageAllocated = await interaction.fields.getTextInputValue(
    "percentageAllocatedInput"
  );

  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "active",
  });

  const vote = await Votes.findOne({
    voterDiscordId: interaction.user.id,
    serverId: interaction.guildId,
    votingRoundId: votingRound._id,
    status: "pending",
  });

  vote.percentageAllocated = parseInt(percentageAllocated);
  await vote.save();

  const proposal = await Proposal.findOne({
    _id: vote.proposalId,
  });

  const embed = getVoteProposalInfoEmbed(
    votingRound,
    proposal,
    percentageAllocated
  );

  const confirmVoteProposalButton = getConfirmVoteButton();
  interaction.reply({
    embeds: [embed],
    components: [confirmVoteProposalButton],
  });
};

module.exports = {
  handleVoteProposalQVFModal,
};
