const { VotingRound } = require("../models/votingRound.model");
const {
  getListOfVerifiedEmbed,
  getWalletVerificationEmbed,
  getVotingRoundDurationEmbed,
  getSelectIfOnlyTokenHolderCanVoteEmbed,
  getEthereumSelectTokenEmbed,
  getCardanoSelectTokenEmbed,
  getNameOfVotingRoundEmbed,
} = require("../sharedDiscordComponents/embeds");
const { getImage } = require("../sharedDiscordComponents/image");
const {
  getSelectRoundDurationMenu,
  getSelectVerificationMenu,
  getSelectIfOnlyTokenHolderCanVoteMenu,
  getSelectTokenMenu,
} = require("../sharedDiscordComponents/selectMenu");
const { getCardanoTokenInWalletMenu } = require("../utils/cardanoUtils");
const {
  getNameOfVotingRoundButton,
} = require("../sharedDiscordComponents/buttons");
const { DiscordUser } = require("../models/discordUser.model");
const { getSelectTokenModal } = require("../sharedDiscordComponents/modals");

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
    let embedContent = getNameOfVotingRoundEmbed(
      votingRound.votingSystem,
      votingRound.onlyTokenHolderCanVote,
      votingRound.verificationMethod,
      votingRound.tokenName,
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
        const tokenInWallet = await getEthereumTokenInWalletMenu(
          interaction.user.id
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
  const embedContent = getVotingRoundDurationEmbed(
    votingRound.votingSystem,
    true,
    votingRound.verificationMethod,
    token.tokenName
  );
  const component = getSelectRoundDurationMenu();
  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    files: [image],
    components: [component],
  });
};

module.exports = {
  handleVotingSystemMenu,
  handleSelectIfOnlyTokenHolderCanVoteMenu,
  handleRoundDurationMenu,
  handleSelectVerificationMethodMenu,
  handleSelectTokenMenu,
};
