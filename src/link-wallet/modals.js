const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

const getCardanoWalletAddressModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("cardanoWalletAddressModal")
    .setTitle("Confirm Wallet Address");

  const walletAddressInput = new TextInputBuilder()
    .setCustomId("walletAddressInput")
    .setLabel("Please enter your wallet address")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(
    walletAddressInput
  );

  modal.addComponents(firstActionRow);
  return modal;
};

const getEthereumWalletAddressModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("ethereumWalletAddressModal")
    .setTitle("Confirm Wallet Address");

  const walletAddressInput = new TextInputBuilder()
    .setCustomId("walletAddressInput")
    .setLabel("Please enter your wallet address")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(
    walletAddressInput
  );

  modal.addComponents(firstActionRow);
  return modal;
};

const getEmailModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("snapbrilliaEmailModal")
    .setTitle("Enter Email Address");

  const emailAddressInput = new TextInputBuilder()
    .setCustomId("emailAddressInput")
    .setLabel("Please enter your email address")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(
    emailAddressInput
  );

  modal.addComponents(firstActionRow);
  return modal;
};

const getEmailOTPModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("snapbrilliaEmailCodeModal")
    .setTitle("Confirm Email Verification Code");

  const emailCodeInput = new TextInputBuilder()
    .setCustomId("emailCodeInput")
    .setLabel("Please enter your email code")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(emailCodeInput);

  modal.addComponents(firstActionRow);
  return modal;
};

module.exports = {
  getCardanoWalletAddressModal,
  getEthereumWalletAddressModal,
  getEmailModal,
  getEmailOTPModal,
};
