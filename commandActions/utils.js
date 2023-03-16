const { DiscordUser } = require("../models/discordUser.model.js");
const {
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
} = require("../shared/buttons");
const {
  getVerifyCardanoWalletEmbed,
  getVerifyEthereumWalletEmbed,
  getPendingVerifiedCardanoWalletEmbed,
  getPendingVerifiedEthereumWalletEmbed,
} = require("../shared/embeds.js");

const checkIfVerified = async (message, votingRound) => {
  const discordUser = await DiscordUser.findOne({
    discordId: message.author.id,
    serverId: message.guildId,
  });

  switch (votingRound.verificationMethod) {
    case "Cardano Wallet":
      if (!discordUser) {
        message.reply({
          embeds: [getVerifyCardanoWalletEmbed()],
          components: [getVerifyCardanoWalletButton()],
        });
        return false;
      }
      if (!discordUser.cardanoIsVerified) {
        message.reply({
          embeds: [getPendingVerifiedCardanoWalletEmbed()],
          components: [getVerifyCardanoWalletButton()],
        });
        return false;
      }
      break;
    case "Ethereum Wallet":
      if (!discordUser) {
        message.reply({
          embeds: [getVerifyEthereumWalletEmbed()],
          components: [getVerifyEthereumWalletButton()],
        });
        return false;
      }
      if (!discordUser.ethereumIsVerified) {
        message.reply({
          embeds: [getPendingVerifiedEthereumWalletEmbed()],
          components: [getVerifyEthereumWalletButton()],
        });
        return false;
      }
      break;
  }
  if (!discordUser) {
    message.reply({
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
