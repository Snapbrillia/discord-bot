const { AttachmentBuilder } = require("discord.js");

const getImage = () => {
  return new AttachmentBuilder(`${process.cwd()}/assets/snapicon.png`);
};

module.exports = {
  getImage,
};
