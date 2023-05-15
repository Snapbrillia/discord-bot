import { useState } from "react";
import SnapbrilliaLogo from "../assets/snapbrillia_logo.svg";
import Image from "next/image";
import { Transaction, ForgeScript, BrowserWallet } from "@meshsdk/core";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal, Web3Button } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";

const chains = [arbitrum, mainnet, polygon];
const projectId = "124362f92b293657597554c0846ca0e5";

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function Home() {
  const [userInputData, setUserInputData] = useState({
    proposalTitle: "",
    proposalDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const [wallet, setWallet] = useState("");

  const wallets = [
    {
      url: "https://namiwallet.io/",
      value: "nami",
      name: "Nami",
    },
    {
      url: "https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka",
      value: "eternl",
      name: "Eternl ",
    },
    {
      url: "https://flint-wallet.com/",
      value: "flint",
      name: "Flint",
    },
    {
      url: "https://nu.fi/",
      value: "nufi",
      name: "NuFi",
    },
    {
      url: "https://typhonwallet.io/#/",
      value: "typhoncip30",
      name: "Typhon",
    },
    {
      url: "https://gerowallet.io/",
      value: "gerowallet",
      name: "Gero",
    },
  ];

  const handleInputData = (event) => {
    setUserInputData({
      ...userInputData,
      [event.target.name]: event.target.value,
    });
  };

  const readyToSubmit =
    userInputData.proposalTitle && userInputData.proposalDescription && wallet;

  const mintNft = async () => {
    try {
      setLoading(true);
      const wallet = await BrowserWallet.enable("nami");
      const usedAddress = await wallet.getUsedAddresses();
      const address = usedAddress[0];
      // use app wallet to get address

      // create forgingScript
      const forgingScript = ForgeScript.withOneSignature(address);

      const tx = new Transaction({ initiator: wallet });

      const assetMetadata = {
        proposalName: userInputData.proposalTitle,
        proposalDescription: userInputData.proposalDescription,
      };

      const asset = {
        assetName: "ProposalToken",
        assetQuantity: "1",
        metadata: assetMetadata,
        label: "721",
        recipient:
          "addr_test1vpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0c7e4cxr",
      };
      tx.mintAsset(forgingScript, asset);
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      window.alert(
        `Your transaction has been submitted successfully. Closing the alert will close the page.`
      );
      window.close();
      setTxHash(txHash);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-400">
      <form className="bg-white rounded px-8 pt-6 pb-8 mb-4 shadow-md">
        <Image
          src={SnapbrilliaLogo}
          alt="snapbrillia-logo"
          style={{ marginBottom: "20px" }}
        />
        <div className="flex flex-wrap">
          <div className="w-full mb-2">
            <label className="block">Proposal Name</label>
            <input
              className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
              type="text"
              name="proposalTitle"
              value={userInputData.proposalTitle}
              onChange={handleInputData}
            />
          </div>
          <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
          <div className="w-full mb-2">
            <label className="block">Proposal Description</label>
            <textarea
              className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
              style={{ height: "100px" }}
              name="proposalDescription"
              value={userInputData.proposalDescription}
              onChange={handleInputData}
            />
          </div>
        </div>
        {/* <div>
          <label className="block">Wallet</label>
          <select
            className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg"
            onChange={(e) => setWallet(e.target.value)}
          >
            <option value="">Select</option>
            {wallets.map((wallet) => (
              <option key={wallet.value} value={wallet.value}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div> */}
        <Web3Button />
        {loading ? (
          <div className="float-right px-5 py-2">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <button
            type="button"
            className="focus:outline-none float-right px-5 py-2 text-white mt-5 rounded-full"
            style={{
              backgroundColor: `${readyToSubmit ? "#a900a6" : "#dfdede"}`,
            }}
            onClick={() => mintNft()}
          >
            Register Proposal
          </button>
        )}
      </form>
    </div>
  );
}
