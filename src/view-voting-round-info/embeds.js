const { createEmbed } = require("../../utils/discordUtils");

const getQuadraticVotingResultsEmbed = (votingRound, projectInfo) => {
  let proposals = "";
  projectInfo.forEach((project) => {
    proposals += `**${project.projectInfo.proposalName}** \n
      🏆 Prize Weight : **${project.prizeWeight.toFixed(2)}** \n
      👥 Total Unique Voters: **${project.totalUniqueVoters}** \n
      💰 Total ADA Votes Registered: **${project.totalAdaVotesRegistered}** \n
      📉 Total Down ADA Votes Registered: **${
        project.totalDownAdaVotesRegistered
      }** \n \n
      `;
  });

  const embed = createEmbed(
    "Voting Round Results",
    `📊 Total Registered Proposals: ${votingRound.totalRegisteredProposals} \n
       👥 Total Unique Voters: ${votingRound.totalUnqiueVoters} \n
       💰 Total ADA Votes Registered: ${votingRound.totalAdaVotesRegistered} \n
       📉 Total Down ADA Votes Registered: ${votingRound.totalDownAdaVotesRegistered} \n \n
        ${proposals} \n
       `
  );
  return embed;
};

module.exports = {
  getQuadraticVotingResultsEmbed,
};
