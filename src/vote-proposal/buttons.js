const { getPrimaryButton } = require("../../utils/discordUtils");

const getVoteProposalQVFButton = () => {
  const button = getPrimaryButton("voteProposalQVFButton", "Vote Proposal");
  return button;
};

const getConfirmVoteButton = () => {
  const button = getPrimaryButton("confirmVoteProposalButton", "Confirm Vote");
  return button;
};

module.exports = {
  getVoteProposalQVFButton,
  getConfirmVoteButton,
};
