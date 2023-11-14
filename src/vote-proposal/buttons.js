const { getPrimaryButton } = require("../../utils/discordUtils");

const getVoteProposalButton = () => {
  const button = getPrimaryButton("voteProposalButton", "Vote Proposal");
  return button;
};

const getConfirmVoteButton = () => {
  const button = getPrimaryButton("confirmVoteProposalButton", "Confirm Vote");
  return button;
};

module.exports = {
  getVoteProposalButton,
  getConfirmVoteButton,
};
