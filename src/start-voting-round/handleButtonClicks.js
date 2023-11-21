const { DiscordServer } = require("../../models/discordServer.model");
const { VotingRound } = require("../../models/votingRound.model");
const { getImage } = require("../../utils/discordUtils");
const {
  getNotifyNewVotingRoundEmbed,
  getConfirmVotingRoundInfoEmbed,
} = require("./embeds");
const { getNameOfVotingRoundModal } = require("./modals");

const handleNameOfVotingRoundButton = async (interaction) => {
  const modal = getNameOfVotingRoundModal();
  await interaction.showModal(modal);
};

const handleConfirmVotingRoundInfoButton = async (interaction, client) => {
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  votingRound.status = "active";
  votingRound.save();

  const server = await DiscordServer.findOne({
    serverId: interaction.guildId,
  });

  const userChannels = server.userChannels;
  const adminChannel = server.adminChannel;
  const notifyNewVotingRoundEmbed = getNotifyNewVotingRoundEmbed(votingRound);
  const image = getImage();

  userChannels.forEach((channel) => {
    client.channels.cache.get(channel).send({
      embeds: [notifyNewVotingRoundEmbed],
      files: [image],
    });
  });

  const embed = getConfirmVotingRoundInfoEmbed();
  client.channels.cache.get(adminChannel).send({
    embeds: [embed],
    files: [image],
  });
};

module.exports = {
  handleNameOfVotingRoundButton,
  handleConfirmVotingRoundInfoButton,
};
