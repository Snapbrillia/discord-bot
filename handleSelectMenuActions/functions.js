const { VotingRound } = require("../models/votingRound.model");
const {
  getListOfVerifiedEmbed,
  getWalletVerificationEmbed,
  getVotingRoundDurationEmbed,
  getSelectIfOnlyTokenHolderCanVoteEmbed,
  getEthereumSelectTokenEmbed,
  getCardanoSelectTokenEmbed,
  getEnableKYCEmbed,
  getNameOfVotingRoundEmbed,
  getSelectOnchainOrOffchainEmbed,
  getEnterProposalInformationEmbed,
  getVerifyWalletEmbed,
} = require("../sharedDiscordComponents/embeds");
const { getImage } = require("../sharedDiscordComponents/image");
const {
  getSelectRoundDurationMenu,
  getSelectVerificationMenu,
  getSelectIfOnlyTokenHolderCanVoteMenu,
  getSelectTokenMenu,
  getSelectVotingOnChainMenu,
  getEnableKYCMenu,
} = require("../sharedDiscordComponents/selectMenu");
const { getCardanoTokenInWalletMenu } = require("../utils/cardanoUtils");
const { getEthereumTokenInWalletMenu } = require("../utils/cardanoUtils");
const {
  getNameOfVotingRoundButton,
  getRegisterProposalButton,
  getVerifyEthereumWalletButton,
  getVerifyCardanoWalletButton,
} = require("../sharedDiscordComponents/buttons");
const { DiscordUser } = require("../models/discordUser.model");
const { getSelectTokenModal } = require("../sharedDiscordComponents/modals");
const { Proposal } = require("../models/projectProposal.model");
const { checkIfVerified } = require("../utils/shared");

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
  let embedContent = "";
  let component = "";
  if (votingSystem === "Quadratic Voting (Tokens In Wallet)") {
    const showWalletVerificationOnly = true;
    embedContent = getWalletVerificationEmbed(votingSystem);
    component = getSelectVerificationMenu(showWalletVerificationOnly);
  } else {
    embedContent = getSelectIfOnlyTokenHolderCanVoteEmbed(votingSystem);
    component = getSelectIfOnlyTokenHolderCanVoteMenu();
  }
  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    components: [component],
    files: [image],
  });
};

// If only token holder can vote is true, then we need to verify the wallet
// If only token holder can vote is false, then we display all verification method including discord
const handleSelectIfOnlyTokenHolderCanVoteMenu = async (interaction) => {
  const onlyTokenHolderCanVoteValue = interaction.values[0];
  const pendingVotingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  let onlyTokenHolderCanVote;
  if (onlyTokenHolderCanVoteValue === "Yes") {
    onlyTokenHolderCanVote = true;
  } else {
    onlyTokenHolderCanVote = false;
  }
  pendingVotingRound.onlyTokenHolderCanVote = onlyTokenHolderCanVote;
  await pendingVotingRound.save();
  let embedContent = "";
  let confirmVerificationMenu = "";
  if (onlyTokenHolderCanVote) {
    const showWalletVerificationOnly = true;
    embedContent = getWalletVerificationEmbed(
      pendingVotingRound.votingSystem,
      onlyTokenHolderCanVote
    );
    confirmVerificationMenu = getSelectVerificationMenu(
      showWalletVerificationOnly
    );
  } else {
    embedContent = getListOfVerifiedEmbed(
      pendingVotingRound.votingSystem,
      onlyTokenHolderCanVote
    );
    confirmVerificationMenu = getSelectVerificationMenu();
  }
  const image = getImage();

  interaction.reply({
    embeds: [embedContent],
    components: [confirmVerificationMenu],
    files: [image],
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
    let embedContent = getSelectOnchainOrOffchainEmbed(
      votingRound.votingSystem,
      votingRound.onlyTokenHolderCanVote,
      votingRound.verificationMethod,
      votingRound.tokenName,
      votingRound.roundDurationInDays
    );
    const nameOfVotingRoundButton = getSelectVotingOnChainMenu();
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

const handleSelectSSIAndKYCMenu = async (interaction) => {
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  const useSSI = interaction.values[0] === "Yes";
  votingRound.knowYourCustomerSSIEnabled = useSSI;
  await votingRound.save();
  const embedContent = getVotingRoundDurationEmbed(
    votingRound.votingSystem,
    true,
    votingRound.verificationMethod,
    votingRound.tokenName,
    votingRound.knowYourCustomerSSIEnabled
  );
  const component = getSelectRoundDurationMenu();
  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    files: [image],
    components: [component],
  });
};

const handleOnChainOrOffChainVotingMenu = async (interaction) => {
  try {
    const votingRound = await VotingRound.findOne({
      serverId: interaction.guildId,
      status: "pending",
    });
    const storeVotesOnChain = interaction.values[0] === "On-chain";
    votingRound.storeVotesOnChain = storeVotesOnChain;
    await votingRound.save();
    let embedContent = getNameOfVotingRoundEmbed(
      votingRound.votingSystem,
      votingRound.onlyTokenHolderCanVote,
      votingRound.verificationMethod,
      votingRound.tokenName,
      votingRound.roundDurationInDays,
      storeVotesOnChain.toString()
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
      if (verificationMethod === "Ethereum Wallet") {
        votingRound.blockchain = "Ethereum";
        embedContent = getEthereumSelectTokenEmbed(
          votingRound.votingSystem,
          true,
          verificationMethod
        );
        const tokenInWallet = getSelectTokenMenu(
          discordUser.ethereumTokenInWallet
        );
        component = getSelectTokenMenu(tokenInWallet);
      } else if (verificationMethod === "Cardano Wallet") {
        votingRound.blockchain = "Cardano";
        embedContent = getCardanoSelectTokenEmbed(
          votingRound.votingSystem,
          true,
          verificationMethod
        );
        component = getSelectTokenMenu(discordUser.cardanoTokenInWallet);
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
  const token = discordUser.cardanoTokenInWallet.find(
    (token) => token.tokenIdentifier === tokenIdentifier
  );
  if (tokenIdentifier === "Enter Manually") {
    const modal = getSelectTokenModal();
    return interaction.showModal(modal);
  } else {
  }
  votingRound.tokenIdentiferOnBlockchain = tokenIdentifier;
  votingRound.tokenName = token.tokenName;
  await votingRound.save();
  const embedContent = getEnableKYCEmbed(
    votingRound.votingSystem,
    true,
    votingRound.verificationMethod,
    votingRound.tokenName
  );
  const component = getEnableKYCMenu();
  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    files: [image],
    components: [component],
  });
};

// Since there is no way of perserving state of interaction,
// we will create a pending proposal for the user to store the states between
// interactions. If the user already has a pending proposal, we will update the voting round id
// they also need to select the wallet they want to use to represent themselves.
const handleListOfProposalsMenu = async (interaction) => {
  const votingRoundId = interaction.values[0];
  const votingRound = await VotingRound.findOne({
    votingRoundId: votingRoundId,
  });
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

  // const isVerified = await checkIfVerified(interaction, votingRound);
  // if (!isVerified) {
  //   return;
  // }

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

module.exports = {
  handleVotingSystemMenu,
  handleSelectIfOnlyTokenHolderCanVoteMenu,
  handleSelectTokenMenu,
  handleSelectSSIAndKYCMenu,
  handleRoundDurationMenu,
  handleOnChainOrOffChainVotingMenu,
  handleSelectVerificationMethodMenu,
  handleListOfProposalsMenu,
};
