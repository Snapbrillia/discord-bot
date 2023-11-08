const { randomNumber } = require("../utils/sharedUtils");
const { VotingRound } = require("../models/votingRound.model");
const { DiscordUser } = require("../models/discordUser.model");
const {
  getVotingRoundInfoEmbed,
  getSendFundToWalletEmbed,
  getProposalInfoEmbed,
  getVoteProposalInfoEmbed,
  getAlreadyLinkedWalletEmbed,
  getPendingVerifiedWalletEmbed,
  getSnapbrilliaEmailCodeEmbed,
  getSnapbrilliaWalletLinkedEmbed,
  getSnapbrilliaEmailNotFoundEmbed,
  getEmailOTPFailedEmbed,
} = require("../sharedDiscordComponents/embeds");
const { getTokenFromAddress } = require("../utils/ethereumUtils");
const { getTokenFromPolicyId } = require("../utils/cardanoUtils");
const {
  getConfirmVotingRoundInfoButton,
  getVerifyCardanoWalletButton,
  getVerifyEthereumWalletButton,
  getEmailOTPButton,
  getConfirmRegisterProposalButton,
} = require("../sharedDiscordComponents/buttons");
const {
  PendingWalletVerification,
} = require("../models/pendingWalletVerification.js");
const { getImage } = require("../sharedDiscordComponents/image");
const {
  sendSnapbrilliaLoginCode,
  verifySnapbrilliaLoginCode,
} = require("../utils/ssiUtils");
const { Proposal } = require("../models/projectProposal.model");
const {
  PendingSnapbrilliaWalletVerification,
} = require("../models/pendingSnapbrilliaWalletVerification");

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
    channelId: interaction.channelId,
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
  const votingRoundPurpose = interaction.fields.getTextInputValue(
    "purposeOfVotingRoundInput"
  );
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  votingRound.votingRoundName = votingRoundName;
  votingRound.votingRoundPurpose = votingRoundPurpose;
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
    votingRound.votingRoundPurpose
  );
  const confirmVotingRoundInfoButton = getConfirmVotingRoundInfoButton();
  interaction.reply({
    embeds: [votingRoundInfoEmbed],
    components: [confirmVotingRoundInfoButton],
    files: [image],
  });
};

const handleSnapbrilliaEmailModal = async (interaction) => {
  const email = interaction.fields.getTextInputValue("emailAddressInput");
  const challengeId = await sendSnapbrilliaLoginCode(email, "email");

  if (!challengeId) {
    const embed = getSnapbrilliaEmailNotFoundEmbed();
    const button = getEmailOTPButton();
    return interaction.reply({
      embeds: [embed],
      components: [button],
    });
  }

  const pendingVerification =
    await PendingSnapbrilliaWalletVerification.findOne({
      discordId: interaction.user.id,
    });

  if (pendingVerification) {
    pendingVerification.challengeId = challengeId;
    pendingVerification.email = email;
    await pendingVerification.save();
  } else {
    await PendingSnapbrilliaWalletVerification.create({
      discordId: interaction.user.id,
      challengeId: challengeId,
      email: email,
    });
  }

  const snapbrilliaEmailCodeEmbed = getSnapbrilliaEmailCodeEmbed();
  const snapbrilliaEmailCodeButton = getEmailOTPButton();
  const image = getImage();
  interaction.reply({
    embeds: [snapbrilliaEmailCodeEmbed],
    components: [snapbrilliaEmailCodeButton],
    files: [image],
  });
};

const handleSnapbrilliaEmailOTPModal = async (interaction) => {
  const code = interaction.fields.getTextInputValue("emailCodeInput");
  const pendingVerification =
    await PendingSnapbrilliaWalletVerification.findOne({
      discordId: interaction.user.id,
    });

  const token = await verifySnapbrilliaLoginCode(
    pendingVerification.challengeId,
    code
  );

  if (!token) {
    const embed = getEmailOTPFailedEmbed();
    const button = getEmailOTPButton();
    return interaction.reply({
      embeds: [embed],
      components: [button],
    });
  }

  const user = await DiscordUser.findOne({
    discordId: interaction.user.id,
  });
  user.snapbrilliaWalletAuthToken = token.authToken;
  user.email = pendingVerification.email;
  await user.save();

  await PendingSnapbrilliaWalletVerification.deleteOne({
    discordId: interaction.user.id,
  });

  const snapbrilliaWalletVerified = getSnapbrilliaWalletLinkedEmbed();
  const image = getImage();

  interaction.reply({
    embeds: [snapbrilliaWalletVerified],
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
  handleSnapbrilliaEmailModal,
  handleSnapbrilliaEmailOTPModal,
};
