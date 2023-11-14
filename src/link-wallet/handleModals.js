const { DiscordUser } = require("../../models/discordUser.model");
const {
  PendingWalletVerification,
} = require("../../models/pendingWalletVerification");
const {
  PendingSnapbrilliaWalletVerification,
} = require("../../models/pendingSnapbrilliaWalletVerification");
const { randomNumber } = require("../../utils/sharedUtils");
const {
  sendSnapbrilliaLoginCode,
  verifySnapbrilliaLoginCode,
} = require("../../utils/ssiUtils");
const {
  getVerifyEthereumWalletButton,
  getVerifyCardanoWalletButton,
  getEmailOTPButton,
} = require("./buttons");
const {
  getSendFundToWalletEmbed,
  getAlreadyLinkedWalletEmbed,
  getPendingVerifiedWalletEmbed,
  getSnapbrilliaEmailCodeEmbed,
  getSnapbrilliaEmailNotFoundEmbed,
  getEmailOTPFailedEmbed,
  getSnapbrilliaWalletLinkedEmbed,
} = require("./embeds");
const { getImage } = require("../../utils/discordUtils");

const handleEthereumWalletAddressModal = async (interaction) => {
  const image = getImage();
  const discordId = interaction.user.id;
  const sendAmount = randomNumber(1000, 1100);
  const walletAddress = interaction.fields
    .getTextInputValue("walletAddressInput")
    .trim();
  const user = await DiscordUser.findOne({
    discordId,
  });
  if (user.ethereumWallets.includes(walletAddress)) {
    return interaction.reply({
      embeds: [getAlreadyLinkedWalletEmbed()],
      components: [getVerifyEthereumWalletButton()],
      files: [image],
    });
  }
  const pendingVerification = await PendingWalletVerification.findOne({
    discordId,
    walletAddress,
  });
  if (pendingVerification) {
    return interaction.reply({
      embeds: [getPendingVerifiedWalletEmbed()],
      components: [getVerifyEthereumWalletButton()],
      files: [image],
    });
  }
  await PendingWalletVerification.create({
    discordId,
    walletAddress,
    sendAmount,
    blockchain: "Ethereum",
  });
  interaction.reply({
    embeds: [getSendFundToWalletEmbed(`${sendAmount} ETH`, walletAddress)],
    files: [image],
  });
};

const handleCardanoWalletAddressModal = async (interaction) => {
  const image = getImage();
  const discordId = interaction.user.id;
  const sendAmount = randomNumber(1500000, 2000000);
  const walletAddress = interaction.fields
    .getTextInputValue("walletAddressInput")
    .trim();
  const user = await DiscordUser.findOne({
    discordId,
  });
  if (user.cardanoWallets.includes(walletAddress)) {
    return interaction.reply({
      embeds: [getAlreadyLinkedWalletEmbed()],
      components: [getVerifyCardanoWalletButton()],
      files: [image],
    });
  }
  const pendingVerification = await PendingWalletVerification.findOne({
    discordId,
    walletAddress,
  });
  if (pendingVerification) {
    return interaction.reply({
      embeds: [getPendingVerifiedWalletEmbed()],
      components: [getVerifyCardanoWalletButton()],
      files: [image],
    });
  }
  await PendingWalletVerification.create({
    discordId,
    walletAddress,
    sendAmount,
    blockchain: "Cardano",
    channelId: interaction.channelId,
  });
  interaction.reply({
    embeds: [getSendFundToWalletEmbed(`${sendAmount} ADA`, walletAddress)],
    files: [image],
  });
};

const handleSnapbrilliaEmailModal = async (interaction) => {
  const email = interaction.fields.getTextInputValue("emailAddressInput");
  const challengeId = await sendSnapbrilliaLoginCode(email, "email");

  if (!challengeId) {
    const embed = getSnapbrilliaEmailNotFoundEmbed();
    const button = getEmailOTPButton();
    return interaction.reply({
      embeds: [embed],
      components: [button],
    });
  }

  const pendingVerification =
    await PendingSnapbrilliaWalletVerification.findOne({
      discordId: interaction.user.id,
    });

  if (pendingVerification) {
    pendingVerification.challengeId = challengeId;
    pendingVerification.email = email;
    await pendingVerification.save();
  } else {
    await PendingSnapbrilliaWalletVerification.create({
      discordId: interaction.user.id,
      challengeId: challengeId,
      email: email,
    });
  }

  const embed = getSnapbrilliaEmailCodeEmbed();
  const button = getEmailOTPButton();
  const image = getImage();
  interaction.reply({
    embeds: [embed],
    components: [button],
    files: [image],
  });
};

const handleSnapbrilliaEmailOTPModal = async (interaction) => {
  const code = interaction.fields.getTextInputValue("emailCodeInput");
  const pendingVerification =
    await PendingSnapbrilliaWalletVerification.findOne({
      discordId: interaction.user.id,
    });

  const token = await verifySnapbrilliaLoginCode(
    pendingVerification.challengeId,
    code
  );

  if (!token) {
    const embed = getEmailOTPFailedEmbed();
    const button = getEmailOTPButton();
    return interaction.reply({
      embeds: [embed],
      components: [button],
    });
  }

  const user = await DiscordUser.findOne({
    discordId: interaction.user.id,
  });
  user.snapbrilliaWalletAuthToken = token.authToken;
  user.email = pendingVerification.email;
  await user.save();

  await PendingSnapbrilliaWalletVerification.deleteOne({
    discordId: interaction.user.id,
  });

  const embed = getSnapbrilliaWalletLinkedEmbed();
  const image = getImage();

  interaction.reply({
    embeds: [embed],
    files: [image],
  });
};

module.exports = {
  handleEthereumWalletAddressModal,
  handleCardanoWalletAddressModal,
  handleSnapbrilliaEmailModal,
  handleSnapbrilliaEmailOTPModal,
};
