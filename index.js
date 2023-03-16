const { Client, GatewayIntentBits } = require("discord.js");
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
} = require("./buttonClickActions/functions");
const {
  handleConfirmCardanoWalletAddressInputModal,
  handleVotingSystemInputModal,
  handleRegisterProposalInputModal,
  handleVoteProposalInputModal,
  handleVerificationMethodInputModal,
  handleTokenSelectInputModal,
  handleConfirmEthereumWalletAddressInputModal,
} = require("./modalSubmitActions/functions");
const {
  handleVerifyCardanoWalletCommand,
  handleRegisterProposalCommand,
  handleStartRoundCommand,
  handleVoteProposalCommand,
  handleDownVoteProposalCommand,
  handleGetVotingRoundResultsCommand,
  handleHelpCommand,
  handleVerifyEthereumWalletCommand,
} = require("./commandActions/functions");
const { verifyCardanoUsers } = require("./utils/cardanoUtils");
const { verifyEthereumUsers } = require("./utils/ethereumUtils");

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

// TODO: ADD resend message if failed
// Commands to handle
client.on("messageCreate", async (message) => {
  switch (message.content) {
    case "/start-voting-round":
      await handleStartRoundCommand(message);
      break;
    case "/verify-cardano-wallet":
      await handleVerifyCardanoWalletCommand(message);
      break;
    case "/verify-ethereum-wallet":
      await handleVerifyEthereumWalletCommand(message);
      break;
    case "/get-voting-round-results":
      await handleGetVotingRoundResultsCommand(message);
      break;
    case "/register-proposal":
      await handleRegisterProposalCommand(message);
      break;
    case "/vote-proposal":
      await handleVoteProposalCommand(message);
      break;
    // TODO: Add verify information and confirm
    case "/down-vote-proposal":
      await handleDownVoteProposalCommand(message);
      break;
    case "/help":
      await handleHelpCommand(message);
      break;
  }
});

// handle button clicks
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
      await handleConfirmVotingRoundInfoButton(interaction, true);
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

// handle modal submits
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

client.login(process.env.TOKEN);

setInterval(() => {
  verifyCardanoUsers();
  verifyEthereumUsers();
}, 15000);
