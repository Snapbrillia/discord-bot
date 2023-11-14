const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

const getSelectVotingTokenModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("votingTokenModal")
    .setTitle("Select Token");

  const tokenInput = new TextInputBuilder()
    .setCustomId("tokenInput")
    .setLabel("Token that will be used to vote")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(tokenInput);

  modal.addComponents(firstActionRow);
  return modal;
};

const getSelectWhitelistTokenModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("whitelistTokenModal")
    .setTitle("Select Token");

  const tokenInput = new TextInputBuilder()
    .setCustomId("tokenInput")
    .setLabel("Token required to participate")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(tokenInput);

  modal.addComponents(firstActionRow);
  return modal;
};

const getNameOfVotingRoundModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("nameOfVotingRoundModal")
    .setTitle("Confirm Name Of Voting Round");

  const nameOfVotingRoundInput = new TextInputBuilder()
    .setCustomId("nameOfVotingRoundInput")
    .setLabel("Name of the voting round")
    .setStyle(TextInputStyle.Short);

  const purposeOfVotingRound = new TextInputBuilder()
    .setCustomId("purposeOfVotingRoundInput")
    .setLabel("Purpose of the voting round")
    .setStyle(TextInputStyle.Paragraph);

  const firstActionRow = new ActionRowBuilder().addComponents(
    nameOfVotingRoundInput
  );
  const secondActionRow = new ActionRowBuilder().addComponents(
    purposeOfVotingRound
  );

  modal.addComponents(firstActionRow, secondActionRow);

  return modal;
};

module.exports = {
  getSelectVotingTokenModal,
  getSelectWhitelistTokenModal,
  getNameOfVotingRoundModal,
};
