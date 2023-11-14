const { Proposal } = require("../../models/projectProposal.model");
const { getImage } = require("../../utils/discordUtils");
const { getVoteProposalButton } = require("./buttons");
const { getVoteQVFProposalEmbed } = require("./embeds");
const { getVoteQVFProposalDropdownMenu } = require("./selectMenus");

const handleVoteProposalVotingRoundMenu = async (interaction) => {
  const votingRoundId = interaction.values[0];

  const proposals = await Proposal.find({
    votingRoundId,
    status: "active",
  });

  const voteProposalEmbed = getVoteQVFProposalEmbed();
  const voteProposalDropdown = getVoteQVFProposalDropdownMenu(proposals);
  const image = getImage();

  interaction.reply({
    embeds: [voteProposalEmbed],
    files: [image],
    components: [voteProposalDropdown],
  });
};

const handleVoteProposalMenu = async (interaction) => {
  const embed = getVoteQVFProposalEmbed();
  const button = getVoteProposalButton();

  interaction.reply({
    embeds: [embed],
    components: [button],
  });
};

module.exports = {
  handleVoteProposalVotingRoundMenu,
  handleVoteProposalMenu,
};
