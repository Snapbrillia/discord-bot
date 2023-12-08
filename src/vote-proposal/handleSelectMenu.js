const { Proposal } = require("../../models/projectProposal.model");
const { Votes } = require("../../models/votes.model");
const { VotingRound } = require("../../models/votingRound.model");
const { getImage } = require("../../utils/discordUtils");
const { getVoteProposalQVFButton } = require("./buttons");
const { getSelectProposalEmbed, getEnterVoteQVFEmbed } = require("./embeds");
const { getProposalDropdownMenu } = require("./selectMenus");

const handleVoteVotingRoundMenu = async (interaction) => {
  const votingRoundId = interaction.values[0];

  const proposals = await Proposal.find({
    votingRoundId,
    status: "active",
  });

  const vote = await Votes.findOne({
    voterDiscordId: interaction.user.id,
    serverId: interaction.guildId,
    votingRoundId,
    status: "pending",
  });

  const votingRound = await VotingRound.findOne({
    _id: votingRoundId,
  });

  if (vote) {
    vote.votingRoundId = votingRoundId;
    await vote.save();
  } else {
    await Votes.create({
      voterDiscordId: interaction.user.id,
      serverId: interaction.guildId,
      votingRoundId,
      status: "pending",
    });
  }

  const embed = getSelectProposalEmbed(votingRound);
  const dropdown = getProposalDropdownMenu(proposals);
  const image = getImage();

  interaction.update({
    embeds: [embed],
    files: [image],
    components: [dropdown],
  });
};

const handleVoteProposalMenu = async (interaction) => {
  const proposalId = interaction.values[0];

  const proposal = await Proposal.findOne({
    _id: proposalId,
  });

  const votingRound = await VotingRound.findOne({
    _id: proposal.votingRoundId,
  });

  const vote = await Votes.findOne({
    voterDiscordId: interaction.user.id,
    serverId: interaction.guildId,
    status: "pending",
  });

  vote.proposalId = proposalId;
  await vote.save();

  const embed = getEnterVoteQVFEmbed(votingRound, proposal);
  const button = getVoteProposalQVFButton();

  interaction.update({
    embeds: [embed],
    components: [button],
  });
};

module.exports = {
  handleVoteVotingRoundMenu,
  handleVoteProposalMenu,
};
