const { Proposal } = require("../../models/projectProposal.model");
const { VotingRound } = require("../../models/votingRound.model");
const { getEnterProposalInformationEmbed } = require("./embeds");
const { checkIfVerified } = require("../../utils/sharedUtils");
const { getRegisterProposalButton } = require("./buttons");
const { getImage } = require("../../utils/discordUtils");

const handleRegisterProposalVotingRoundMenu = async (interaction) => {
  const votingRoundId = interaction.values[0];
  const votingRound = await VotingRound.findOne({
    serverId: interaction.guildId,
  });
  if (votingRound.onlyTokenHolderCanVote) {
    const isVerified = await checkIfVerified(interaction, votingRound);
    if (!isVerified) {
      return;
    }
  }
  const existingProposal = await Proposal.findOne({
    serverId: interaction.guildId,
    votingRoundId: votingRoundId,
    discordId: interaction.user.id,
    status: "pending",
  });
  if (existingProposal) {
    existingProposal.votingRoundId = votingRoundId;
    await existingProposal.save();
  } else {
    await Proposal.create({
      serverId: interaction.guildId,
      votingRoundId: votingRoundId,
      discordId: interaction.user.id,
      status: "pending",
    });
  }
  // const hasParticipatedInRound = await checkIfUserHasParticipatedInRound();

  const image = getImage();
  let embed = getEnterProposalInformationEmbed();
  let button = getRegisterProposalButton();

  interaction.reply({
    embeds: [embed],
    files: [image],
    components: [button],
  });
};

module.exports = {
  handleRegisterProposalVotingRoundMenu,
};
