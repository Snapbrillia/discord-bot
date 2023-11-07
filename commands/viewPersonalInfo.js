const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view-personal-info")
    .setDescription(
      "View your linked wallets, previous participation in voting rounds, and more"
    ),
};
