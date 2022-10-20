import { useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

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
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={doSomething}>doSomething</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
