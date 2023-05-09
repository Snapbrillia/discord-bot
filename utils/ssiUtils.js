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
} = require("@trinsic/trinsic");
const { v4: uuid } = require("uuid");

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

  console.log("eco systemId", ecosystemId);

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

generateProof();

const verifyProof = async (proof, authToken) => {
  trinsic.options.authToken = authToken;
  const verifyResponse = await trinsic.credential().verifyProof(
    VerifyProofRequest.fromPartial({
      proofDocumentJson: proof.proofDocumentJson,
    })
  );
  return verifyResponse;
};
