const { Client, GatewayIntentBits, createChannel } = require("discord.js");
const {
  handleVerifyCardanoWalletButton,
  handleRegisterProposalButton,
  handleStartRoundButton,
  handleVoteProposalButton,
  handleDownVoteProposalButton,
  handleVerificationMethodButton,
  handleSelectTokenButton,
  handleConfirmVotingRoundInfoButton,
  handleConfirmRegisterProposalButton,
  handleConfirmVoteProposalButton,
  handleVerifyEthereumWalletButton,
} = require("./handleButtonClickActions/functions");
const {
  handleConfirmCardanoWalletAddressInputModal,
  handleVotingSystemInputModal,
  handleRegisterProposalInputModal,
  handleVoteProposalInputModal,
  handleVerificationMethodInputModal,
  handleTokenSelectInputModal,
  handleConfirmEthereumWalletAddressInputModal,
} = require("./handleModalSubmitActions/functions");
const {
  handleVerifyCardanoWalletCommand,
  handleRegisterProposalCommand,
  handleStartRoundCommand,
  handleVoteProposalCommand,
  handleDownVoteProposalCommand,
  handleGetVotingRoundResultsCommand,
  handleHelpCommand,
  handleVerifyEthereumWalletCommand,
} = require("./handleCommandActions/functions");
const { verifyCardanoUsers } = require("./utils/cardanoUtils");
const { verifyEthereumUsers } = require("./utils/ethereumUtils");
const { deployScripts } = require("./deployCommandScript");
const {
  createChannelWithOwner,
  createChannelWithUsers,
} = require("./handleGuildCreateActions/functions");

require("dotenv").config();
require("./mongodb.config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Bot is added to server. Creates private channels with admins and users
client.on("guildCreate", async (guild) => {
  const members = await guild.members.fetch();
  const owner = await guild.fetchOwner();
  createChannelWithOwner(guild, owner, client.user.id);
  members.forEach((member) => {
    console.log(member);
    if (member.user.bot) {
      return;
    }
    createChannelWithUsers(guild, member, client.user.id);
  });
  await deployScripts(guild);
});

// creare private channel with every user, private chaneel with the owner
// TODO PRIVATE CHANNEL WITH ALL USERS
// When new members join. Create a private channel with them
client.on("guildMemberAdd", (member) => {});

// Handle button clicks
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  switch (interaction.customId) {
    case "selectVotingSystemButton":
      await handleStartRoundButton(interaction);
      break;
    case "selectVerificationMethodButton":
      await handleVerificationMethodButton(interaction);
      break;
    case "selectQVTokenVerificationMethodButton":
      await handleVerificationMethodButton(interaction, true);
      break;
    case "selectTokenButton":
      await handleSelectTokenButton(interaction);
      break;
    case "confirmVotingRoundInfoButton":
      await handleConfirmVotingRoundInfoButton(interaction);
      break;
    case "verifyCardanoWalletButton":
      await handleVerifyCardanoWalletButton(interaction);
      break;
    case "verifyEthereumWalletButton":
      await handleVerifyEthereumWalletButton(interaction);
      break;
    case "registerProposal":
      await handleRegisterProposalButton(interaction);
      break;
    case "confirmProposalButton":
      await handleConfirmRegisterProposalButton(interaction);
      break;
    case "voteProposalButton":
      await handleVoteProposalButton(interaction);
      break;
    case "confirmVoteProposalButton":
      await handleConfirmVoteProposalButton(interaction);
      break;
    case "downVoteProposal":
      await handleDownVoteProposalButton(interaction);
      break;
  }
});

// Handle modal submits
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  switch (interaction.customId) {
    case "selectVotingSystemInputModal":
      await handleVotingSystemInputModal(interaction);
      break;
    case "confirmVerificationMethodInputModal":
      await handleVerificationMethodInputModal(interaction);
      break;
    case "confirmTokenInputModal":
      await handleTokenSelectInputModal(interaction);
      break;
    case "confirmCardanoWalletAddressInputModal":
      await handleConfirmCardanoWalletAddressInputModal(interaction);
      break;
    case "confirmEthereumWalletAddressInputModal":
      await handleConfirmEthereumWalletAddressInputModal(interaction);
      break;
    case "registerProposalInputModal":
      await handleRegisterProposalInputModal(interaction);
      break;
    case "voteProposalInputModal":
      await handleVoteProposalInputModal(interaction, "vote");
      break;
    case "downVoteProposalInputModal":
      await handleVoteProposalInputModal(interaction, "down-vote");
      break;
  }
});

// Handle commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  switch (interaction.commandName) {
    case "start-voting-round":
      await handleStartRoundCommand(interaction);
      break;
    case "verify-cardano-wallet":
      await handleVerifyCardanoWalletCommand(interaction);
      break;
    case "verify-ethereum-wallet":
      await handleVerifyEthereumWalletCommand(interaction);
      break;
    case "register-proposal":
      await handleRegisterProposalCommand(interaction);
      break;
    case "vote-proposal":
      await handleVoteProposalCommand(interaction);
      break;
    case "down-vote-proposal":
      await handleDownVoteProposalCommand(interaction);
      break;
    case "get-voting-round-results":
      await handleGetVotingRoundResultsCommand(interaction);
      break;
    case "help":
      await handleHelpCommand(interaction);
      break;
  }
});

client.login(process.env.TOKEN);

setInterval(() => {
  verifyCardanoUsers();
  verifyEthereumUsers();
}, 15000);
