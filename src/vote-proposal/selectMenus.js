const { buildActionRow } = require("../../utils/discordUtils");

const getVotingRoundMenu = (votingRound) => {
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
    "selectVoteProposalVotingRoundMenu"
  );
  return actionRow;
};

const getProposalDropdownMenu = (proposals) => {
  const selectMenu = [];
  for (let i = 0; i < proposals.length; i++) {
    selectMenu.push({
      label: proposals[i].name,
      description: `Description: ${proposals[i].description}`,
      value: proposals[i]._id.toString(),
    });
  }

  const actionRow = buildActionRow(
    selectMenu,
    "Select Proposal",
    "selectVoteProposalMenu"
  );
  return actionRow;
};

module.exports = {
  getVotingRoundMenu,
  getProposalDropdownMenu,
};
