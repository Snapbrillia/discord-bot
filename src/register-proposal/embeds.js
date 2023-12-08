const { createEmbed } = require("../../utils/discordUtils");

const getRegisterProposalEmbed = () => {
  const embed = createEmbed(
    "📝 Register Proposal 📝 ",
    `Select the voting round you want to participate in. \n
      `
  );
  return embed;
};

const getEnterProposalInformationEmbed = (votingRound) => {
  const embed = createEmbed(
    "📌📃 Register Proposal 📃📌",
    `Please enter the name and description of your proposal. \n
    🔧** Proposal Info**🔧 \n
     Voting Round Selected: **${votingRound.votingRoundName}** \n
     Voting Round Purpose: **${votingRound.votingRoundPurpose}** \n
    `
  );
  return embed;
};

const getConfirmProposalInfoEmbed = (proposalInfo, votingRound) => {
  const embed = createEmbed(
    "📝 Confirm Proposal Info 📝 ",
    `Please confirm the following information about your proposal \n
    🔧** Proposal Info**🔧 \n
        Voting Round Selected: **${votingRound.votingRoundName}** \n
        Voting Round Purpose: **${votingRound.votingRoundPurpose}** \n
        Proposal Name: **${proposalInfo.name}**\n
        Proposal Description: **${proposalInfo.description}**\n
        `
  );
  return embed;
};

const getProposalRegisteredEmbed = (proposalInfo, votingRound) => {
  const embed = createEmbed(
    "📝 Proposal Registered 📝 ",
    `Your proposal has been registered. \n
    🔧** Proposal Info**🔧 \n
    Voting Round Selected: **${votingRound.votingRoundName}** \n
    Voting Round Purpose: **${votingRound.votingRoundPurpose}** \n
    Proposal Name: **${proposalInfo.name}**\n
    Proposal Description: **${proposalInfo.description}**\n
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
