const { EmbedBuilder } = require("discord.js");

// helper functions
const formatDate = (date) => {
  const d = new Date(date);
  const day = `0${d.getDate()}`.slice(-2);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  return [year, month, day].join("-");
};

const getStartAndEndDate = (days) => {
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
  const formatedStartDate = formatDate(startDate);
  const formatedEndDate = formatDate(endDate);
  return { startDate: formatedStartDate, endDate: formatedEndDate };
};

// append them if they exist and if they are undefined, then don't append them
const getVotingRoundConfigurationText = (
  votingSystem,
  onChainVotes,
  onlyTokenHolderCanVote,
  blockchain,
  tokenName,
  enabledKYC,
  roundDuration,
  votingRoundName,
  votingRoundDescription
) => {
  let text = `🔧** Current configuration of voting round **🔧\n
  ** Voting System **: ${votingSystem} \n `;
  if (onChainVotes !== undefined) {
    const votingMethod = onChainVotes
      ? "Store votes on-chain"
      : "Store votes off-chain";
    text += `** Voting Method **: ${votingMethod} \n`;
  }
  if (onlyTokenHolderCanVote !== undefined) {
    const votingMethod = onlyTokenHolderCanVote
      ? "Only holders of a specific Token can Vote"
      : "Anybody can vote as long as they are verified";
    text += `** Voting Permissions **: ${votingMethod} \n`;
  }
  if (blockchain) {
    text += `** Blockchain **: ${blockchain} \n`;
  }
  if (tokenName) {
    text += `** Token Used **: ${tokenName} \n`;
  }
  if (enabledKYC !== undefined) {
    const enabled = enabledKYC ? "Enabled" : "Disabled";
    text += `** SSI and KYC Authentication **: ${enabled} \n`;
  }
  if (roundDuration) {
    const { startDate, endDate } = getStartAndEndDate(roundDuration);
    text += `** Voting Round Start**: ${startDate} \n ** Voting Round End **: ${endDate}\n`;
  }
  if (votingRoundName) {
    text += `** Voting Round Name **: ${votingRoundName}\n`;
  }
  if (votingRoundDescription) {
    text += `** Voting Round Description **: ${votingRoundDescription}\n`;
  }
  return text;
};

// embeds
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
    ** Single Vote ** \n  - Voters only have one vote. \n 
    ** Yes/No Voting ** \n - Voters can choose to vote either For or Against a proposal. \n
    ** Quadratic Voting (Tokens In Wallet) ** \n - The voting power of each voter will be decided by the amount of a specific asset the voter has in his wallet when the voting round ends. Users will specify the percentage of his voting power he will allocate to a proposal (down or up vote) when voting. Their votes will be calculated using the quadratic voting formula.\n
    **  Quadratic Voting (Same Voting Power) ** \n - Each user will have the same voting power. Their votes will be calculated using the quadratic voting formula.\n \n
    `
  );
  return embed;
};

const getSendFundToWalletEmbed = (sendAmount, walletAddress) => {
  const embed = createEmbed(
    "✅👝 Wallet Address Submitted For Verification 👝✅",
    `You have submitted a wallet address for verification. \n
    Please send ** ${sendAmount} **to this ** ${walletAddress}** wallet address within 5 minutes for it to be verified. \n
    Please remember to use the same wallet to send the funds. \n
    `
  );
  return embed;
};

const getAlreadyVerifiedWalletEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Wallet Already Verified 🛡️🔒",
    `This wallet address has already been verified and link to you. Please enter a different wallet address to verify. \n
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

const getSelectIfOnlyTokenHolderCanVoteEmbed = (votingSystem, onChainVotes) => {
  const embed = createEmbed(
    "🔒🗳️️ Select Voting Permissions 🗳️🔒",
    `Please select the the voting permissions for this voting round. \n \n
     ** Only Specific Token Holders ** \n - Only users who hold a specific token can vote. \n
     ** Everyone Can Vote ** \n - Everyone can vote as long as they are part of your discord community. \n
  ${getVotingRoundConfigurationText(votingSystem, onChainVotes)} 
  `
  );
  return embed;
};

const getSelectBlockchainEmbed = (
  votingSystem,
  onChainVotes,
  onlyTokenHolderCanVote
) => {
  const embed = createEmbed(
    "🔒🛡️ Select Blockchain 🛡️🔒",
    `Please select the blockchain that you want the voting round to run on.\n 
     ** Ethereum Blockchain ** \n - The voting round will be running on the Ethereum Blockchain.  \n
     ** Cardano Blockchain ** \n - The voting round will be running on the Cardano Blockchain. \n
    ${getVotingRoundConfigurationText(
      votingSystem,
      onChainVotes,
      onlyTokenHolderCanVote
    )}
  `
  );
  return embed;
};

const getEnableKYCEmbed = (
  votingSystem,
  onChainVotes,
  onlyTokenHolderCanVote,
  verificationMethod,
  tokenName
) => {
  const embed = createEmbed(
    "🔍👤 Enable KYC 👤🔍",
    `Would you like to secure your voting round with SSI and KYC enabled authentication. We will be asking user to provide a verifiable credential to prove their identity. The verifiable credential will be issued to them by Snapbrillia after they have been verfied. This will help prevent sybil attacks (people creating multiple accounts and voting) against the voting round. \n \n
      ** Yes ** \n - SSI and KYC will be enabled for this voting round. \n
      ** No ** \n - SSI and KYC will not be enabled for this voting round. \n
    ${getVotingRoundConfigurationText(
      votingSystem,
      onChainVotes,
      onlyTokenHolderCanVote,
      verificationMethod,
      tokenName
    )} 
    `
  );
  return embed;
};

const getVotingRoundDurationEmbed = (
  votingSystem,
  onChainVotes,
  onlyTokenHolderCanVote,
  verificationMethod,
  tokenName,
  enableKYC
) => {
  const embed = createEmbed(
    "🕒⏱️ Select Voting Round Duration ⏱️🕒",
    `Please select how long you want the voting round to last. \n \n
   ${getVotingRoundConfigurationText(
     votingSystem,
     onChainVotes,
     onlyTokenHolderCanVote,
     verificationMethod,
     tokenName,
     enableKYC
   )} 
    `
  );
  return embed;
};

const getEthereumSelectTokenEmbed = (
  votingSystem,
  onChainVotes,
  onlyTokenHolderCanVote,
  verificationMethod
) => {
  const embed = createEmbed(
    "💰💸 Select Voting Token 💸💰",
    `You have selected to require voters to verify themselve using an Ethereum wallet. \n
    The last step is to select the token you want to use for voting. \n
    If you want to use an token, please enter the contract address of the token. \n
    If you want to use ETH, please enter "ETH". \n
    ${getVotingRoundConfigurationText(
      votingSystem,
      onChainVotes,
      onlyTokenHolderCanVote,
      verificationMethod
    )}
    `
  );
  return embed;
};

const getCardanoSelectTokenEmbed = (
  votingSystem,
  onChainVotes,
  onlyTokenHolderCanVote,
  verificationMethod
) => {
  const embed = createEmbed(
    "🌟 Select Whitelist And Voting Token 🌟 ",
    `You have selected the Cardano blockchain to run your voting round on. Please select the token that you want to use for whitelisting and voting. \n
    We have selected the first 24 tokens in your wallets. If you don't see the token you want to use you can enter the command ** /refresh-assets-in-cardano-wallet **.This will fetch the latest assets you have in your wallet. \n
    You can also enter the token manually. You would need to provide the token's unique identifer on the blockchain (concatenation of the Asset Name in hex and Policy Id). \n
    ${getVotingRoundConfigurationText(
      votingSystem,
      onChainVotes,
      onlyTokenHolderCanVote,
      verificationMethod
    )}
    `
  );
  return embed;
};

const getVerifyWalletEmbed = (token) => {
  const embed = createEmbed(
    "🔒🛡️ Verify Wallet 🛡️🔒",
    `To ensure the security of our community, we require all members to verify their wallet addresses before participating in voting rounds.\n
        💰 To verify your wallet, please send a sum of ${token} to the wallet address you provide. Once the transaction is confirmed, you will be able to participate in the upcoming voting round.\n
        👉 Please ensure that you send the sum of ${token} using the wallet that you are want to verify. This will help us confirm the ownership of the wallet and prevent any potential fraudulent activity. Thank you!.\n
    `
  );
  return embed;
};

const getSelectOnchainOrOffchainEmbed = (votingSystem, enableKYC) => {
  const embed = createEmbed(
    "🗳️ On-chain or Off-chain voting 🗳️ ",
    `Please select if you want to use on-chain voting or off-chain voting. \n
    ** On-chain voting ** \n - Votes will be stored on the blockchain. Community members will be redirected to a secure page to register a proposal or cast their vote. \n
    ** Off-chain voting ** \n - Votes will be stored off-chain. Community members will be able to register a proposal or cast their vote directly from Discord. \n
    ${getVotingRoundConfigurationText(votingSystem, enableKYC)}
    `
  );
  return embed;
};

const getVotingRoundInfoEmbed = (
  votingSystem,
  storeVotesOnChain,
  onlyTokenHolderCanVote,
  verificationMethod,
  tokenUsed,
  enableKYC,
  roundDuration,
  votingRoundName,
  votingRoundDescription
) => {
  const embed = createEmbed(
    "🗳️ Voting Round Info 🗳️ ",
    `You have completed all the nessesary steps to create a voting round. \n
    Please confirm the following information about the voting round \n
    ${getVotingRoundConfigurationText(
      votingSystem,
      storeVotesOnChain,
      onlyTokenHolderCanVote,
      verificationMethod,
      tokenUsed,
      enableKYC,
      roundDuration,
      votingRoundName,
      votingRoundDescription
    )}
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
    `To register a proposal please first select the voting round you want to participate in. \n
    `
  );
  return embed;
};

const getProposalInfoEmbed = (proposalInfo, votingRound) => {
  const embed = createEmbed(
    "📝 Proposal Info 📝 ",
    `Please confirm the following information about your proposal \n
      Voting Round: **${votingRound}** \n
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

const getVoteProposalEmbed1 = () => {
  const embed = createEmbed(
    "🗳️ Vote Proposal 🗳️ ",
    `To vote for a proposal please first select the voting round you want to participate in \n 
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

const getPendingVerifiedWalletEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Wallet Pending Verification 🛡️🔒",
    `Your wallet is currently being verified. Please wait for the verification to complete. You can also verify another wallet. \n
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

const getNameOfVotingRoundEmbed = (
  votingSystem,
  onlyTokenHolderCanVote,
  verificationMethod,
  tokenUsed,
  enableKYC,
  roundDuration,
  onChainVotes
) => {
  const embed = createEmbed(
    "🗳️ Voting Round Name 🗳️ ",
    `This is the final step of creating a voting round.Please click the button below to enter a name and a description for this voting round. \n
    ${getVotingRoundConfigurationText(
      votingSystem,
      onlyTokenHolderCanVote,
      verificationMethod,
      tokenUsed,
      enableKYC,
      roundDuration,
      onChainVotes
    )}
    `
  );
  return embed;
};

const getEnterProposalInformationEmbed = () => {
  const embed = createEmbed(
    "📌📃 Register Proposal 📃📌",
    `The admins of this voting round has selected to store the votes on chain. Please click the following link to register a proposal. http://localhost:3000 \n
    `
  );
  return embed;
};

module.exports = {
  getVotingRoundInfoEmbed,
  getSendFundToWalletEmbed,
  getSelectIfOnlyTokenHolderCanVoteEmbed,
  getSelectBlockchainEmbed,
  getVerifyWalletEmbed,
  getEnableKYCEmbed,
  getEthereumSelectTokenEmbed,
  getCardanoSelectTokenEmbed,
  getVotingSystemsEmbed,
  getQuadraticVotingResultsEmbed,
  getConfirmVotingRoundInfoEmbed,
  getRegisterProposalEmbed,
  getProposalInfoEmbed,
  getConfirmProposalEmbed,
  getVoteProposalEmbed,
  getDownVoteProposalEmbed,
  getVoteProposalInfoEmbed,
  getConfirmVoteProposalEmbed,
  getAlreadyVerifiedWalletEmbed,
  getPendingVerifiedWalletEmbed,
  getPendingVerifiedEthereumWalletEmbed,
  getAlreadyVerifiedEthereumWalletEmbed,
  getHelpCommandEmbed,
  getAdminIntroductionEmbed,
  getMemberIntrouductionEmbed,
  getVotingRoundDurationEmbed,
  getNameOfVotingRoundEmbed,
  getEnterProposalInformationEmbed,
  getVoteProposalEmbed1,
  getSelectOnchainOrOffchainEmbed,
};
