const { Alchemy, Network } = require("alchemy-sdk");
require("dotenv").config();

const config = {
  apiKey: process.env.ALCHEMY_API,
  network: Network.ETH_GOERLI,
};

const checkIfEthSend = async (address, amount) => {
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
};

const getTokenFromAddress = async (address) => {
  if (address.toLowerCase() === "eth") {
    return "ETH";
  }
  const alchemy = new Alchemy(config);
  const response = await alchemy.core.getTokenMetadata(address);
  return response.name;
};

const getEthereumTokensInWallet = async (address) => {
  const alchemy = new Alchemy(config);
  // Get token balances
  const balances = await alchemy.core.getTokenBalances(address);

  // Remove tokens with zero balance
  const nonZeroBalances = balances.tokenBalances.filter((token) => {
    return token.tokenBalance !== "0";
  });

  let tokens = [];
  for (let token of nonZeroBalances) {
    // Get metadata of token
    const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);

    tokens.push({
      tokenName: metadata.name,
      tokenIdentifier: token.contractAddress,
    });
  }
  return tokens;
};

module.exports = {
  checkIfEthSend,
  getTokenFromAddress,
  getEthereumTokensInWallet,
};
