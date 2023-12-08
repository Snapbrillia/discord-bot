const { DiscordServer } = require("../../models/discordServer.model");
const { DiscordUser } = require("../../models/discordUser.model");
const { VotingRound } = require("../../models/votingRound.model");
const { getImage } = require("../../utils/discordUtils");
const {
  getNoPermessionToStartVotingRoundEmbed,
  getCardanoVotingTokenEmbed,
} = require("./embeds");
const { getSelectTokenMenu } = require("./selectMenus");

const handleStartRoundCommand = async (interaction) => {
  const server = await DiscordServer.findOne({
    serverId: interaction.guildId,
  });
  const image = getImage();
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
  });
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });

  if (!votingRound) {
    await VotingRound.create({
      serverId: interaction.guildId,
      status: "pending",
    });
  }

  if (interaction.channelId !== server.adminChannel) {
    const embed = getNoPermessionToStartVotingRoundEmbed();
    return interaction.reply({
      embeds: [embed],
      files: [image],
    });
  }

  const embed = getCardanoVotingTokenEmbed();
  const selectMenu = getSelectTokenMenu(
    discordUser.cardanoTokensInWallet,
    "selectVotingTokenMenu"
  );

  return interaction.reply({
    embeds: [embed],
    components: [selectMenu],
    files: [image],
  });
};

module.exports = {
  handleStartRoundCommand,
};
