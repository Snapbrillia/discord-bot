const { ChannelType, PermissionsBitField } = require("discord.js");
const { DiscordServer } = require("../../models/discordServer.model");
const { DiscordUser } = require("../../models/discordUser.model");
const {
  getMemberIntroductionEmbed,
  getAdminIntroductionEmbed,
} = require("./embeds");

const createVotingServer = async (guild) => {
  try {
    const channel = await guild.channels.create({
      name: "snapbrillia-voting-server",
      type: ChannelType.GuildText,
    });
    channel.send({
      embeds: [getMemberIntroductionEmbed()],
    });
    return channel.id;
  } catch (err) {
    console.log(err);
  }
};

const createChannelWithAdmins = async (guild, userId, botId) => {
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
          id: userId,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: botId,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
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
  } catch (err) {
    console.log(err);
  }
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
  createVotingServer,
  createChannelWithAdmins,
  createDiscordUser,
  createDiscordServer,
};
