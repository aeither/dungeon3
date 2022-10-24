import { loadKaboom } from "@/components/kaboom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import kaboom from "kaboom";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useProgram from "./hooks/anchor";
import useTw from "./hooks/tw";

export default function Home() {
  // const wallet = useWallet();
  // const { hasNft } = useTw();
  // const navigate = useNavigate();
  const { setUserAnchor } = useProgram();

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


