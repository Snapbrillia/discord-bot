const { getPrimaryButton } = require("../../utils/discordUtils");

const getNameOfVotingRoundButton = () => {
  const button = getPrimaryButton(
    "nameOfVotingRoundButton",
    "Enter Voting Round Info"
  );
  return button;
};

const getConfirmVotingRoundInfoButton = () => {
  const button = getPrimaryButton(
    "confirmVotingRoundInfoButton",
    "Confirm Voting Round Info"
  );
  return button;
};

module.exports = {
  getNameOfVotingRoundButton,
  getConfirmVotingRoundInfoButton,
};
