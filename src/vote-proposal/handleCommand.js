const { VotingRound } = require("../../models/votingRound.model");
const { getListOfVotingRoundMenu } = require("../other/menus");
const { getVoteProposalSelectVotingRoundEmbed } = require("./embeds");

const handleVoteProposalCommand = async (interaction) => {
  const votingRound = await VotingRound.find({
    serverId: interaction.guildId,
    status: "active",
  });

  if (!votingRound) {
    interaction.reply("No active voting round");
    return false;
  }

  const voteProposalEmbed = getVoteProposalSelectVotingRoundEmbed();
  const listOfProposalMenu = getListOfVotingRoundMenu(votingRound, "vote");
  await interaction.reply({
    embeds: [voteProposalEmbed],
    components: [listOfProposalMenu],
  });
};

module.exports = {
  handleVoteProposalCommand,
};
