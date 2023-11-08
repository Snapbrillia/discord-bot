const { buildActionRow } = require("../shared/utils");

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

const getSelectLinkWalletMenu = () => {
  const selectMenu = [
    {
      label: "Ethereum Wallet",
      description: "Link your Ethereum wallet",
      value: "Ethereum Wallet",
    },
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

const getSelectTokenMenu = (tokens) => {
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

  const actionRow = buildActionRow(
    selectMenu,
    "Select Token",
    "selectTokenMenu"
  );
  return actionRow;
};

const getListOfVotingRoundMenu = (votingRound) => {
  const selectMenu = [];
  for (let i = 0; i < votingRound.length; i++) {
    selectMenu.push({
      label: votingRound[i].votingRoundName,
      description: `Voting System: ${votingRound[i].votingSystem}`,
      value: votingRound[i]._id.toString(),
    });
  }
  const actionRow = buildActionRow(
    selectMenu,
    "Select Voting Round",
    "selectRegisterProposalVotingRoundMenu"
  );
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

const getListOfProposalMenu = (proposals) => {
  const selectMenu = [];
  for (let i = 0; i < proposals.length; i++) {
    selectMenu.push({
      label: proposals[i].name,
      description: proposals[i].description,
      value: proposals[i]._id.toString(),
    });
  }
  const actionRow = buildActionRow(
    selectMenu,
    "Select Voting Round",
    "selectRegisterProposalVotingRoundMenu"
  );
  return actionRow;
};

const getViewPeronalInfoMenu = () => {
  const selectMenu = [
    {
      label: "Ethereum Wallet",
      description: "View information about your linked Ethereum wallet",
      value: "Ethereum Wallet",
    },
    {
      label: "Cardano Wallet",
      description: "View information about your linked Cardano wallet",
      value: "Cardano Wallet",
    },
    {
      label: "Snapbrillia Wallet",
      description: "View information about your linked Snapbrillia Wallet",
      value: "Snapbrillia Wallet",
    },
  ];
  const actionRow = buildActionRow(
    selectMenu,
    "Select Info To View",
    "selectViewPersonalInfoMenu"
  );
  return actionRow;
};

module.exports = {
  getSelectVotingSystemMenu,
  getSelectRoundDurationMenu,
  getSelectTokenMenu,
  getListOfProposalMenu,
  getListOfVotingRoundMenu,
  getEnableSSIAuthMenu,
  getSelectLinkWalletMenu,
  getViewPeronalInfoMenu,
};
