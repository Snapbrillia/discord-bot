const { DiscordUser } = require("../models/discordUser.model.js");
const {
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
} = require("../sharedDiscordComponents/buttons");
const {
  getVerifyWalletEmbed,
} = require("../sharedDiscordComponents/embeds.js");

const checkIfVerified = async (interaction, votingRound) => {
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
    serverId: interaction.guildId,
  });

  switch (votingRound.verificationMethod) {
    case "Cardano Wallet":
      if (discordUser.cardanoWallets.length > 0) {
        interaction.reply({
          embeds: [getVerifyWalletEmbed("ADA")],
          components: [getVerifyCardanoWalletButton()],
        });
        return false;
      }
      break;
    case "Ethereum Wallet":
      if (discordUser.ethereumWallets.length > 0) {
        interaction.reply({
          embeds: [getVerifyWalletEmbed("ETH")],
          components: [getVerifyEthereumWalletButton()],
        });
        return false;
      }
      break;
  }

  return true;
};

module.exports = {
  checkIfVerified,
};
