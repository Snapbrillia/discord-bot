const { createEmbed } = require("../../utils/discordUtils");

const getAdminIntroductionEmbed = () => {
  const embed = createEmbed(
    "👋 Snapbrillia Voting Bot 👋",
    `Thank You for using Snapbrillia Voting Bot. To get started enter the command **/help**. \n
      Please make sure only admins are allowed in this channel
      `
  );
  return embed;
};

const getMemberIntroductionEmbed = () => {
  const embed = createEmbed(
    "👋 Snapbrillia Voting Bot 👋",
    `Welcome to the Snapbrillia Voting Bot! \n
    Before you can participate in any of our voting rounds, we require all members to verify their wallet addresses. Don't worry, it's a quick and easy process! 🔒🛡️ \n
    To get a list of all the commands you can use, please type **/help** \n  
    `
  );
  return embed;
};

module.exports = {
  getAdminIntroductionEmbed,
  getMemberIntroductionEmbed,
};
