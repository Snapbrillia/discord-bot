const { Client, GatewayIntentBits } = require("discord.js");
const {
  handleVerifyCardanoWalletButton,
  handleRegisterProposalButton,
  handleVoteProposalButton,
  handleDownVoteProposalButton,
  handleConfirmVotingRoundInfoButton,
  handleConfirmRegisterProposalButton,
  handleConfirmVoteProposalButton,
  handleVerifyEthereumWalletButton,
  handleNameOfVotingRoundButton,
  hanldeVerifySSIEmailButton,
  handleEnterSSIEmailVerificationButton,
  handleEnterSSIPhoneNumberButton,
  handleEnterSSIPhoneCodeButton,
} = require("./handleButtonClickActions/functions");
const {
  handleConfirmCardanoWalletAddressInputModal,
  handleRegisterProposalInputModal,
  handleVoteProposalInputModal,
  handleTokenSelectInputModal,
  handleConfirmEthereumWalletAddressInputModal,
  handleNameOfVotingRoundInputModal,
  handleVerifySSIEmailInputModal,
  handleEnterSSIEmailCodeInputModal,
  handleEnterSSIPhoneInputModal,
  handleEnterSSIPhoneCodeInputModal,
} = require("./handleModalSubmitActions/functions");
const {
  handleLinkWalletCommand,
  handleRegisterProposalCommand,
  handleStartRoundCommand,
  handleVoteProposalCommand,
  handleGetVotingRoundResultsCommand,
  handleHelpCommand,
} = require("./handleCommandActions/functions");
const { deployCommands } = require("./deployCommandScript");
const {
  createChannelWithAdmins,
  createChannelWithUser,
  createChannelWithEveryOne,
  createDiscordUser,
  createCategory,
  createDiscordServer,
} = require("./handleGuildCreateActions/functions");
const {
  handleVotingSystemMenu,
  handleRoundDurationMenu,
  handleSelectVerificationMethodMenu,
  handleSelectIfOnlyTokenHolderCanVoteMenu,
  handleSelectTokenMenu,
  handleSelectSSIAuthMenu,
  handleOnChainOrOffChainVotingMenu,
  handleListOfProposalsMenu,
  handleLinkWalletMenu,
} = require("./handleSelectMenuActions/functions");
const { removeExpiredPendingVerification } = require("./utils/databaseUtils");
const { verifyUsers } = require("./utils/sharedUtils");
const {
  checkIfADASend,
  getCardanoTokensInWallet,
} = require("./utils/cardanoUtils");
const {
  checkIfEthSend,
  getEthereumTokensInWallet,
} = require("./utils/ethereumUtils");

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
  const category = await createCategory(guild);
  const channelId = await createChannelWithAdmins(
    guild,
    owner,
    client.user.id,
    category
  );
  const generalChannelId = await createChannelWithEveryOne(
    guild,
    client.user.id,
    category
  );
  members.forEach(async (member) => {
    if (member.user.bot) {
      return;
    }
    await createChannelWithUser(guild, member, client.user.id, category);
    await createDiscordUser(guild, member);
  });
  await deployCommands(guild);
  await createDiscordServer(guild, channelId, generalChannelId);
});

// creare private channel with every user, private chaneel with the owner
// TODO PRIVATE CHANNEL WITH ALL USERS
// When new members join. Create a private channel with them
client.on("guildMemberAdd", (member) => {
  console.log(member);
});

// Handle commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  switch (interaction.commandName) {
    case "start-voting-round":
      await handleStartRoundCommand(interaction);
      break;
    case "link-wallets":
      await handleLinkWalletCommand(interaction);
      break;
    case "register-proposal":
      await handleRegisterProposalCommand(interaction);
      break;
    case "vote-proposal":
      await handleVoteProposalCommand(interaction);
      break;
    case "get-voting-round-results":
      await handleGetVotingRoundResultsCommand(interaction);
      break;
    case "view-personal-info":
      await handleViewPersonalInfoCommand(interaction);
      break;
    case "help":
      await handleHelpCommand(interaction);
      break;
  }
});

// Handle select menu
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  switch (interaction.customId) {
    case "selectVotingSystemMenu":
      await handleVotingSystemMenu(interaction);
      break;
    case "selectOnChainOrOffChainVotingMenu":
      await handleOnChainOrOffChainVotingMenu(interaction);
      break;
    case "selectIfOnlyTokenHolderCanVoteMenu":
      await handleSelectIfOnlyTokenHolderCanVoteMenu(interaction);
      break;
    case "selectVerificationMethodMenu":
      await handleSelectVerificationMethodMenu(interaction);
      break;
    case "selectTokenMenu":
      await handleSelectTokenMenu(interaction);
      break;
    case "selectSSIAuthMenu":
      await handleSelectSSIAuthMenu(interaction);
      break;
    case "selectRoundDurationMenu":
      await handleRoundDurationMenu(interaction);
      break;
    case "selectRegisterProposalVotingRoundMenu":
      await handleListOfProposalsMenu(interaction);
      break;
    case "selectLinkWalletMenu":
      await handleLinkWalletMenu(interaction);
      break;
  }
});

// Handle modal submits
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  switch (interaction.customId) {
    case "confirmTokenInputModal":
      await handleTokenSelectInputModal(interaction);
      break;
    case "confirmNameOfVotingRoundInputModal":
      await handleNameOfVotingRoundInputModal(interaction);
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
    case "enterSSIEmailInputModal":
      await handleVerifySSIEmailInputModal(interaction);
      break;
    case "enterSSIEmailCodeInputModal":
      await handleEnterSSIEmailCodeInputModal(interaction);
      break;
    case "enterSSIPhoneNumberInputModal":
      await handleEnterSSIPhoneInputModal(interaction);
      break;
    case "enterSSIPhoneCodeInputModal":
      await handleEnterSSIPhoneCodeInputModal(interaction);
      break;
  }
});

// Handle button clicks
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  switch (interaction.customId) {
    case "nameOfVotingRoundButton":
      await handleNameOfVotingRoundButton(interaction);
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
    case "verifySSIEmailButton":
      await hanldeVerifySSIEmailButton(interaction);
      break;
    case "enterSSIEmailVerificationButton":
      await handleEnterSSIEmailVerificationButton(interaction);
      break;
    case "enterSSIPhoneNumberButton":
      await handleEnterSSIPhoneNumberButton(interaction);
      break;
    case "enterSSIPhoneCodeButton":
      await handleEnterSSIPhoneCodeButton(interaction);
      break;
    case "registerProposalButton":
      await handleRegisterProposalButton(interaction);
      break;
    case "voteProposalButton":
      await handleVoteProposalButton(interaction);
      break;
    case "downVoteProposal":
      await handleDownVoteProposalButton(interaction);
      break;
    case "confirmProposalButton":
      await handleConfirmRegisterProposalButton(interaction);
      break;
    case "confirmVoteProposalButton":
      await handleConfirmVoteProposalButton(interaction);
      break;
  }
});

client.login(process.env.TOKEN);

setInterval(async () => {
  await removeExpiredPendingVerification();
  // verify users cardano wallet
  verifyUsers(
    "Cardano",
    "cardanoWallets",
    "cardanoTokensInWallet",
    checkIfADASend,
    getCardanoTokensInWallet
  );
  // verify users ethereum wallet
  await verifyUsers(
    "Ethereum",
    "ethereumWallets",
    "ethereumTokensInWallet",
    checkIfEthSend,
    getEthereumTokensInWallet
  );
}, 15000);
