const {
  TrinsicService,
  CreateWalletRequest,
  CreateEcosystemRequest,
  TemplateField,
  FieldType,
  CreateCredentialTemplateRequest,
  IssueFromTemplateRequest,
  InsertItemRequest,
  CreateProofRequest,
  VerifyProofRequest,
  AddExternalIdentityInitRequest,
  IdentityProvider,
  AddExternalIdentityConfirmRequest,
  AddExternalIdentityInitResponse,
} = require("@trinsic/trinsic");
const { v4: uuid } = require("uuid");
const { DiscordUser } = require("../models/discordUser.model");
const { PendingSSIVerification } = require("../models/pendingSSIVerification");

const trinsic = new TrinsicService({
  /** Trinsic API endpoint. Defaults to `prod.trinsic.cloud` */
  serverEndpoint: "prod.trinsic.cloud",
  /** Trinsic API port; defaults to `443` */
  serverPort: 443,
  /** Whether TLS is enabled between SDK and Trinsic API; defaults to `true` */
  serverUseTls: true,
  /** Authentication token for SDK calls; defaults to empty string (unauthenticated) */
  authToken:
    "CiVodHRwczovL3RyaW5zaWMuaWQvc2VjdXJpdHkvdjEvb2Jlcm9uEmsKK3Vybjp0cmluc2ljOndhbGxldHM6elFZYnVLaHRvcGU4WlVjMXFlaXJodW4iPHVybjp0cmluc2ljOmVjb3N5c3RlbXM6Y29uZGVzY2VuZGluZy1tY2NsaW50b2NrLXp1cGhjdzZkaGNjbRowjsYAkJd7q6dnRaxgi3r9tFebuJpHBtGef6zVg3R7YXZ6jJUmXVihs3VOnTwrx_2lIgA",
});

const issueCredential = async () => {
  const ecosystem = await trinsic
    .provider()
    .createEcosystem(CreateEcosystemRequest.fromPartial({}));
  const ecosystemId = ecosystem.ecosystem?.id;

  const user = await trinsic
    .wallet()
    .createWallet({ ecosystemId: ecosystemId });
  const snapbrillia = await trinsic
    .wallet()
    .createWallet({ ecosystemId: ecosystemId });
  const discordVotingRound = await trinsic
    .wallet()
    .createWallet({ ecosystemId: ecosystemId });

  console.log("user", user);
  console.log("snapbrillia", snapbrillia);
  console.log("discordVotingRound", discordVotingRound);

  const firstNameField = TemplateField.fromPartial({
    description: "First name of vaccine recipient",
    type: FieldType.STRING,
  });

  const lastNameField = TemplateField.fromPartial({
    type: FieldType.STRING,
    description: "Last name of vaccine recipient",
  });

  const address = TemplateField.fromPartial({
    type: FieldType.STRING,
    description: "Address of user",
  });

  console.log("firstNameField", firstNameField);
  console.log("lastNameField", lastNameField);
  console.log("address", address);

  //Create request
  let request = CreateCredentialTemplateRequest.fromPartial({
    name: `VaccinationCertificate-${uuid()}`,
    fields: {
      firstName: firstNameField,
      lastName: lastNameField,
      address: address,
    },
  });

  //Create template
  const response = await trinsic.template().create(request);
  const template = response.data;
  console.log("template", template);

  const credentialValues = JSON.stringify({
    firstName: "Allison",
    lastName: "Allisonne",
    address: "123 Main St.",
  });

  // Sign a credential as the clinic and send it to Allison
  trinsic.options.authToken = snapbrillia.authToken;
  const issueResponse = await trinsic.credential().issueFromTemplate(
    IssueFromTemplateRequest.fromPartial({
      templateId: template.id,
      valuesJson: credentialValues,
    })
  );
  console.log("issueResponse", issueResponse);

  trinsic.options.authToken = user.authToken;
  const insertResponse = await trinsic.wallet().insertItem(
    InsertItemRequest.fromPartial({
      itemJson: issueResponse.documentJson,
    })
  );
  console.log("insertResponse", insertResponse);

  // Allison shares the credential with the venue.
  trinsic.options.authToken = user.authToken;
  const proofResponse = await trinsic.credential().createProof(
    CreateProofRequest.fromPartial({
      itemId: insertResponse.itemId,
    })
  );
  console.log("proofResponse", proofResponse);

  trinsic.options.authToken = discordVotingRound.authToken;
  const verifyResponse = await trinsic.credential().verifyProof(
    VerifyProofRequest.fromPartial({
      proofDocumentJson: proofResponse.proofDocumentJson,
    })
  );

  console.log("verifyResponse", verifyResponse);
};

const generateProof = async () => {
  const ecosystem = await trinsic
    .provider()
    .createEcosystem(CreateEcosystemRequest.fromPartial({}));

  const ecosystemId = ecosystem.ecosystem?.id;

  const user = await trinsic
    .wallet()
    .createWallet({ ecosystemId: ecosystemId });

  const snapbrillia = await trinsic
    .wallet()
    .createWallet({ ecosystemId: ecosystemId });

  const discordVotingRound = await trinsic
    .wallet()
    .createWallet({ ecosystemId: ecosystemId });

  const firstNameField = TemplateField.fromPartial({
    description: "First name",
    type: FieldType.STRING,
  });

  const lastNameField = TemplateField.fromPartial({
    type: FieldType.STRING,
    description: "Last name",
  });

  const address = TemplateField.fromPartial({
    type: FieldType.STRING,
    description: "Address of user",
  });

  //Create request
  let request = CreateCredentialTemplateRequest.fromPartial({
    name: `Demo-${uuid()}`,
    fields: {
      firstName: firstNameField,
      lastName: lastNameField,
      address: address,
    },
  });

  //Create template
  const response = await trinsic.template().create(request);
  const template = response.data;
  console.log("template", template);

  const credentialValues = JSON.stringify({
    firstName: "Allison",
    lastName: "Allisonne",
    address: "123 Main St.",
  });

  // Sign a credential as the clinic and send it to Allison
  trinsic.options.authToken = snapbrillia.authToken;
  const issueResponse = await trinsic.credential().issueFromTemplate(
    IssueFromTemplateRequest.fromPartial({
      templateId: template.id,
      valuesJson: credentialValues,
    })
  );
  console.log("issueResponse", issueResponse);

  trinsic.options.authToken = user.authToken;
  const insertResponse = await trinsic.wallet().insertItem(
    InsertItemRequest.fromPartial({
      itemJson: issueResponse.documentJson,
    })
  );
  console.log("insertResponse", insertResponse);

  // Allison shares the credential with the venue.
  trinsic.options.authToken = user.authToken;
  const proofResponse = await trinsic.credential().createProof(
    CreateProofRequest.fromPartial({
      itemId: insertResponse.itemId,
    })
  );

  const isVerified = await verifyProof(
    proofResponse,
    discordVotingRound.authToken
  );

  console.log("Is Verfied: ", isVerified);

  return proofResponse;
};

const verifyProof = async (proof, authToken) => {
  trinsic.options.authToken = authToken;
  const verifyResponse = await trinsic.credential().verifyProof(
    VerifyProofRequest.fromPartial({
      proofDocumentJson: proof.proofDocumentJson,
    })
  );
  return verifyResponse;
};

const generateEmailProof = async (email, userId) => {
  // const ecosystemId = "condescending-mcclintock-zuphcw6dhccm";
  // const user = await trinsic
  //   .wallet()
  //   .createWallet({ ecosystemId: ecosystemId });
  // const discordUser = await DiscordUser.findOne({ discordId: userId });
  // discordUser.ssiAuthToken = user.authToken;
  // await discordUser.save();
  // trinsic.options.authToken = discordUser.ssiAuthToken;
  // const request = AddExternalIdentityInitRequest.create({
  //   identity: email,
  //   provider: IdentityProvider.EMAIL,
  // });
  // const responseInit = await trinsic.wallet().addExternalIdentityInit(request);
  // await PendingSSIVerification.create({
  //   discordId: userId,
  //   email: email,
  //   challengeId: responseInit.challenge,
  // });
};

const submitEmailProof = async (code, userId) => {
  // const emailChallenge = await PendingSSIVerification.findOne({
  //   discordId: userId,
  // });
  // const requestConfirm = AddExternalIdentityConfirmRequest.create({
  //   challenge: emailChallenge.challengeId,
  //   response: code,
  // });
  // const discordUser = await DiscordUser.findOne({ discordId: userId });
  // trinsic.options.authToken = discordUser.ssiAuthToken;
  // await trinsic.wallet().addExternalIdentityConfirm(requestConfirm);
  // emailChallenge.delete();
};

const generatePhoneProof = async (phoneNumber, userId) => {
  const discordUser = await DiscordUser.findOne({ discordId: userId });

  trinsic.options.authToken = discordUser.ssiAuthToken;

  const request = AddExternalIdentityInitRequest.create({
    identity: phoneNumber,
    provider: IdentityProvider.PHONE,
  });

  const responseInit = await trinsic.wallet().addExternalIdentityInit(request);

  await PendingSSIVerification.create({
    discordId: userId,
    identity: phoneNumber,
    challengeId: responseInit.challenge,
  });

  console.log("Phone Code Send");
};

const submitPhoneProof = async (code, userId) => {
  try {
    // const emailChallenge = await PendingSSIVerification.findOne({
    //   discordId: userId,
    // });

    // const requestConfirm = AddExternalIdentityConfirmRequest.create({
    //   challenge: emailChallenge.challengeId,
    //   response: code,
    // });

    const discordUser = await DiscordUser.findOne({ discordId: userId });

    trinsic.options.authToken = discordUser.ssiAuthToken;

    // await trinsic.wallet().addExternalIdentityConfirm(requestConfirm);

    // emailChallenge.delete();

    const phoneNumberField = TemplateField.fromPartial({
      description: "Phone Number",
      type: FieldType.STRING,
    });

    const emailField = TemplateField.fromPartial({
      description: "Email Address",
      type: FieldType.STRING,
    });

    let request = CreateCredentialTemplateRequest.fromPartial({
      name: `Verified-Identity-${uuid()}`,
      fields: {
        phoneNumber: phoneNumberField,
        email: emailField,
      },
    });

    const response = await trinsic.template().create(request);
    const template = response.data;

    const credentialValues = JSON.stringify({
      phoneNumber: "6461046503",
      email: "shanzhang@snapbrillia.com",
    });

    trinsic.options.authToken =
      "CiVodHRwczovL3RyaW5zaWMuaWQvc2VjdXJpdHkvdjEvb2Jlcm9uEpEBCit1cm46dHJpbnNpYzp3YWxsZXRzOnpMMTZrOEMzdFZpaG84cnVSWGJ2cHg4Ijx1cm46dHJpbnNpYzplY29zeXN0ZW1zOmNvbmRlc2NlbmRpbmctbWNjbGludG9jay16dXBoY3c2ZGhjY20qJDM1ZDAxZTI3LWU0NDAtNGUxNi1hN2MwLWFmNDYyYTcyYTk0Zhowib3+anDTMYUpzVjXZWVfGQ8ASt+z4Jl3deCdaGDPSvvbCvGA+zJ5RTabUOu2cL1VIgA=";

    const issueResponse = await trinsic.credential().issueFromTemplate(
      IssueFromTemplateRequest.fromPartial({
        templateId: template.id,
        valuesJson: credentialValues,
      })
    );

    console.log("issue response", issueResponse);

    trinsic.options.authToken = discordUser.ssiAuthToken;
    const insertResponse = await trinsic.wallet().insertItem(
      InsertItemRequest.fromPartial({
        itemJson: issueResponse.documentJson,
      })
    );

    console.log("VC Issued", insertResponse);
  } catch (e) {
    console.log(e);
  }
};

const issueEmailAndPhoneCredential = async (userId) => {
  const user = await DiscordUser.findOne({ discordId: userId });

  const nameField = TemplateField.fromPartial({
    description: "Name of proposal",
    type: FieldType.STRING,
  });

  const descriptionField = TemplateField.fromPartial({
    description: "Description of proposal",
    type: FieldType.STRING,
  });

  let request = CreateCredentialTemplateRequest.fromPartial({
    name: `Demo-${uuid()}`,
    fields: {
      name: nameField,
      description: descriptionField,
    },
  });

  const response = await trinsic.template().create(request);
  const template = response.data;

  const credentialValues = JSON.stringify({
    name: "Snapbrillia",
    description: "Blah",
  });

  // Sign a credential as the clinic and send it to Allison
  trinsic.options.authToken =
    "CiVodHRwczovL3RyaW5zaWMuaWQvc2VjdXJpdHkvdjEvb2Jlcm9uEpEBCit1cm46dHJpbnNpYzp3YWxsZXRzOnpMMTZrOEMzdFZpaG84cnVSWGJ2cHg4Ijx1cm46dHJpbnNpYzplY29zeXN0ZW1zOmNvbmRlc2NlbmRpbmctbWNjbGludG9jay16dXBoY3c2ZGhjY20qJDM1ZDAxZTI3LWU0NDAtNGUxNi1hN2MwLWFmNDYyYTcyYTk0Zhowib3+anDTMYUpzVjXZWVfGQ8ASt+z4Jl3deCdaGDPSvvbCvGA+zJ5RTabUOu2cL1VIgA=";

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
  console.log("insertResponse", insertResponse);
};

const issueRegistrationCredential = async (proposal, userId) => {
  console.log(proposal);
  const user = await DiscordUser.findOne({ discordId: userId });

  trinsic.options.authToken =
    "CiVodHRwczovL3RyaW5zaWMuaWQvc2VjdXJpdHkvdjEvb2Jlcm9uEpEBCit1cm46dHJpbnNpYzp3YWxsZXRzOnpMMTZrOEMzdFZpaG84cnVSWGJ2cHg4Ijx1cm46dHJpbnNpYzplY29zeXN0ZW1zOmNvbmRlc2NlbmRpbmctbWNjbGludG9jay16dXBoY3c2ZGhjY20qJDM1ZDAxZTI3LWU0NDAtNGUxNi1hN2MwLWFmNDYyYTcyYTk0Zhowib3+anDTMYUpzVjXZWVfGQ8ASt+z4Jl3deCdaGDPSvvbCvGA+zJ5RTabUOu2cL1VIgA=";

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

  console.log("credentialValues", credentialValues);

  const issueResponse = await trinsic.credential().issueFromTemplate(
    IssueFromTemplateRequest.fromPartial({
      templateId: template.id,
      valuesJson: credentialValues,
    })
  );

  console.log("Created VC", issueResponse);

  trinsic.options.authToken = user.ssiAuthToken;
  const insertResponse = await trinsic.wallet().insertItem(
    InsertItemRequest.fromPartial({
      itemJson: issueResponse.documentJson,
    })
  );
  console.log("Issued VC", insertResponse);
};

const sendLoginRequest = async () => {};

const confirmLoginRequest = async () => {};

module.exports = {
  generateEmailProof,
  submitEmailProof,
  generatePhoneProof,
  submitPhoneProof,
  issueEmailAndPhoneCredential,
  issueRegistrationCredential,
};
