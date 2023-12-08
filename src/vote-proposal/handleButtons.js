const { getVoteProposalQVFModal } = require("./modals");
const { getProposalVotedEmbed } = require("./embeds");
const { Votes } = require("../../models/votes.model");
const { VotingRound } = require("../../models/votingRound.model");
const { Proposal } = require("../../models/projectProposal.model");

const handleVoteProposalQVFButton = async (interaction) => {
  const modal = getVoteProposalQVFModal();
  await interaction.showModal(modal);
};

const handleConfirmVoteProposalButton = async (interaction) => {
  const userVote = await Votes.findOne({
    voterDiscordId: interaction.user.id,
    serverId: interaction.guildId,
    status: "pending",
  });

  const votingRoundId = userVote.votingRoundId;

  const votingRound = await VotingRound.findOne({
    _id: votingRoundId,
  });

  const userHasVoted = await Votes.findOne({
    voterDiscordId: interaction.user.id,
    serverId: interaction.guildId,
    votingRoundId,
    status: "active",
  });

  if (!userHasVoted) {
    votingRound.uniqueVoters += 1;
    await votingRound.save();
  }

  const proposal = await Proposal.findOne({
    _id: userVote.proposalId,
  });

  const userHasVotedProposal = await Votes.findOne({
    voterDiscordId: interaction.user.id,
    serverId: interaction.guildId,
    votingRoundId,
    proposalId: proposal._id,
    status: "active",
  });

  if (!userHasVotedProposal) {
    proposal.uniqueVoters += 1;
  }

  proposal.proposalWeight = Math.sqrt(userVote.percentageAllocated);
  await proposal.save();

  userVote.status = "active";
  await userVote.save();

  const confirmVoteProposalEmbed = getProposalVotedEmbed();
  await interaction.reply({
    embeds: [confirmVoteProposalEmbed],
  });
};

module.exports = {
  handleVoteProposalQVFButton,
  handleConfirmVoteProposalButton,
};
