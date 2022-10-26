import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProgram from "./hooks/anchor";
import useTw from "./hooks/tw";

export default function MintPage() {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const { nftDrop, hasNft } = useTw();
  const { initUserAnchor } = useProgram();

  /**
   * Check if the wallet has NFT
   * Go to the game page if we find it.
   */
  useEffect(() => {
    if (hasNft === 1) {
      navigate("/");
    }
  }, [hasNft]);

  const mint = async () => {
    if (!nftDrop || !publicKey) return;
    try {
      // Claim 1 NFT
      const claimedAddresses = await nftDrop.claim(1);
      console.log("Claimed NFT to: ", claimedAddresses[0]);

      // Initialize user account
      await initUserAnchor();

      navigate("/");
    } catch (error) {
      alert("something went wront :(");
    }
  };

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
          <span>Mint your Hero</span>
          <button className="btn btn-primary" onClick={mint}>
            Mint
          </button>
        </div>
      </div>
    </>
  );
}
