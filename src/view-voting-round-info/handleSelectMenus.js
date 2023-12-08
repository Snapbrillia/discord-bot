const { Proposal } = require("../../models/projectProposal.model");
const { VotingRound } = require("../../models/votingRound.model");
const { getImage } = require("../../utils/discordUtils");
const { getVotingRoundInfoEmbed } = require("./embeds");

const handleViewVotingRoundsMenu = async (interaction) => {
  const votingRoundId = interaction.values[0];

  const votingRound = await VotingRound.findOne({
    _id: votingRoundId,
  });

  const proposals = await Proposal.find({
    votingRoundId,
    status: "active",
  });

  const votingRoundInfoEmbed = getVotingRoundInfoEmbed(votingRound, proposals);

  const image = getImage();
  await interaction.reply({ embeds: [votingRoundInfoEmbed], files: [image] });
};

module.exports = {
  handleViewVotingRoundsMenu,
};
