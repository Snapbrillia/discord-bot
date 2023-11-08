const { buildActionRow } = require("../../shared/utils");

const getSelectQVFVoteAllocationMenu = () => {
  const selectMenu = [
    {
      label: "Equal Vote Allocation",
      description: "Only holders of a specific token can participate",
      value: "equal",
    },
    {
      label: "Vote Allocation Based On Token Holdings",
      description:
        "They can participate as long as they are part of your discord server",
      value: "token",
    },
  ];
  const actionRow = buildActionRow(
    selectMenu,
    "Select Vote Allocation Method",
    "selectQVFVoteAllocationMenu"
  );
  return actionRow;
};

const getSelectBlockchainMenu = () => {
  const selectMenu = [
    {
      label: "Ethereum Blockchain",
      description: "The voting round will be on the Ethereum blockchain",
      value: "Ethereum Blockchain",
    },
    {
      label: "Cardano Blockchain",
      description: "The voting round will be on the Cardano blockchain",
      value: "Cardano Blockchain",
    },
  ];

  const actionRow = buildActionRow(
    selectMenu,
    "Select Blockchain",
    "selectVerificationMethodMenu"
  );
  return actionRow;
};

const getSelectIfOnlyTokenHolderCanVoteMenu = () => {
  const selectMenu = [
    {
      label: "Only Specific Token Holders",
      description: "Only holders of a specific token can participate",
      value: "Yes",
    },
    {
      label: "Everyone Can Participate",
      description:
        "They can participate as long as they are part of your discord server",
      value: "No",
    },
  ];
  const actionRow = buildActionRow(
    selectMenu,
    "Select Participation Permission",
    "selectIfOnlyTokenHolderCanVoteMenu"
  );
  return actionRow;
};

module.exports = {
  getSelectQVFVoteAllocationMenu,
  getSelectBlockchainMenu,
  getSelectIfOnlyTokenHolderCanVoteMenu,
};
