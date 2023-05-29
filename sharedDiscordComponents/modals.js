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

  const descriptionOfVotingRound = new TextInputBuilder()
    .setCustomId("descriptionOfVotingRound")
    .setLabel("Description of the voting round")
    .setStyle(TextInputStyle.Paragraph);

  const firstActionRow = new ActionRowBuilder().addComponents(
    nameOfVotingRoundInput
  );
  const secondActionRow = new ActionRowBuilder().addComponents(
    descriptionOfVotingRound
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

const getVerifySSIEmailModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("enterSSIEmailInputModal")
    .setTitle("Confirm Email");

  const emailInput = new TextInputBuilder()
    .setCustomId("emailInput")
    .setLabel("Please enter your email")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(emailInput);

  modal.addComponents(firstActionRow);
  return modal;
};

const getEnterSSIEmailCodeModal = () => {
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

const getEnterSSIPhoneNumberCodeModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("enterSSIPhoneNumberInputModal")
    .setTitle("Enter Phone Number");

  const phoneNumberInput = new TextInputBuilder()
    .setCustomId("phoneInput")
    .setLabel("Please enter phone number")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(phoneNumberInput);

  modal.addComponents(firstActionRow);
  return modal;
};

const getEnterSSIPhoneCodeModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("enterSSIPhoneCodeInputModal")
    .setTitle("Enter Phone Verification Code");

  const phoneNumberCodeInput = new TextInputBuilder()
    .setCustomId("phoneCodeInput")
    .setLabel("Please the code")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(
    phoneNumberCodeInput
  );

  modal.addComponents(firstActionRow);
  return modal;
};

const getSnapbrilliaWalletEmailAddressModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("snapbrilliaEmailAddressModal")
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

const getSnapbrilliaWalletPhoneNumberModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("confirmSnapbrilliaWalletPhoneNumberInputModal")
    .setTitle("Enter Phone Number");

  const emailAddressInput = new TextInputBuilder()
    .setCustomId("phoneNumberInput")
    .setLabel("Please enter your phone number")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(
    emailAddressInput
  );

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
  getVerifySSIEmailModal,
  getEnterSSIEmailCodeModal,
  getEnterSSIPhoneNumberCodeModal,
  getEnterSSIPhoneCodeModal,
  getSnapbrilliaWalletEmailAddressModal,
  getSnapbrilliaWalletPhoneNumberModal,
};
