const { ChannelType, PermissionsBitField } = require("discord.js");
const { DiscordServer } = require("../models/discordServer.model");
const { DiscordUser } = require("../models/discordUser.model");
const {
  getMemberIntrouductionEmbed,
  getAdminIntroductionEmbed,
} = require("../sharedDiscordComponents/embeds");

const createCategory = async (guild) => {
  try {
    const category = await guild.channels.create({
      name: "Snapbrillia Voting",
      type: ChannelType.GuildCategory,
    });
    return category.id;
  } catch (err) {}
};

const createChannelWithUser = async (guild, user, botId, category) => {
  try {
    const channel = await guild.channels.create({
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
    });
    await channel.setParent(category);
    channel.send({
      embeds: [getMemberIntrouductionEmbed()],
    });
    return channel.id;
  } catch (err) {}
};

const createChannelWithAdmins = async (guild, user, botId, category) => {
  try {
    const channel = await guild.channels.create({
      name: "snapbrillia-voting-server-admins",
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.id,
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
    });
    await channel.setParent(category);
    channel.send({
      embeds: [getAdminIntroductionEmbed()],
    });
    return channel.id;
  } catch (err) {}
};

//create discord user in database
const createDiscordUser = async (guild, member, userChannelId) => {
  try {
    const discordUserExists = await DiscordUser.findOne({
      discordId: member.id,
    });
    if (discordUserExists) {
      const serverIdExists = discordUserExists.serversUserIsIn.includes(
        member.guild.id
      );
      if (!serverIdExists) {
        discordUserExists.serversUserIsIn.push(member.guild.id);
        await discordUserExists.save();
        return;
      }
      return;
    }
    await DiscordUser.create({
      discordId: member.id,
      discordUsername: member.user.username,
      serversUserIsIn: [guild.id],
      ethereumTokensInWallet: [
        {
          tokenName: "ETH",
          tokenIdentifier: "ETH",
        },
      ],
      cardanoTokensInWallet: [
        {
          tokenName: "ADA",
          tokenIdentifier: "ADA",
        },
      ],
    });
  } catch (err) {}
};

const createDiscordServer = async (guild, adminChannel, userChannels) => {
  try {
    await DiscordServer.create({
      adminChannel: adminChannel,
      serverId: guild.id,
      serverOwner: guild.ownerId,
      userChannels: userChannels,
    });
  } catch (err) {}
};

module.exports = {
  createCategory,
  createChannelWithUser,
  createChannelWithAdmins,
  createDiscordUser,
  createDiscordServer,
};
