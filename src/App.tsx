import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { useMemo, useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const wallet = useWallet();
  const { connection } = useConnection();

  // TypeError: Class extends value undefined is not a constructor or null
  const sdk = useMemo(() => {
    if (!wallet.connected) {
      const sdk = ThirdwebSDK.fromNetwork("devnet");
      // sdk.wallet.connect(wallet);
      return sdk;
    }
  }, [wallet]);

  const doSomething = async () => {
    if (!sdk) return;

    const program = await sdk.getProgram(
      "E3Gad5EmcveNHhJrYBCFLixDansXABzakTfcMFRGRVCc",
      "nft-drop"
    );

    const nfts = await program.getAll();

    console.log(nfts[0].metadata.name);
  };

  return (
    <>
      <div className="flex justify-around">
        <div className="self-center">
          <h2 className="font-bold">Dungeon3</h2>
        </div>
        <button className="btn btn-primary" onClick={doSomething}>
          do something!{" "}
        </button>
        <WalletMultiButton className="btn btn-primary" />
      </div>
    </>
  );
}

export default App;
