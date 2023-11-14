const {
  getCardanoWalletAddressModal,
  getEthereumWalletAddressModal,
} = require("./modals");

const handleVerifyCardanoWalletButton = async (interaction) => {
  const modal = getCardanoWalletAddressModal();
  await interaction.showModal(modal);
};

const handleVerifyEthereumWalletButton = async (interaction) => {
  const modal = getEthereumWalletAddressModal();
  await interaction.showModal(modal);
};

module.exports = {
  handleVerifyCardanoWalletButton,
  handleVerifyEthereumWalletButton,
};
