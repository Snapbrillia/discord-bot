const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-voting-round-results")
    .setDescription("Get the results of the current voting round."),
};
