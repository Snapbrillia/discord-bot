import SnapbrilliaLogo from "../../assets/snapbrillia_logo.svg";
import Image from "next/image";

export default function Container({ component }) {
  return (
    <div className="flex items-center justify-center h-screen w-400">
      <form className="bg-white rounded px-8 pt-6 pb-8 mb-4 shadow-md">
        <Image
          src={SnapbrilliaLogo}
          alt="snapbrillia-logo"
          style={{ marginBottom: "20px" }}
        />
        {component}
      </form>
    </div>
  );
}
