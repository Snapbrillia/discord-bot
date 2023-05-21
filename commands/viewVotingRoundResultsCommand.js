const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view-voting-round-info")
    .setDescription(
      "View the details of current voting round, current proposals, etc..."
    ),
};
