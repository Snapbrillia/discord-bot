const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refresh-assets")
    .setDescription("Refresh the assets you hold in your wallet"),
};
