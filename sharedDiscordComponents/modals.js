const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require("discord.js");

const getNameOfVotingRoundModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("confirmNameOfVotingRoundInputModal")
    .setTitle("Confirm Name Of Voting Round");

  const nameOfVotingRoundInput = new TextInputBuilder()
    .setCustomId("nameOfVotingRoundInput")
    .setLabel("Name of the voting round")
    .setStyle(TextInputStyle.Short);

  const purposeOfVotingRound = new TextInputBuilder()
    .setCustomId("purposeOfVotingRoundInput")
    .setLabel("Purpose of the voting round")
    .setStyle(TextInputStyle.Paragraph);

  const firstActionRow = new ActionRowBuilder().addComponents(
    nameOfVotingRoundInput
  );
  const secondActionRow = new ActionRowBuilder().addComponents(
    purposeOfVotingRound
  );

  modal.addComponents(firstActionRow, secondActionRow);

  return modal;
};

const getCardanoWalletAddressModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("confirmCardanoWalletAddressInputModal")
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
    .setCustomId("confirmEthereumWalletAddressInputModal")
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

const getSelectTokenModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("confirmTokenInputModal")
    .setTitle("Select Token");

  const tokenInput = new TextInputBuilder()
    .setCustomId("tokenInput")
    .setLabel("Token that will be used to vote")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(tokenInput);

  modal.addComponents(firstActionRow);
  return modal;
};

const getRegisterProposalModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("registerProposalInputModal")
    .setTitle("Confirm Register Proposal");

  const proposalNameInput = new TextInputBuilder()
    .setCustomId("proposalNameInput")
    .setLabel("Please enter your proposal name")
    .setStyle(TextInputStyle.Short);

  const proposalDescriptionInput = new TextInputBuilder()
    .setCustomId("proposalDescriptionInput")
    .setLabel("Please enter your proposal description")
    .setStyle(TextInputStyle.Paragraph);

  const firstActionRow = new ActionRowBuilder().addComponents(
    proposalNameInput
  );

  const secondActionRow = new ActionRowBuilder().addComponents(
    proposalDescriptionInput
  );

  modal.addComponents(firstActionRow, secondActionRow);
  return modal;
};

const getVoteProposalModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("voteProposalInputModal")
    .setTitle("Confirm Vote Proposal");

  const proposalIdInput = new TextInputBuilder()
    .setCustomId("proposalWalletAddressInput")
    .setLabel("The Name Of The Proposal")
    .setStyle(TextInputStyle.Short);

  const percentageAllocatedInput = new TextInputBuilder()
    .setCustomId("percentageAllocatedInput")
    .setLabel("The percentage of voting power to allocate")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(proposalIdInput);
  const secondActionRow = new ActionRowBuilder().addComponents(
    percentageAllocatedInput
  );

  modal.addComponents(firstActionRow, secondActionRow);
  return modal;
};

const getDownVoteProposalModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("downVoteProposalInputModal")
    .setTitle("Confirm Down Vote Proposal");

  const proposalIdInput = new TextInputBuilder()
    .setCustomId("proposalWalletAddressInput")
    .setLabel("Wallet address of the proposal")
    .setStyle(TextInputStyle.Short);

  const percentageAllocatedInput = new TextInputBuilder()
    .setCustomId("percentageAllocatedInput")
    .setLabel("The percentage of voting power to allocate")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(proposalIdInput);
  const secondActionRow = new ActionRowBuilder().addComponents(
    percentageAllocatedInput
  );

  modal.addComponents(firstActionRow, secondActionRow);
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
  getNameOfVotingRoundModal,
  getCardanoWalletAddressModal,
  getEthereumWalletAddressModal,
  getSelectTokenModal,
  getRegisterProposalModal,
  getVoteProposalModal,
  getDownVoteProposalModal,
  getDownVoteProposalModal,
  getEmailModal,
  getEmailOTPModal,
};
