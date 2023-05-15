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
  } catch (err) {
    console.log(err);
  }
};

const createChannelWithUsers = async (guild, user, botId, category) => {
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
  } catch (err) {
    console.log(err);
  }
};

const createChannelWithOwner = async (guild, user, botId, category) => {
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
      const serverIdExists = discordUserExists.serversUserIsIn.includes(
        member.guild.id
      );
      if (!serverIdExists) {
        discordUserExists.serversUserIsIn.push(member.guild.id);
        await discordUserExists.save();
      }
      return;
    }
    await DiscordUser.create({
      discordId: member.id,
      discordUsername: member.user.username,
      serversUserIsIn: [guild.id],
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

const createDiscordServer = async (guild, adminChannel) => {
  try {
    console.log(adminChannel);
    await DiscordServer.create({
      adminChannel: adminChannel,
      serverId: guild.id,
      serverOwner: guild.ownerId,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createCategory,
  createChannelWithUsers,
  createChannelWithOwner,
  createDiscordUser,
  createDiscordServer,
};
