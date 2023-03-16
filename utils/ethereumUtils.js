// Setup: npm install alchemy-sdk
const { Alchemy, Network } = require("alchemy-sdk");
const { DiscordUser } = require("../models/discordUser.model");
require("dotenv").config();

const config = {
  apiKey: process.env.ALCHEMY_API,
  network: Network.ETH_GOERLI,
};

const verifyEthereumUsers = async () => {
  const users = await DiscordUser.find({ ethereumIsVerified: false });
  if (users.length === 0) {
    return;
  }
  users.forEach(async (user) => {
    const { ethereumWalletAddress, confirmEthAmount } = user;
    const verified = await checkIfEthSend(
      ethereumWalletAddress,
      confirmEthAmount
    );
    console.log(verified);
    if (verified) {
      await DiscordUser.findOneAndUpdate(
        { discordId: user.discordId, channelId: user.channelId },
        { ethereumIsVerified: true }
      );
    }
  });
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
