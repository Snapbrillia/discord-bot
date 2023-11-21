const { Proposal } = require("../../models/projectProposal.model");
const { getImage } = require("../../utils/discordUtils");
const { getVoteProposalButton } = require("./buttons");
const { getSelectProposalEmbed } = require("./embeds");
const { getProposalDropdownMenu } = require("./selectMenus");

const handleSelectProposalMenu = async (interaction) => {
  const votingRoundId = interaction.values[0];

  const proposals = await Proposal.find({
    votingRoundId,
    status: "active",
  });

  const voteProposalEmbed = getSelectProposalEmbed();
  const voteProposalDropdown = getProposalDropdownMenu(proposals);
  const image = getImage();

  interaction.reply({
    embeds: [voteProposalEmbed],
    files: [image],
    components: [voteProposalDropdown],
  });
};

const handleVoteProposalMenu = async (interaction) => {
  console.log(interaction.values[0]);

  console.log("hiy");
  const embed = getSelectProposalEmbed();
  const button = getVoteProposalButton();

  interaction.reply({
    embeds: [embed],
    components: [button],
  });
};

module.exports = {
  handleSelectProposalMenu,
  handleVoteProposalMenu,
};
