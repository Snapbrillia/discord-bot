const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote-proposal")
    .setDescription("Vote for a proposal"),
};
