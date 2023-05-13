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
  getSendFundToWalletEmbed,
  getVotingSystemsEmbed,
  getProposalInfoEmbed,
  getVoteProposalInfoEmbed,
  getAlreadyVerifiedWalletEmbed,
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
  getEnterSSIPhoneVerificationButton,
  getEnterSSIPhoneCodeButton,
  getConfirmRegisterProposalButton,
} = require("../sharedDiscordComponents/buttons");
const { numberRegex } = require("../utils/sharedUtils");
const {
  PendingVerification,
} = require("../models/pendingBlockchainVerification.model.js");
const { getImage } = require("../sharedDiscordComponents/image");
const {
  generateEmailProof,
  submitEmailProof,
  generatePhoneProof,
} = require("../utils/ssiUtils");

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
      embeds: [getAlreadyVerifiedWalletEmbed()],
      components: [getVerifyCardanoWalletButton()],
      files: [image],
    });
  }
  const pendingVerification = await PendingVerification.findOne({
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
  await PendingVerification.create({
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
  if (user.cardanoWallets.includes(walletAddress)) {
    return interaction.reply({
      embeds: [getAlreadyVerifiedWalletEmbed()],
      components: [getVerifyEthereumWalletButton()],
      files: [image],
    });
  }
  const pendingVerification = await PendingVerification.findOne({
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
  await PendingVerification.create({
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

  if (!tokenName) {
    if (votingRound.verificationMethod === "Ethereum Wallet") {
      return interaction.reply({
        content:
          "Failed to find token with this contract address, please try again",
        embeds: [
          getEthereumSelectTokenEmbed(
            votingRound.votingSystem,
            true,
            votingRound.verificationMethod
          ),
        ],
        components: [getSelectTokenButton()],
      });
    } else {
      return interaction.reply({
        content:
          "Failed to find token with this policy and asset name, please try again. ",
        embeds: [
          getCardanoSelectTokenEmbed(
            votingRound.votingSystem,
            true,
            votingRound.verificationMethod
          ),
        ],
        components: [getSelectTokenButton()],
      });
    }
  } else {
    if (votingRound.verificationMethod === "Ethereum Wallet") {
      interaction.reply({});
    } else {
    }
  }

  votingRound.tokenIdentiferOnBlockchain = token;
  votingRound.tokenName = tokenName;
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
  // let walletAddress = "";
  // if (votingRound.blockchain === "Ethereum") {
  //   walletAddress = discordUser.ethereumWalletAddress;
  // } else {
  //   walletAddress = discordUser.cardanoWalletAddress;
  // }
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
  //   walletAddress,
  //   votingRound.votingRoundId,
  //   projectInfo
  // );
  // if (registerProposalResponse.err) {
  //   interaction.reply(registerProposalResponse.message);
  //   return;
  // }
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

  const enterSSIPhoneVerificationEmbed = getSSIWalletCreatedEmbed();
  const image = getImage();

  interaction.reply({
    embeds: [enterSSIPhoneVerificationEmbed],
    files: [image],
  });
};

// const handleEnterSSIEmailCodeInputModal = async (interaction) => {
//   const enterSSIPhoneVerificationEmbed = getEnterSSIPhoneNumberEmbed();
//   const enterSSIPhoneVerificationButton = getEnterSSIPhoneVerificationButton();
//   const image = getImage();

//   const code = interaction.fields.getTextInputValue("emailCodeInput");

//   await submitEmailProof(code, interaction.user.id);

//   interaction.reply({
//     embeds: [enterSSIPhoneVerificationEmbed],
//     components: [enterSSIPhoneVerificationButton],
//     files: [image],
//   });
// };

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
