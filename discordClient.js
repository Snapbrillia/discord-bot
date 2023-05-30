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
  handleEnterSnapbrilliaEmailCodeButton,
  handleEnterSnapbrilliaPhoneCodeButton,
} = require("./handleDiscordActions/handleButtonClicks");
const {
  handleConfirmCardanoWalletAddressInputModal,
  handleRegisterProposalInputModal,
  handleTokenSelectInputModal,
  handleConfirmEthereumWalletAddressInputModal,
  handleNameOfVotingRoundInputModal,
  handleSnapbrilliaEmailAddressModal,
  handleSnapbrilliaEmailCodeModal,
  handleSnapbrilliaPhoneNumberModal,
  handleSnapbrilliaPhoneCodeModal,
} = require("./handleDiscordActions/handleModal");
const {
  handleLinkWalletCommand,
  handleRegisterProposalCommand,
  handleStartRoundCommand,
  handleVoteProposalCommand,
  handleGetVotingRoundResultsCommand,
  handleHelpCommand,
  handleViewPersonalInfoCommand,
} = require("./handleDiscordActions/handleCommands");
const { deployCommands } = require("./commands/deployCommandScript");
const {
  createChannelWithAdmins,
  createChannelWithUser,
  createDiscordUser,
  createCategory,
  createDiscordServer,
} = require("./handleDiscordActions/handleGuildCreate");
const {
  handleVotingSystemMenu,
  handleRoundDurationMenu,
  handleSelectVerificationMethodMenu,
  handleSelectIfOnlyTokenHolderCanVoteMenu,
  handleSelectTokenMenu,
  handleSelectSnapbrilliaWalletAuthMenu,
  handleListOfProposalsMenu,
  handleLinkWalletMenu,
  handleViewPersonalInfoMenu,
  handleLinkSnapbrilliaWalletMenu,
} = require("./handleDiscordActions/handleSelectMenu");
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

// Bot is added to server.Deploy application commands. Creates private
// channels with admins and users, store the channel ids in the database
client.on("guildCreate", async (guild) => {
  const members = await guild.members.fetch();
  const owner = await guild.fetchOwner();
  const category = await createCategory(guild);
  const adminChannelId = await createChannelWithAdmins(
    guild,
    owner,
    client.user.id,
    category
  );

  let userChannelsId = [];

  for (const member of members) {
    if (member[1].user.bot) {
      continue;
    }
    const userChannelId = await createChannelWithUser(
      guild,
      member[1],
      client.user.id,
      category
    );
    userChannelsId.push(userChannelId);
    await createDiscordUser(guild, member[1], userChannelId);
  }

  await createDiscordServer(guild, adminChannelId, userChannelsId);
  await deployCommands(guild);
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
    case "selectIfOnlyTokenHolderCanVoteMenu":
      await handleSelectIfOnlyTokenHolderCanVoteMenu(interaction);
      break;
    case "selectVerificationMethodMenu":
      await handleSelectVerificationMethodMenu(interaction);
      break;
    case "selectTokenMenu":
      await handleSelectTokenMenu(interaction);
      break;
    case "selectSnapbrilliaWalletAuthMenu":
      await handleSelectSnapbrilliaWalletAuthMenu(interaction);
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
    case "selectSnapbrilliaWalletLoginMenu":
      await handleLinkSnapbrilliaWalletMenu(interaction);
      break;
    case "selectViewPersonalInfoMenu":
      await handleViewPersonalInfoMenu(interaction);
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
    case "snapbrilliaEmailAddressModal":
      await handleSnapbrilliaEmailAddressModal(interaction);
      break;
    case "snapbrilliaEmailCodeModal":
      await handleSnapbrilliaEmailCodeModal(interaction);
      break;
    case "snapbrilliaPhoneNumberModal":
      await handleSnapbrilliaPhoneNumberModal(interaction);
      break;
    case "snapbrilliaPhoneCodeModal":
      await handleSnapbrilliaPhoneCodeModal(interaction);
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
    case "enterSnapbrilliaEmailCodeButton":
      await handleEnterSnapbrilliaEmailCodeButton(interaction);
      break;
    case "enterSnapbrilliaPhoneCodeButton":
      await handleEnterSnapbrilliaPhoneCodeButton(interaction);
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
    getCardanoTokensInWallet,
    client
  );
  // verify users ethereum wallet
  await verifyUsers(
    "Ethereum",
    "ethereumWallets",
    "ethereumTokensInWallet",
    checkIfEthSend,
    getEthereumTokensInWallet,
    client
  );
}, 15000);
