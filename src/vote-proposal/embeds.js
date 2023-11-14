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
    "🗳️ Vote Proposal 🗳️ ",
    `To vote for a proposal please first select the voting round you want to participate in \n 
      `
  );
  return embed;
};

const getVoteQVFProposalEmbed = () => {
  const embed = createEmbed(
    "🗳️ Vote Proposal 🗳️ ",
    `To vote for a proposal please enter the name of the proposal you want to vote for. You will specify a percentage of your voting power(amount of voting asset you have in your wallet) to give to the proposal. \n
       Please note the maximum percentage of voting power you can allocate across all proposal is 100%. \n
      `
  );
  return embed;
};

module.exports = {
  getProposalVotedEmbed,
  getVoteProposalInfoEmbed,
  getVoteProposalSelectVotingRoundEmbed,
  getVoteQVFProposalEmbed,
};
