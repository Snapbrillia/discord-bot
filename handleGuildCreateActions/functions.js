const { ChannelType, PermissionsBitField } = require("discord.js");
const { DiscordUser } = require("../models/discordUser.model");
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

//create discord user in database
const createDiscordUser = async (guild, member) => {
  try {
    const discordUserExists = await DiscordUser.findOne({
      discordId: member.id,
    });
    if (discordUserExists) {
      const serverIdExists = discordUserExists.serverId.includes(
        member.guild.id
      );
      if (!serverIdExists) {
        discordUserExists.serverId.push(member.guild.id);
        await discordUserExists.save();
      }
      return;
    }
    await DiscordUser.create({
      discordId: member.id,
      discordUsername: member.user.username,
      serverId: [guild.id],
      ethereumTokenInWallet: [
        {
          tokenName: "ETH",
          tokenIdentifier: "ETH",
        },
      ],
      cardanoTokenInWallet: [
        {
          tokenName: "ADA",
          tokenIdentifier: "ADA",
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createChannelWithUsers,
  createChannelWithOwner,
  createDiscordUser,
};
