const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("down-vote-proposal")
    .setDescription("Down vote a proposal in the current voting round."),
};
