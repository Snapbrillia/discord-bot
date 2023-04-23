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
    "Verify Cardano Wallet"
  );
  return button;
};

const getVerifyEthereumWalletButton = () => {
  const button = getPrimaryButton(
    "verifyEthereumWalletButton",
    "Verify Ethereum Wallet"
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

const getRegisterProposalButton = () => {
  const button = getPrimaryButton("registerProposal", "Register Proposal");
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
};
