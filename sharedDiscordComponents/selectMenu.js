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
      label: "Quadratic Voting (Tokens In Wallet)",
      description:
        "Each user can vote with the amount of tokens they have in their wallet",
      value: "Quadratic Voting (Tokens In Wallet)",
    },
    {
      label: "Quadratic Voting (Same Voting Power)",
      description: "Each user can vote with the same amount of tokens",
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

const getSelectIfOnlyTokenHolderCanVoteMenu = () => {
  const selectMenu = [
    {
      label: "Yes",
      description: "Only tokens of a specific token can vote",
      value: "Yes",
    },
    {
      label: "No",
      description: "They can vote as long as they are verified",
      value: "No",
    },
  ];
  const actionRow = buildActionRow(
    selectMenu,
    "Select Voting Permissions",
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

const getSelectVerificationMenu = (showWalletVerificationOnly) => {
  const selectMenu = [
    {
      label: "Ethereum Wallet",
      description: "Users will need to verify their Ethereum wallet address",
      value: "Ethereum Wallet",
    },
    {
      label: "Cardano Wallet",
      description: "Users will need to verify their Cardano wallet address",
      value: "Cardano Wallet",
    },
  ];
  if (!showWalletVerificationOnly) {
    selectMenu.push({
      label: "Discord Verification",
      description:
        "Users can participate as long as they are a member of the server",
      value: "Discord Verification",
    });
  }
  const actionRow = buildActionRow(
    selectMenu,
    "Select Verification Method",
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

const getListOfProposalMenu = (votingRound) => {
  const selectMenu = [];
  for (let i = 0; i < votingRound.length; i++) {
    selectMenu.push({
      label: votingRound[i].votingRoundName,
      description: `Voting System: ${votingRound[i].votingSystem}`,
      value: votingRound[i].votingRoundId,
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
      label: "On-chain",
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

const getEnableKYCMenu = () => {
  const selectMenu = [
    {
      label: "Yes",
      description: "SSI and KYC enabled authentication",
      value: "Yes",
    },
    {
      label: "No",
      description: "No SSI and KYC enabled authentication",
      value: "No",
    },
  ];
  const actionRow = buildActionRow(
    selectMenu,
    "Select Enable SSI and KYC",
    "selectSSIAndKYCMenu"
  );
  return actionRow;
};

module.exports = {
  getSelectVotingSystemMenu,
  getSelectIfOnlyTokenHolderCanVoteMenu,
  getSelectRoundDurationMenu,
  getSelectVerificationMenu,
  getSelectTokenMenu,
  getSelectVotingOnChainMenu,
  getListOfProposalMenu,
  getEnableKYCMenu,
};
