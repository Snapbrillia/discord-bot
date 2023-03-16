const { randomNumber } = require("../utils/cardanoUtils");
const {
  initateFund,
  registerProposal,
  voteToProposal,
} = require("../api/quadraticVoting");
const { VotingRound } = require("../models/votingRound.model");
const { DiscordUser } = require("../models/discordUser.model");
const {
  getWalletVerificationEmbed,
  getListOfVerifiedEmbed,
  getEthereumSelectTokenEmbed,
  getCardanoSelectTokenEmbed,
  getVotingRoundInfoEmbed,
  getVotingSystemsEmbed,
  getProposalInfoEmbed,
  getVoteProposalInfoEmbed,
} = require("../shared/embeds");
const { getTokenFromAddress } = require("../utils/ethereumUtils");
const { getTokenFromPolicyId } = require("../utils/cardanoUtils");
const {
  getSelectVotingSystemButton,
  getSelectVerificationMethodButton,
  getSelectQVTokenVerificationMethodButton,
  getSelectTokenButton,
  getConfirmVotingRoundInfoButton,
  getConfirmProposalButton,
  getConfirmVoteButton,
} = require("../shared/buttons");
const { numberRegex } = require("../utils/shared");

const handleConfirmCardanoWalletAddressInputModal = async (interaction) => {
  const discordId = interaction.user.id;
  const serverId = interaction.guildId;
  const discordUsername = interaction.user.username;
  const confirmLovelaceAmount = randomNumber(1500000, 5000000);
  const confirmAdaAmount = confirmLovelaceAmount / 1000000;
  const cardanoWalletAddress = interaction.fields
    .getTextInputValue("walletAddressInput")
    .trim();

  await DiscordUser.create({
    cardanoWalletAddress,
    cardanoIsVerified: false,
    discordId,
    serverId,
    discordUsername,
    confirmAdaAmount,
  });

  interaction.reply(
    `Please send ${sendAdaAmount} ADA to the provided wallet address within 5 minutes to verify your wallet`
  );
};

const handleConfirmEthereumWalletAddressInputModal = async (interaction) => {
  const discordId = interaction.user.id;
  const serverId = interaction.guildId;
  const discordUsername = interaction.user.username;
  const confirmEthAmount = randomNumber(10000, 20000);
  const ethereumWalletAddress = interaction.fields
    .getTextInputValue("walletAddressInput")
    .trim();

  const user = await DiscordUser.findOne({
    discordId,
    serverId,
  });
  if (user) {
    user.ethereumWalletAddress = ethereumWalletAddress;
    user.ethereumIsVerified = false;
    user.confirmEthAmount = confirmEthAmount;
    await user.save();
  } else {
    await DiscordUser.create({
      ethereumWalletAddress,
      ethereumIsVerified: false,
      discordId,
      serverId,
      discordUsername,
      confirmEthAmount,
    });
  }

  interaction.reply(
    `Please send ${confirmEthAmount} ETH to the provided wallet address within 5 minutes to verify your wallet`
  );
};

const handleVotingSystemInputModal = async (interaction) => {
  const roundDuration = interaction.fields
    .getTextInputValue("deadlineInput")
    .trim();
  if (!numberRegex.test(roundDuration)) {
    interaction.reply({
      content:
        "Please enter a valid number for days the voting round should last(e.g. 1)",
      embeds: [getVotingSystemsEmbed()],
      components: [getSelectVotingSystemButton()],
    });
    return;
  }
  const votingSystem = interaction.fields
    .getTextInputValue("votingSystemInput")
    .trim();
  if (!numberRegex.test(votingSystem) || votingSystem < 1 || votingSystem > 4) {
    interaction.reply({
      content: "Please enter a valid number for voting system (e.g. 1)",
      embeds: [getVotingSystemsEmbed()],
      components: [getSelectVotingSystemButton()],
    });
    return;
  }
  let votingSystemToUse = "";
  let embedContent = getListOfVerifiedEmbed();
  let confirmVerificationButton = getSelectVerificationMethodButton();
  switch (votingSystem) {
    case "1":
      embedContent = getWalletVerificationEmbed();
      votingSystemToUse = "Quadratic Voting (Token In Wallet)";
      confirmVerificationButton = getSelectQVTokenVerificationMethodButton();
      break;
    case "2":
      votingSystemToUse = "Quadratic Voting (Same Voting Power)";
      break;
    case "3":
      votingSystemToUse = "Basic Voting";
      break;
    case "4":
      votingSystemToUse = "Single Choice Voting";
      break;
  }
  const roundDurationInDays = parseInt(roundDuration);
  const pendingVotingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  if (pendingVotingRound) {
    pendingVotingRound.roundDurationInDays = roundDurationInDays;
    pendingVotingRound.votingSystemToUse = votingSystemToUse;
    await pendingVotingRound.save();
  } else {
    await VotingRound.create({
      serverId: interaction.guildId,
      roundDurationInDays,
      votingSystemToUse,
      status: "pending",
    });
  }
  interaction.reply({
    embeds: [embedContent],
    components: [confirmVerificationButton],
  });
};

const handleVerificationMethodInputModal = async (interaction) => {
  try {
    const votingRound = await VotingRound.findOne({
      serverId: interaction.guildId,
      status: "pending",
    });
    const isTokenizedVote =
      votingRound.votingSystemToUse === "Quadratic Voting (Token In Wallet)";
    const verificationMethod = interaction.fields
      .getTextInputValue("verificationMethodInput")
      .trim();
    let verficationMethodLimit = "";
    if (isTokenizedVote) {
      verficationMethodLimit = 2;
    } else {
      verficationMethodLimit = 3;
    }
    if (
      !numberRegex.test(verificationMethod) ||
      verificationMethod < 1 ||
      verificationMethod > verficationMethodLimit
    ) {
      interaction.reply({
        content: "Please enter a valid verification method (e.g. 1)",
        embeds: [getWalletVerificationEmbed()],
        components: [getSelectVerificationMethodButton()],
      });
      return;
    }
    let embeded = "";
    let button = "";
    if (isTokenizedVote) {
      if (verificationMethod === "1") {
        embeded = getEthereumSelectTokenEmbed();
      } else if (verificationMethod === "2") {
        embeded = getCardanoSelectTokenEmbed();
      }
      button = getSelectTokenButton();
    } else {
      embeded = getVotingRoundInfoEmbed(votingRound);
      button = getConfirmVotingRoundInfoButton();
    }
    switch (verificationMethod) {
      case "1":
        votingRound.verificationMethod = "Ethereum Wallet";
        break;
      case "2":
        votingRound.verificationMethod = "Cardano Wallet";
        break;
      case "3":
        votingRound.verificationMethod = "Discord Account";
        break;
    }
    await votingRound.save();
    interaction.reply({ embeds: [embeded], components: [button] });
  } catch (error) {
    interaction.reply({
      content: "An error occured, please try again",
      embeds: [getWalletVerificationEmbed()],
      components: [getSelectVerificationMethodButton()],
    });
  }
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
  votingRound.assetIdentifierOnChain = token;
  votingRound.assetName = tokenName;
  await votingRound.save();
  interaction.reply({
    embeds: [getVotingRoundInfoEmbed(votingRound)],
    components: [getConfirmVotingRoundInfoButton()],
  });
};

const handleRegisterProposalInputModal = async (interaction) => {
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
    serverId: interaction.guildId,
    isVerified: true,
  });
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    isActive: true,
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
  // const registerProposalResponse = await registerProposal(
  //   discordUser.walletAddress,
  //   votingRound.votingRoundId,
  //   projectInfo
  // );
  // if (registerProposalResponse.err) {
  //   interaction.reply(registerProposalResponse.message);
  //   return;
  // }
  interaction.reply({
    embeds: [getProposalInfoEmbed(projectInfo)],
    components: [getConfirmProposalButton()],
  });
};

const handleVoteProposalInputModal = async (interaction, action) => {
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
    serverId: interaction.guildId,
    isVerified: true,
  });
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    isActive: true,
  });
  const voteToAddress = await interaction.fields.getTextInputValue(
    "proposalWalletAddressInput"
  );
  const percentageAllocated = await interaction.fields.getTextInputValue(
    "percentageAllocatedInput"
  );
  // const voteProposalResponse = await voteToProposal(
  //   discordUser.walletAddress,
  //   votingRound.votingRoundId,
  //   percentageAllocated,
  //   voteToAddress,
  //   action
  // );
  // if (voteProposalResponse.err) {
  //   interaction.reply(voteProposalResponse.message);
  //   return;
  // }

  interaction.reply({
    embeds: [getVoteProposalInfoEmbed(voteToAddress, percentageAllocated)],
    components: [getConfirmVoteButton()],
  });
};

module.exports = {
  handleConfirmCardanoWalletAddressInputModal,
  handleVotingSystemInputModal,
  handleTokenSelectInputModal,
  handleRegisterProposalInputModal,
  handleVoteProposalInputModal,
  handleVerificationMethodInputModal,
  handleConfirmEthereumWalletAddressInputModal,
};
