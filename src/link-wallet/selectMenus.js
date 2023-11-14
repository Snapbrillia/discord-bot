const { buildActionRow } = require("../../utils/discordUtils");

const getSelectLinkWalletMenu = () => {
  const selectMenu = [
    {
      label: "Cardano Wallet",
      description: "Link your Cardano wallet",
      value: "Cardano Wallet",
    },
    {
      label: "Snapbrillia Wallet",
      description: "Link your Snapbrillia Wallet",
      value: "Snapbrillia Wallet",
    },
  ];
  const actionRow = buildActionRow(
    selectMenu,
    "Select Wallet To Link",
    "selectLinkWalletMenu"
  );
  return actionRow;
};

module.exports = {
  getSelectLinkWalletMenu,
};
