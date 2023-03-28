const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify-cardano-wallet")
    .setDescription("Verify your Cardano wallet address."),
};
