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

const handleSelectVerificationMethodMenu = async (interaction) => {
  try {
    const verificationMethod = interaction.values[0];
    const votingRound = await VotingRound.findOne({
      serverId: interaction.guildId,
      status: "pending",
    });
    votingRound.verificationMethod = verificationMethod;
    let embedContent = "";
    let component = "";
    interaction.deferReply();
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
      const tokenInWallet = await getCardanoTokenInWalletMenu(
        interaction.user.id
      );
      component = getSelectTokenMenu(tokenInWallet);
    } else if (verificationMethod === "Discord Account") {
      votingRound.blockchain = "Discord";
      embedContent = getVotingRoundDurationEmbed(
        votingRound.votingSystem,
        votingRound.onlyTokenHolderCanVote,
        verificationMethod
      );
      component = getSelectRoundDurationMenu();
    }
    await votingRound.save();
    const image = getImage();
    interaction.followUp({
      embeds: [embedContent],
      files: [image],
      components: [component],
    });
  } catch (error) {
    console.log(error);
  }
};

const handleSelectTokenMenu = async (interaction) => {
  const value = interaction.values[0];
  console.log(value);
  const tokenName = value.split("-")[0];
  const tokenIdentifer = value.split("-")[1];
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  votingRound.tokenIdentiferOnBlockchain = tokenIdentifer;
  votingRound.tokenName = tokenName;
  await votingRound.save();

  const embedContent = getVotingRoundDurationEmbed(
    votingRound.votingSystem,
    true,
    votingRound.verificationMethod,
    tokenName
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
