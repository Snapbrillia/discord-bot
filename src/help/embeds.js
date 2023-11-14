const { createEmbed } = require("../../utils/discordUtils");

const getHelpCommandEmbed = () => {
  const embed = createEmbed(
    "Help",
    `**For Admins** \n
      **/start-voting-round** - Start the voting round\n
      **For Voters** \n
      **/view-voting-round-info** - View voting round information\n
      **/register-proposal** - Register a proposal\n
      **/vote-proposal** - Vote for a proposal\n
      **/help** - Get list of availible commands with the bot.\n`
  );
  return embed;
};

module.exports = {
  getHelpCommandEmbed,
};
