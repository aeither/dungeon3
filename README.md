# Dungeon3: RPG game on Solana

[![DUNGEON3_BANNER](https://user-images.githubusercontent.com/36173828/197815345-3c6096c4-5884-484b-80cc-859ed16ffbac.png)](https://youtu.be/VEt2Kg1jjBc)
Click on the image to watch the Demo or click [Here](https://youtu.be/VEt2Kg1jjBc).

## Overview

Solana is one of the most exciting layer 1 blockchain platforms. Unlike Ethereum, its consensus is achieved by using proof of stake and proof of history. The code deployed on the chain is called a program. In Ethereum, they are called smart contracts. They took a different approach, which means we also need to learn new logic to build on Solana. Building on Solana is hard. It is well known by Solana builders as "chewing glass."

There is no need to be concerned. In this guide, we will build an RPG game on Solana. We will cover the complete stack of the app by breaking down each step: the program, the nft collection drop, the frontend, and the game.

We are going to start with the program which allows the user to store the in-game progress on-chain. We will use a beginner-friendly programming language, Python. It is possible thanks to the new Seahorse framework that we are going to use with the Solana Playground Web editor. We created an NFT collection drop. All the players can mint their free NFT to get started with the game. Then we are going to use kaboomjs to create the game. It is a game library by Replit that allows us to use Javascript to build browser games, so you don't have to download any game engine such as Unity to build a game.

The tools we will cover include:

### Solana

Solana is well known to be fast and cheap. It provides the web3js SDK, CLI, Solana Program Library (SPL), or interfaces to query the Solana Network. We can write programs in Rust the traditional way or in Anchor. [Read more](https://solana.com/news/getting-started-with-solana-development)

Rust has a steep learning curve, which makes it difficult for newcomers to build on Solana. Don't worry because we are going to build the program with the brand new Seahorse language. It lets you write Solana programs in Python. Developers gain Python's ease-of-use while still having the same safety guarantees as every Rust program on the Solana chain. [Seahorse Website](https://seahorse-lang.org/)

### Thirdweb

Thirdweb simplifies the Solana development workflow with an intuitive dashboard and SDKs to deploy and interact with your programs. [Thirdweb website](https://thirdweb.com/)

### Kaboom

Kaboom is a Javascript game programming library that helps you make games fast and fun. Building games in the browser has never been so easy thanks to Kaboom from Replit. [Github](https://github.com/replit/kaboom)

A quick peek of the repository structure

```
📦 dungeon3
├─ art_layers // Layers of PNGs to be use with Hashlips Engine
├─ program // Solana program to save player progress and typescript tests
├─ src
│  ├─ component
│  │  └─ kaboom // The RPG game
│  ├─ contexts // Wallet provider contex
│  ├─ hooks // Web3 methods and utilities
│  ├─ utils // Constants and the program IDL
│  ├─ App.tsx // The game page
│  └─ MintPage
└─ public
   └─ assets // Game audios and images
```

Let's go!

## Prerequisites

- Install [Node.js](https://nodejs.org/en/)
- Basic familiarity with javascript and python.

## Setup

_Skip whatever step that you have already done before._

Install the [Solana Tool Suite](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool)to interact with a Solana cluster. We will use its command-line interface, also known as the CLI. It provides the most direct, flexible, and secure access to your Solana accounts. After the installation, you may need to expose the path by copy-pasting the script that will show up in your terminal. Check the version to verify you have installed it correctly.

```text
$ solana --version
solana-cli 1.13.0 (src:devbuild; feat:2324890699)
```

Let's use the CLI to generate a keypair. A keypair is a public key and corresponding private key for accessing an account. The public key is your address that you can share with your friends to receive funds, and it is visible to them when you give them assets. You must keep your private key secret. It allows anyone with it to move any assets.

Generate a new keypair with:

```text
solana-keygen new
```

It will write a JSON file to the keypair path on your computer. The file contains an array of bytes. A byte is just a number from 0-255. You can find the path by running.

```text
$ solana config get
Config File: /Users/USERNAME/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/USERNAME/.config/solana/id.json
Commitment: confirmed
```

We can check the address and balance with the respective keywords.

```text
solana address
```

and

```text
solana balance
```

To get a few SOL for testing, we use the airdrop command. Currently, the maximum SOL per call is set at 2 SOL. We can get more by calling more times if needed.

```text
solana airdrop 2
```

We are not going to use the localnet so make sure the RPC URL is set to devnet with

```text
solana config set --url devnet
```

Run `cat` with the file path to display its content. We can copy-paste it to import it into Phantom Wallet. In this way, we don't use our main wallet.

```text
cat /Users/USERNAME/.config/solana/id.json
```

Now that we have setup our wallet, the next step is to create the program to store game data on the blockchain.

## The Program

![SOLPG_CREATE_PROJECT](https://user-images.githubusercontent.com/36173828/197973953-ceea7322-5880-4fee-a25f-7305fb30fe06.png)

### Introducing Seahorse

There are 3 frameworks we can use to create a Solana program. The local, the anchor, or the recently arrived seahorse Right now, the most commonly used framework is Anchor as it is observable on GitHub and in the open source repository of the best known protocols. Anchor abstracts huge parts of the native way of life, but it is still using Rust.

Rust is known for being slow because of the high learning curve and the writing speed due to the very verbose code, which also makes it hard to read. It is complex, which means the barrier to entry for development is high. This slows development down and stunts innovation within the ecosystem.

Solehorse lets you write Solana programs in Python. It is a community-led project built on Anchor. fully interoperable with Rust code. Compatibility with the Anchor It is not production ready as it is still in beta, which means there are bugs and limitations. Nevertheless, we are going to explore its simplicity and its potential.

### Program breakdown

Head to [Solana Playground](https://beta.solpg.io/) and click on the plus sign to create a new project. Give it the name `dungeon3`, select the last option Seahorse(Python), and press the create button. Change the name of `fizzbuzz.py` to `dungeon.py` and paste the following code.

```python
# calculator
# Built with Seahorse v0.2.1

from seahorse.prelude import *

# This is your program's public key and it will update
# automatically when you build the project.
declare_id('11111111111111111111111111111111');


class UserAccount(Account):
    authority: Pubkey
    score: u64
    map: u8
    health: u8


class ItemAccount(Account):
    authority: Pubkey
    id: u8
    quantity: u64
    exports: u8


@instruction
def init_user(authority: Signer, new_user_account: Empty[UserAccount]):
    user_account = new_user_account.init(
        payer=authority, seeds=['user', authority])
    user_account.authority = authority.key()
    user_account.score = 0
    user_account.map = 0
    user_account.health = 0


@instruction
def init_item(authority: Signer, new_item_account: Empty[ItemAccount], id: u8):
    item_account = new_item_account.init(
        payer=authority, seeds=['item', authority, id])
    item_account.authority = authority.key()
    item_account.id = id
    item_account.quantity = 0
    item_account.exports = 0


@instruction
def set_user(authority: Signer, user_account: UserAccount, score: u64, map: u8, health: u8):
    assert authority.key() == user_account.authority, "signer must be user account authority"
    user_account.score = score
    user_account.map = map
    user_account.health = health


@instruction
def add_item(authority: Signer, item_account: ItemAccount):
    assert authority.key() == item_account.authority, "signer must be user account authority"
    item_account.quantity = item_account.quantity + 1


@instruction
def export_items(authority: Signer, item_account: ItemAccount):
    assert authority.key() == item_account.authority, "signer must be user account authority"
    item_account.quantity = 0
    item_account.exports = item_account.exports + 1

```

Let's see what we are doing here. The first line imports class and function definitions to provide editors with autocompletion and serve as documentation.

```python
from seahorse.prelude import *
```

`Declare_id` is the program's public key.

```python
# This is your program's public key and it will update
# automatically when you build the project.
declare_id('11111111111111111111111111111111');
```

We derive the base `account` type to make program accounts. We created 2 accounts. The first one is the UserAccount to store the user's progress; the second one is the ItemAccount to record user items that can be exported as NFT.

```python
class UserAccount(Account):
    authority: Pubkey
    score: u64
    map: u8
    health: u8
```

With the @instruction decorator, we convert a function to an instruction. If you have used Anchor, you should know accounts are separated and put into an account context struct. In Seahorse we don't have the account context. The parameters of an instruction can include both accounts and regular parameters.

We passed in a Signer, the wallet that signed the transaction with this instruction call. It is often used as an account payer or seed.
For the second account, `new_user_account` We wrap the account with `Empty` to indicate it will be initialized by this instruction. The `payer` indicates who is going to pay for the rent. On Solana, all accounts need to pay a fee for allocating space for account data. It is rent exempt if initiated with an amount equal to more than 2 years of rent. That amount is recoverable if we close the account, but that is out of scope of the goal of this tutorial. The seeds allow us to generate the account address deterministically. Once initiated, we set the default values.

```python
@instruction
def init_user(authority: Signer, new_user_account: Empty[UserAccount]):
    user_account = new_user_account.init(
        payer=authority, seeds=['user', authority])
    user_account.authority = authority.key()
    user_account.score = 0
    user_account.map = 0
    user_account.health = 0
```

Switch to the second tab in Solana Playground. Make a copy of your address and fund it.

![COPY_ADDRESS_FOR_FUNDING](https://user-images.githubusercontent.com/36173828/197339176-d88a9641-e7b6-4f7e-b5d8-4d484c9d34c6.png)

```text
$ solana airdrop 2 <YOUR_ADDRESS>
```

Click on build and then on deploy to send the program to the devnet. Open "Program Credentials" and copy the program ID. Save it somewhere as it is required as an environment variable for the frontend.

![PROGRAM_ID](https://user-images.githubusercontent.com/36173828/197525057-a775fca3-9a77-411a-9cac-24c6b89a4095.png)

Now it is time to test the program.

### Testing

In the third tab, we can play around with the program. It is divided into two sections: Instructions and Accounts. In the first section, you can call all the available functions by passing the required accounts and arguments. In the second section, you can fetch the accounts data.

![TESTING_PAGE](https://user-images.githubusercontent.com/36173828/197340231-96cddfbc-15d9-4339-b616-334a9bea9c84.png)

We can also automate the testing with a test file that you can find under the Client section back in the file explorer tab.

![TESTING_TS](https://user-images.githubusercontent.com/36173828/197340797-fdda6a37-dee4-4c13-a028-1bda9c60cac7.png)

You can try to write your own tests first. It is pretty straightforward. The editor comes with autocompletion, which helps us to understand what we can use. There is already an example there from the fizzbuzz program. Otherwise, you can paste mine.

```ts
// No imports needed: web3, anchor, pg and more are globally available

describe("Test", async () => {
  // Generate the account public key from its seeds
  const [userAccountAddress] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("user"), pg.wallet.publicKey.toBuffer()],
    pg.PROGRAM_ID
  );

  it("init user", async () => {
    // Send transaction
    const txHash = await pg.program.methods
      .initUser()
      .accounts({
        newUserAccount: userAccountAddress,
      })
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await pg.connection.confirmTransaction(txHash);

    // Fetch the account
    const userAccount = await pg.program.account.userAccount.fetch(
      userAccountAddress
    );

    console.log("Score: ", userAccount.score.toString());
    console.log("Health: ", userAccount.health);
  });

  it("set user", async () => {
    // Send transaction
    const txHash = await pg.program.methods
      .setUser(new BN(15000), 0, 1)
      .accounts({
        userAccount: userAccountAddress,
      })
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await pg.connection.confirmTransaction(txHash);

    // Fetch the account
    const userAccount = await pg.program.account.userAccount.fetch(
      userAccountAddress
    );

    console.log("Score: ", userAccount.score.toString());
    console.log("Health: ", userAccount.health);
  });
});
```

`userAccountAddress` is a PDA or program-derived account generated from the seeds that we passed when we initiated the account. PDAs do not have private keys, so they can live securely on a chain.

First we invoke the method iniUser. There are no arguments passed to initUser(). Then we pass the accounts that the instruction will interact with. In this case, the user account address. We can notice that authority, `systemProgram,` and rent are also accounts that the instruction interacts with, therefore requiring them, but we omitted them without problem. That is because there are variables that Anchor can infer, so they are optional.

```ts
const txHash = await pg.program.methods
  .initUser()
  .accounts({
    // authority: pg.wallet.publicKey,
    newUserAccount: userAccountAddress,
    // systemProgram: new PublicKey("11111111111111111111111111111111"),
    // rent: new PublicKey("SysvarRent111111111111111111111111111111111")
  })
  .rpc();
```

On the next line, we wait for confirmation that the transaction has been successfully finalized. Therefore, we are waiting for the account to be successfully created and updated with the default values.

```ts
await pg.connection.confirmTransaction(txHash);
```

Once it is confirmed, we can fetch the account data and log the result.

```ts
const userAccount = await pg.program.account.userAccount.fetch(
  userAccountAddress
);

console.log("Score: ", userAccount.score.toString());
console.log("Health: ", userAccount.health);
```

This is going to be useful for us to implement contract calls later on from the frontend with the Thirdweb Solana SDK. As stated at the beginning of the overview, we also want the user to mint a free NFT to get access to the game. To attain that, we are going to create the NFT Collection Drop so people can claim it.

## The Collection

![FIGMA_FILE](https://user-images.githubusercontent.com/36173828/197549397-dd12afc8-4c02-46ff-9ebc-4a06431f82e6.png)

### Generate the PNGs

Players would be required to have our NFT to be able to play the game. The nfts need to be claimable. To achieve this, we will use the thirdweb nft drop program. The first step is to create the layers of the design. The most popular tools are Photoshop, Illustrator, or Figma. For this tutorial you can use mine, which you can copy from my [figma file](https://www.figma.com/community/file/1166287637845780926) where you can make any changes you wish, or use the exported PNGs from the `art_layers` folder.

![LAYERS](https://user-images.githubusercontent.com/36173828/197975079-e817b5d2-c744-464e-b4b0-4c2bf1ab936a.png)

To combine the layers, we will use the Hashlips art engine. To make it better, we are going to use the modified version by Waren Gonzaga adapted for Thirdweb. Clone the repository with.

```text
git clone https://github.com/warengonzaga/thirdweb-art-engine.git
```

Remove all the folders inside the layer folders. Put the folders of our art inside there. Go to the config file under the src folder. Change the `namePrefix` and description of your collection here. Change the `layersOrder` to the folder you placed inside the layers folder and change growEditionSizeTo to the number of PNGs you want to generate.   
Use yarn to install the dependencies and run:

```text
yarn generate && yarn generate_thirdweb
```

to generate the art and create a folder for thirdweb.

### Setup wallet

Install the Phantom Wallet Chrome Extension from here: [https://phantom.app/](https://phantom.app/). Create a new wallet by following the instructions indicated by Phantom. It's very important to keep safe the recovery phrase of 12 words. Switch to DEVNET.

![DEVNET_WALLET](https://user-images.githubusercontent.com/36173828/197481422-da5cbf35-6815-458a-95bc-08d0d30b40b3.png)

If you intend to use this wallet directly, you can copy your wallet address and open the terminal to run the solana cli to airdrop yourself 2 SOL.

```text
solana airdrop 2 WALLET_ADDRESS
```

What I did is to import a second wallet generated from the terminal shown in the setup section above, so I separated the wallet where I hold real assets and the second wallet, which is used only for testing purposes for security concerns. Open the keypair json file by running

```text
$ solana config get
...
Keypair Path: /Users/USERNAME/.config/solana/id.json
```

To open the path, hold down the cmd or CTRL key and click on it.You can also access the file by going to the path with File Explorer. The content looks like this `[12, 21, 45]`. In the Phantom Wallet, click on the icon and your wallet name again. Click on Add/Connect Wallet-> Import private key and paste it there to import.

### Deploy and upload

Head to the Thirdweb Dashboard at [https://thirdweb.com/dashboard](https://thirdweb.com/dashboard). Link to your Phantom Wallet. Click on the Deploy New Program button. Choose the NFT drop. Give it a name; Dungeon3, in my case. Set the Total Supply to the NFT quantity we have generated. Change the Network to the Developer and click on Deploy Now.

![DEPLOY_PROGRAM](https://user-images.githubusercontent.com/36173828/197492622-88c22b82-5a89-4599-834e-e7d4fcbd4274.png)

Use Batch Upload, drag and drop the folder generated with the Hashlips engine, or click to select files.

![UPLOAD_ART](https://user-images.githubusercontent.com/36173828/197494844-2af59645-ff38-4920-9189-62c6b2a4c0da.gif)

You need to upload all of your NFTs that match the drop supply set when deploying the program. Set your claim conditions to enable users to start claiming them. In the claim conditions tab, we can change the drop start, royalties, and how much to charge. I set the total number of NFTS that can be claimed to the maximum supply and left the rest as is. Then we click on Save claim conditions.

## The Mint page

![MINT_PAGE](https://user-images.githubusercontent.com/36173828/197976196-899206a1-2801-4df0-a342-5ab56b8a4c99.png)

### Getting started

Set the environment variables. The variables required can be found in.env.example.

- The program ID comes from the program we deployed at the beginning.
- The collection address can be copied from the Thirdweb Dashboard, more specifically the nft drop that we have created for the collection.
- The RPC URL. You can be obtained one by creating an Alchemy account, then creating an app, and you can copy the url from the dashboard.

The project started with pnpm. The commands are the same for npm and yarn. To install the dependencies, run

```
pnpm install
```

and start the project on local with

```
pnpm dev
```

### Router

We want users to mint a nft from their collection to be able to play the game. With the help of `react-router-dom`, we create two pages with react. The mint page checks for the user's nft, and if the user does not have a nft yet, we allow the user to mint one. The user connects with the Phantom wallet and mints a free nft. Once it is minted, the user can play the game.

Create the router in `main.tsx` with `createBrowserRouter` and pass the router to the `RouterProvider`.

```tsx
import "@solana/wallet-adapter-react-ui/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { ContextProvider } from "./contexts/ContextProvider";
import MintPage from "./MintPage";
import "./styles/globals.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "mint",
    element: <MintPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
);
```

The path mint takes the user to the mint page `MintPage.tsx`.

```ts
import MintPage from "./MintPage";

// ...

{
  path: "mint",
  element: <MintPage />,
},
```

It should be running at http://127.0.0.1:5173/mint

### Mint NFT

The `MintPage.tsx`:

```tsx
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProgram from "./hooks/anchor";
import useTw from "./hooks/tw";

export default function MintPage() {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const { nftDrop, hasNft } = useTw();
  const { initUserAnchor } = useProgram();

  /**
   * Check if the wallet has NFT
   * Go to the game page if we find it.
   */
  useEffect(() => {
    if (hasNft === 1) {
      navigate("/");
    }
  }, [hasNft]);

  const mint = async () => {
    if (!nftDrop || !publicKey) return;
    try {
      // Claim 1 NFT
      const claimedAddresses = await nftDrop.claim(1);
      console.log("Claimed NFT to: ", claimedAddresses[0]);

      // Initialize user account
      await initUserAnchor();

      navigate("/");
    } catch (error) {
      alert("something went wront :(");
    }
  };

  return (
    <>
      <div className="flex justify-around">
        <div className="self-center">
          <h2 className="font-bold">Dungeon3</h2>
        </div>
        <WalletMultiButton className="btn btn-primary" />
      </div>
      <div className="h-screen">
        <div className="flex flex-col gap-3 h-[inherit] items-center justify-center">
          <h2 className="font-bold">Dungeon3</h2>
          <img src="/hero.png" alt="dungeon3" className="w-60" />
          <span>Mint your Hero</span>
          <button className="btn btn-primary" onClick={mint}>
            Mint
          </button>
        </div>
      </div>
    </>
  );
}
```

The player can connect the wallet to the Solana blockchain thanks to the wallet button component.

```html
<WalletMultiButton className="btn btn-primary" />
```

Then we have another button which allows the user to mint a NFT.

```html
<button className="btn btn-primary" onClick="{mint}">Mint</button>
```

The page will check if the user has an NFT of the collection first.

```ts
/**
 * Check if the wallet has NFT
 * Go to the game page if we find it.
 */
useEffect(() => {
  if (hasNft === 1) {
    navigate("/");
  }
}, [hasNft]);
```

The mint function calls the `nftDrop` property from the `useTw()` hook

```ts
const { nftDrop } = useTw();

// ...

const mint = async () => {
  if (!nftDrop || !wallet.publicKey) return;
  try {
    // Claim 1 NFT
    const claimedAddresses = await nftDrop.claim(1);
    console.log("Claimed NFT to: ", claimedAddresses[0]);

    // Initialize user account
    await initUserAnchor();

    navigate("/");
  } catch (error) {
    alert("something went wront :(");
  }
};
```

The `nftDrop` is initiated by the Thirdweb SDK. The SDK is initialized when the user connects the wallet.

```ts
import { NETWORK_URL, TW_COLLECTION_ADDRESS } from "@/utils/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { NFTDrop, ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { useEffect, useMemo, useState } from "react";

export default function useTw() {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const [nftDrop, setNftDrop] = useState<NFTDrop>();
  const [hasNft, setHasNft] = useState(-1);

  // Initialize sdk with wallet when wallet is connected
  const sdk = useMemo(() => {
    if (publicKey) {
      const sdk = ThirdwebSDK.fromNetwork(NETWORK_URL);
      sdk.wallet.connect(wallet);
      return sdk;
    }
  }, [publicKey]);

  // Initialize collection drop program when sdk is defined
  useEffect(() => {
    async function load() {
      if (sdk) {
        const nftDrop = await sdk.getNFTDrop(TW_COLLECTION_ADDRESS);
        setNftDrop(nftDrop);
      }
    }
    load();
  }, [sdk]);

  useEffect(() => {
    async function getHasNft() {
      try {
        if (publicKey !== null && nftDrop !== undefined) {
          const nfts = await nftDrop.getAllClaimed();
          const userAddress = publicKey.toBase58();
          const hasNFT = nfts.some((nft) => nft.owner === userAddress);
          if (hasNFT === undefined) {
            setHasNft(0);
          } else {
            setHasNft(1);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    getHasNft();
  }, [publicKey, nftDrop]);

  return {
    sdk,
    nftDrop,
    hasNft,
  };
}
```

When the app gets the user wallet address, the hook instanciate the Thirdweb SDK and gets the nft drop. It will use it to check if the user has an NFT of the collection with `getHasNft()`.

```ts
if (publicKey !== null && nftDrop !== undefined) {
  const nfts = await nftDrop.getAllClaimed();
  const userAddress = publicKey.toBase58();
  const hasNFT = nfts.some((nft) => nft.owner === userAddress);
  if (hasNFT === undefined) {
    setHasNft(0);
  } else {
    setHasNft(1);
  }
}
```

We also called `initUserAnchor()` when we called the mint function.

### Initiate user account

`initUserAnchor()` is imported from `hooks/anchor.ts`. We are using the Solana SDK to get the Anchor Program. The code should look familiar to you. We pasted the code we used for testing the program with tiny changes.

```ts
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
```

## The Game

![GAME_PAGE](https://user-images.githubusercontent.com/36173828/197976446-3d71da8a-a605-4c60-a5b4-97b879b817a0.png)

### Introduction

Kaboom is a Javascript game programming library that helps you make games quickly and with fun. We initiate kaboom in App.tsx and pass down the context to kaboom components.

All the game's static assets are located inside the assets folder. The sounds folder contains the mp3 and wav that play on player action. The main PNGs are located in the dungeon.png file. The dungeon.json file defines the pixels we want to extract from dungeon.png and defines the animations.

During the development, I encountered a class `extends value undefined is not a constructor or null` issue.

> Note:
> Polyfill issue. Some dependencies of the Metaplex SDK are still relying on node.js features that are not available in the browser by default. We are installing some polyfills via rollup plugins since Vite uses rollup under the hood the bundle for production. Thirdweb Solana SDK is built on top of Metaplex which means Metaplex issue are also reflected. [Learn more about the issue](https://github.com/metaplex-foundation/js/issues/343)

This repository has the polyfills installed, but if you have to start a new project with create-react-app or vite. Keep in mind that polyfills are required.

### Initiate and load assets

Let's break down the game, starting from the `App.tsx` file.

```ts
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
    // Start kaboom with configuration
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
```

When the page is loaded, we initiate inside `useEffect` to create a new instance of kaboom. We set the canvas size to stretch to fit the container while keeping the width-to-height ratio.

```ts
const k = kaboom({
  global: false,
  width: 640,
  height: 480,
  stretch: true,
  letterbox: true,
  canvas: canvasRef.current,
  background: [0, 0, 0],
});
```

Get the element with the id `canvas` as a reference. This allows React to render the game inside the canvas component. The 160px acts as a margin to the borders.

```ts
const canvasRef = useRef(
  document.getElementById("canvas") as HTMLCanvasElement
);

// ... inside return
<canvas
  id="canvas"
  width={window.innerWidth - 160}
  height={window.innerHeight - 160}
  ref={canvasRef}
></canvas>;
```

We pass down the kaboom context.

```ts
import { loadKaboom } from "@/components/kaboom";

// ... k = Kaboom Context
loadKaboom(k, setUserAnchor);
```

Inside `kaboom/index.ts` we have:

```ts
import { SetUserAnchor } from "@/hooks/anchor";
import { KaboomCtx } from "kaboom";
import { OLDMAN, OLDMAN2, OLDMAN3 } from "../../utils/constants";
import { Game } from "./game";
import { Home } from "./home";

export const loadKaboom = (k: KaboomCtx, setUserAnchor: SetUserAnchor) => {
  const { go, loadSpriteAtlas, loadSound, loadSprite, play, scene } = k;

  /**
   * Load Sprites and Sounds
   */
  loadSpriteAtlas("/assets/dungeon.png", "/assets/dungeon.json");
  loadSprite(OLDMAN, "/assets/OldMan/SeparateAnim/Idle.png", {
    sliceX: 4,
    sliceY: 1,
    anims: {
      idle: {
        from: 0,
        to: 3,
      },
    },
  });
  loadSprite(OLDMAN2, "/assets/OldMan2/SeparateAnim/Idle.png", {
    sliceX: 4,
    sliceY: 1,
    anims: {
      idle: {
        from: 0,
        to: 3,
      },
    },
  });
  loadSprite(OLDMAN3, "/assets/OldMan3/SeparateAnim/Idle.png", {
    sliceX: 4,
    sliceY: 1,
    anims: {
      idle: {
        from: 0,
        to: 3,
      },
    },
  });

  loadSound("coin", "/assets/sounds/coin.wav");
  loadSound("hit", "/assets/sounds/hit.mp3");
  loadSound("wooosh", "/assets/sounds/wooosh.mp3");
  loadSound("kill", "/assets/sounds/kill.wav");

  loadSound("dungeon", "/assets/sounds/dungeon.ogg");
  const music = play("dungeon", {
    volume: 0.2,
    loop: true,
  });

  scene("home", () => Home(k));

  scene("game", () => Game(k, setUserAnchor));

  function start() {
    // Start with the "game" scene, with initial parameters
    go("home", {});
  }
  start();
};
```

We are going to use all the functions we are going to use in the first line to avoid using the context every time we invoke any function.

```ts
const { go, loadSpriteAtlas, loadSound, loadSprite, play, scene } = k;
```

We load the sprites and sound. If you are asking, what is a sprite? Sprites are images that represent game assets.

```ts
/**
 * Load Sprites and Sounds
 */
loadSpriteAtlas("/assets/dungeon.png", "/assets/dungeon.json");
loadSprite(OLDMAN, "/assets/OldMan/SeparateAnim/Idle.png", {
  sliceX: 4,
  sliceY: 1,
  anims: {
    idle: {
      from: 0,
      to: 3,
    },
  },
});
// ...

loadSound("coin", "/assets/sounds/coin.wav");
loadSound("hit", "/assets/sounds/hit.mp3");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");
loadSound("kill", "/assets/sounds/kill.wav");

loadSound("dungeon", "/assets/sounds/dungeon.ogg");
const music = play("dungeon", {
  volume: 0.2,
  loop: true,
});
```

`loadSpriteAtlas` is one PNG file that aggregates several images, which is why we also have to pass in a json file that extracts each piece by defining its size with `width` and `height`. x and y for its coordinates`sliceX` and `anims` for its frames and configures its animation.

```json
"coin": {
  "x": 288,
  "y": 272,
  "width": 32,
  "height": 8,
  "sliceX": 4,
  "anims": {
    "spin": {
      "from": 0,
      "to": 3,
      "speed": 10,
      "loop": true
    }
  }
},
```

For the animation configuration in `loadSprite,` we can pass in as the third. Then we have `loadSound` that loads a sound with a name and resource url.

```ts
loadSound("coin", "/assets/sounds/coin.wav");
```

Once an asset is loaded, we can use it by calling it by the name we gave to it.

```ts
loadSound("dungeon", "/assets/sounds/dungeon.ogg");
play("dungeon", {
  volume: 0.2,
  loop: true,
});
```

Create 2 scenes. The home component contains a menu that allows the user to start a new game. We start by showing the Home component first by calling the function `start()` .

```ts
scene("home", () => Home(k));
scene("game", () => Game(k, setUserAnchor));

function start() {
  // Start with the "game" scene, with initial parameters
  go("home", {});
}
start();
```

### Map, characters, items and logics

The Home component has mostly the same elements that we are going to cover in the Game component, so let's move to the `game.ts` file directly.

Let's create the map for the game. Most game editors come with a visual editor that allows us to drag and drop items into it. Kaboom works a bit differently. We write the map in code. The addLevel requires two parameters. In the first parameter, we define where we want to place the game assets with symbols. You can use all the symbols you can imagine, plus numbers, uppercase and lowercase. Then in the second parameter, we define the size and associate each symbol with the sprite it stands for. The symbols work like HTML tags, and then when defining the sprite to the symbol, it's like adding CSS style to the HTML tag.

```ts
/**
 * Map
 */

// map floor
addLevel(
  [
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
    "                                        ",
  ],
  {
    width: 16,
    height: 16,
    " ": () => [sprite("floor", { frame: ~~rand(0, 8) })],
  }
);

// map walls, enemies, items, coins...
const map = addLevel(
  [
    "                                        ",
    "tttttttttttttttttttttttttttttttttttttttt",
    "qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwd",
    "l                                      r",
    "l    $                                 r",
    "l                                      r",
    "l      ccc    ccc      ccc       ccc   r",
    "l                                      r",
    "l  ccc            ccc       ccc        r",
    "4ttttttttttttttttttttttttttttttttttttt r",
    "ewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww r",
    "l                                      r",
    "l                      c               r",
    "l               ccccccccc              r",
    "l                      c               r",
    "l                                      r",
    "l                                      r",
    "4ttttttttttttttttttttttttttttttttttttttr",
    "ewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwr",
    "l                                      r",
    "l   cccccccccccccccccccccccccccccccc   r",
    "l                                      r",
    "l   cccccccccccccccccccccccccccccccc   r",
    "l                                      r",
    "l                                      r",
    "attttttttttttttttttttttttttttttttttttttb",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  ],
  {
    width: 16,
    height: 16,
    $: () => [sprite("chest"), area(), solid(), { opened: false }, "chest"],
    c: () => [sprite("coin", { anim: "spin" }), area(), "coin"],
    a: () => [sprite("wall_botleft"), area({ width: 4 }), solid()],
    b: () => [
      sprite("wall_botright"),
      area({ width: 4, offset: vec2(12, 0) }),
      solid(),
    ],
    q: () => [sprite("wall_topleft"), area(), solid()],
    4: () => [sprite("wall_topmidleft"), area(), solid()],
    e: () => [sprite("wall_midleft"), area(), solid()],
    d: () => [sprite("wall_topright"), area(), solid()],
    w: () => [sprite("wall"), area(), solid()],
    t: () => [
      sprite("wall_top"),
      area({ height: 4, offset: vec2(0, 12) }),
      solid(),
    ],
    l: () => [sprite("wall_left"), area({ width: 4 }), solid()],
    r: () => [
      sprite("wall_right"),
      area({ width: 4, offset: vec2(12, 0) }),
      solid(),
    ],
  }
);
```

With the add function, we assemble a game object from a list of components and add it to the game. Position yourself on the map. A sprite takes the id of a loaded sprite. In loadSpriteAtlas we have defined all the ids in the json file. The collision area defines the collision area and enables collision detection with other objects. This allows us to increase the player's coin when the player touches a coin, for example. We used it for the walls and enemies so the player couldn't walk through them like a ghost.

```ts
/**
 * Sprites
 */
const player = add([
  pos(map.getPos(11, 11)),
  sprite(HERO, { anim: "idle" }),
  area({ width: 12, height: 12, offset: vec2(0, 6) }),
  solid(),
  origin("center"),
]);

const sword = add([
  pos(),
  sprite(SWORD),
  origin("bot"),
  rotate(0),
  follow(player, vec2(-4, 9)),
  area(),
  spin(),
]);

const oldman = add([
  OLDMAN,
  sprite(OLDMAN),
  pos(map.getPos(30, 12)),
  origin("bot"),
  area(),
  solid(),
  { msg: "Save progress?" },
]);

const oldman2 = add([
  OLDMAN2,
  sprite(OLDMAN2),
  pos(map.getPos(8, 20)),
  origin("bot"),
  area(),
  solid(),
  { msg: "Save progress?" },
]);

const oldman3 = add([
  OLDMAN3,
  sprite(OLDMAN3),
  pos(map.getPos(8, 4)),
  origin("bot"),
  area(),
  solid(),
  { msg: "Save progress?" },
]);

const ogre = add([
  "ogre",
  sprite("ogre"),
  pos(map.getPos(6, 14)),
  origin("bot"),
  area({ scale: 0.5 }),
  solid(),
]);

const monster = add([
  "monster",
  sprite("monster", { anim: "run" }),
  pos(map.getPos(4, 7)),
  origin("bot"),
  patrol(100),
  area({ scale: 0.5 }),
  solid(),
]);

const monster2 = add([
  "monster",
  sprite("monster", { anim: "run" }),
  pos(map.getPos(24, 9)),
  origin("bot"),
  patrol(100),
  area({ scale: 0.5 }),
  solid(),
]);
```

For the HUD (heads-up display) we add

```ts
/**
 * HUD
 */
const counter = add([
  text("Score: 0", { size: 18, font: "sinko" }),
  pos(40, 4),
  z(100),
  fixed(),
  { value: 0 },
]);

const health = add([
  sprite("health", { width: 18, height: 18 }),
  pos(12, 4),
  fixed(),
]);
```

Then we create functions used by characters and items that define the actions.

```ts
/**
 * Logics
 */

// Spin the sword 360 degree
function spin() {
  let spinning = false;
  return {
    angle: 0,
    id: "spin",
    update() {
      if (spinning) {
        this.angle += 1200 * dt();
        if (this.angle >= 360) {
          this.angle = 0;
          spinning = false;
        }
      }
    },
    spin() {
      spinning = true;
    },
  };
}

// Reduces the life of the player.
// Reset player stats and move to home if there is no life left.
function reduceHealth() {
  switch (health.frame) {
    case 0:
      health.frame = 1;
      break;
    case 1:
      health.frame = 2;
      break;
    default:
      go("home");
      counter.value = 0;
      counter.text = "0";
      health.frame = 0;
      break;
  }
}

// Make enemy to move left and right on collision
function patrol(speed = 60, dir = 1) {
  return {
    on: (obj: any, col: any) => console.log(),
    move: (x: any, y: any) => console.log(),
    id: "patrol",
    require: ["pos", "area"],
    add() {
      this.on("collide", (obj: any, col: any) => {
        if (col.isLeft() || col.isRight()) {
          dir = -dir;
        }
      });
    },
    update() {
      this.move(speed * dir, 0);
    },
  };
}

// Show a dialog box. The player can save their progress on-chain if accept.
function addDialog() {
  const h = 160;
  const btnText = "Yes";
  const bg = add([
    pos(0, height() - h),
    rect(width(), h),
    color(0, 0, 0),
    z(100),
    fixed(),
  ]);
  const txt = add([
    text("", {
      size: 18,
    }),
    pos(vec2(300, 400)),
    scale(1),
    origin("center"),
    z(100),
    fixed(),
  ]);
  const btn = add([
    text(btnText, {
      size: 24,
    }),
    pos(vec2(400, 400)),
    area({ cursor: "pointer" }),
    scale(1),
    origin("center"),
    z(100),
    fixed(),
  ]);

  btn.onUpdate(() => {
    if (btn.isHovering()) {
      btn.scale = vec2(1.2);
    } else {
      btn.scale = vec2(1);
      cursor("default");
    }
  });

  btn.onClick(() => {
    setUserAnchor(counter.value, health.frame);
  });
  bg.hidden = true;
  txt.hidden = true;
  btn.hidden = true;
  return {
    say(t: string) {
      txt.text = t;
      bg.hidden = false;
      txt.hidden = false;
      btn.hidden = false;
    },
    dismiss() {
      if (!this.active()) {
        return;
      }
      txt.text = "";
      bg.hidden = true;
      txt.hidden = true;
      btn.hidden = true;
    },
    active() {
      return !bg.hidden;
    },
    destroy() {
      bg.destroy();
      txt.destroy();
    },
  };
}
const dialog = addDialog();
```

One thing to notice here is when the player interacts with the old man. The player can save the progress of the game by calling the `setUserAnchor(counter.value, health.frame);` function.

Define what happens when the player comes into contact with enemies or items.

```ts
/**
 * on Player Collides
 */

// Reduce the player life when collides with the ogre enemy
player.onCollide("ogre", async (obj, col) => {
  play("hit");
  reduceHealth();
});

// Increase the score when the player touch a coin. Make disappear the coin.
player.onCollide("coin", async (obj, col) => {
  destroy(obj);
  play("coin");
  counter.value += 10;
  counter.text = `Score: ${counter.value}`;
});

// Reduce the player life when collides with the monster enemy
// Move the player a fixed distance in the opposite direction of the collision.
player.onCollide("monster", async (obj, col) => {
  if (col?.isRight()) {
    player.moveBy(-32, 0);
  }
  if (col?.isLeft()) {
    player.moveBy(32, 0);
  }
  if (col?.isBottom()) {
    player.moveBy(0, -32);
  }
  if (col?.isTop()) {
    player.moveBy(0, 32);
  }
  if (col?.displacement) play("hit");
  reduceHealth();
});

// When the sword collides with ogre, kill it and receive 100 coins.
sword.onCollide("ogre", async (ogre) => {
  play("kill");
  counter.value += 100;
  counter.text = `Score: ${counter.value}`;
  destroy(ogre);
});

// Start a dialog with the old man on contact.
player.onCollide(OLDMAN, (obj) => {
  dialog.say(obj.msg);
});

// Start a dialog with the old man on contact.
player.onCollide(OLDMAN2, (obj) => {
  dialog.say(obj.msg);
});

// Start a dialog with the old man on contact.
player.onCollide(OLDMAN3, (obj) => {
  dialog.say(obj.msg);
});
```

Set the camera to be zoomed and follow the player, the movements and the animation.

```ts
/**
 * Player Controls
 */

// Follow the player with the camera
camScale(vec2(2));
player.onUpdate(() => {
  camPos(player.pos);
});

// Press space to spin the sword
// Open a chest if the player is touching it.
onKeyPress("space", () => {
  let interacted = false;
  every("chest", (c) => {
    if (player.isTouching(c)) {
      if (c.opened) {
        c.play("close");
        c.opened = false;
      } else {
        c.play("open");
        c.opened = true;
        counter.value += 500;
        counter.text = `Score: ${counter.value}`;
      }
      interacted = true;
    }
  });
  if (!interacted) {
    play("wooosh");
    sword.spin();
  }
});

// Player movement controls
onKeyDown("right", () => {
  player.flipX(false);
  sword.flipX(false);
  player.move(SPEED, 0);
  sword.follow.offset = vec2(-4, 9);
});

onKeyDown("left", () => {
  player.flipX(true);
  sword.flipX(true);
  player.move(-SPEED, 0);
  sword.follow.offset = vec2(4, 9);
});

onKeyDown("up", () => {
  player.move(0, -SPEED);
});

onKeyDown("down", () => {
  player.move(0, SPEED);
});

// Player animation while stationary and in motion
onKeyRelease(["left", "right", "up", "down"], () => {
  player.play("idle");
});

onKeyPress(["left", "right", "up", "down"], () => {
  dialog.dismiss();
  player.play("run");
});
```

Congratulations! Now you know how to build an RPG game on Solana!

## What’s Next?

You have done an awesome job! I know the content is dense and you made it to the end! The app is not complete; it is a starting point in the development of Web3 Applications. From the knowledge that you have acquired, you can move forward, building your own ideas. Here, I am going to leave you some features you can add to the app:

1. Import game progress from a user account.
2. Fetch NFT Collection Metadata and add the items to the game.
3. Export game assets to NFTs or export coins to tokens.
4. Add more items, levels, or enemies.
5. Use the NFT character as a playable hero with different stats.

Star this [Github Repository](https://github.com/aeither/dungeon3) to help reach more people.

## NFT Art and Game Assets

Dungeon tileset II - https://0x72.itch.io/dungeontileset-ii

## Conclusion

In this guide, you learned how to build an RPG on Solana. We covered the on-chain program's code using the Seahorse framework with the Python programming language. Thirdweb suits for the NFT collection drop, the mint, and the program code. Load, create, and use game assets with Kaboom.

I hope you found it useful. Consider diving into [Seahorse](https://seahorse-lang.org/), [Thirdweb](https://thirdweb.com/network/solana) or [Kaboom](https://github.com/replit/kaboom) to learn more about the tools we have used.

Let's connect on [Twitter](https://twitter.com/giovannifulin) .
