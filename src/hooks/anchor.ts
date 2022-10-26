import { PROGRAM_ID } from "@/utils/constants";
import { Dungeon3, IDL } from "@/utils/idl";
import { BN, Program } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import useTw from "./tw";

export type SetUserAnchor = (
  score: number,
  health: number
) => Promise<string | undefined>;

export default function useProgram() {
  const wallet = useWallet();
  const { sdk } = useTw();
  const [program, setProgram] = useState<Program<Dungeon3>>();

  useEffect(() => {
    // Load program when sdk is defined
    load();
    async function load() {
      if (sdk) {
        const { program }: { program: Program<Dungeon3> } =
          (await sdk.getProgram(PROGRAM_ID.toBase58(), IDL)) as any;
        setProgram(program);
      }
    }
  }, [sdk]);

  const initUserAnchor = async () => {
    try {
      if (!program || !wallet.publicKey) return;

      // Find user account. PDA
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
      return txHash;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const setUserAnchor = async (score: number, health: number) => {
    try {
      if (!program || !wallet.publicKey) return;

      // Find user account. PDA
      const [userAccountAddress] = await PublicKey.findProgramAddress(
        [Buffer.from("user"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      // Send transaction
      const txHash = await program.methods
        .setUser(new BN(score), 0, health)
        .accounts({
          userAccount: userAccountAddress,
          authority: wallet.publicKey,
        })
        .rpc();
      console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
      return txHash;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  return {
    program,
    initUserAnchor,
    setUserAnchor,
  };
}
