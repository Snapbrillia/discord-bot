const { EmbedBuilder } = require("discord.js");
const {
  getStartAndEndDate,
  getVotingRoundConfigurationText,
} = require("../utils/shared");

const createEmbed = (title, description) => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setAuthor({
      name: "Snapbrillia",
      url: "https://snapbrillia.com",
      iconURL: `attachment://snapicon.png`,
    })
    .setThumbnail(`attachment://snapicon.png`)
    .setColor("#a900a6");
  return embed;
};

const getVotingSystemsEmbed = () => {
  const embed = createEmbed(
    "Select Voting System",
    `👋 Hi there! I'm the Snapbrillia Bot and I'm here to guide you through the process of setting up a voting round in your server. 🤖 To get started, please choose the voting system you'd like to use for this round. To ensure the security of your voting round, we recommend that only administrators are included in this channel, to prevent unauthorized access and editing. 🛡️ Thanks for choosing our bot to manage voting within your community! \n  \n    
    1️⃣ Single Vote - Voters only have one vote. \n 
    2️⃣ Yes/No Voting - Voters can choose to vote either For or Against a proposal. \n
    3️⃣ Quadratic Voting (Tokens In Wallet) - The voting power of each voter will be decided by the amount of a specific asser the voter has in his wallet when the voting round ends. Users will specify the percentage of his voting power he will allocate to a proposal (down or up vote) when voting. Their votes will be calculated using the quadratic voting formula.\n
    4️⃣ Quadratic Voting (Same Voting Power) - Each user will have the same voting power. Their votes will be calculated using the quadratic voting formula.\n \n
    `
  );
  return embed;
};

const getAlreadyVerifiedCardanoWalletEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Verification 🛡️🔒",
    `You have already verified your Cardano wallet. \n
    `
  );
  return embed;
};

const getAlreadyVerifiedEthereumWalletEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Verification 🛡️🔒",
    `You have already verified your Ethereum wallet. \n
    `
  );
  return embed;
};

const getSelectIfOnlyTokenHolderCanVoteEmbed = (votingSystem) => {
  const embed = createEmbed(
    "🔒🗳️️ Select Voting Permissions 🗳️🔒",
    `Please select the the voting permissions for this voting round. \n \n
  1️⃣ Only Token Holders: Only users who hold the token can vote. \n
  2️⃣ Everyone Can Vote: Everyone can vote as long as they are verified. \n \n
  ${getVotingRoundConfigurationText(votingSystem)} 
  `
  );
  return embed;
};

const getVotingRoundDurationEmbed = (votingSystem) => {
  const embed = createEmbed(
    "🕒⏱️ Select Voting Round Duration ⏱️🕒",
    `Please select how long you want the voting round to last. \n \n
   ${getVotingRoundConfigurationText(
     votingSystem,
     votingSystem.onlyTokenHolderCanVote
   )} 
    `
  );
  return embed;
};

const getListOfVerifiedEmbed = (votingSystem, onlyTokenHolderCanVote) => {
  const embed = createEmbed(
    "Select Verification Method",
    `🔒🛡️ Verification Methods 🛡️🔒 \n \n
  1️⃣ Ethereum Wallet Address: Users will need to authenticate themselves by proving ownership of their Ethereum based wallet address. \n
  2️⃣ Cardano Wallet Address: Users will need to authenticate themselves by proving ownership of their Cardano based wallet address. \n
  3️⃣ Discord Account: Users can vote simply by being a member of your discord community. \n \n
  ${getVotingRoundConfigurationText(votingSystem, onlyTokenHolderCanVote)}
  `
  );
  return embed;
};

const getWalletVerificationEmbed = (votingSystem, onlyTokenHolderCanVote) => {
  const embed = createEmbed(
    "🔒🛡️ Select Verification Method 🛡️🔒",
    `Since the voting power of the voter will be decided by the amount of a specific token they have in their wallet, the wallet you choose to verify must support the token you are using for voting.IE If you want only the holder of your communitie's ERC20 token to participate, select Ethereum wallet verification. \n 
  1️⃣ Ethereum-based wallet address: Users will need to authenticate themselves by proving ownership of their Ethereum based wallet address.  \n
  2️⃣ Cardano-based wallet address: Users will need to authenticate themselves by proving ownership of their Cardano based wallet address. \n
    ${getVotingRoundConfigurationText(votingSystem, onlyTokenHolderCanVote)}
  `
  );
  return embed;
};

const getEthereumSelectTokenEmbed = () => {
  const embed = createEmbed(
    "💰💸 Select Voting Token 💸💰",
    `You have selected to require voters to verify themselve using an Ethereum wallet. \n
    The last step is to select the token you want to use for voting. \n
    If you want to use an token, please enter the contract address of the token. \n
    If you want to use ETH, please enter "ETH". \n
    `
  );
  return embed;
};

const getCardanoSelectTokenEmbed = () => {
  const embed = createEmbed(
    "🌟 Select Voting Token 🌟 ",
    `You have selected to require voters to verify themselve using an Cardano wallet. \n
    The last step is to select the token you want to use for voting. \n
    If you want to use an Token, please enter the concatination of the hex encoding of the Asset Name and Policy ID of the Token. \n
    If you want to use ADA, please enter "ADA". \n
    To see the tokens in your cardano wallet, please enter the command "/assets-in-cardano-wallet". \n
    `
  );
  return embed;
};

const getVerifyCardanoWalletEmbed = () => {
  const embed = new EmbedBuilder().setTitle("🔒🛡️ Verify Wallet 🛡️🔒")
    .setDescription(`To ensure the security of our community, we require all members to verify their wallet addresses before participating in voting rounds.\n
        💰 To verify your wallet, please send a sum of ADA to the wallet address you provide. Once the transaction is confirmed, you will be able to participate in the upcoming voting round.\n
        👉 Please ensure that you send the sum of ADA from the same address that you are using to verify. This will help us confirm the ownership of the wallet and prevent any potential fraudulent activity. Thank you!.\n
    `);
  return embed;
};

const getVerifyEthereumWalletEmbed = () => {
  const embed = new EmbedBuilder().setTitle("🔒🛡️ Verify Wallet 🛡️🔒")
    .setDescription(`To ensure the security of our community, we require all members to verify their wallet addresses before participating in voting rounds.\n
        💰 To verify your wallet, please send a sum of ETH to the wallet address you provide. Once the transaction is confirmed, you will be able to participate in the upcoming voting round.\n
        👉 Please ensure that you send the sum of ETH from the same address that you are using to verify. This will help us confirm the ownership of the wallet and prevent any potential fraudulent activity. Thank you!.\n
    `);
  return embed;
};

const getVotingRoundInfoEmbed = (votingRound) => {
  const { endDate, startDate } = getStartAndEndDate(
    votingRound.roundDurationInDays
  );
  let tokenUsed = "";
  if (votingRound.votingSystem === "Quadratic Voting (Tokens In Wallet)") {
    tokenUsed = `Voting Token: **${votingRound.assetName}**`;
  }
  const embed = createEmbed(
    "🗳️ Voting Round Info 🗳️ ",
    `Please confirm the following information about the voting round \n
     Voting System: **${votingRound.votingSystem}**\n
     Verification Method: **${votingRound.verificationMethod} **\n
     Start Date: **${startDate}**\n
     End Date: **${endDate}**\n
     ${tokenUsed} \n
    `
  );
  return embed;
};

const getQuadraticVotingResultsEmbed = (votingRound, projectInfo) => {
  let proposals = "";
  projectInfo.forEach((project) => {
    proposals += `**${project.projectInfo.proposalName}** \n
    🏆 Prize Weight : **${project.prizeWeight.toFixed(2)}** \n
    👥 Total Unique Voters: **${project.totalUniqueVoters}** \n
    💰 Total ADA Votes Registered: **${project.totalAdaVotesRegistered}** \n
    📉 Total Down ADA Votes Registered: **${
      project.totalDownAdaVotesRegistered
    }** \n \n
    `;
  });

  const embed = createEmbed(
    "Voting Round Results",
    `📊 Total Registered Proposals: ${votingRound.totalRegisteredProposals} \n
     👥 Total Unique Voters: ${votingRound.totalUnqiueVoters} \n
     💰 Total ADA Votes Registered: ${votingRound.totalAdaVotesRegistered} \n
     📉 Total Down ADA Votes Registered: ${votingRound.totalDownAdaVotesRegistered} \n \n
      ${proposals} \n
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

const getRegisterProposalEmbed = () => {
  const embed = createEmbed(
    "📝 Register Proposal 📝 ",
    `To register a proposal please enter the name of your proposal along with a quick description. \n
    `
  );
  return embed;
};

const getProposalInfoEmbed = (proposalInfo) => {
  const embed = createEmbed(
    "📝 Proposal Info 📝 ",
    `You have successfully registered the following proposal \n
      Proposal Name: **${proposalInfo.proposalName}**\n
      Proposal Description: **${proposalInfo.proposalDescription}**\n
      `
  );
  return embed;
};

const getConfirmProposalEmbed = () => {
  const embed = createEmbed(
    "📝 Proposal Registered 📝 ",
    `Your proposal has been registered. \n
      `
  );
  return embed;
};

const getConfirmVoteProposalEmbed = () => {
  const embed = createEmbed(
    "🗳️ Proposal Voted 🗳️ ",
    `Your vote has been registered. \n

      `
  );
  return embed;
};

const getVoteProposalEmbed = () => {
  const embed = createEmbed(
    "🗳️ Vote Proposal 🗳️ ",
    `To vote for a proposal please enter the name of the proposal you want to vote for. You will specify a percentage of your voting power(amount of voting asset you have in your wallet) to give to the proposal. \n
     Please note the maximum percentage of voting power you can allocate across all proposal is 100%. \n
    `
  );
  return embed;
};

const getVoteProposalInfoEmbed = (propsoalName, percentageAllocated) => {
  const embed = createEmbed(
    "🗳️ Vote Proposal Info 🗳️ ",
    `You have voted for a proposal with the following information. \n
      Proposal Name: **${propsoalName}**\n
      Percentage of Voting Power Allocated: **${percentageAllocated}%**\n
    `
  );
  return embed;
};

const getDownVoteProposalEmbed = () => {
  const embed = createEmbed(
    "🗳️ Down Vote Proposal 🗳️ ",
    `To down vote a proposal please enter the name of the proposal you want to down vote. \n`
  );
  return embed;
};

const getPendingVerifiedCardanoWalletEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Verify Wallet 🛡️🔒",
    `Your wallet is currently being verified. Please wait for the verification to complete. You can also verify a different wallet \n
    `
  );
  return embed;
};

const getPendingVerifiedEthereumWalletEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Verify Wallet 🛡️🔒",
    `Your wallet is currently being verified. Please wait for the verification to complete. You can also verify a different wallet \n
    `
  );
  return embed;
};

const getHelpCommandEmbed = () => {
  const embed = createEmbed(
    "Help",
    `**For Admins** \n
    **/start-voting-round** - Start the voting round\n
    **For Voters** \n
    **/verify-cardano-wallet** - Verify your Cardano wallet address\n
    **/verify-ethereum-wallet** - Verify your Ethereum wallet address\n
    **/register-proposal** - Register your proposal\n
    **/vote-proposal** - Vote for a proposal\n
    **/down-vote-proposal** - Down vote a proposal\n
    **/help** - Show this message\n`
  );
  return embed;
};

const getAdminIntroductionEmbed = () => {
  const embed = createEmbed(
    "👋 Snapbrillia Voting Bot 👋",
    `Thank You for using Snapbrillia Voting Bot. To get started enter the command /help. \n
    Please make sure only admins are allowed in this channel
    `
  );
  return embed;
};

const getMemberIntrouductionEmbed = () => {
  const embed = createEmbed(
    "👋 Snapbrillia Voting Bot 👋",
    `Welcome to the Snapbrillia Voting Bot! \n
  Before you can participate in any of our voting rounds, we require all members to verify their wallet addresses. Don't worry, it's a quick and easy process! 🔒🛡️ \n
  To get a list of all the commands you can use, please type **/help** \n  
  `
  );
  return embed;
};

module.exports = {
  getListOfVerifiedEmbed,
  getVotingRoundInfoEmbed,
  getSelectIfOnlyTokenHolderCanVoteEmbed,
  getWalletVerificationEmbed,
  getVerifyCardanoWalletEmbed,
  getEthereumSelectTokenEmbed,
  getCardanoSelectTokenEmbed,
  getVotingSystemsEmbed,
  getQuadraticVotingResultsEmbed,
  getConfirmVotingRoundInfoEmbed,
  getRegisterProposalEmbed,
  getVerifyEthereumWalletEmbed,
  getProposalInfoEmbed,
  getConfirmProposalEmbed,
  getVoteProposalEmbed,
  getDownVoteProposalEmbed,
  getVoteProposalInfoEmbed,
  getConfirmVoteProposalEmbed,
  getAlreadyVerifiedCardanoWalletEmbed,
  getPendingVerifiedCardanoWalletEmbed,
  getPendingVerifiedEthereumWalletEmbed,
  getAlreadyVerifiedEthereumWalletEmbed,
  getHelpCommandEmbed,
  getAdminIntroductionEmbed,
  getMemberIntrouductionEmbed,
  getVotingRoundDurationEmbed,
};
