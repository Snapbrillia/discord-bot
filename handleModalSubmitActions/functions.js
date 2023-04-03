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
  getEthereumSelectTokenEmbed,
  getCardanoSelectTokenEmbed,
  getVotingRoundInfoEmbed,
  getVotingSystemsEmbed,
  getProposalInfoEmbed,
  getVoteProposalInfoEmbed,
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
} = require("../sharedDiscordComponents/buttons");
const { numberRegex } = require("../utils/shared");

const handleConfirmCardanoWalletAddressInputModal = async (interaction) => {
  const discordId = interaction.user.id;
  const serverId = interaction.guildId;
  const discordUsername = interaction.user.username;
  const confirmLovelaceAmount = randomNumber(1500000, 5000000);
  const cardanoWalletAddress = interaction.fields
    .getTextInputValue("walletAddressInput")
    .trim();

  const user = await DiscordUser.findOne({
    discordId,
    serverId,
  });
  if (user) {
    user.cardanoWalletAddress = cardanoWalletAddress;
    user.cardanoIsVerified = false;
    user.confirmLovelaceAmount = confirmLovelaceAmount;
    await user.save();
  } else {
    await DiscordUser.create({
      cardanoWalletAddress,
      cardanoIsVerified: false,
      discordId,
      serverId,
      discordUsername,
      confirmLovelaceAmount,
    });
  }
  interaction.reply(
    `Please send ${confirmLovelaceAmount} ADA to the provided wallet address within 5 minutes to verify your wallet`
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

const handleVerificationMethodInputModal = async (interaction) => {
  try {
    const votingRound = await VotingRound.findOne({
      serverId: interaction.guildId,
      status: "pending",
    });
    const isTokenizedVote =
      votingRound.votingSystem === "Quadratic Voting (Tokens In Wallet)";
    const verificationMethod = interaction.fields
      .getTextInputValue("verificationMethodInput")
      .trim();

    let embeded = "";
    let button = "";
    // looks if it is a tokenized vote
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
        votingRound.blockchain = "Ethereum";
        break;
      case "2":
        votingRound.verificationMethod = "Cardano Wallet";
        votingRound.blockchain = "Cardano";
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

  if (!tokenName) {
    if (votingRound.verificationMethod === "Ethereum Wallet") {
      return interaction.reply({
        content:
          "Failed to find token with this contract address, please try again",
        embeds: [getEthereumSelectTokenEmbed()],
        components: [getSelectTokenButton()],
      });
    } else {
      return interaction.reply({
        content:
          "Failed to find token with this policy and asset name, please try again. ",
        embeds: [getCardanoSelectTokenEmbed()],
        components: [getSelectTokenButton()],
      });
    }
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
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "active",
  });
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
    serverId: interaction.guildId,
  });
  let walletAddress = "";
  if (votingRound.blockchain === "Ethereum") {
    walletAddress = discordUser.ethereumWalletAddress;
  } else {
    walletAddress = discordUser.cardanoWalletAddress;
  }
  const proposalName =
    interaction.fields.getTextInputValue("proposalNameInput");
  const proposalDescription = interaction.fields.getTextInputValue(
    "proposalDescriptionInput"
  );
  const projectInfo = {
    proposalName,
    proposalDescription,
  };
  const registerProposalResponse = await registerProposal(
    walletAddress,
    votingRound.votingRoundId,
    projectInfo
  );
  if (registerProposalResponse.err) {
    interaction.reply(registerProposalResponse.message);
    return;
  }
  interaction.reply({
    embeds: [getProposalInfoEmbed(projectInfo)],
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

module.exports = {
  handleConfirmCardanoWalletAddressInputModal,
  handleTokenSelectInputModal,
  handleRegisterProposalInputModal,
  handleVoteProposalInputModal,
  handleVerificationMethodInputModal,
  handleConfirmEthereumWalletAddressInputModal,
};
