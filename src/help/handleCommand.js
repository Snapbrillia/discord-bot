const { getHelpCommandEmbed } = require("./embeds");

const handleHelpCommand = async (interaction) => {
  const helpCommandEmbed = getHelpCommandEmbed();
  return interaction.reply({
    embeds: [helpCommandEmbed],
  });
};

module.exports = {
  handleHelpCommand,
};
