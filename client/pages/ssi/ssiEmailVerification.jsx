import Container from "../shared/container";
import Image from "next/image";
import SnapbrilliaLogo from "../../assets/snapbrillia_logo.svg";

export default function Home() {
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
            <label className="block">Email Address</label>
            <input
              className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
              type="text"
              name="proposalTitle"
              value={userInputData.proposalTitle}
              onChange={handleInputData}
            />
          </div>
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
      </form>
    </div>
  );
}
