// Setup: npm install alchemy-sdk
const { Alchemy, Network } = require("alchemy-sdk");
const { DiscordUser } = require("../models/discordUser.model");
const { PendingVerification } = require("../models/pendingVerification.model");

require("dotenv").config();

const config = {
  apiKey: process.env.ALCHEMY_API,
  network: Network.ETH_GOERLI,
};

const verifyEthereumUsers = async () => {
  const pendingVerification = await PendingVerification.find({
    blockchain: "Ethereum",
  });
  if (pendingVerification.length === 0) {
    return;
  }
  for (let i = 0; i < pendingVerification.length; i++) {
    const { walletAddress, sendAmount, discordId } = pendingVerification[i];
    const currentDate = new Date();
    const verificationDate = new Date(pendingVerification[i].createdAt);
    const difference = currentDate.getTime() - verificationDate.getTime();
    const differenceInMinutes = Math.round(difference / 60000);
    if (differenceInMinutes > 5) {
      await PendingVerification.deleteOne({
        walletAddress,
        sendAmount,
      });
      return;
    }
    const verified = await checkIfEthSend(walletAddress, sendAmount);
    if (verified) {
      const discordUser = await DiscordUser.findOne({
        discordId,
      });
      discordUser.ethereumWallets.push(walletAddress);
      await discordUser.save();
      await PendingVerification.deleteOne({
        walletAddress,
        sendAmount,
      });
    }
  }
};

const checkIfEthSend = async (address, amount) => {
  try {
    const alchemy = new Alchemy(config);
    const response = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: address,
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
    });
    const ethSend = response.transfers.some((transaction) => {
      return transaction.value === amount;
    });
    return ethSend;
  } catch (err) {
    throw err;
  }
};

const getTokenFromAddress = async (address) => {
  try {
    if (address.toLowerCase() === "eth") {
      return "ETH";
    }
    const alchemy = new Alchemy(config);
    const response = await alchemy.core.getTokenMetadata(address);
    return response.name;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  verifyEthereumUsers,
  getTokenFromAddress,
};
