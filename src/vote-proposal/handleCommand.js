const { VotingRound } = require("../../models/votingRound.model");
const { getVotingRoundMenu } = require("./selectMenus");
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

  const embed = getVoteProposalSelectVotingRoundEmbed();
  const menu = getVotingRoundMenu(votingRound);
  await interaction.reply({
    embeds: [embed],
    components: [menu],
  });
};

module.exports = {
  handleVoteProposalCommand,
};
