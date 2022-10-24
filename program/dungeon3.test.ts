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
