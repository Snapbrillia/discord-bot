const { createEmbed } = require("../../utils/discordUtils");

const getLinkWalletEmbed = () => {
  const embed = createEmbed(
    "🔒🔗 Link Wallet 🔗🔒",
    `Please select the wallet you'd like to link. \n
      ** Cardano Wallet ** \n Link a Cardano Wallet.  \n
      ** Snapbrillia Wallet ** \n Link your Snapbrillia Wallet.  \n
      `
  );
  return embed;
};

const getSendFundToWalletEmbed = (sendAmount, walletAddress) => {
  const embed = createEmbed(
    "✅👝 Wallet Address Submitted For Verification 👝✅",
    `You have submitted a wallet address for verification. \n
      Please send ** ${sendAmount} **to this ** ${walletAddress}** wallet address within 5 minutes for it to be verified. \n
      Please remember to use the same wallet to send the funds. \n
      `
  );
  return embed;
};

const getAlreadyLinkedWalletEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Wallet Already Linked 🛡️🔒",
    `This wallet address has already been verified and link to you. Please enter a different wallet address to verify. \n
      `
  );
  return embed;
};

const getVerifyWalletEmbed = (token) => {
  const embed = createEmbed(
    "🔒🛡️ Verify Wallet 🛡️🔒",
    `To ensure the security of our community, we require all members to verify their wallet addresses before participating in voting rounds.\n
          💰 To verify your wallet, please send a sum of ${token} to the wallet address you provide. Once the transaction is confirmed, you will be able to participate in the upcoming voting round.\n
          👉 Please ensure that you send the sum of ${token} using the wallet that you are want to verify. This will help us confirm the ownership of the wallet and prevent any potential fraudulent activity. Thank you!.\n
      `
  );
  return embed;
};

const getPendingVerifiedWalletEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Wallet Pending Verification 🛡️🔒",
    `Your wallet is currently being verified. Please wait for the verification to complete. You can also verify another wallet. \n
      `
  );
  return embed;
};

const getSnapbrilliaWalletLoginEmbed = () => {
  const embed = createEmbed(
    "🔒💼 Snapbrillia Wallet  💼🔒",
    `To link your Snapbrillia Wallet to your discord account you will need to verify the email address you used to sign up for the Snapbrillia Wallet. \n
      To create a new Snapbrillia Wallet please visit https://snapbrillia.com \n 
      `
  );
  return embed;
};

const getSnapbrilliaEmailCodeEmbed = () => {
  const embed = createEmbed(
    "🔒💼 Snapbrillia Wallet 💼🔒",
    `A verification code has been sent to your email address. Please check your email and enter the code below to complete the verification process.
      `
  );
  return embed;
};

const getSnapbrilliaEmailNotFoundEmbed = () => {
  const embed = createEmbed(
    "🔒💼 Snapbrillia Wallet 💼🔒",
    `Your information can not be verified. Please make sure you are using the same credentials you used to sign up for the Snapbrillia Wallet. \n
      `
  );
  return embed;
};

const getEmailOTPFailedEmbed = () => {
  const embed = createEmbed(
    "🔒💼 Snapbrillia Wallet 💼🔒",
    `The verification code you entered is incorrect. Please try again. \n
      `
  );
  return embed;
};

const getSnapbrilliaWalletLinkedEmbed = () => {
  const embed = createEmbed(
    "🎉✨ Snapbrillia Wallet Linked ✨🎉",
    `You have successfully linked your Snapbrillia Wallet to your Discord account.
      `
  );
  return embed;
};

const getSnapbrilliaWalletLinkedAlreadyEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Wallet Already Linked 🛡️🔒",
    `You have already linked a Snapbrillia Wallet to this Discord account. \n
      `
  );
  return embed;
};

module.exports = {
  getLinkWalletEmbed,
  getSendFundToWalletEmbed,
  getAlreadyLinkedWalletEmbed,
  getVerifyWalletEmbed,
  getPendingVerifiedWalletEmbed,
  getSnapbrilliaWalletLoginEmbed,
  getSnapbrilliaEmailCodeEmbed,
  getSnapbrilliaEmailNotFoundEmbed,
  getEmailOTPFailedEmbed,
  getSnapbrilliaWalletLinkedEmbed,
  getSnapbrilliaWalletLinkedAlreadyEmbed,
};
