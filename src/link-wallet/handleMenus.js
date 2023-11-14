const { DiscordUser } = require("../../models/discordUser.model");
const { getImage } = require("../../utils/discordUtils");
const {
  getVerifyEthereumWalletButton,
  getVerifyCardanoWalletButton,
  getEmailButton,
} = require("./buttons");
const {
  getVerifyWalletEmbed,
  getSnapbrilliaWalletLoginEmbed,
  getSnapbrilliaWalletLinkedAlreadyEmbed,
} = require("./embeds");

const handleLinkWalletMenu = async (interaction) => {
  let embed;
  let button;
  const linkWallet = interaction.values[0];
  const user = await DiscordUser.findOne({
    discordId: interaction.user.id,
  });
  switch (linkWallet) {
    case "Ethereum Wallet":
      embed = getVerifyWalletEmbed("Ethereum");
      button = getVerifyEthereumWalletButton();
      break;
    case "Cardano Wallet":
      embed = getVerifyWalletEmbed("Cardano");
      button = getVerifyCardanoWalletButton();
      break;
    case "Snapbrillia Wallet":
      if (user.snapbrilliaWalletAuthToken) {
        embed = getSnapbrilliaWalletLinkedAlreadyEmbed();
        return interaction.reply({
          embeds: [embed],
        });
      } else {
        embed = getSnapbrilliaWalletLoginEmbed();
        button = getEmailButton();
      }
      break;
    default:
      break;
  }

  const image = getImage();

  interaction.reply({
    embeds: [embed],
    components: [button],
    files: [image],
  });
};

module.exports = {
  handleLinkWalletMenu,
};
