import {
  NETWORK_URL,
  PROGRAM_ID,
  TW_COLLECTION_ADDRESS,
} from "@/utils/constants";
import { Dungeon3, IDL } from "@/utils/idl";
import { Program } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { NFTDrop, ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { useEffect, useMemo, useState } from "react";

export default function useCustomHooks() {
  const wallet = useWallet();
  const [nftDrop, setNftDrop] = useState<NFTDrop>();
  const [program, setProgram] = useState<Program<Dungeon3>>();
  const [hasNft, setHasNft] = useState(false);

  const sdk = useMemo(() => {
    if (wallet.connected) {
      const sdk = ThirdwebSDK.fromNetwork(NETWORK_URL);
      sdk.wallet.connect(wallet);
      return sdk;
    }
  }, [wallet]);

  useEffect(() => {
    load();

    async function load() {
      if (sdk) {
        const { program }: { program: Program<Dungeon3> } =
          (await sdk.getProgram(PROGRAM_ID.toBase58(), IDL)) as any;
        setProgram(program);

        const nftDrop = await sdk.getNFTDrop(TW_COLLECTION_ADDRESS);
        setNftDrop(nftDrop);
      }
    }
  }, [sdk]);

  useEffect(() => {
    getHasNft();

    async function getHasNft() {
      try {
        if (wallet.publicKey !== null && nftDrop !== undefined) {
          const nfts = await nftDrop.getAllClaimed();
          const userAddress = wallet.publicKey.toBase58();
          const hasNFT = nfts.some((nft) => nft.owner === userAddress);
          if (hasNFT === undefined) return;
          setHasNft(hasNFT);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [wallet, nftDrop]);

  return {
    program,
    nftDrop,
    hasNft,
  };
}
