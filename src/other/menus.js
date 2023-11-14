const { buildActionRow } = require("../../utils/discordUtils");

const getListOfVotingRoundMenu = (votingRound, action) => {
  const selectMenu = [];
  for (let i = 0; i < votingRound.length; i++) {
    selectMenu.push({
      label: votingRound[i].votingRoundName,
      description: `Voting System: ${votingRound[i].votingSystem}`,
      value: votingRound[i]._id.toString(),
    });
  }
  let id;
  if (action === "vote") {
    id = "selectVoteProposalVotingRoundMenu";
  } else {
    id = "selectRegisterProposalVotingRoundMenu";
  }

  const actionRow = buildActionRow(selectMenu, "Select Voting Round", id);
  return actionRow;
};

module.exports = {
  getListOfVotingRoundMenu,
};
