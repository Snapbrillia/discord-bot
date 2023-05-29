const {
  TemplateField,
  FieldType,
  CreateCredentialTemplateRequest,
  IssueFromTemplateRequest,
  InsertItemRequest,
  IdentityProvider,
  AuthenticateInitRequest,
  AuthenticateConfirmRequest,
} = require("@trinsic/trinsic");
const { v4: uuid } = require("uuid");
const { DiscordUser } = require("../models/discordUser.model");

const issueRegistrationCredential = async (proposal, userId) => {
  const user = await DiscordUser.findOne({ discordId: userId });

  trinsic.options.authToken = user.ssiAuthToken;

  const nameField = TemplateField.fromPartial({
    description: "Name of proposal",
    type: FieldType.STRING,
  });

  const descriptionField = TemplateField.fromPartial({
    description: "Description of proposal",
    type: FieldType.STRING,
  });

  let request = CreateCredentialTemplateRequest.fromPartial({
    name: `Proof-Of-Participation-${uuid()}`,
    fields: {
      name: nameField,
      description: descriptionField,
    },
  });

  const response = await trinsic.template().create(request);
  const template = response.data;

  const credentialValues = JSON.stringify({
    name: proposal.name,
    description: proposal.description,
  });

  const issueResponse = await trinsic.credential().issueFromTemplate(
    IssueFromTemplateRequest.fromPartial({
      templateId: template.id,
      valuesJson: credentialValues,
    })
  );

  trinsic.options.authToken = user.ssiAuthToken;
  const insertResponse = await trinsic.wallet().insertItem(
    InsertItemRequest.fromPartial({
      itemJson: issueResponse.documentJson,
    })
  );

  return insertResponse.itemId;
};

const sendEmailSSILoginRequest = async (email) => {
  const requestInit = AuthenticateInitRequest.create({
    identity: email,
    provider: IdentityProvider.EMAIL,
    ecosystemId: process.env.TRINSIC_ECOSYSTEM_ID,
  });
  const challengeId = await trinsic.wallet().authenticateInit(requestInit);
  return challengeId;
};

const verifyLoginRequest = async (challengeId, code) => {
  const requestConfirm = AuthenticateConfirmRequest.create({
    challengeId: challengeId,
    response: code, // OTP code
  });
  const responseConfirm = await trinsic
    .wallet()
    .authenticateConfirm(requestConfirm);
  return responseConfirm;
};

module.exports = {
  issueRegistrationCredential,
  sendEmailSSILoginRequest,
  verifyLoginRequest,
};
