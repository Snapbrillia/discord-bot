const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

const getPrimaryButton = (customId, label) => {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(customId)
      .setLabel(label)
      .setStyle(ButtonStyle.Primary)
  );
  return row;
};

const getSelectVotingSystemButton = () => {
  const button = getPrimaryButton(
    "selectVotingSystemButton",
    "Select Voting System"
  );
  return button;
};

const getSelectVerificationMethodButton = () => {
  const button = getPrimaryButton(
    "selectVerificationMethodButton",
    "Select Verification Method"
  );
  return button;
};

const getSelectQVTokenVerificationMethodButton = () => {
  const button = getPrimaryButton(
    "selectQVTokenVerificationMethodButton",
    "Select Verification Method"
  );
  return button;
};

const getSelectTokenButton = () => {
  const button = getPrimaryButton(
    "selectTokenButton",
    "Select Token For Voting Round"
  );
  return button;
};

const getConfirmVotingRoundInfoButton = () => {
  const button = getPrimaryButton(
    "confirmVotingRoundInfoButton",
    "Confirm Voting Round Info"
  );
  return button;
};

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

const getVoteProposalButton = () => {
  const button = getPrimaryButton("voteProposalButton", "Vote Proposal");
  return button;
};

const getNameOfVotingRoundButton = () => {
  const button = getPrimaryButton(
    "nameOfVotingRoundButton",
    "Enter Voting Round Info"
  );
  return button;
};

const getConfirmVoteButton = () => {
  const button = getPrimaryButton("confirmVoteProposalButton", "Confirm Vote");
  return button;
};

const getConfirmRegisterProposalButton = () => {
  const button = getPrimaryButton(
    "confirmProposalButton",
    "Confirm Register Proposal"
  );
  return button;
};

const getRegisterProposalButton = () => {
  const button = getPrimaryButton(
    "registerProposalButton",
    "Register Proposal"
  );
  return button;
};

const getEnterSnapbrilliaEmailCodeButton = () => {
  const button = getPrimaryButton(
    "enterSnapbrilliaEmailCodeButton",
    "Enter Email Verification Code"
  );
  return button;
};

const getEnterSnaprbilliaPhoneCodeButton = () => {
  const button = getPrimaryButton(
    "enterSnapbrilliaPhoneCodeButton",
    "Enter Phone Number Verification Code"
  );
  return button;
};

module.exports = {
  getPrimaryButton,
  getSelectVotingSystemButton,
  getSelectVerificationMethodButton,
  getSelectQVTokenVerificationMethodButton,
  getSelectTokenButton,
  getConfirmVotingRoundInfoButton,
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
  getVoteProposalButton,
  getNameOfVotingRoundButton,
  getConfirmVoteButton,
  getRegisterProposalButton,
  getConfirmRegisterProposalButton,
  getEnterSnapbrilliaEmailCodeButton,
  getEnterSnaprbilliaPhoneCodeButton,
};
