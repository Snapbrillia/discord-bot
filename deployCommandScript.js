const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

// The script should be shown in a order that makes sense to the user
// but if you use code to deploy the commands, the order is alphabetical
// because of the way the file system works.
const deployCommands = async (guild) => {
  try {
    const commands = [];

    // grab all files under the folder commands

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
  deployCommands,
};
