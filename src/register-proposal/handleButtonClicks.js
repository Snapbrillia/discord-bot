const { Proposal } = require("../../models/projectProposal.model");
const { getProposalRegisteredEmbed } = require("./embeds");
const { getRegisterProposalModal } = require("./modals");
const { DiscordServer } = require("../../models/discordServer.model");
const { getImage } = require("../../utils/discordUtils");
const { VotingRound } = require("../../models/votingRound.model");
const { getEmailModal, getEmailOTPModal } = require("../link-wallet/modals");

const handleConfirmRegisterProposalButton = async (interaction) => {
  const proposal = await Proposal.findOne({
    discordId: interaction.user.id,
    status: "pending",
  });

  proposal.status = "active";
  await proposal.save();

  // await issueRegistrationCredential(proposal, interaction.user.id);
  const server = await DiscordServer.findOne({
    serverId: interaction.guildId,
  });

  const votingRound = await VotingRound.findOne({
    _id: proposal.votingRoundId,
  });

  votingRound.proposalsSubmitted += 1;
  await votingRound.save();

  const embed = getProposalRegisteredEmbed(proposal, votingRound);
  const image = getImage();

  interaction.reply({
    embeds: [embed],
    files: [image],
  });
};

const handleEnterEmailButton = async (interaction) => {
  const modal = getEmailModal();
  await interaction.showModal(modal);
};

const handleEnterEmailOTPButton = async (interaction) => {
  const modal = getEmailOTPModal();
  await interaction.showModal(modal);
};

const handleRegisterProposalButton = async (interaction) => {
  const modal = getRegisterProposalModal();
  await interaction.showModal(modal);
};

module.exports = {
  handleConfirmRegisterProposalButton,
  handleEnterEmailButton,
  handleEnterEmailOTPButton,
  handleRegisterProposalButton,
};
