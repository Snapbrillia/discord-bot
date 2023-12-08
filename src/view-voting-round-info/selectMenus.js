const { buildActionRow } = require("../../utils/discordUtils");

const getVotingRoundsMenu = (votingRounds) => {
  const selectMenu = [];
  for (let i = 0; i < votingRounds.length; i++) {
    selectMenu.push({
      label: votingRounds[i].votingRoundName,
      description: `Voting System: ${votingRounds[i].votingSystem}`,
      value: votingRounds[i]._id.toString(),
    });
  }

  const actionRow = buildActionRow(
    selectMenu,
    "Select Voting Round",
    "selectViewInfoVotingRoundMenu"
  );
  return actionRow;
};

module.exports = {
  getVotingRoundsMenu,
};
