const { getPrimaryButton } = require("../../utils/discordUtils");

const getRegisterProposalButton = () => {
  const button = getPrimaryButton(
    "registerProposalButton",
    "Register Proposal"
  );
  return button;
};

const getConfirmRegisterProposalButton = () => {
  const button = getPrimaryButton(
    "confirmProposalButton",
    "Confirm Register Proposal"
  );
  return button;
};

module.exports = {
  getRegisterProposalButton,
  getConfirmRegisterProposalButton,
};
