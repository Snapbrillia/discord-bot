const { VotingRound } = require("../models/votingRound.model");
const {
  getListOfVerifiedEmbed,
  getWalletVerificationEmbed,
  getVotingRoundDurationEmbed,
  getSelectIfOnlyTokenHolderCanVoteEmbed,
  getEthereumSelectTokenEmbed,
  getCardanoSelectTokenEmbed,
} = require("../sharedDiscordComponents/embeds");
const { getImage } = require("../sharedDiscordComponents/image");
const {
  getSelectRoundDurationMenu,
  getSelectVerificationMenu,
  getSelectIfOnlyTokenHolderCanVoteMenu,
  getSelectTokenMenu,
} = require("../sharedDiscordComponents/selectMenu");

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
    await VotingRound.create({
      serverId: interaction.guildId,
      votingSystem,
      status: "pending",
    });
  }
  let embedContent = "";
  let confirmVerificationButton = "";
  if (votingSystem === "Quadratic Voting (Tokens In Wallet)") {
    embedContent = getWalletVerificationEmbed(votingSystem);
    confirmVerificationButton = getSelectVerificationMenu();
  } else {
    embedContent = getSelectIfOnlyTokenHolderCanVoteEmbed(votingSystem);
    confirmVerificationButton = getSelectIfOnlyTokenHolderCanVoteMenu();
  }
  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    components: [confirmVerificationButton],
    files: [image],
  });
};

const handleSelectIfOnlyTokenHolderCanVoteMenu = async (interaction) => {
  const onlyTokenHolderCanVoteValue = interaction.values[0];
  const pendingVotingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  let onlyTokenHolderCanVote = false;
  if (onlyTokenHolderCanVoteValue === "Yes") {
    onlyTokenHolderCanVote = true;
  }
  pendingVotingRound.onlyTokenHolderCanVote = onlyTokenHolderCanVote;
  await pendingVotingRound.save();
  let embedContent = "";
  let confirmVerificationMenu = "";
  if (
    pendingVotingRound.votingSystem === "Quadratic Voting (Tokens In Wallet)"
  ) {
    const showWalletVerificationOnly = true;
    embedContent = getWalletVerificationEmbed(
      pendingVotingRound.votingSystem,
      onlyTokenHolderCanVote
    );
    confirmVerificationMenu = getSelectVerificationMenu(
      showWalletVerificationOnly
    );
  }
  embedContent = getListOfVerifiedEmbed(
    pendingVotingRound.votingSystem,
    onlyTokenHolderCanVote
  );
  confirmVerificationMenu = getSelectVerificationMenu();

  const image = getImage();

  interaction.reply({
    embeds: [embedContent],
    components: [confirmVerificationMenu],
    files: [image],
  });
};

const handleRoundDurationMenu = async (interaction) => {
  try {
    const votingRound = await VotingRound.findOne({
      serverId: interaction.guildId,
      status: "pending",
    });
    const roundDurationInDays = interaction.values[0];
    votingRound.roundDurationInDays = parseInt(roundDurationInDays);
    await votingRound.save();
    let embedContent = getListOfVerifiedEmbed(votingRound);
    let confirmVerificationButton = getSelectVerificationMenu();
    if (votingRound.votingSystem === "Quadratic Voting (Tokens In Wallet)") {
      const showWalletVerificationOnly = true;
      embedContent = getWalletVerificationEmbed(votingRound);
      confirmVerificationButton = getSelectVerificationMenu(
        showWalletVerificationOnly
      );
    }
    const image = getImage();
    interaction.reply({
      embeds: [embedContent],
      components: [confirmVerificationButton],
      files: [image],
    });
  } catch (error) {
    console.log(error);
  }
};

const handleSelectVerificationMethodMenu = async (interaction) => {
  try {
    const verificationMethod = interaction.values[0];
    const votingRound = await VotingRound.findOne({
      serverId: interaction.guildId,
      status: "pending",
    });
    votingRound.verificationMethod = verificationMethod;
    let embedContent = "";
    if (verificationMethod === "Ethereum Wallet") {
      votingRound.blockchain = "Ethereum";
      embedContent = getEthereumSelectTokenEmbed();
    } else if (verificationMethod === "Cardano Wallet") {
      votingRound.blockchain = "Cardano";
      embedContent = getCardanoSelectTokenEmbed();
    } else if (verificationMethod === "Discord Account") {
      votingRound.blockchain = "Discord";
      embedContent = getVotingRoundDurationEmbed();
    }

    await votingRound.save();

    const image = getImage();

    const selectTokenMenu = getSelectIfOnlyTokenHolderCanVote();
    let button = "";

    interaction.reply({
      embeds: [embedContent],
      files: [image],
      components: [selectTokenMenu],
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleVotingSystemMenu,
  handleSelectIfOnlyTokenHolderCanVoteMenu,
  handleRoundDurationMenu,
  handleSelectVerificationMethodMenu,
};
