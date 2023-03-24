const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register-proposal")
    .setDescription("Register a proposal for the current voting round."),
};
