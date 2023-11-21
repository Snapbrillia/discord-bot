const { createEmbed } = require("../../utils/discordUtils");

const getProposalVotedEmbed = () => {
  const embed = createEmbed(
    "🗳️ Proposal Voted 🗳️ ",
    `Your vote has been registered. \n
      `
  );
  return embed;
};

const getVoteProposalInfoEmbed = (percentageAllocated) => {
  const embed = createEmbed(
    "🗳️ Vote Proposal Info 🗳️ ",
    `You have voted for a proposal with the following information. \n
      Proposal Name: **New Discord Logo**\n
      Percentage of Voting Power Allocated: **${percentageAllocated}%**\n
    `
  );
  return embed;
};

const getVoteProposalSelectVotingRoundEmbed = () => {
  const embed = createEmbed(
    "🗳️ Select Voting Round 🗳️ ",
    `To vote for a proposal please first select the voting round you want to participate in \n 
      `
  );
  return embed;
};

const getSelectProposalEmbed = () => {
  const embed = createEmbed(
    "🗳️ Select Proposal 🗳️ ",
    `Please select the proposal you want to vote for. \n
    `
  );
  return embed;
};

module.exports = {
  getProposalVotedEmbed,
  getVoteProposalInfoEmbed,
  getVoteProposalSelectVotingRoundEmbed,
  getSelectProposalEmbed,
};
