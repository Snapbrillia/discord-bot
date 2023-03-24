const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify-ethereum-wallet")
    .setDescription("Verify your Ethereum wallet address."),
};
