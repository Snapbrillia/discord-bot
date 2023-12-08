const { VotingRound } = require("../../models/votingRound.model");
const { getImage } = require("../../utils/discordUtils");
const { getVotingRoundsEmbed } = require("./embeds");
const { getVotingRoundsMenu } = require("./selectMenus");

const handleViewVotingRoundsCommand = async (interaction) => {
  const votingRounds = await VotingRound.find({
    serverId: interaction.guildId,
    status: "active",
  });

  const image = getImage();

  if (!votingRounds.length) {
    interaction.reply({
      content: "No active voting rounds",
      files: [image],
    });
    return false;
  }

  const embed = getVotingRoundsEmbed(votingRounds);
  const menu = getVotingRoundsMenu(votingRounds);
  await interaction.reply({
    embeds: [embed],
    components: [menu],
    files: [image],
  });
};

module.exports = {
  handleViewVotingRoundsCommand,
};
