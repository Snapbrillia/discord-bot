const { createEmbed } = require("../../utils/discordUtils");

const getQuadraticVotingResultsEmbed = (votingRound, projectInfo) => {
  let proposals = "";
  projectInfo.forEach((project) => {
    proposals += `**${project.projectInfo.proposalName}** \n
      🏆 Prize Weight : **${project.prizeWeight.toFixed(2)}** \n
      👥 Total Unique Voters: **${project.totalUniqueVoters}** \n
      💰 Total ADA Votes Registered: **${project.totalAdaVotesRegistered}** \n
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

const getVotingRoundsEmbed = () => {
  const embed = createEmbed(
    "Voting Rounds",
    `Select the voting round you want to view. \n
       `
  );
  return embed;
};

const getVotingRoundInfoEmbed = (votingRound, proposals) => {
  const heightestPrizeWeightProposal = proposals.reduce((prev, current) => {
    return prev.prizeWeight > current.prizeWeight ? prev : current;
  });

  let proposalsEmbed = "";
  proposals.forEach((project) => {
    proposalsEmbed += `💡Proposal name: **${project.name}** \n
      📝Proposal Description: **${project.description}** \n
      👥Total Unique Voters: **${project.uniqueVoters}** \n
      🏆Estimated Proposal Weight: **${project.proposalWeight}** \n  \n
      `;
  });

  const embed = createEmbed(
    "🗳️ Voting Round Status 🗳️",
    `\n**Voting Round** \n
     🏷️ Voting Round Name: **${votingRound.votingRoundName}** \n
     📝 Voting Round Purpose: **${votingRound.votingRoundPurpose}** \n
     📊 Total Registered Proposals: **${votingRound.proposalsSubmitted}** \n
     👥 Total Unique Voters: **${votingRound.uniqueVoters}** \n 
     🏆 Estimated Highest Prize Weight Proposal: **${heightestPrizeWeightProposal.name}** \n \n
     **Proposals Submitted** \n
     ${proposalsEmbed} \n
    `
  );
  return embed;
};

module.exports = {
  getQuadraticVotingResultsEmbed,
  getVotingRoundsEmbed,
  getVotingRoundInfoEmbed,
};
