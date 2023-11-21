const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

const getPrimaryButton = (customId, label) => {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(customId)
      .setLabel(label)
      .setStyle(ButtonStyle.Primary)
  );
  return row;
};

const createEmbed = (title, description) => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setAuthor({
      name: "Snapbrillia",
      url: "https://snapbrillia.com",
      iconURL: `attachment://snapicon.png`,
    })
    .setThumbnail(`attachment://snapicon.png`)
    .setColor("#a900a6");
  return embed;
};

const buildActionRow = (selectMenu, placeholder, id) => {
  const actionRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(id)
      .setPlaceholder(placeholder)
      .addOptions(selectMenu)
  );
  return actionRow;
};

const getImage = () => {
  return new AttachmentBuilder(`${process.cwd()}/assets/snapicon.png`);
};

const getDisabledButton = (label) => {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("disabled")
      .setLabel(label)
      .setDisabled(true)
      .setStyle(ButtonStyle.Primary)
  );
  return row;
};

module.exports = {
  getPrimaryButton,
  createEmbed,
  buildActionRow,
  getImage,
  getDisabledButton,
};
