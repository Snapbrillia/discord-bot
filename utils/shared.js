const numberRegex = /^[0-9]+$/;

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
  votingPermissions,
  roundDuration,
  verificationMethod,
  tokenUsed
) => {
  let text = `🔧** Current configuration of voting round **🔧\n
  Voting System:** ${votingSystem} **\n `;
  if (typeof votingPermissions === "boolean") {
    if (votingPermissions) {
      text += `Voting Permissions:** Only holders of a specific Token can Vote **\n`;
    } else {
      text += `Voting Permissions:** Anybody can vote as long as they are verified **\n`;
    }
  }
  if (roundDuration) {
    const { startDate, endDate } = getStartAndEndDate(roundDuration);
    text += `Voting Round Start:** ${startDate} **\n Voting Round End:** ${endDate} **\n`;
  }
  if (verificationMethod) {
    text += `Verification Method:** ${verificationMethod} **\n`;
  }
  if (tokenUsed) {
    text += `Token Used:** ${tokenUsed} **\n`;
  }
  return text;
};

module.exports = {
  numberRegex,
  formatDate,
  getStartAndEndDate,
  getVotingRoundConfigurationText,
};
