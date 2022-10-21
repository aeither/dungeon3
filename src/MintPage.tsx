import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCustomHooks from "./hooks/hooks";

export default function MintPage() {
  const wallet = useWallet();
  const navigate = useNavigate();
  const { nftDrop } = useCustomHooks();

  useEffect(() => {
    async function f() {
      if (!nftDrop || !wallet.publicKey) return;
      const nfts = await nftDrop.getAllClaimed();
      const userAddress = wallet.publicKey.toBase58();
      const hasNft = nfts.some((nft) => nft.owner === userAddress);
      if (hasNft) {
        navigate("/");
      }
    }

    f();
  }, [wallet]);

  const mint = async () => {
    if (!nftDrop || !wallet.publicKey) return;
    const nfts = await nftDrop.getAll();
    console.log(nfts);

    const claimedAddresses = await nftDrop.claim(1);
    console.log("Claimed NFT to: ", claimedAddresses[0]);
    navigate("/");
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
