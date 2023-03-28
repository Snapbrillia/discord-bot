const { ChannelType, PermissionsBitField } = require("discord.js");
const {
  getMemberIntrouductionEmbed,
  getAdminIntroductionEmbed,
} = require("../sharedDiscordComponents/embeds");

const createChannelWithUsers = (guild, user, botId) => {
  try {
    guild.channels
      .create({
        name: "snapbrillia-voting-server",
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.id, // shortcut for @everyone role ID
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: user.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: botId,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      })
      .then((channel) => {
        channel.send({
          embeds: [getMemberIntrouductionEmbed()],
        });
      });
  } catch (err) {
    console.log(err);
  }
};

const createChannelWithOwner = (guild, user, botId) => {
  try {
    guild.channels
      .create({
        name: "snapbrillia-voting-server-config",
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.id, // shortcut for @everyone role ID
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: user.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: botId,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      })
      .then((channel) => {
        channel.send({
          embeds: [getAdminIntroductionEmbed()],
        });
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createChannelWithUsers,
  createChannelWithOwner,
};
