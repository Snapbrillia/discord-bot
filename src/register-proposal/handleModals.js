const { Proposal } = require("../../models/projectProposal.model");
const { VotingRound } = require("../../models/votingRound.model");
const { getImage, getDisabledButton } = require("../../utils/discordUtils");
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

  proposal.name = proposalName;
  proposal.description = proposalDescription;

  await proposal.save();

  const embed = getConfirmProposalInfoEmbed(proposal, votingRound);
  const button = getConfirmRegisterProposalButton();

  // const filter = (i) =>
  //   i.customId === "confirmProposalButton" && i.user.id === interaction.user.id;

  // const collector = interaction.channel.createMessageComponentCollector({
  //   filter,
  //   time: 15000,
  // });

  // const disabledButton = getDisabledButton("Confirm Register Proposal");

  // collector.on("collect", async (i) => {
  //   await i.update({ components: [disabledButton] });
  // });

  const image = getImage();

  interaction.update({
    embeds: [embed],
    components: [button],
    files: [image],
  });
};

module.exports = {
  handleRegisterProposalModal,
};
