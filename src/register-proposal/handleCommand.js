const { VotingRound } = require("../../models/votingRound.model");
const { getImage } = require("../../utils/discordUtils");
const { getVotingRoundMenu } = require("./selectMenus");
const { getRegisterProposalEmbed } = require("./embeds");

const handleRegisterProposalCommand = async (interaction) => {
  const votingRound = await VotingRound.find({
    serverId: interaction.guildId,
    status: "active",
  });
  const image = getImage();

  if (votingRound.length === 0) {
    interaction.reply("No active voting round");
    return false;
  }

  const embed = getRegisterProposalEmbed();
  const menu = getVotingRoundMenu(votingRound);
  await interaction.reply({
    embeds: [embed],
    components: [menu],
    files: [image],
  });
};

module.exports = {
  handleRegisterProposalCommand,
};
