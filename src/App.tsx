import {
  AnchorProvider,
  BN,
  Idl,
  Program,
  Wallet,
} from "@project-serum/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { PublicKey } from "@solana/web3.js";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import kaboom from "kaboom";
import { useEffect, useMemo, useRef } from "react";
import { Dungeon3, IDL } from "./utils/idl";
import { loadKaboom } from "./utils/kaboom";

export default function Home() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const PROGRAM_ID = new PublicKey(
    "6gT9vcnHzJLT8bSbnYskzQqZ6WhYUKsVdQgCPUkxmCNo"
  );
  const TW_PROGRAM_ADDRESS = "E3Gad5EmcveNHhJrYBCFLixDansXABzakTfcMFRGRVCc";

  // TypeError: Class extends value undefined is not a constructor or null
  const sdk = useMemo(() => {
    if (wallet.connected) {
      const sdk = ThirdwebSDK.fromNetwork("devnet");
      sdk.wallet.connect(wallet);
      return sdk;
    }
  }, [wallet]);

  const provider = useMemo(() => {
    const aWallet = wallet as any as Wallet;
    const provider = new AnchorProvider(connection, aWallet, {});
    return provider;
  }, [wallet, connection]);

  const program: Program<Dungeon3> | undefined = useMemo(
    () => new Program(IDL as Idl, PROGRAM_ID, provider) as any,
    [wallet, connection]
  );

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
      // clearColor: [0, 0, 0],
      background: [0, 0, 0],
    });

    loadKaboom(k, initUserAnchor);
  }, []);

  return (
    <>
      <div className="flex justify-around">
        <div className="self-center">
          <h2 className="font-bold">Dungeon3</h2>
        </div>
        <button onClick={initUserAnchor}>init </button>
        <button onClick={setUserAnchor}>set </button>
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
