const { Client, GatewayIntentBits } = require("discord.js");
const { deployCommands } = require("./deployCommandScript");
const {
  createVotingServer,
  createChannelWithAdmins,
  createDiscordUser,
  createDiscordServer,
} = require("./src/other/handleGuildCreate");
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

// migration to new folder structure
const {
  handleStartRoundCommand,
} = require("./src/start-voting-round/handleCommand");
const {
  handleVotingSystemMenu,
  handleWhitelistTokenMenu,
  handleSelectQVFVoteAllocationMenu,
  handleSelectVotingTokenMenu,
  handleSelectWhitelistTokenMenu,
  handleSelectSnapbrilliaWalletAuthMenu,
  handleRoundDurationMenu,
  handleSelectVerificationMethodMenu,
} = require("./src/start-voting-round/handleSelectMenu");
const {
  handleConfirmVotingRoundInfoButton,
  handleNameOfVotingRoundButton,
} = require("./src/start-voting-round/handleButtonClicks");
const {
  handleVoteProposalCommand,
} = require("./src/vote-proposal/handleCommand");
const {
  handleVoteVotingRoundMenu,
  handleVoteProposalMenu,
} = require("./src/vote-proposal/handleSelectMenu");
const {
  handleVerifyCardanoWalletButton,
  handleVerifyEthereumWalletButton,
} = require("./src/link-wallet/handleButtonClicks");
const {
  handleVoteProposalQVFButton,
  handleConfirmVoteProposalButton,
} = require("./src/vote-proposal/handleButtons");
const {
  handleConfirmRegisterProposalButton,
  handleEnterEmailButton,
  handleEnterEmailOTPButton,
  handleRegisterProposalButton,
} = require("./src/register-proposal/handleButtonClicks");
const { handleLinkWalletCommand } = require("./src/link-wallet/handleCommand");
const {
  handleRegisterProposalCommand,
} = require("./src/register-proposal/handleCommand");
const { handleHelpCommand } = require("./src/help/handleCommand");
const {
  handleEthereumWalletAddressModal,
  handleCardanoWalletAddressModal,
  handleSnapbrilliaEmailModal,
  handleSnapbrilliaEmailOTPModal,
} = require("./src/link-wallet/handleModals");
const {
  handleVotingTokenModal,
  handleWhitelistTokenModal,
  handleNameOfVotingRoundModal,
} = require("./src/start-voting-round/handleModals");
const {
  handleRegisterProposalModal,
} = require("./src/register-proposal/handleModals");
const {
  handleVoteProposalQVFModal,
} = require("./src/vote-proposal/handleModals");
const { handleLinkWalletMenu } = require("./src/link-wallet/handleMenus");
const {
  handleRegisterProposalVotingRoundMenu,
} = require("./src/register-proposal/handleSelectMenu");
const {
  handleViewVotingRoundsCommand,
} = require("./src/view-voting-round-info/handleCommands");
const {
  handleViewVotingRoundsMenu,
} = require("./src/view-voting-round-info/handleSelectMenus");

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

client.login(process.env.TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Bot is added to server.Deploy application commands. Creates private
// channels with admins and users, store the channel ids in the database
client.on("guildCreate", async (guild) => {
  try {
    const members = await guild.members.fetch();
    const owner = await guild.fetchOwner();
    const adminChannelId = await createChannelWithAdmins(
      guild,
      owner.id,
      client.user.id
    );

    let userChannelsId = [];
    const userChannelId = await createVotingServer(guild, client.user.id);
    userChannelsId.push(userChannelId);
    await createDiscordServer(guild, adminChannelId, userChannelsId);

    for (const member of members) {
      if (member[1].user.bot) {
        continue;
      }

      await createDiscordUser(guild, member[1]);
    }

    await deployCommands(guild);
  } catch (err) {
    console.log(err);
  }
});

// When new members join. Create a private channel with them
client.on("guildMemberAdd", async (member) => {
  await createDiscordUser(member.guild, member);
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
    case "view-voting-round-info":
      await handleViewVotingRoundsCommand(interaction);
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
    case "selectQVFVoteAllocationMenu":
      await handleSelectQVFVoteAllocationMenu(interaction);
      break;
    case "selectWhitelistTokenEnabledMenu":
      await handleWhitelistTokenMenu(interaction);
      break;
    case "selectVerificationMethodMenu":
      await handleSelectVerificationMethodMenu(interaction);
      break;
    case "selectWhitelistTokenMenu":
      await handleSelectWhitelistTokenMenu(interaction);
      break;
    case "selectVotingTokenMenu":
      await handleSelectVotingTokenMenu(interaction);
      break;
    case "selectSnapbrilliaWalletAuthMenu":
      await handleSelectSnapbrilliaWalletAuthMenu(interaction);
      break;
    case "selectRoundDurationMenu":
      await handleRoundDurationMenu(interaction);
      break;
    case "selectRegisterProposalVotingRoundMenu":
      await handleRegisterProposalVotingRoundMenu(interaction);
      break;
    case "selectVoteProposalVotingRoundMenu":
      await handleVoteVotingRoundMenu(interaction);
      break;
    case "selectLinkWalletMenu":
      await handleLinkWalletMenu(interaction);
      break;
    case "selectVoteProposalMenu":
      await handleVoteProposalMenu(interaction);
      break;
    case "selectViewInfoVotingRoundMenu":
      await handleViewVotingRoundsMenu(interaction);
      break;
  }
});

// Handle modal submits
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  switch (interaction.customId) {
    case "votingTokenModal":
      await handleVotingTokenModal(interaction);
      break;
    case "whitelistTokenModal":
      await handleWhitelistTokenModal(interaction);
      break;
    case "nameOfVotingRoundModal":
      await handleNameOfVotingRoundModal(interaction);
      break;
    case "cardanoWalletAddressModal":
      await handleCardanoWalletAddressModal(interaction);
      break;
    case "ethereumWalletAddressModal":
      await handleEthereumWalletAddressModal(interaction);
      break;
    case "registerProposalModal":
      await handleRegisterProposalModal(interaction);
      break;
    case "snapbrilliaEmailModal":
      await handleSnapbrilliaEmailModal(interaction);
      break;
    case "snapbrilliaEmailCodeModal":
      await handleSnapbrilliaEmailOTPModal(interaction);
      break;
    case "voteProposalQVFModal":
      await handleVoteProposalQVFModal(interaction);
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
      await handleConfirmVotingRoundInfoButton(interaction, client);
      break;
    case "verifyCardanoWalletButton":
      await handleVerifyCardanoWalletButton(interaction);
      break;
    case "verifyEthereumWalletButton":
      await handleVerifyEthereumWalletButton(interaction);
      break;
    case "enterEmailButton":
      await handleEnterEmailButton(interaction);
      break;
    case "enterEmailOTPButton":
      await handleEnterEmailOTPButton(interaction);
      break;
    case "registerProposalButton":
      await handleRegisterProposalButton(interaction);
      break;
    case "voteProposalQVFButton":
      await handleVoteProposalQVFButton(interaction);
      break;
    case "confirmProposalButton":
      await handleConfirmRegisterProposalButton(interaction, client);
      break;
    case "confirmVoteProposalButton":
      await handleConfirmVoteProposalButton(interaction);
      break;
  }
});

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
