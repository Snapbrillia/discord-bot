const { DiscordServer } = require("../../models/discordServer.model");
const {
  getNoPermessionToStartVotingRoundEmbed,
  getVotingSystemsEmbed,
} = require("../../sharedDiscordComponents/embeds");
const { getImage } = require("../../sharedDiscordComponents/image");
const {
  getSelectVotingSystemMenu,
} = require("../../sharedDiscordComponents/selectMenu");

const handleStartRoundCommand = async (interaction) => {
  const server = await DiscordServer.findOne({
    serverId: interaction.guildId,
  });
  const image = getImage();

  if (interaction.channelId !== server.adminChannel) {
    const embed = getNoPermessionToStartVotingRoundEmbed();
    return interaction.reply({
      embeds: [embed],
      files: [image],
    });
  }

  const selectMenu = getSelectVotingSystemMenu();
  const embed = getVotingSystemsEmbed();

  return interaction.reply({
    embeds: [embed],
    components: [selectMenu],
    files: [image],
  });
};

module.exports = {
  handleStartRoundCommand,
};
