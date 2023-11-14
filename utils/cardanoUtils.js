const axios = require("axios");
require("dotenv").config();

const blockfrostHeaders = {
  "Content-Type": "application/cbor",
  project_id: process.env.BLOCKFROST_ID,
};

const checkIfADASend = async (address, amount) => {
  try {
    const txHash = await getTxHashOfTransaction(address, amount);
    if (!txHash) {
      return false;
    }
    const verified = await verifyTxHash(address, txHash);
    return verified;
  } catch (err) {
    throw err;
  }
};

// Get the transaction hash of the transaction that sent the confirm amount
const getTxHashOfTransaction = async (walletAddress, confirmLovelaceAmount) => {
  try {
    const confimaAdaAmountLoveLace = confirmLovelaceAmount * 1000000;
    const transactions = await axios.get(
      `${process.env.BLOCKFROST_URL}/addresses/${walletAddress}/utxos`,
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

// Verify that the transaction input came from the wallet address
const verifyTxHash = async (walletAddress, txHash) => {
  try {
    const transactions = await axios.get(
      `${process.env.BLOCKFROST_URL}/txs/${txHash}/utxos`,
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
      `${process.env.BLOCKFROST_URL}/assets/${assetIdentifier}`,
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

const getCardanoTokensInWallet = async (walletAddress) => {
  let assets = [];
  const utxos = await axios.get(
    `${process.env.BLOCKFROST_URL}/addresses/${walletAddress}/utxos`,
    {
      headers: blockfrostHeaders,
    }
  );
  utxos.data.forEach((utxo) => {
    utxo.amount.forEach((asset) => {
      if (asset.unit !== "lovelace") {
        assets.push(asset);
      }
    });
  });
  let tokenWithTokenName = [];
  for (let i = 0; i < assets.length && i < 23; i++) {
    const tokenName = await getTokenFromPolicyId(assets[i].unit);
    if (tokenName) {
      tokenWithTokenName.push({
        tokenName,
        tokenIdentifier: assets[i].unit,
      });
    }
  }

  return tokenWithTokenName;
};

module.exports = {
  checkIfADASend,
  getTokenFromPolicyId,
  getCardanoTokensInWallet,
};
