const axios = require("axios");
const { DiscordUser } = require("../models/discordUser.model.js");
const {
  PendingVerification,
} = require("../models/pendingVerification.model.js");
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
  const pendingVerification = await PendingVerification.find({
    blockchain: "Cardano",
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
    const verified = await checkBalanceArrived(walletAddress, sendAmount);
    console.log(verified);
    if (verified) {
      const discordUser = await DiscordUser.findOne({
        discordId,
      });
      discordUser.cardanoWallets.push(walletAddress);
      await discordUser.save();
      await PendingVerification.deleteOne({
        walletAddress,
        sendAmount,
      });
    }
  }
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

const getCardanoTokenInWalletMenu = async (discordId) => {
  const discordUser = await DiscordUser.findOne({
    discordId,
  });
  const { cardanoWallets } = discordUser;
  let assets = [];
  for (let i = 0; i < cardanoWallets.length; i++) {
    const utxos = await axios.get(
      `${blockfrostURL}/addresses/${cardanoWallets[i]}/utxos`,
      {
        headers: blockfrostHeaders,
      }
    );
    utxos.data.forEach((utxo) => {
      if (utxo.amount.length > 1) {
        utxo.amount.forEach((asset) => {
          if (asset.unit !== "lovelace") {
            assets.push(asset);
          }
        });
      }
    });
  }

  let selectMenu = [
    { label: "ADA", description: "The native Cardano Currency", value: "ADA" },
  ];
  for (let i = 0; i < assets.length && i < 23; i++) {
    const tokenName = await getTokenFromPolicyId(assets[i].unit);
    if (tokenName) {
      selectMenu.push({
        label: tokenName,
        description: `Token ID: ${assets[i].unit}`,
        value: `${tokenName}-${assets[i].unit}`,
      });
    }
  }
  selectMenu.push({
    label: "Enter Manually",
    description:
      "Enter the concatenation of the Asset Name in hex and Policy Id of the asset",
    value: "Other",
  });

  return selectMenu;
};

const getEthereumTokenInWalletMenu = () => {};

module.exports = {
  randomNumber,
  verifyCardanoUsers,
  getTokenFromPolicyId,
  getCardanoTokenInWalletMenu,
  getEthereumTokenInWalletMenu,
};
