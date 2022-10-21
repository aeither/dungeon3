import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCustomHooks from "./hooks/hooks";

export default function MintPage() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const { hasNft } = useCustomHooks();

  useEffect(() => {
    if (hasNft) {
      navigate("/");
    }
  }, [wallet]);

  return (
    <>
      <div className="flex justify-around">
        <div className="self-center">
          <h2 className="font-bold">Dungeon3</h2>
        </div>
        <WalletMultiButton className="btn btn-primary" />
      </div>
      <div className="h-screen">
        <div className="flex flex-col gap-3 h-[inherit] items-center justify-center">
          <h2 className="font-bold">Dungeon3</h2>
          <img src="/hero.png" alt="dungeon3" className="w-60" />
          <span>Mint your Dungeon3 Hero</span>
          <button className="btn btn-primary" onClick={() => console.log("eh")}>
            Mint
          </button>
        </div>
      </div>
    </>
  );
}
