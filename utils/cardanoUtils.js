const axios = require("axios");
const { DiscordUser } = require("../models/discordUser.model.js");
require("dotenv").config();

const blockfrostHeaders = {
  "Content-Type": "application/cbor",
  project_id: process.env.BLOCKFROST_PRE_PROD_ID,
};

const blockfrostURL = "https://cardano-preprod.blockfrost.io/api/v0";

const randomNumber = (min, max) => {
  const int = Math.floor(Math.random() * (max - min)) + min;
  return int / 1000000;
};

const verifyCardanoUsers = async () => {
  const users = await DiscordUser.find({ cardanoIsVerified: false });
  if (users.length === 0) {
    return;
  }
  users.forEach(async (user) => {
    const { cardanoWalletAddress, confirmLovelaceAmount } = user;
    const verified = await checkBalanceArrived(
      cardanoWalletAddress,
      confirmLovelaceAmount
    );
    if (verified) {
      await DiscordUser.findOneAndUpdate(
        { discordId: user.discordId, channelId: user.channelId },
        { cardanoIsVerified: true }
      );
    }
  });
};

const checkBalanceArrived = async (walletAddress, confirmLovelaceAmount) => {
  const transactionHash = await getTxHashOfTransaction(
    walletAddress,
    confirmLovelaceAmount
  );
  if (!transactionHash) {
    return false;
  }
  const isVerified = await verifyTxHash(walletAddress, transactionHash);
  return isVerified;
};

const getTxHashOfTransaction = async (walletAddress, confirmLovelaceAmount) => {
  try {
    const confimaAdaAmountLoveLace = confirmLovelaceAmount * 1000000;
    const transactions = await axios.get(
      `${blockfrostURL}/addresses/${walletAddress}/utxos`,
      {
        headers: blockfrostHeaders,
      }
    );
    const { tx_hash } = transactions.data.find((transaction) => {
      if (
        transaction.amount[0].unit === "lovelace" &&
        parseInt(transaction.amount[0].quantity) === confimaAdaAmountLoveLace
      ) {
        return transaction.tx_hash;
      }
    });
    return tx_hash;
  } catch (err) {
    return null;
  }
};

const verifyTxHash = async (walletAddress, txHash) => {
  try {
    const transactions = await axios.get(
      `${blockfrostURL}/txs/${txHash}/utxos`,
      {
        headers: blockfrostHeaders,
      }
    );
    const isVerified = transactions.data.inputs.some(
      (input) => input.address === walletAddress
    );
    return isVerified;
  } catch (err) {
    return null;
  }
};

// Asset Idenitifer is the concatnation of the asset name and policy ID
const getTokenFromPolicyId = async (assetIdentifier) => {
  try {
    if (assetIdentifier === "ADA") {
      return "ADA";
    }
    const tokens = await axios.get(
      `${blockfrostURL}/assets/${assetIdentifier}`,
      {
        headers: blockfrostHeaders,
      }
    );
    const tokenName = Buffer.from(tokens.data.asset_name, "hex").toString(
      "utf8"
    );
    return tokenName;
  } catch (err) {
    return null;
  }
};

module.exports = {
  randomNumber,
  verifyCardanoUsers,
  getTokenFromPolicyId,
};
