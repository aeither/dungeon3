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
import useProgram from "./hooks/anchor";
import useTw from "./hooks/tw";

export default function Home() {
  const wallet = useWallet();
  const { hasNft } = useTw();
  const { initUserAnchor, setUserAnchor } = useProgram();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!hasNft) {
  //     navigate("/mint");
  //   }
  // }, [wallet]);

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

    loadKaboom(k, setUserAnchor);
  }, []);

  return (
    <>
      <div className="flex justify-around">
        <div className="self-center">
          <h2 className="font-bold">Dungeon3</h2>
        </div>
        <button onClick={initUserAnchor}>init</button>
        <button onClick={() => setUserAnchor(123, 1)}>set</button>
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
