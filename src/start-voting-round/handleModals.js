const { VotingRound } = require("../../models/votingRound.model");
const { getTokenFromPolicyId } = require("../../utils/cardanoUtils");
const { getImage } = require("../../utils/discordUtils");
const { getTokenFromAddress } = require("../../utils/ethereumUtils");
const { getConfirmVotingRoundInfoButton } = require("./buttons");
const {
  getEnableKYCEmbed,
  getWhitelistTokenEnabledEmbed,
  getVotingRoundInfoEmbed,
} = require("./embeds");
const {
  getWhitelistTokenEnabledMenu,
  getEnableSSIAuthMenu,
} = require("./selectMenus");

const handleVotingTokenModal = async (interaction) => {
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

  votingRound.votingTokenIdentifer = token;
  votingRound.votingTokenName = tokenName;
  await votingRound.save();

  const embed = getWhitelistTokenEnabledEmbed(votingRound);
  const components = getWhitelistTokenEnabledMenu();
  const image = getImage();

  interaction.reply({
    embeds: [embed],
    components: [components],
    files: [image],
  });
};

const handleWhitelistTokenModal = async (interaction) => {
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

  votingRound.whitelistTokenIdentifier = token;
  votingRound.whitelistTokenName = tokenName;
  await votingRound.save();

  const embed = getEnableKYCEmbed(votingRound);
  const components = getEnableSSIAuthMenu();
  const image = getImage();

  interaction.reply({
    embeds: [embed],
    components: [components],
    files: [image],
  });
};

const handleNameOfVotingRoundModal = async (interaction) => {
  const votingRoundName = interaction.fields.getTextInputValue(
    "nameOfVotingRoundInput"
  );
  const votingRoundPurpose = interaction.fields.getTextInputValue(
    "purposeOfVotingRoundInput"
  );
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
    status: "pending",
  });
  votingRound.votingRoundName = votingRoundName;
  votingRound.votingRoundPurpose = votingRoundPurpose;
  await votingRound.save();
  const image = getImage();
  const embed = getVotingRoundInfoEmbed(votingRound);
  const confirmVotingRoundInfoButton = getConfirmVotingRoundInfoButton();
  interaction.reply({
    embeds: [embed],
    components: [confirmVotingRoundInfoButton],
    files: [image],
  });
};

module.exports = {
  handleVotingTokenModal,
  handleWhitelistTokenModal,
  handleNameOfVotingRoundModal,
};
