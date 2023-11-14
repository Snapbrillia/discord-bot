const { getSelectLinkWalletMenu } = require("./selectMenus");
const { getImage } = require("../../utils/discordUtils");
const { getLinkWalletEmbed } = require("./embeds");

const handleLinkWalletCommand = async (interaction) => {
  const linkWalletEmbed = getLinkWalletEmbed();
  const linkWalletMenu = getSelectLinkWalletMenu();
  const image = getImage();

  return interaction.reply({
    embeds: [linkWalletEmbed],
    components: [linkWalletMenu],
    files: [image],
  });
};

module.exports = {
  handleLinkWalletCommand,
};
