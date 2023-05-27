const { VotingRound } = require("../models/votingRound.model");
const {
  getSelectBlockchainEmbed,
  getVotingRoundDurationEmbed,
  getSelectIfOnlyTokenHolderCanVoteEmbed,
  getEthereumSelectTokenEmbed,
  getCardanoSelectTokenEmbed,
  getEnableKYCEmbed,
  getNameOfVotingRoundEmbed,
  getSelectOnchainOrOffchainEmbed,
  getEnterProposalInformationEmbed,
  getVerifyWalletEmbed,
  getEnterNameAndDescriptionEmbed,
  getEnterEmailVerificationSSIEmbed,
  getSSIEmailVerificationEmbed,
  getViewEthereumWalletsEmbed,
} = require("../sharedDiscordComponents/embeds");
const { getImage } = require("../sharedDiscordComponents/image");
const {
  getSelectRoundDurationMenu,
  getSelectBlockchainMenu,
  getSelectIfOnlyTokenHolderCanVoteMenu,
  getSelectTokenMenu,
  getSelectVotingOnChainMenu,
  getEnableSSIAuthMenu,
} = require("../sharedDiscordComponents/selectMenu");
const {
  getNameOfVotingRoundButton,
  getRegisterProposalButton,
  getSSIEmailVerificationButton,
  getVerifyCardanoWalletButton,
  getEnterSSIEmailVerificationButton,
  getVerifyEthereumWalletButton,
} = require("../sharedDiscordComponents/buttons");
const { DiscordUser } = require("../models/discordUser.model");
const { getSelectTokenModal } = require("../sharedDiscordComponents/modals");
const { Proposal } = require("../models/projectProposal.model");
const { checkIfVerified } = require("../utils/sharedUtils");

const handleVotingSystemMenu = async (interaction) => {
  const votingSystem = interaction.values[0];
  const pendingVotingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  if (pendingVotingRound) {
    pendingVotingRound.votingSystem = votingSystem;
    await pendingVotingRound.save();
  } else {
    if (votingSystem === "Quadratic Voting (Tokens In Wallet)") {
      await VotingRound.create({
        serverId: interaction.guildId,
        votingSystem,
        onlyTokenHolderCanVote: true,
        status: "pending",
      });
    } else {
      await VotingRound.create({
        serverId: interaction.guildId,
        votingSystem,
        status: "pending",
      });
    }
  }
  let embedContent = getSelectIfOnlyTokenHolderCanVoteEmbed(votingSystem);
  const nameOfVotingRoundButton = getSelectIfOnlyTokenHolderCanVoteMenu();
  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    components: [nameOfVotingRoundButton],
    files: [image],
  });
};

// If only token holder can vote is true, then we need to verify the wallet
// If only token holder can vote is false, then we display all verification method including discord
const handleSelectIfOnlyTokenHolderCanVoteMenu = async (interaction) => {
  const onlyTokenHolderCanVoteValue = interaction.values[0];
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  let onlyTokenHolderCanVote;
  if (onlyTokenHolderCanVoteValue === "Yes") {
    onlyTokenHolderCanVote = true;
  } else {
    onlyTokenHolderCanVote = false;
  }
  votingRound.onlyTokenHolderCanVote = onlyTokenHolderCanVote;
  await votingRound.save();

  let embedContent = getSelectBlockchainEmbed(
    votingRound.votingSystem,
    votingRound.storeVotesOnChain,
    onlyTokenHolderCanVote
  );
  let confirmVerificationMenu = getSelectBlockchainMenu();

  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    components: [confirmVerificationMenu],
    files: [image],
  });
};

// After selecting verification method we will check if token is needed for this round. If it is needed
// we need to grab the token from the users wallet. Since discord only allows 25
// we will grab the first 23 options(One reserved for ADA and one reserved for enter manually)
// and add an extra  option where we grab the next 25 options.
const handleSelectVerificationMethodMenu = async (interaction) => {
  try {
    const verificationMethod = interaction.values[0];
    const votingRound = await VotingRound.findOne({
      serverId: interaction.guildId,
      status: "pending",
    });
    votingRound.verificationMethod = verificationMethod;
    const discordUser = await DiscordUser.findOne({
      discordId: interaction.user.id,
    });
    let embedContent = getVotingRoundDurationEmbed(
      votingRound.votingSystem,
      votingRound.onlyTokenHolderCanVote,
      verificationMethod
    );
    let component = getSelectRoundDurationMenu();
    if (votingRound.onlyTokenHolderCanVote) {
      if (verificationMethod === "Ethereum Blockchain") {
        votingRound.blockchain = "Ethereum";
        embedContent = getEthereumSelectTokenEmbed(
          votingRound.votingSystem,
          votingRound.storeVotesOnChain,
          true,
          verificationMethod
        );
        component = getSelectTokenMenu(discordUser.ethereumTokensInWallet);
      } else if (verificationMethod === "Cardano Blockchain") {
        votingRound.blockchain = "Cardano";
        embedContent = getCardanoSelectTokenEmbed(
          votingRound.votingSystem,
          votingRound.storeVotesOnChain,
          true,
          verificationMethod
        );
        component = getSelectTokenMenu(discordUser.cardanoTokensInWallet);
      }
    }
    await votingRound.save();
    const image = getImage();
    interaction.reply({
      embeds: [embedContent],
      files: [image],
      components: [component],
    });
  } catch (error) {
    console.log(error);
  }
};

//
const handleSelectTokenMenu = async (interaction) => {
  const tokenIdentifier = interaction.values[0];
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
  });
  let token = {};
  if (votingRound.blockchain === "Cardano") {
    token = discordUser.cardanoTokensInWallet.find(
      (token) => token.tokenIdentifier === tokenIdentifier
    );
  } else {
    token = discordUser.ethereumTokensInWallet.find(
      (token) => token.tokenIdentifier === tokenIdentifier
    );
  }
  if (tokenIdentifier === "Enter Manually") {
    const modal = getSelectTokenModal();
    return interaction.showModal(modal);
  }
  votingRound.tokenIdentiferOnBlockchain = tokenIdentifier;
  votingRound.tokenName = token.tokenName;
  await votingRound.save();
  const embedContent = getEnableKYCEmbed(
    votingRound.votingSystem,
    votingRound.storeVotesOnChain,
    votingRound.onlyTokenHolderCanVote,
    votingRound.verificationMethod,
    votingRound.tokenName
  );
  const component = getEnableSSIAuthMenu();
  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    files: [image],
    components: [component],
  });
};

const handleSelectSSIAuthMenu = async (interaction) => {
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  const useSSI = interaction.values[0] === "Yes";
  votingRound.requiredVerifiableCredential = useSSI;
  await votingRound.save();
  const embedContent = getVotingRoundDurationEmbed(
    votingRound.votingSystem,
    votingRound.storeVotesOnChain,
    votingRound.onlyTokenHolderCanVote,
    votingRound.verificationMethod,
    votingRound.tokenName,
    votingRound.requiredVerifiableCredential
  );
  const component = getSelectRoundDurationMenu();
  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    files: [image],
    components: [component],
  });
};

// After selecting the round duration we will ask the
// user to enter the name of the voting round
const handleRoundDurationMenu = async (interaction) => {
  try {
    const votingRound = await VotingRound.findOne({
      serverId: interaction.guildId,
      status: "pending",
    });
    const roundDurationInDays = interaction.values[0];
    votingRound.roundDurationInDays = parseInt(roundDurationInDays);
    await votingRound.save();
    let embedContent = getEnterNameAndDescriptionEmbed(
      votingRound.votingSystem,
      votingRound.storeVotesOnChain,
      votingRound.onlyTokenHolderCanVote,
      votingRound.verificationMethod,
      votingRound.tokenName,
      votingRound.requiredVerifiableCredential,
      votingRound.roundDurationInDays
    );
    const nameOfVotingRoundButton = getNameOfVotingRoundButton();
    const image = getImage();
    interaction.reply({
      embeds: [embedContent],
      components: [nameOfVotingRoundButton],
      files: [image],
    });
  } catch (error) {
    console.log(error);
  }
};

// Since there is no way of perserving state of interaction,
// we will create a pending proposal for the user to store the states between
// interactions. If the user already has a pending proposal, we will update the voting round id
// they also need to select the wallet they want to use to represent themselves.
const handleListOfProposalsMenu = async (interaction) => {
  const votingRoundId = interaction.values[0];
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
  });
  if (votingRound.onlyTokenHolderCanVote) {
    const isVerified = await checkIfVerified(interaction, votingRound);
    if (!isVerified) {
      return;
    }
  }
  const existingProposal = await Proposal.findOne({
    serverId: interaction.guildId,
    votingRoundId: votingRoundId,
    discordId: interaction.user.id,
    status: "pending",
  });
  if (existingProposal) {
    existingProposal.votingRoundId = votingRoundId;
    await existingProposal.save();
  } else {
    await Proposal.create({
      serverId: interaction.guildId,
      votingRoundId: votingRoundId,
      discordId: interaction.user.id,
      status: "pending",
    });
  }
  // const hasParticipatedInRound = await checkIfUserHasParticipatedInRound();

  const image = getImage();
  let embedContent = getEnterProposalInformationEmbed();
  let button = getRegisterProposalButton();

  interaction.reply({
    embeds: [embedContent],
    files: [image],
    components: [button],
  });
};

const handleLinkWalletMenu = async (interaction) => {
  let embed;
  let button;
  const linkWallet = interaction.values[0];
  switch (linkWallet) {
    case "Ethereum Wallet":
      embed = getVerifyWalletEmbed("Ethereum");
      button = getVerifyEthereumWalletButton();
      break;
    case "Cardano Wallet":
      embed = getVerifyWalletEmbed("Cardano");
      button = getVerifyCardanoWalletButton();
      break;
    case "SSI Wallet":
      embed = getSSIEmailVerificationEmbed();
      button = getSSIEmailVerificationButton();
      break;
    default:
      break;
  }

  const image = getImage();

  interaction.reply({
    embeds: [embed],
    components: [button],
    files: [image],
  });
};

const handleViewPersonalInfoMenu = async (interaction) => {
  const image = getImage();
  const embed = getViewEthereumWalletsEmbed();
  interaction.reply({
    embeds: [embed],
    files: [image],
  });
};

module.exports = {
  handleVotingSystemMenu,
  handleSelectIfOnlyTokenHolderCanVoteMenu,
  handleSelectTokenMenu,
  handleSelectSSIAuthMenu,
  handleRoundDurationMenu,
  handleSelectVerificationMethodMenu,
  handleListOfProposalsMenu,
  handleLinkWalletMenu,
  handleViewPersonalInfoMenu,
};
