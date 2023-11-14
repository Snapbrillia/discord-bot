const { VotingRound } = require("../../models/votingRound.model");
const { getImage } = require("../../utils/discordUtils");
const { getListOfVotingRoundMenu } = require("../other/menus");
const { getRegisterProposalEmbed } = require("./embeds");

const handleRegisterProposalCommand = async (interaction) => {
  const votingRound = await VotingRound.find({
    serverId: interaction.guildId,
    status: "active",
  });
  if (!votingRound) {
    interaction.reply("No active voting round");
    return false;
  }
  const embed = getRegisterProposalEmbed();
  const image = getImage();

  const menu = getListOfVotingRoundMenu(votingRound);
  await interaction.reply({
    embeds: [embed],
    components: [menu],
    files: [image],
  });
};

module.exports = {
  handleRegisterProposalCommand,
};
