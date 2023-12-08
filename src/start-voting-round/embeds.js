const { createEmbed } = require("../../utils/discordUtils");
const { getVotingRoundConfigurationText } = require("../../utils/sharedUtils");

const getNoPermessionToStartVotingRoundEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Permission Denied 🛡️🔒",
    `A voting round can only be started from the Admin channel. To start a voting round please go to the snapbrillia-voting-server-admins channel or contact an Admin. \n
    `
  );
  return embed;
};

const getVotingSystemsEmbed = () => {
  const embed = createEmbed(
    "Select Voting System",
    `To get started, please choose the voting system you'd like to use for this round.\n
    **⭐ Quadratic Voting ⭐** \n Voters votes will be calculated using the quadratic voting formula. To learn more about Quadratic Voting/Funding https://www.wtfisqf.com/. \n
    ** Single Vote ** \n Voters only have one vote. \n 
    ** Yes/No Vote ** \n Voters can choose to vote either For or Against a proposal. \n
    ** Vote With Tokens In Wallet ** \n Voters will be able to vote using the tokens they have in their wallet. Votes are calculated 1:1 to the token they have in their wallet. \n
    `
  );
  return embed;
};

const getWhitelistTokenEnabledEmbed = (votingRound) => {
  const embed = createEmbed(
    "🔒🗳️️ Select Permission 🗳️🔒",
    `Please select the permissions for this voting round. \n \n
       ** Only Specific Token Holders ** \n Only people who hold a specific token can participate in this voting round. \n
       ** Everyone Can Participate ** \n Everyone can participate as long as they are part of your discord community. \n
    ${getVotingRoundConfigurationText(votingRound)} 
    `
  );
  return embed;
};

const getSelectQVFVotingMethodEmbed = () => {
  const embed = createEmbed(
    "🔒🗳️️ Select Allocated Votes 🗳️🔒",
    `Please select how votes will be allocated. \n \n
    ** Equal Vote Allocation ** \n Everyone has the same amount of votes. \n
    ** Vote Allocation Based On Token Holdings ** \n The more tokens you hold, the more votes you have. \n
    `
  );
  return embed;
};

const getVotingRoundDurationEmbed = (votingRound) => {
  const embed = createEmbed(
    "🕒⏱️ Select Voting Round Duration ⏱️🕒",
    `Please select how long you want the voting round to last. \n \n
   ${getVotingRoundConfigurationText(votingRound)} 
    `
  );
  return embed;
};

const getEnableKYCEmbed = (votingRound) => {
  const embed = createEmbed(
    "🔍👤 Enable Snapbrillia Wallet Authentication 👤🔍",
    `Would you like to secure your voting round with Snapbrillia Wallet authentication? Snapbrillia Wallet is a non-custodial Crypto and Self-Soverign Identity wallet. \n
     Enabling this method will provide further security against the voting round. Users participating in the voting round will also recieve a digital proof of participation that lives on the blockchain. \n \n
      ** Yes ** \n Snapbrillia Wallet authentication will be enabled for this voting round. \n
      ** No ** \n Snapbrillia Wallet authentication will not be enabled for this voting round. \n \n
    ${getVotingRoundConfigurationText(votingRound)} 
    `
  );
  return embed;
};

const getEthereumSelectTokenEmbed = (votingRound) => {
  const embed = createEmbed(
    "💰💸 Select Voting Token 💸💰",
    `Please select the token that you want to use for whitelisting and voting. \n
    We have selected the first 24 tokens in your wallets. If you don't see the token you want to use you can enter the command ** /refresh-assets-in-wallet **.This will fetch the latest assets you have in your wallet. \n
    You can also enter the token manually by providing the token's contract address. \n
    ${getVotingRoundConfigurationText(votingRound)}
    `
  );
  return embed;
};

const getWhitelistTokenEmbed = (votingRound) => {
  const embed = createEmbed(
    "🌟 Select Whitelist Token 🌟",
    `Please select the token that you want to use for whitelisting. \n
    You can also enter the token manually by providing the token's unique identifer on the blockchain (concatenation of the Policy Id and Asset Name in hex ). \n
    ${getVotingRoundConfigurationText(votingRound)}
    `
  );
  return embed;
};

const getCardanoVotingTokenEmbed = () => {
  const embed = createEmbed(
    "🌟 Select Voting Token 🌟",
    `You have initiated a new voting round. Users will specify how much of their voting power they want to allocate to a proposal. At the end of the voting round we will take a snapshot of the amount of tokens the users have in their wallet. Then we callculate how much votes each proposal recieved by using the Quadratic Voting/Funding Formula. \n
    Please select the token that you want to use for voting. \n
    You can also enter the token manually by providing the token's unique identifer on the blockchain (concatenation of the Policy Id and Asset Name in hex ). \n
    `
  );
  return embed;
};

const getSelectBlockchainEmbed = (votingRound) => {
  const embed = createEmbed(
    "🔒🛡️ Select Blockchain 🛡️🔒",
    `Please select the blockchain that you want the voting round to run on.\n 
       ** Ethereum Blockchain ** \n The voting round will be running on the Ethereum Blockchain.  \n
       ** Cardano Blockchain ** \n The voting round will be running on the Cardano Blockchain. \n
      ${getVotingRoundConfigurationText(votingRound)}
    `
  );
  return embed;
};

const getVotingRoundInfoEmbed = (votingRound) => {
  const embed = createEmbed(
    "🗳️ Enter Voting Round Name and Description🗳️ ",
    `Please confirm the follow information about the voting round. \n
    ${getVotingRoundConfigurationText(votingRound)}
    `
  );
  return embed;
};

const getEnterNameAndDescriptionEmbed = (votingRound) => {
  const embed = createEmbed(
    "🗳️ Enter Voting Round Name and Description🗳️ ",
    `Please enter a name and a purpose for the voting round. \n
    ${getVotingRoundConfigurationText(votingRound)}
    `
  );
  return embed;
};

const getNotifyNewVotingRoundEmbed = (votingRound) => {
  const embed = createEmbed(
    "Voting Round Alert",
    `A new voting round has been created. Start participating by using the command **/register-proposal** or **/vote-proposal** \n
    ${getVotingRoundConfigurationText(votingRound)}
    `
  );
  return embed;
};

const getConfirmVotingRoundInfoEmbed = () => {
  const embed = createEmbed(
    "🗳️ Voting Round Started 🗳️ ",
    `The voting round has been started! \n
    `
  );
  return embed;
};

module.exports = {
  getNoPermessionToStartVotingRoundEmbed,
  getVotingSystemsEmbed,
  getWhitelistTokenEnabledEmbed,
  getSelectQVFVotingMethodEmbed,
  getVotingRoundDurationEmbed,
  getSelectBlockchainEmbed,
  getVotingRoundInfoEmbed,
  getCardanoVotingTokenEmbed,
  getEnableKYCEmbed,
  getEthereumSelectTokenEmbed,
  getWhitelistTokenEmbed,
  getEnterNameAndDescriptionEmbed,
  getNotifyNewVotingRoundEmbed,
  getConfirmVotingRoundInfoEmbed,
};
