const { createEmbed } = require("../../utils/discordUtils");

const getRegisterProposalEmbed = () => {
  const embed = createEmbed(
    "📝 Register Proposal 📝 ",
    `To register a proposal please first select the voting round you want to participate in. \n
      `
  );
  return embed;
};

const getEnterProposalInformationEmbed = (votingRound) => {
  const embed = createEmbed(
    "📌📃 Register Proposal 📃📌",
    `Please enter the name and description of your proposal. \n
    🔧** Proposal Info**🔧 \n
     Voting Round: **${votingRound.votingRoundName}** \n
    `
  );
  return embed;
};

const getConfirmProposalInfoEmbed = (proposalInfo, votingRound) => {
  const embed = createEmbed(
    "📝 Confirm Proposal Info 📝 ",
    `Please confirm the following information about your proposal \n
    🔧** Proposal Info**🔧 \n
        Voting Round: **${votingRound.votingRoundName}** \n
        Voting Round Purpose: **${votingRound.votingRoundPurpose}** \n
        Proposal Name: **${proposalInfo.proposalName}**\n
        Proposal Description: **${proposalInfo.proposalDescription}**\n
        `
  );
  return embed;
};

const getProposalRegisteredEmbed = (proposalInfo, votingRound) => {
  const embed = createEmbed(
    "📝 Proposal Registered 📝 ",
    `Your proposal has been registered. \n
    🔧** Proposal Info**🔧 \n
    Voting Round: **${votingRound.votingRoundName}** \n
    Voting Round Purpose: **${votingRound.votingRoundPurpose}** \n
    Proposal Name: **${proposalInfo.proposalName}**\n
    Proposal Description: **${proposalInfo.proposalDescription}**\n
    `
  );
  return embed;
};

module.exports = {
  getRegisterProposalEmbed,
  getEnterProposalInformationEmbed,
  getConfirmProposalInfoEmbed,
  getProposalRegisteredEmbed,
};
