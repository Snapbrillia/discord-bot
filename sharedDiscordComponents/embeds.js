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
  snapbrilliaWalletAuth,
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
    text += `** Participation Permissions **: ${votingMethod} \n`;
  }
  if (blockchain) {
    text += `** Blockchain **: ${blockchain} \n`;
  }
  if (tokenName) {
    text += `** Token Used **: ${tokenName} \n`;
  }
  if (snapbrilliaWalletAuth !== undefined) {
    const enabled = snapbrilliaWalletAuth ? "Enabled" : "Disabled";
    text += `** Snapbrillia Wallet Auth **: ${enabled} \n`;
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
    `I'm the Snapbrillia Bot and I'm here to guide you through the process of setting up a voting round in your server. To ensure the security of your voting round, we recommend that only administrators are included in this channel, to prevent unauthorized access and editing. \n 
    To get started, please choose the voting system you'd like to use for this round.\n
    ** Single Vote ** \n Voters only have one vote. \n 
    ** Yes/No Voting ** \n Voters can choose to vote either For or Against a proposal. \n
    ** Vote With Tokens In Wallet ** \n Voters will be able to vote using the tokens they have in their wallet. Votes are calculated 1:1 to the token they have in their wallet. \n
    ** Quadratic Voting (Tokens In Wallet) ** \n The voting power of each voter will be decided by the amount of a specific asset the voter has in his wallet when the voting round ends. Their votes will be calculated using the quadratic voting formula.\n
    ** Quadratic Voting (Same Voting Power) ** \n Each user will have the same voting power. Their votes will be calculated using the quadratic voting formula.\n \n
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

const getAlreadyLinkedWalletEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Wallet Already Linked 🛡️🔒",
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
    "🔒🗳️️ Select Participation Permission 🗳️🔒",
    `Please select the the voting permissions for this voting round. \n \n
     ** Only Specific Token Holders ** \n Only users who hold a specific token can participate. \n
     ** Everyone Can Participate ** \n Everyone can participate as long as they are part of your discord community. \n
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
     ** Ethereum Blockchain ** \n The voting round will be running on the Ethereum Blockchain.  \n
     ** Cardano Blockchain ** \n The voting round will be running on the Cardano Blockchain. \n
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
    "🔍👤 Enable Snapbrillia Wallet Authentication 👤🔍",
    `Would you like to secure your voting round with Snapbrillia Wallet authentication? Snapbrillia Wallet is a non-custodial Crypto and Self-Soverign Identity wallet. This will help prevent sybil attacks against the voting round. Users participating in the round will also recieve a Verifiable Credential proving their participation. \n \n
      ** Yes ** \n Snapbrillia Wallet authentication will be enabled for this voting round. \n
      ** No ** \n Snapbrillia Wallet authentication will not be enabled for this voting round. \n \n
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
    `Please select the token that you want to use for whitelisting and voting. \n
    We have selected the first 24 tokens in your wallets. If you don't see the token you want to use you can enter the command ** /refresh-assets-in-wallet **.This will fetch the latest assets you have in your wallet. \n
    You can also enter the token manually by providing the token's contract address. \n
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
    `Please select the token that you want to use for whitelisting and voting. \n
    We have selected the first 24 tokens in your wallets. If you don't see the token you want to use you can enter the command ** /refresh-assets-in-wallet **.This will fetch the latest assets you have in your wallet. \n
    You can also enter the token manually by providing the token's unique identifer on the blockchain (concatenation of the Asset Name in hex and Policy Id). \n
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
    "🗳️ Enter Voting Round Name and Description🗳️ ",
    `Please confirm the follow information about the voting round. \n
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

const getEnterNameAndDescriptionEmbed = (
  votingSystem,
  storeVotesOnChain,
  onlyTokenHolderCanVote,
  verificationMethod,
  tokenUsed,
  enableKYC,
  roundDuration
) => {
  const embed = createEmbed(
    "🗳️ Enter Voting Round Name and Description🗳️ ",
    `Please enter a name and a description of the voting round. \n
    ${getVotingRoundConfigurationText(
      votingSystem,
      storeVotesOnChain,
      onlyTokenHolderCanVote,
      verificationMethod,
      tokenUsed,
      enableKYC,
      roundDuration
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
    **/view-voting-round-info** - View voting round information\n
    **/register-proposal** - Register a proposal\n
    **/vote-proposal** - Vote for a proposal\n
    **/help** - Get list of availible commands with the bot.\n`
  );
  return embed;
};

const getAdminIntroductionEmbed = () => {
  const embed = createEmbed(
    "👋 Snapbrillia Voting Bot 👋",
    `Thank You for using Snapbrillia Voting Bot. To get started enter the command **/help**. \n
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
    `Please enter the name and description of your proposal. \n
    `
  );
  return embed;
};

const getLinkWalletEmbed = () => {
  const embed = createEmbed(
    "🔒🔗 Link Wallet 🔗🔒",
    `To ensure a secure and trustworthy voting experience, we've implemented a wallet linking feature. By linking your wallet to your user account, you can participate in the upcoming voting round with confidence. Please select the wallet you'd like to link. \n
    ** Ethereum Wallet ** \n Link a Ethereum Wallet. \n
    ** Cardano Wallet ** \n Link a Cardano Wallet.  \n
    ** Snapbrillia Wallet ** \n Link your Snapbrillia Wallet.  \n
    `
  );
  return embed;
};

const getSnapbrilliaWalletLoginEmbed = () => {
  const embed = createEmbed(
    "🔒💼 Snapbrillia Wallet  💼🔒",
    `To link your Snapbrillia Wallet to your discord account you will need to verify the email address you used to sign up for the Snapbrillia Wallet. \n
    To create a new Snapbrillia Wallet please visit https://snapbrillia.com \n 
    `
  );
  return embed;
};

const getSnapbrilliaEmailCodeEmbed = () => {
  const embed = createEmbed(
    "🔒💼 Snapbrillia Wallet 💼🔒",
    `A verification code has been sent to your email address. Please check your email and enter the code below to complete the verification process.
    `
  );
  return embed;
};

const getSnapbrilliaEmailNotFoundEmbed = () => {
  const embed = createEmbed(
    "🔒💼 Snapbrillia Wallet 💼🔒",
    `Your information can not be verified. Please make sure you are using the same credentials you used to sign up for the Snapbrillia Wallet. \n
    `
  );
  return embed;
};

const getEmailOTPFailedEmbed = () => {
  const embed = createEmbed(
    "🔒💼 Snapbrillia Wallet 💼🔒",
    `The verification code you entered is incorrect. Please try again. \n
    `
  );
  return embed;
};

const getSnapbrilliaWalletLinkedEmbed = () => {
  const embed = createEmbed(
    "🎉✨ Snapbrillia Wallet Linked ✨🎉",
    `You have successfully linked your Snapbrillia Wallet to your Discord account.
    `
  );
  return embed;
};

const getSnapbrilliaWalletLinkedAlreadyEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Wallet Already Linked 🛡️🔒",
    `You have already linked a Snapbrillia Wallet to this Discord account. \n
    `
  );
  return embed;
};

const getNoPermessionToStartVotingRoundEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Permission Denied 🛡️🔒",
    `You do not have permission to start a voting round. Please contact an admin to start a voting round. \n
    `
  );
  return embed;
};

const getNoWhitelistTokenFoundEmbed = (tokenName, wallet) => {
  const embed = createEmbed(
    "🔒🗳️ Token Missing 🗳️🔒",
    `To participate in the current voting round, it is necessary to hold a specific token. However, our records indicate that you do not currently possess the required token: ** ${tokenName} **. \n
    You can do one of the following: \n
    ** Link ${wallet} ** \n - Link a new wallet to your account that contains the token. \n
    ** Refresh Assets In Wallet ** \n - If you hold the tokens in your linked wallets then you can run the command ** /refresh-assets-in-wallet ** to fetch the latest assets in your wallet. \n
    `
  );
  return embed;
};

const getWalletLinkedSuccessfullyEmbed = (walletAddress) => {
  const embed = createEmbed(
    "🔒🗳️ Wallet Linked 🗳️🔒",
    `You have successfully verified and linked the following wallet ** ${walletAddress} ** to your account
    `
  );
  return embed;
};

const getVotingHasStartedEmbed = () => {
  const embed = createEmbed(
    "🗳️ A Voting Round Has Been Created 🗳️",
    `A voting round has just been initiated. \n
    Voting Round Name: ** New Logo ** \n
    Voting Round Description: ** Decide new logo for discord server ** \n
    Enter the command ** /register-proposal ** or ** /vote-proposal ** to start participating in the voting round. \n`
  );
  return embed;
};

const getViewPersonalInfoEmbed = () => {
  const embed = createEmbed(
    "🔒🗳️ View Personal Info 🗳️🔒",
    `Please select the information you want to view. \n
  ** Ethereum Wallets ** \n - View linked Ethereum Wallets. \n
  ** Cardano Wallets ** \n - View linked Cardano Wallets. \n
  ** Self-Soverign Identity ** \n - View verifiable credentials in your wallet. \n
  ** Participation History ** \n - View your participation history in voting rounds. \n
  `
  );
  return embed;
};

const getViewEthereumWalletsEmbed = (wallets) => {
  const embed = createEmbed(
    "🔒🗳️ Ethereum Wallets 🗳️🔒",
    `You have the following Ethereum wallets linked to your account. \n
    ** Linked Wallet Address ** \n - 0x1f45D3DFa47b42231806ec59Be0C4ba9507a8Cbd \n
    ** Assets In Wallet ** \n - ETH \n
    `
  );
  return embed;
};

const getNotifyNewVotingRoundEmbed = (votingRound) => {
  const embed = createEmbed(
    "Voting Round Alert",
    `A new voting round has been created. \n`
  );
  return embed;
};

module.exports = {
  getVotingRoundInfoEmbed,
  getEnterNameAndDescriptionEmbed,
  getSendFundToWalletEmbed,
  getSelectIfOnlyTokenHolderCanVoteEmbed,
  getSelectBlockchainEmbed,
  getVerifyWalletEmbed,
  getLinkWalletEmbed,
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
  getAlreadyLinkedWalletEmbed,
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
  getSnapbrilliaWalletLoginEmbed,
  getSnapbrilliaEmailCodeEmbed,
  getSnapbrilliaEmailNotFoundEmbed,
  getEmailOTPFailedEmbed,
  getSnapbrilliaWalletLinkedEmbed,
  getSnapbrilliaWalletLinkedAlreadyEmbed,
  getNoPermessionToStartVotingRoundEmbed,
  getNoWhitelistTokenFoundEmbed,
  getWalletLinkedSuccessfullyEmbed,
  getVotingHasStartedEmbed,
  getViewPersonalInfoEmbed,
  getViewEthereumWalletsEmbed,
  getNotifyNewVotingRoundEmbed,
};
