const { Proposal } = require("../../models/projectProposal.model");
const { VotingRound } = require("../../models/votingRound.model");
const { getImage } = require("../../utils/discordUtils");
const { getConfirmRegisterProposalButton } = require("./buttons");
const { getConfirmProposalInfoEmbed } = require("./embeds");

const handleRegisterProposalModal = async (interaction) => {
  const proposal = await Proposal.findOne({
    discordId: interaction.user.id,
    status: "pending",
    serverId: interaction.guildId,
  });

  const votingRound = await VotingRound.findOne({
    _id: proposal.votingRoundId,
  });

  const proposalName =
    interaction.fields.getTextInputValue("proposalNameInput");
  const proposalDescription = interaction.fields.getTextInputValue(
    "proposalDescriptionInput"
  );

  const projectInfo = {
    proposalName,
    proposalDescription,
  };

  proposal.name = proposalName;
  proposal.description = proposalDescription;

  await proposal.save();

  const image = getImage();
  const registerProposalButton = getConfirmRegisterProposalButton();
  interaction.reply({
    embeds: [
      getConfirmProposalInfoEmbed(projectInfo, votingRound.votingRoundName),
    ],
    components: [registerProposalButton],
    files: [image],
  });
};

module.exports = {
  handleRegisterProposalModal,
};
