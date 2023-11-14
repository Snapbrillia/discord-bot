const { buildActionRow } = require("../../utils/discordUtils");

const getVoteQVFProposalDropdownMenu = (proposals) => {
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

module.exports = {
  getVoteQVFProposalDropdownMenu,
  getListOfProposalMenu,
};
