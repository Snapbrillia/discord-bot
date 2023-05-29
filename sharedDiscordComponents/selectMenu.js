const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

const buildActionRow = (selectMenu, placeholder, id) => {
  const actionRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(id)
      .setPlaceholder(placeholder)
      .addOptions(selectMenu)
  );
  return actionRow;
};

const getSelectVotingSystemMenu = () => {
  const selectMenu = [
    {
      label: "Single Vote",
      description: "Each user can only vote once",
      value: "Single Vote",
    },
    {
      label: "Yes/No Voting",
      description: "Each user can only vote yes or no to a proposal",
      value: "Yes/No Voting",
    },
    {
      label: "Regular Voting (Tokens In Wallet)",
      description:
        "Each user can vote with the amount of tokens they have in their wallet.",
      value: "Regular Voting (Tokens In Wallet)",
    },
    {
      label: "Quadratic Voting (Tokens In Wallet)",
      description:
        "Quadratic Voting with voting power based on the amount of tokens they have in their wallet",
      value: "Quadratic Voting (Tokens In Wallet)",
    },
    {
      label: "Quadratic Voting (Same Voting Power)",
      description: "Quadratic Voting with the same voting power for each user",
      value: "Quadratic Voting (Same Voting Power)",
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

const getSelectTokenMenu = (tokens) => {
  let selectMenu = [];

  for (let i = 0; i < tokens.length && i < 23; i++) {
    selectMenu.push({
      label: tokens[i].tokenName,
      description: tokens[i].tokenIdentifier,
      value: tokens[i].tokenIdentifier,
    });
    console.log(selectMenu);
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

const getSelectVotingOnChainMenu = () => {
  const selectMenu = [
    {
      label: " ",
      description: "Store the votes on chain",
      value: "On-chain",
    },
    {
      label: "Off-chain",
      description: "Do not store the votes on chain",
      value: "Off-chain",
    },
  ];
  const actionRow = buildActionRow(
    selectMenu,
    "Select On-chain or Off-chain Voting",
    "selectOnChainOrOffChainVotingMenu"
  );
  return actionRow;
};

const getEnableSSIAuthMenu = () => {
  const selectMenu = [
    {
      label: "Yes",
      description: "Enable Self-Soverign Identity Auth",
      value: "Yes",
    },
    {
      label: "No",
      description: "Disable Self-Soverign Identity Auth",
      value: "No",
    },
  ];
  const actionRow = buildActionRow(
    selectMenu,
    "Select Enable Self-Soverign Identity Auth",
    "selectSSIAuthMenu"
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

const getSnapbrilliaWalletLoginMenu = () => {
  const selectMenu = [
    {
      label: "Email Login",
      description: "Snapbrillia Wallet Login with Email",
      value: "Email Login",
    },
    {
      label: "Phone Login",
      description: "Snapbrillia Wallet Login with Phone",
      value: "Phone Login",
    },
  ];
  const actionRow = buildActionRow(
    selectMenu,
    "Select Login Method",
    "selectSnapbrilliaWalletLoginMenu"
  );

  return actionRow;
};

module.exports = {
  getSelectVotingSystemMenu,
  getSelectIfOnlyTokenHolderCanVoteMenu,
  getSelectRoundDurationMenu,
  getSelectBlockchainMenu,
  getSelectTokenMenu,
  getSelectVotingOnChainMenu,
  getListOfProposalMenu,
  getListOfVotingRoundMenu,
  getEnableSSIAuthMenu,
  getSelectLinkWalletMenu,
  getViewPeronalInfoMenu,
  getSnapbrilliaWalletLoginMenu,
};
