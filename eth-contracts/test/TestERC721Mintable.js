var ERC721MintableComplete = artifacts.require("REMERC721Token");

contract("TestERC721Mintable", accounts => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[2];
  const account_four = accounts[3];
  const account_five = accounts[4];
  describe("match erc721 spec", function() {
    beforeEach(async function() {
      this.contract = await ERC721MintableComplete.new({ from: account_one });

      // TODO: mint multiple tokens
      let tokenOne = 1;
      let tokenTwo = 2;
      let tokenThree = 3;
      let tokenFour = 4;

      await this.contract.mint(account_one, tokenOne, { from: account_one });

      await this.contract.mint(account_two, tokenTwo, { from: account_one });

      await this.contract.mint(account_three, tokenThree, {
        from: account_one
      });

      await this.contract.mint(account_four, tokenFour, { from: account_one });
    });

    it("should return total supply", async function() {
      let totalTokens = await this.contract.totalSupply({ from: account_one });

      assert.equal(totalTokens, 4, "Invalid token count");
    });

    it("should get token balance", async function() {
      let balance = await this.contract.balanceOf(account_two, {
        from: account_one
      });
      assert.equal(balance, 1);
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function() {
      let tokenId = 2;
      let result = await this.contract.tokenURI(tokenId);
      assert.equal(
        result,
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2",
        "Invalid token URI"
      );
    });

    it("should transfer token from one owner to another", async function() {
      let tokenId = 1;

      await this.contract.transferFrom(account_one, account_two, tokenId, {
        from: account_one
      });

      let newOwner = await this.contract.ownerOf(tokenId, {
        from: account_one
      });

      assert.equal(
        newOwner,
        account_two,
        "Owner should be Account 2 after token transfer"
      );
    });
  });

  describe("have ownership properties", function() {
    beforeEach(async function() {
      this.contract = await ERC721MintableComplete.new({ from: account_one });
    });

    it("should return contract owner", async function() {
      let tokenId = 1;
      let contractOwner = await this.contract.owner.call(tokenId, {
        from: account_one
      });
      assert.equal(contractOwner, account_one);
    });

    it("should fail when minting when address is not contract owner", async function() {
      let revert = false;
      try {
        let tx = await this.contract.mint(account_five, 5, {
          from: account_two
        });
      } catch (e) {
        revert = true;
      }

      assert.equal(revert, true, "Given address is not contract owner");
    });
  });
});
