const { EmbedBuilder } = require("discord.js");
const { formatDate } = require("../utils/shared");

const createEmbed = (title, description) => {
  const embed = new EmbedBuilder().setTitle(title).setDescription(description);
  return embed;
};

const getVotingSystemsEmbed = () => {
  const embed = createEmbed(
    "Select Voting System",
    `🗳️ Snapbrillia's Voting System! 🎉\n \n
    🔥 We offer four dynamic voting methods to choose from, each with its own unique strengths and advantages. Whether you're running an election, gathering input from your team, or making a group decision, our system is designed to provide a simple, user-friendly experience that delivers reliable, accurate results.\n \n
    1️⃣ Quadratic Voting (Token In Wallet) - The voting power of each voter will be decided by the amount of a specific asser the voter has in his wallet when the voting round ends. Users will specify the percentage of his voting power he will allocate to a proposal (down or up vote) when voting. Their votes will be squared rooted.\n
    2️⃣ Quadratic Voting (Same Voting Power) - Each user will have the same voting power.Their votes will be square rooted.\n
    3️⃣ Basic Voting - Voters can choose to vote either For or Against a proposal. \n
    4️⃣ Single Choice Voting - Voters can choose to vote for one proposal only and all votes are counted equally. \n \n
    🗳️ To start a voting round, please enter the number next to the voting system you would like to use. \n \n
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

const getListOfVerifiedEmbed = () => {
  const embed = createEmbed(
    "Select Verification Method",
    `🔒🛡️ Verification Methods 🛡️🔒 \n \n
  1️⃣ Ethereum Wallet Address: Users will need to authenticate themselves by proving ownership of their Ethereum based wallet address. \n
  2️⃣ Cardano Wallet Address: Users will need to authenticate themselves by proving ownership of their Cardano based wallet address. \n
  3️⃣ Discord Account: Users can vote simply by being a member of your discord community. \n
`
  );
  return embed;
};

const getWalletVerificationEmbed = () => {
  const embed = createEmbed(
    "🔒🛡️ Select Verification Method 🛡️🔒",
    `Since the voting power of the voter will be decided by the amount of a specific token they have in their wallet, the wallet you choose to verify must support the token you are using for voting.IE If you want only the holder of your communitie's ERC20 token to participate, select Ethereum wallet verification. \n 
  1️⃣ Ethereum-based wallet address: Users will need to authenticate themselves by proving ownership of their Ethereum based wallet address.  \n
  2️⃣ Cardano-based wallet address: Users will need to authenticate themselves by proving ownership of their Cardano based wallet address. \n
`
  );
  return embed;
};

const getEthereumSelectTokenEmbed = () => {
  const embed = createEmbed(
    "🌟 Select Voting Token 🌟",
    `You have selected to require voters to verify themselve using an Ethereum wallet. \n
    The last step is to select the token you want to use for voting. \n
    If you want to use an ERC20 token, please enter the contract address of the token. \n
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
    If you want to use an Cardano Asset, please enter the Policy ID of the asset. \n
    If you want to use ADA, please enter "ADA". \n
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
  const currentDate = new Date();
  const currentDateFormated = formatDate(currentDate);
  const endDate = new Date(
    currentDate.getTime() +
      votingRound.roundDurationInDays * 24 * 60 * 60 * 1000
  );
  const endDateFormated = formatDate(endDate);
  let tokenUsed = "";
  if (votingRound.votingSystemToUse === "Quadratic Voting (Token In Wallet)") {
    tokenUsed = `Voting Token: **${votingRound.assetName}**`;
  }
  const embed = createEmbed(
    "🗳️ Voting Round Info 🗳️ ",
    `Please confirm the following information about the voting round \n
     Voting System: **${votingRound.votingSystemToUse}**\n
     Verification Method: **${votingRound.verificationMethod} **\n
     Start Date: **${currentDateFormated}**\n
     End Date: **${endDateFormated}**\n
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
    `Please confirm the following information about the proposal \n
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
    `Please confirm the following information about the proposal you want to vote for. \n
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

module.exports = {
  getListOfVerifiedEmbed,
  getVotingRoundInfoEmbed,
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
};
