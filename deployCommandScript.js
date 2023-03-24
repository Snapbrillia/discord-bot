const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const deployScripts = async (guild) => {
  try {
    const commands = [];
    const commandsPath = path.join(__dirname + "/commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    // The put method is used to fully refresh all commands in the guild with the current set
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
