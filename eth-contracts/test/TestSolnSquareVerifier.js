var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
let verifier = artifacts.require("Verifier");
let proof = require("../../zokrates/code/square/proof.json");

contract("TestSolnSquareVerifier", accounts => {
  const account_one = accounts[0];
  const account_two = accounts[1];

  describe("Testing minting and adding solution", function() {
    beforeEach(async function() {
      try {
        const contractVerifier = await verifier.new({ from: account_one });
        this.contract = await SolnSquareVerifier.new(contractVerifier.address, {
          from: account_one
        });
      } catch (e) {
        console.log(e);
      }
    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it("ERC721 token can be minted", async function() {
      let revert = false;
      try {
        await this.contract.mintToken(
          account_two,
          1,
          proof.proof.A,
          proof.proof.A_p,
          proof.proof.B,
          proof.proof.B_p,
          proof.proof.C,
          proof.proof.C_p,
          proof.proof.H,
          proof.proof.K,
          proof.input,
          { from: account_one }
        );
      } catch (e) {
        revert = true;
        console.log(e);
      }
      assert.equal(revert, false, "Mint Not Successfull!!");
    });

    it("Mint a token with the same solution", async function() {
      // Mint - first time
      await this.contract.mintToken(
        account_two,
        1,
        proof.proof.A,
        proof.proof.A_p,
        proof.proof.B,
        proof.proof.B_p,
        proof.proof.C,
        proof.proof.C_p,
        proof.proof.H,
        proof.proof.K,
        proof.input,
        { from: account_one }
      );

      let revert = false;

      try {
        // minting again
        await this.contract.mintToken(
          account_two,
          1,
          proof.proof.A,
          proof.proof.A_p,
          proof.proof.B,
          proof.proof.B_p,
          proof.proof.C,
          proof.proof.C_p,
          proof.proof.H,
          proof.proof.K,
          proof.input,
          { from: account_one }
        );
      } catch (e) {
        revert = true;
      }
      assert.equal(
        revert,
        true,
        "Unable to mint the solution - already exists "
      );
    });
  });
});
