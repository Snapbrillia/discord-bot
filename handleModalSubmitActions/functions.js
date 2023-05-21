const { randomNumber } = require("../utils/sharedUtils");
const { VotingRound } = require("../models/votingRound.model");
const { DiscordUser } = require("../models/discordUser.model");
const {
  getWalletVerificationEmbed,
  getEthereumSelectTokenEmbed,
  getCardanoSelectTokenEmbed,
  getVotingRoundInfoEmbed,
  getSendFundToWalletEmbed,
  getVotingSystemsEmbed,
  getProposalInfoEmbed,
  getVoteProposalInfoEmbed,
  getAlreadyLinkedWalletEmbed,
  getPendingVerifiedWalletEmbed,
  getEnterVerificationEmbed,
  getEnterSSIEmailAddressEmbed,
  getEnterSSIPhoneNumberEmbed,
  getEnterSSIPhoneCodeEmbed,
  getSSIWalletCreatedEmbed,
} = require("../sharedDiscordComponents/embeds");
const { getTokenFromAddress } = require("../utils/ethereumUtils");
const { getTokenFromPolicyId } = require("../utils/cardanoUtils");
const {
  getSelectVotingSystemButton,
  getSelectVerificationMethodButton,
  getSelectQVTokenVerificationMethodButton,
  getSelectTokenButton,
  getConfirmVotingRoundInfoButton,
  getConfirmVoteButton,
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
  getEnterSSIEmailVerificationButton,
  handleEnterSSIPhoneNumberButton,
  getEnterSSIPhoneCodeButton,
  getConfirmRegisterProposalButton,
  getEnterSSIPhoneNumberButton,
} = require("../sharedDiscordComponents/buttons");
const { numberRegex } = require("../utils/sharedUtils");
const {
  PendingWalletVerification,
} = require("../models/pendingWalletVerification.js");
const { getImage } = require("../sharedDiscordComponents/image");
const {
  generateEmailProof,
  submitEmailProof,
  generatePhoneProof,
  submitPhoneProof,
} = require("../utils/ssiUtils");
const { Proposal } = require("../models/projectProposal.model");

const handleConfirmCardanoWalletAddressInputModal = async (interaction) => {
  const image = getImage();
  const discordId = interaction.user.id;
  const sendAmount = randomNumber(1500000, 2000000);
  const walletAddress = interaction.fields
    .getTextInputValue("walletAddressInput")
    .trim();
  const user = await DiscordUser.findOne({
    discordId,
  });
  if (user.cardanoWallets.includes(walletAddress)) {
    return interaction.reply({
      embeds: [getAlreadyLinkedWalletEmbed()],
      components: [getVerifyCardanoWalletButton()],
      files: [image],
    });
  }
  const pendingVerification = await PendingWalletVerification.findOne({
    discordId,
    walletAddress,
  });
  if (pendingVerification) {
    return interaction.reply({
      embeds: [getPendingVerifiedWalletEmbed()],
      components: [getVerifyCardanoWalletButton()],
      files: [image],
    });
  }
  await PendingWalletVerification.create({
    discordId,
    walletAddress,
    sendAmount,
    blockchain: "Cardano",
  });
  interaction.reply({
    embeds: [getSendFundToWalletEmbed(`${sendAmount} ADA`, walletAddress)],
    files: [image],
  });
};

const handleConfirmEthereumWalletAddressInputModal = async (interaction) => {
  const image = getImage();
  const discordId = interaction.user.id;
  const sendAmount = randomNumber(1000, 1100);
  const walletAddress = interaction.fields
    .getTextInputValue("walletAddressInput")
    .trim();
  const user = await DiscordUser.findOne({
    discordId,
  });
  if (user.ethereumWallets.includes(walletAddress)) {
    return interaction.reply({
      embeds: [getAlreadyLinkedWalletEmbed()],
      components: [getVerifyEthereumWalletButton()],
      files: [image],
    });
  }
  const pendingVerification = await PendingWalletVerification.findOne({
    discordId,
    walletAddress,
  });
  if (pendingVerification) {
    return interaction.reply({
      embeds: [getPendingVerifiedWalletEmbed()],
      components: [getVerifyEthereumWalletButton()],
      files: [image],
    });
  }
  await PendingWalletVerification.create({
    discordId,
    walletAddress,
    sendAmount,
    blockchain: "Ethereum",
  });
  interaction.reply({
    embeds: [getSendFundToWalletEmbed(`${sendAmount} ETH`, walletAddress)],
    files: [image],
  });
};

const handleTokenSelectInputModal = async (interaction) => {
  const token = interaction.fields.getTextInputValue("tokenInput").trim();
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });

  let tokenName = "";
  if (votingRound.verificationMethod === "Ethereum Wallet") {
    tokenName = await getTokenFromAddress(token);
  } else {
    tokenName = await getTokenFromPolicyId(token);
  }

  votingRound.tokenIdentiferOnBlockchain = token;
  votingRound.tokenName = tokenName;
  await votingRound.save();

  const embed = getVotingRoundInfoEmbed(votingRound);
  const components = [getConfirmVotingRoundInfoButton()];

  interaction.reply({
    embeds: [embed],
    components: components,
  });
};

const handleRegisterProposalInputModal = async (interaction) => {
  const proposal = await Proposal.findOne({
    discordId: interaction.user.id,
    status: "pending",
    serverId: interaction.guildId,
  });

  const votingRound = await VotingRound.findOne({
    _id: proposal.votingRoundId,
  });

  const proposalName =
    interaction.fields.getTextInputValue("proposalNameInput");
  const proposalDescription = interaction.fields.getTextInputValue(
    "proposalDescriptionInput"
  );

  const projectInfo = {
    proposalName,
    proposalDescription,
  };

  proposal.name = proposalName;
  proposal.description = proposalDescription;

  await proposal.save();

  const image = getImage();
  const registerProposalButton = getConfirmRegisterProposalButton();
  interaction.reply({
    embeds: [getProposalInfoEmbed(projectInfo, votingRound.votingRoundName)],
    components: [registerProposalButton],
    files: [image],
  });
};

const handleVoteProposalInputModal = async (interaction, action) => {
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
    serverId: interaction.guildId,
  });
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "active",
  });
  const voteToAddress = await interaction.fields.getTextInputValue(
    "proposalWalletAddressInput"
  );
  const percentageAllocated = await interaction.fields.getTextInputValue(
    "percentageAllocatedInput"
  );
  let walletAddress = "";
  if (votingRound.blockchain === "Ethereum") {
    walletAddress = discordUser.ethereumWalletAddress;
  } else {
    walletAddress = discordUser.cardanoWalletAddress;
  }
  const voteProposalResponse = await voteToProposal(
    walletAddress,
    votingRound.votingRoundId,
    percentageAllocated,
    voteToAddress,
    action
  );
  if (voteProposalResponse.err) {
    interaction.reply(voteProposalResponse.message);
    return;
  }
  interaction.reply({
    embeds: [getVoteProposalInfoEmbed(voteToAddress, percentageAllocated)],
  });
};

const handleNameOfVotingRoundInputModal = async (interaction) => {
  const votingRoundName = interaction.fields.getTextInputValue(
    "nameOfVotingRoundInput"
  );
  const votingRoundDescription = interaction.fields.getTextInputValue(
    "descriptionOfVotingRound"
  );
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  votingRound.votingRoundName = votingRoundName;
  votingRound.votingRoundDescription = votingRoundDescription;
  await votingRound.save();
  const image = getImage();
  const votingRoundInfoEmbed = getVotingRoundInfoEmbed(
    votingRound.votingSystem,
    votingRound.storeVotesOnChain,
    votingRound.onlyTokenHolderCanVote,
    votingRound.verificationMethod,
    votingRound.tokenName,
    votingRound.requiredVerifiableCredential,
    votingRound.roundDurationInDays,
    votingRound.votingRoundName,
    votingRound.votingRoundDescription
  );
  const confirmVotingRoundInfoButton = getConfirmVotingRoundInfoButton();
  interaction.reply({
    embeds: [votingRoundInfoEmbed],
    components: [confirmVotingRoundInfoButton],
    files: [image],
  });
};

const handleVerifySSIEmailInputModal = async (interaction) => {
  const enterSSIEmailVerificationEmbed = getEnterSSIEmailAddressEmbed();
  const enterSSIEmailVerificationButton = getEnterSSIEmailVerificationButton();

  const email = interaction.fields.getTextInputValue("emailInput");
  await generateEmailProof(email, interaction.user.id);

  const image = getImage();
  interaction.reply({
    embeds: [enterSSIEmailVerificationEmbed],
    components: [enterSSIEmailVerificationButton],
    files: [image],
  });
};

const handleEnterSSIEmailCodeInputModal = async (interaction) => {
  const code = interaction.fields.getTextInputValue("emailCodeInput");

  await submitEmailProof(code, interaction.user.id);

  const enterSSIPhoneVerificationEmbed = getEnterSSIPhoneNumberEmbed();
  const enterSSIPhoneNumberButton = getEnterSSIPhoneNumberButton();
  const image = getImage();

  interaction.reply({
    embeds: [enterSSIPhoneVerificationEmbed],
    components: [enterSSIPhoneNumberButton],
    files: [image],
  });
};

const handleEnterSSIPhoneInputModal = async (interaction) => {
  const enterPhoneNumberVerificationCode = getEnterSSIPhoneCodeEmbed();
  const enterPhoneNumberVerificationButton = getEnterSSIPhoneCodeButton();
  const phoneNumber = interaction.fields.getTextInputValue("phoneInput");

  const image = getImage();
  await generatePhoneProof(phoneNumber, interaction.user.id);
  interaction.reply({
    embeds: [enterPhoneNumberVerificationCode],
    components: [enterPhoneNumberVerificationButton],
    files: [image],
  });
};

const handleEnterSSIPhoneCodeInputModal = async (interaction) => {
  const ssiWalletCreatedEmbed = getSSIWalletCreatedEmbed();

  const image = getImage();
  await submitPhoneProof("", interaction.user.id);
  interaction.reply({
    embeds: [ssiWalletCreatedEmbed],
    files: [image],
  });
};

module.exports = {
  handleConfirmCardanoWalletAddressInputModal,
  handleTokenSelectInputModal,
  handleRegisterProposalInputModal,
  handleVoteProposalInputModal,
  handleConfirmEthereumWalletAddressInputModal,
  handleNameOfVotingRoundInputModal,
  handleVerifySSIEmailInputModal,
  handleEnterSSIEmailCodeInputModal,
  handleEnterSSIPhoneInputModal,
  handleEnterSSIPhoneCodeInputModal,
};
