const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("link-wallets")
    .setDescription("Link your Ethereum, Cardano, or Snapbrillia Wallet"),
};
