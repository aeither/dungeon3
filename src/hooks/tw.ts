import { NETWORK_URL, TW_COLLECTION_ADDRESS } from "@/utils/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { NFTDrop, ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { useEffect, useMemo, useState } from "react";

export default function useTw() {
  const wallet = useWallet();
  const [nftDrop, setNftDrop] = useState<NFTDrop>();
  const [hasNft, setHasNft] = useState(false);

  const sdk = useMemo(() => {
    if (wallet.connected) {
      const sdk = ThirdwebSDK.fromNetwork(NETWORK_URL);
      sdk.wallet.connect(wallet);
      return sdk;
    }
  }, [wallet]);

  useEffect(() => {
    async function load() {
      if (sdk) {
        const nftDrop = await sdk.getNFTDrop(TW_COLLECTION_ADDRESS);
        setNftDrop(nftDrop);
      }
    }
    load();
  }, [sdk]);

  useEffect(() => {
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
    getHasNft();
  }, [wallet, nftDrop]);

  return {
    sdk,
    nftDrop,
    hasNft,
  };
}
