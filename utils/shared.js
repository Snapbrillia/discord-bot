const numberRegex = /^[0-9]+$/;

const formatDate = (date) => {
  const d = new Date(date);
  const day = `0${d.getDate()}`.slice(-2);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  return [year, month, day].join("-");
};

module.exports = {
  numberRegex,
  formatDate,
};
