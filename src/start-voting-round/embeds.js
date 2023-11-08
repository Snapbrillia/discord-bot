const {
  createEmbed,
  getVotingRoundConfigurationText,
} = require("../../shared/utils");

const getSelectIfOnlyTokenHolderCanVoteEmbed = (votingSystem, onChainVotes) => {
  const votingConfig = {
    votingSystem: votingSystem,
    onChainVotes: onChainVotes,
  };

  const embed = createEmbed(
    "🔒🗳️️ Select Participation Permission 🗳️🔒",
    `Please select the the voting permissions for this voting round. \n \n
       ** Only Specific Token Holders ** \n Only people who hold a specific token can participate. \n
       ** Everyone Can Participate ** \n Everyone can participate as long as they are part of your discord community. \n
    ${getVotingRoundConfigurationText(votingConfig)} 
    `
  );
  return embed;
};

const getSelectQVFVotingMethodEmbed = () => {
  const embed = createEmbed(
    "🔒🗳️️ Select Allocated Votes 🗳️🔒",
    `Please select how votes will be allocated. \n \n
    ** Equal Amounts ** \n Everyone has the same amount of votes. \n
    ** Votes are allocated based on the amount of tokens held ** \n The more tokens you hold, the more votes you have. \n
    `
  );
  return embed;
};

const getSelectBlockchainEmbed = (
  votingSystem,
  onChainVotes,
  onlyTokenHolderCanVote
) => {
  const votingConfig = {
    votingSystem: votingSystem,
    onChainVotes: onChainVotes,
    onlyTokenHolderCanVote: onlyTokenHolderCanVote,
  };

  const embed = createEmbed(
    "🔒🛡️ Select Blockchain 🛡️🔒",
    `Please select the blockchain that you want the voting round to run on.\n 
       ** Ethereum Blockchain ** \n The voting round will be running on the Ethereum Blockchain.  \n
       ** Cardano Blockchain ** \n The voting round will be running on the Cardano Blockchain. \n
      ${getVotingRoundConfigurationText(votingConfig)}
    `
  );
  return embed;
};

module.exports = {
  getSelectIfOnlyTokenHolderCanVoteEmbed,
  getSelectQVFVotingMethodEmbed,
  getSelectBlockchainEmbed,
};
