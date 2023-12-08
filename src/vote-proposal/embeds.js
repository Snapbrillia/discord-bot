const { createEmbed } = require("../../utils/discordUtils");

const getProposalVotedEmbed = () => {
  const embed = createEmbed(
    "🗳️ Vote Registered 🗳️ ",
    `Your vote has been successfully registered. \n
      `
  );
  return embed;
};

const getVoteProposalInfoEmbed = (votingRound, proposal, votingPower) => {
  const embed = createEmbed(
    "🗳️ Vote Proposal Info 🗳️ ",
    `You have voted for a proposal with the following information. \n
    🔧** Vote Info**🔧 \n
    Voting Round Selected: **${votingRound.votingRoundName}** \n
    Voting Round Purpose: **${votingRound.votingRoundPurpose}** \n
    Proposal Selected: **${proposal.name}** \n
    Proposal Description: **${proposal.description}** \n
    Percentage Of Voting Power Allocated: **${votingPower}** \n
    `
  );
  return embed;
};

const getVoteProposalSelectVotingRoundEmbed = () => {
  const embed = createEmbed(
    "🗳️ Select Voting Round 🗳️ ",
    `Select the voting round you want to participate in \n 
      `
  );
  return embed;
};

const getSelectProposalEmbed = (votingRound) => {
  const embed = createEmbed(
    "🗳️ Select Proposal 🗳️ ",
    `Please select the proposal you want to vote for. \n

    🔧** Vote Info**🔧 \n
    Voting Round Selected: **${votingRound.votingRoundName}** \n
    Voting Round Purpose: **${votingRound.votingRoundPurpose}** \n
    `
  );
  return embed;
};

const getEnterVoteQVFEmbed = (votingRound, proposal) => {
  const embed = createEmbed(
    "🗳️ Enter Voting Power 🗳️ ",
    `Please enter a percentage of your voting power that you want to allocate to this proposal.\n
    🔧** Vote Info**🔧 \n
    Voting Round Selected: **${votingRound.votingRoundName}** \n
    Voting Round Purpose: **${votingRound.votingRoundPurpose}** \n
    Proposal Selected: **${proposal.name}** \n
    Proposal Description: **${proposal.description}** \n
    `
  );
  return embed;
};

module.exports = {
  getProposalVotedEmbed,
  getVoteProposalInfoEmbed,
  getVoteProposalSelectVotingRoundEmbed,
  getSelectProposalEmbed,
  getEnterVoteQVFEmbed,
};
