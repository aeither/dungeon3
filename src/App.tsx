import { loadKaboom } from "@/components/kaboom";
import { BN, Program } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { PublicKey } from "@solana/web3.js";
import { NFTDrop, ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import kaboom from "kaboom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dungeon3, IDL } from "./utils/idl";
import {
  MINT_ADDRESS,
  PROGRAM_ID,
  TW_COLLECTION_ADDRESS,
} from "@/utils/constants";
import useCustomHooks from "./hooks/hooks";

export default function Home() {
  const wallet = useWallet();
  const { program, hasNft } = useCustomHooks();
  // const PROGRAM_ID = new PublicKey(
  //   "6gT9vcnHzJLT8bSbnYskzQqZ6WhYUKsVdQgCPUkxmCNo"
  // );
  // const TW_COLLECTION_ADDRESS = "E3Gad5EmcveNHhJrYBCFLixDansXABzakTfcMFRGRVCc";
  // const MINT_ADDRESS = "2HQ6DKR4naR6jEs7driTnRvcWwxArogTaCsf4vS5eH93";
  // const [program, setProgram] = useState<Program<Dungeon3>>();
  // const [nftDrop, setNftDrop] = useState<NFTDrop>();
  // const [hasNft, setHasNft] = useState(false);

  // const sdk = useMemo(() => {
  //   if (wallet.connected) {
  //     const sdk = ThirdwebSDK.fromNetwork("devnet");
  //     sdk.wallet.connect(wallet);
  //     return sdk;
  //   }
  // }, [wallet]);

  // useEffect(() => {
  //   load();

  //   async function load() {
  //     if (sdk) {
  //       const { program }: { program: Program<Dungeon3> } =
  //         (await sdk.getProgram(PROGRAM_ID.toBase58(), IDL)) as any;
  //       setProgram(program);

  //       const nftDrop = await sdk.getNFTDrop(TW_COLLECTION_ADDRESS);
  //       setNftDrop(nftDrop);
  //     }
  //   }
  // }, [sdk]);

  // const getHasNft = async () => {
  //   try {
  //     if (!nftDrop || !wallet.publicKey) {
  //     } else {
  //       console.log("nftDrop.publicKey", nftDrop.publicKey.toBase58());

  //       const balance = await nftDrop.balance(MINT_ADDRESS);
  //       console.log(balance);
  //       setHasNft(balance > 0 ? true : false);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // useEffect(() => {
  //   getHasNft();
  // }, [wallet]);

  const initUserAnchor = async () => {
    try {
      if (!program || !wallet.publicKey) return;

      const [userAccountAddress] = await PublicKey.findProgramAddress(
        [Buffer.from("user"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      // Send transaction
      const txHash = await program.methods
        .initUser()
        .accounts({
          newUserAccount: userAccountAddress,
        })
        .rpc();
      console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
    } catch (error) {
      console.error(error);
    }
  };

  const setUserAnchor = async () => {
    try {
      if (!program || !wallet.publicKey) return;

      const [userAccountAddress] = await PublicKey.findProgramAddress(
        [Buffer.from("user"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      // Send transaction
      const txHash = await program.methods
        .setUser(new BN(12000), 2, 0)
        .accounts({
          userAccount: userAccountAddress,
          authority: wallet.publicKey,
        })
        .rpc();
      console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
    } catch (error) {
      console.error(error);
    }
  };

  const canvasRef = useRef(
    document.getElementById("canvas") as HTMLCanvasElement
  );
  useEffect(() => {
    // Start kaboom
    const k = kaboom({
      global: false,
      width: 640,
      height: 480,
      stretch: true,
      letterbox: true,
      canvas: canvasRef.current,
      background: [0, 0, 0],
    });

    loadKaboom(k, hasNft);
    // loadKaboom(k, initUserAnchor);
  }, []);

  return (
    <>
      <div className="flex justify-around">
        <div className="self-center">
          <h2 className="font-bold">Dungeon3</h2>
        </div>
        <button onClick={initUserAnchor}>init</button>
        <button onClick={setUserAnchor}>set</button>
        <WalletMultiButton className="btn btn-primary" />
      </div>
      <canvas
        id="canvas"
        width={window.innerWidth - 160}
        height={window.innerHeight - 160}
        ref={canvasRef}
      ></canvas>
    </>
  );
}
