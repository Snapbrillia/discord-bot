const axios = require("axios");
const url = "http://localhost:8000";

const initateFund = async (channelId, daysTillDeadline) => {
  try {
    const response = await axios.post(
      `${url}/snapbrillia/quadratic-voting/initiate-fund`,
      {
        fundOwnerId: channelId,
        daysTillDeadline,
      }
    );
    return response.data;
  } catch (err) {
    return { err: true, message: err.response.data.error };
  }
};

const registerProposal = async (walletAddress, votingRoundId, projectInfo) => {
  try {
    const response = await axios.post(
      `${url}/snapbrillia/quadratic-voting/register-proposal`,
      {
        walletAddress,
        votingRoundId,
        projectInfo,
      }
    );
    return response.data;
  } catch (err) {
    return { err: true, message: err.response.data.error };
  }
};

const voteToProposal = async (
  walletAddress,
  votingRoundId,
  percentageAllocated,
  voteProposalAddress,
  voteAction
) => {
  try {
    const response = await axios.post(
      `${url}/snapbrillia/quadratic-voting/vote-to-proposal`,
      {
        walletAddress,
        votingRoundId,
        percentageAllocated,
        voteProposalAddress,
        voteAction,
      }
    );
    return response.data;
  } catch (err) {
    return { err: true, message: err.response.data.error };
  }
};

const getVotingResult = async () => {
  const response = await axios.get(
    `${url}/snapbrillia/quadratic-voting/get-voting-round-info`
  );
  return response.data;
};

const getAllProposalsInfo = async () => {
  const response = await axios.get(
    `${url}/snapbrillia/quadratic-voting/get-all-proposal-info`
  );
  return response.data;
};

module.exports = {
  initateFund,
  registerProposal,
  voteToProposal,
  getVotingResult,
  getAllProposalsInfo,
};
