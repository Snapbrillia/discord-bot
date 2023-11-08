const { VotingRound } = require("../../models/votingRound.model");
const { getImage } = require("../../sharedDiscordComponents/image");
const {
  getSelectQVFVotingMethodEmbed,
  getSelectIfOnlyTokenHolderCanVoteEmbed,
  getSelectBlockchainEmbed,
} = require("./embeds");
const {
  getSelectQVFVoteAllocationMenu,
  getSelectBlockchainMenu,
  getSelectIfOnlyTokenHolderCanVoteMenu,
} = require("./selectMenus");

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

  if (votingSystem === "Quadratic Voting") {
    const embedContent = getSelectQVFVotingMethodEmbed();
    const nameOfVotingRoundButton = getSelectQVFVoteAllocationMenu();
    const image = getImage();

    return interaction.reply({
      embeds: [embedContent],
      components: [nameOfVotingRoundButton],
      files: [image],
    });
  }

  let embedContent = getSelectIfOnlyTokenHolderCanVoteEmbed(votingSystem);
  const ifOnlyTokenHolderCanVoteMenu = getSelectIfOnlyTokenHolderCanVoteMenu();
  const image = getImage();

  interaction.reply({
    embeds: [embedContent],
    components: [ifOnlyTokenHolderCanVoteMenu],
    files: [image],
  });
};

const handleSelectQVFVoteAllocationMenu = async (interaction) => {
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  const voteAllocation = interaction.values[0];

  if (voteAllocation === "equal") {
    votingRound.votingSystem = "Quadratic Voting (Equal Votes)";
  } else {
    votingRound.votingSystem = "Quadratic Voting (Token Votes)";
  }

  await votingRound.save();

  let embedContent = getSelectIfOnlyTokenHolderCanVoteEmbed(
    votingRound.votingSystem
  );
  let selectIfOnlyTokenHolderCanVoteMenu =
    getSelectIfOnlyTokenHolderCanVoteMenu();

  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    components: [selectIfOnlyTokenHolderCanVoteMenu],
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
  let selectBlockchainMenu = getSelectBlockchainMenu();

  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    components: [selectBlockchainMenu],
    files: [image],
  });
};

module.exports = {
  handleVotingSystemMenu,
  handleSelectQVFVoteAllocationMenu,
  handleSelectIfOnlyTokenHolderCanVoteMenu,
};
