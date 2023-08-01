const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-summary")
    .setDescription("Get summary of last 24 hours of texts in a channel"),
};
