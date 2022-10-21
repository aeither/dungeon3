import { loadKaboom } from "@/components/kaboom";
import { PROGRAM_ID } from "@/utils/constants";
import { BN } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { PublicKey } from "@solana/web3.js";
import kaboom from "kaboom";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useCustomHooks from "./hooks/hooks";

export default function Home() {
  const wallet = useWallet();
  const { program, hasNft } = useCustomHooks();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasNft) {
      navigate("/mint");
    }
  }, [wallet]);

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
