const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

// The script should be shown in a order that makes sense to the user
// but if you use code to deploy the commands, the order is alphabetical
// because of the way the file system works.
const deployScripts = async (guild) => {
  try {
    const commands = [];

    // Manually set the order of the commands
    const desiredOrder = [
      "helpCommand.js",
      "startVotingRoundCommand.js",
      "registerProposalCommand.js",
      "voteProposalCommand.js",
      "getVotingRoundResultsCommand.js",
      "linkWalletsCommand.js",
      "viewPersonalInfo.js",
    ];

    for (const file of desiredOrder) {
      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(process.env.APPLICATION_ID, guild.id),
      { body: commands }
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  deployScripts,
};
