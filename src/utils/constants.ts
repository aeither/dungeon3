import { PublicKey } from "@solana/web3.js";

/** Kaboom */
export const OLDMAN = "oldman";
export const OLDMAN2 = "oldman2";
export const OLDMAN3 = "oldman3";
export const SPEED = 120;
export const HERO = "hero2";
export const SWORD = "sword2";

/** Solana */
export const PROGRAM_ID = new PublicKey(import.meta.env.VITE_PROGRAM_ID || "");
export const TW_COLLECTION_ADDRESS =
  import.meta.env.VITE_TW_COLLECTION_ADDRESS || "";
export const MINT_ADDRESS = import.meta.env.VITE_MINT_ADDRESS || "";
export const NETWORK_URL =
  `https://solana-devnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API}` ||
  "devnet";
