const { buildActionRow } = require("../../utils/discordUtils");

const getSelectVotingSystemMenu = () => {
  const selectMenu = [
    {
      label: "Quadratic Voting(Recommended)",
      description: "Votes are calculated using the QVF formula",
      value: "Quadratic Voting",
    },
    {
      label: "Single Vote",
      description: "Voters only have one vote",
      value: "Single Vote",
    },
    {
      label: "Yes/No Vote",
      description: "For simple yes/no voting",
      value: "Yes/No Voting",
    },
    {
      label: "Tokens in Wallet Voting",
      description: "Vote with the amount tokens they have in their wallet",
      value: "Regular Voting (Tokens In Wallet)",
    },
  ];
  const actionRow = buildActionRow(
    selectMenu,
    "Select Voting System",
    "selectVotingSystemMenu"
  );
  return actionRow;
};

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

const getWhitelistTokenEnabledMenu = () => {
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
    "selectWhitelistTokenEnabledMenu"
  );
  return actionRow;
};

const getSelectRoundDurationMenu = () => {
  let selectMenu = [];
  for (let i = 1; i <= 25; i++) {
    selectMenu.push({
      label: `${i} day(s)`,
      description: `The voting round will last for ${i} day(s)`,
      value: `${i}`,
    });
  }
  const actionRow = buildActionRow(
    selectMenu,
    "Select Round Duration",
    "selectRoundDurationMenu"
  );
  return actionRow;
};

const getSelectTokenMenu = (tokens, customId) => {
  let selectMenu = [];

  for (let i = 0; i < tokens.length && i < 23; i++) {
    selectMenu.push({
      label: tokens[i].tokenName,
      description: tokens[i].tokenIdentifier,
      value: tokens[i].tokenIdentifier,
    });
    if (i === 22)
      selectMenu.push({
        label: "More Tokens",
        description: "See more tokens in your wallet",
        value: "More Tokens",
      });
  }

  selectMenu.push({
    label: "Enter Manually",
    description: "Enter the token identifier manually",
    value: "Enter Manually",
  });

  const actionRow = buildActionRow(selectMenu, "Select Token", customId);
  return actionRow;
};

const getEnableSSIAuthMenu = () => {
  const selectMenu = [
    {
      label: "Yes",
      description: "Enable Snapbrillia Wallet auth",
      value: "Yes",
    },
    {
      label: "No",
      description: "Disable Snapbrillia Wallet auth",
      value: "No",
    },
  ];
  const actionRow = buildActionRow(
    selectMenu,
    "Select Enable Snapbrillia Wallet Auth",
    "selectSnapbrilliaWalletAuthMenu"
  );
  return actionRow;
};

module.exports = {
  getSelectVotingSystemMenu,
  getSelectQVFVoteAllocationMenu,
  getSelectBlockchainMenu,
  getWhitelistTokenEnabledMenu,
  getSelectRoundDurationMenu,
  getSelectTokenMenu,
  getEnableSSIAuthMenu,
};
