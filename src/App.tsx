import { loadKaboom } from "@/components/kaboom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import kaboom from "kaboom";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useProgram from "./hooks/anchor";
import useTw from "./hooks/tw";

export default function Home() {
  const { hasNft } = useTw();
  const navigate = useNavigate();
  const { setUserAnchor, program } = useProgram();

  // Check if the user has the nft.
  // Go to the mint page if the user hasn't.
  useEffect(() => {
    if (hasNft === 0) {
      navigate("/mint");
    }
  }, [hasNft]);

  // Get the canvas where we are going to load the game.
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
  }, [program]);

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
