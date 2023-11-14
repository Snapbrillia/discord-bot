const { getPrimaryButton } = require("../../utils/discordUtils");

const getVerifyCardanoWalletButton = () => {
  const button = getPrimaryButton(
    "verifyCardanoWalletButton",
    "Link Cardano Wallet"
  );
  return button;
};

const getVerifyEthereumWalletButton = () => {
  const button = getPrimaryButton(
    "verifyEthereumWalletButton",
    "Link Ethereum Wallet"
  );
  return button;
};

const getEmailButton = () => {
  const button = getPrimaryButton("enterEmailButton", "Enter Email");
  return button;
};

const getEmailOTPButton = () => {
  const button = getPrimaryButton(
    "enterEmailOTPButton",
    "Enter Email Verification Code"
  );
  return button;
};

module.exports = {
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
  getEmailOTPButton,
  getEmailButton,
};
