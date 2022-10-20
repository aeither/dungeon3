import {
  AnchorProvider,
  BN,
  Idl,
  Program,
  Wallet,
} from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { useMemo } from "react";
import { Dungeon3, IDL } from "@/assets/idl";

function App() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID || "");
  const TW_PROGRAM_ADDRESS = process.env.TW_PROGRAM_ADDRESS || "";

  const sdk = useMemo(() => {
    if (!wallet.connected) {
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

  const logNfts = async () => {
    if (!sdk) return;

    const program = await sdk.getProgram(TW_PROGRAM_ADDRESS, "nft-drop");
    const nfts = await program.getAll();
    console.log(nfts[0].metadata.name);
  };

  return (
    <>
      <div className="flex justify-around">
        <div className="self-center">
          <h2 className="font-bold">Dungeon3</h2>
        </div>
        <button className="btn btn-primary" onClick={logNfts}>
          get Nfts
        </button>
        <WalletMultiButton className="btn btn-primary" />
      </div>
    </>
  );
}

export default App;
