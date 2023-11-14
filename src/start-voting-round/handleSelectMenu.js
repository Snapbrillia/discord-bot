const { DiscordUser } = require("../../models/discordUser.model");
const { VotingRound } = require("../../models/votingRound.model");
const {
  getSelectVotingTokenModal,
  getSelectWhitelistTokenModal,
} = require("./modals");
const { getSelectTokenMenu, getEnableSSIAuthMenu } = require("./selectMenus");
const { getImage } = require("../../utils/discordUtils");
const { getNameOfVotingRoundButton } = require("./buttons");
const {
  getSelectQVFVotingMethodEmbed,
  getWhitelistTokenEnabledEmbed,
  getCardanoVotingTokenEmbed,
  getWhitelistTokenEmbed,
  getEnableKYCEmbed,
  getVotingRoundDurationEmbed,
  getEthereumSelectTokenEmbed,
  getEnterNameAndDescriptionEmbed,
} = require("./embeds");
const {
  getSelectQVFVoteAllocationMenu,
  getWhitelistTokenEnabledMenu,
  getSelectRoundDurationMenu,
} = require("./selectMenus");

const handleVotingSystemMenu = async (interaction) => {
  const votingSystem = interaction.values[0];

  const pendingVotingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });

  if (pendingVotingRound) {
    pendingVotingRound.deleteOne();
  }

  await VotingRound.create({
    serverId: interaction.guildId,
    votingSystem,
    status: "pending",
  });

  if (votingSystem === "Quadratic Voting") {
    const embedContent = getSelectQVFVotingMethodEmbed();
    const nameOfVotingRoundButton = getSelectQVFVoteAllocationMenu();
    const image = getImage();

    return interaction.update({
      embeds: [embedContent],
      components: [nameOfVotingRoundButton],
      files: [image],
    });
  }

  let embedContent = getWhitelistTokenEnabledEmbed(votingSystem);
  const ifOnlyTokenHolderCanVoteMenu = getWhitelistTokenEnabledMenu();
  const image = getImage();

  interaction.update({
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
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
  });

  let embedContent;
  let selectMenu;

  if (voteAllocation === "equal") {
    votingRound.votingSystem = "Quadratic Voting (Equal Votes)";
    embedContent = getWhitelistTokenEnabledEmbed(votingRound);
    selectMenu = getWhitelistTokenEnabledMenu();
  } else {
    votingRound.votingSystem = "Quadratic Voting (Token Votes)";
    embedContent = getCardanoVotingTokenEmbed(votingRound);
    selectMenu = getSelectTokenMenu(
      discordUser.cardanoTokensInWallet,
      "selectVotingTokenMenu"
    );
  }

  await votingRound.save();

  const image = getImage();
  interaction.update({
    embeds: [embedContent],
    components: [selectMenu],
    files: [image],
  });
};

const handleSelectWhitelistTokenMenu = async (interaction) => {
  const tokenIdentifier = interaction.values[0];
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
  });
  let token = discordUser.cardanoTokensInWallet.find(
    (token) => token.tokenIdentifier === tokenIdentifier
  );
  if (tokenIdentifier === "Enter Manually") {
    const modal = getSelectWhitelistTokenModal();
    return interaction.showModal(modal);
  }
  votingRound.whitelistTokenIdentifier = tokenIdentifier;
  votingRound.whitelistTokenName = token.tokenName;
  await votingRound.save();

  const embedContent = getEnableKYCEmbed(votingRound);
  const component = getEnableSSIAuthMenu();
  const image = getImage();

  interaction.update({
    embeds: [embedContent],
    files: [image],
    components: [component],
  });
};

const handleSelectVotingTokenMenu = async (interaction) => {
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
    const modal = getSelectVotingTokenModal();
    return interaction.showModal(modal);
  }
  votingRound.votingTokenIdentifer = tokenIdentifier;
  votingRound.votingTokenName = token.tokenName;
  await votingRound.save();

  const embedContent = getWhitelistTokenEnabledEmbed(votingRound);
  const component = getWhitelistTokenEnabledMenu();
  const image = getImage();
  interaction.update({
    embeds: [embedContent],
    files: [image],
    components: [component],
  });
};

const handleWhitelistTokenMenu = async (interaction) => {
  const onlyTokenHolderCanVoteValue = interaction.values[0];
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  const discordUser = await DiscordUser.findOne({
    id: interaction.user.Id,
  });

  let embedContent;
  let selectMenu;

  if (onlyTokenHolderCanVoteValue === "Yes") {
    votingRound.onlyTokenHolderCanVote = true;
    embedContent = getWhitelistTokenEmbed(votingRound);
    selectMenu = getSelectTokenMenu(
      discordUser.cardanoTokensInWallet,
      "selectWhitelistTokenMenu"
    );
  } else {
    votingRound.onlyTokenHolderCanVote = false;
    embedContent = getCardanoVotingTokenEmbed(votingRound);
    selectMenu = getSelectTokenMenu(
      discordUser.cardanoTokensInWallet,
      "selectVotingTokenMenu"
    );
  }

  await votingRound.save();

  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    components: [selectMenu],
    files: [image],
  });
};

const handleSelectVerificationMethodMenu = async (interaction) => {
  const verificationMethod = interaction.values[0];
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  votingRound.verificationMethod = verificationMethod;
  const discordUser = await DiscordUser.findOne({
    discordId: interaction.user.id,
  });
  let embedContent = getVotingRoundDurationEmbed(votingRound);
  let component = getSelectRoundDurationMenu();
  if (votingRound.onlyTokenHolderCanVote) {
    if (verificationMethod === "Ethereum Blockchain") {
      votingRound.blockchain = "Ethereum";
      embedContent = getEthereumSelectTokenEmbed(votingRound);
      component = getSelectTokenMenu(
        discordUser.ethereumTokensInWallet,
        "selectVotingTokenMenu"
      );
    } else if (verificationMethod === "Cardano Blockchain") {
      votingRound.blockchain = "Cardano";
      embedContent = getWhitelistTokenEmbed(votingRound);
      component = getSelectTokenMenu(
        discordUser.cardanoTokensInWallet,
        "selectWhitelistTokenMenu"
      );
    }
  }
  await votingRound.save();
  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    files: [image],
    components: [component],
  });
};

const handleSelectSnapbrilliaWalletAuthMenu = async (interaction) => {
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  const useSSI = interaction.values[0] === "Yes";
  votingRound.snapbrilliaWalletAuth = useSSI;
  await votingRound.save();
  const embedContent = getVotingRoundDurationEmbed(votingRound);
  const component = getSelectRoundDurationMenu();
  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    files: [image],
    components: [component],
  });
};

const handleRoundDurationMenu = async (interaction) => {
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  const roundDurationInDays = interaction.values[0];
  votingRound.roundDurationInDays = parseInt(roundDurationInDays);
  await votingRound.save();
  let embedContent = getEnterNameAndDescriptionEmbed(votingRound);
  const nameOfVotingRoundButton = getNameOfVotingRoundButton();
  const image = getImage();
  interaction.reply({
    embeds: [embedContent],
    components: [nameOfVotingRoundButton],
    files: [image],
  });
};

module.exports = {
  handleVotingSystemMenu,
  handleSelectVotingTokenMenu,
  handleSelectWhitelistTokenMenu,
  handleSelectQVFVoteAllocationMenu,
  handleWhitelistTokenMenu,
  handleSelectVerificationMethodMenu,
  handleSelectSnapbrilliaWalletAuthMenu,
  handleRoundDurationMenu,
};
