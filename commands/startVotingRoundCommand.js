const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start-voting-round")
    .setDescription("Start a voting round."),
};
