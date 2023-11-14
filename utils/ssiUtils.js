const {
  TrinsicService,
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

const trinsic = new TrinsicService({
  /** Trinsic API endpoint. Defaults to `prod.trinsic.cloud` */
  serverEndpoint: "prod.trinsic.cloud",
  /** Trinsic API port; defaults to `443` */
  serverPort: 443,
  /** Whether TLS is enabled between SDK and Trinsic API; defaults to `true` */
  serverUseTls: true,
  /** Authentication token for SDK calls; defaults to empty string (unauthenticated) */
  authToken: process.env.TRINSIC_AUTH_TOKEN,
});

const issueRegistrationCredential = async (proposal, userId) => {
  const user = await DiscordUser.findOne({ discordId: userId });

  trinsic.options.authToken = user.snapbrilliaWalletAuthToken;

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

  trinsic.options.authToken = user.snapbrilliaWalletAuthToken;
  const insertResponse = await trinsic.wallet().insertItem(
    InsertItemRequest.fromPartial({
      itemJson: issueResponse.documentJson,
    })
  );

  return insertResponse.itemId;
};

const sendSnapbrilliaLoginCode = async (identity) => {
  const provider = IdentityProvider.EMAIL;

  const requestInit = AuthenticateInitRequest.create({
    identity: identity,
    provider: provider,
    ecosystemId: process.env.TRINSIC_ECOSYSTEM_ID,
  });

  const challengeResponse = await trinsic
    .wallet()
    .authenticateInit(requestInit);

  return challengeResponse.challenge;
};

const verifySnapbrilliaLoginCode = async (challengeId, code) => {
  const requestConfirm = AuthenticateConfirmRequest.create({
    challenge: challengeId,
    response: code,
  });

  const authToken = await trinsic.wallet().authenticateConfirm(requestConfirm);
  return authToken;
};

module.exports = {
  issueRegistrationCredential,
  sendSnapbrilliaLoginCode,
  verifySnapbrilliaLoginCode,
};
