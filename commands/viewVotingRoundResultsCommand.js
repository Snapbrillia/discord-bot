const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view-voting-round-info")
    .setDescription("View current voting round info"),
};
