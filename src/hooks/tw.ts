import { NETWORK_URL, TW_COLLECTION_ADDRESS } from "@/utils/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { NFTDrop, ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { useEffect, useMemo, useState } from "react";

export default function useTw() {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const [nftDrop, setNftDrop] = useState<NFTDrop>();
  const [hasNft, setHasNft] = useState(-1);

  // Initialize sdk with wallet when wallet is connected
  const sdk = useMemo(() => {
    if (publicKey) {
      const sdk = ThirdwebSDK.fromNetwork(NETWORK_URL);
      sdk.wallet.connect(wallet);
      return sdk;
    }
  }, [publicKey]);

  // Initialize collection drop program when sdk is defined
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
        if (publicKey !== null && nftDrop !== undefined) {
          const nfts = await nftDrop.getAllClaimed();
          const userAddress = publicKey.toBase58();
          const hasNFT = nfts.some((nft) => nft.owner === userAddress);
          if (hasNFT === undefined) {
            setHasNft(0);
          } else {
            setHasNft(1);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    getHasNft();
  }, [publicKey, nftDrop]);

  return {
    sdk,
    nftDrop,
    hasNft,
  };
}
