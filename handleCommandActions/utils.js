const { DiscordUser } = require("../models/discordUser.model.js");
const {
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
} = require("../sharedDiscordComponents/buttons");
const {
  getVerifyCardanoWalletEmbed,
  getVerifyEthereumWalletEmbed,
  getPendingVerifiedCardanoWalletEmbed,
  getPendingVerifiedEthereumWalletEmbed,
} = require("../sharedDiscordComponents/embeds.js");

const checkIfVerified = async (interaction, votingRound) => {
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
    serverId: interaction.guildId,
  });

  switch (votingRound.verificationMethod) {
    case "Cardano Wallet":
      if (!discordUser) {
        interaction.reply({
          embeds: [getVerifyCardanoWalletEmbed()],
          components: [getVerifyCardanoWalletButton()],
        });
        return false;
      }
      if (!discordUser.cardanoIsVerified) {
        interaction.reply({
          embeds: [getPendingVerifiedCardanoWalletEmbed()],
          components: [getVerifyCardanoWalletButton()],
        });
        return false;
      }
      break;
    case "Ethereum Wallet":
      if (!discordUser) {
        interaction.reply({
          embeds: [getVerifyEthereumWalletEmbed()],
          components: [getVerifyEthereumWalletButton()],
        });
        return false;
      }
      if (!discordUser.ethereumIsVerified) {
        interaction.reply({
          embeds: [getPendingVerifiedEthereumWalletEmbed()],
          components: [getVerifyEthereumWalletButton()],
        });
        return false;
      }
      break;
  }
  if (!discordUser) {
    interaction.reply({
      embeds: [verifyWalletEmbed],
      components: [verifyWalletButton],
    });
    return false;
  }
  return true;
};

module.exports = {
  checkIfVerified,
};
