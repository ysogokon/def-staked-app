const SunFlowerSeedToken = artifacts.require("SunFlowerSeedToken");
const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", ([owner, customer]) => {
  let tether, reward, decentralBank;

  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }

  before(async () => {
    tether = await Tether.new();
    reward = await RWD.new();
    decentralBank = await DecentralBank.new(reward.address, tether.address);
    seedToken = await SunFlowerSeedToken.new();

    // Transfer all tokens to DecentralBank (1 million)
    await reward.transfer(decentralBank.address, tokens("1000000"));

    // Transfer 100 tokes Tethers to Customer
    await tether.transfer(customer, tokens("100"), { from: owner });
  });

  describe("Tether Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Tether");
    });
  });

  describe("Reward Token Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await reward.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Decentral Bank Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    it("contract has tokens", async () => {
      let balance = await reward.balanceOf(decentralBank.address);
      assert.equal(balance, tokens("1000000"));
    });
  });

  describe("Yield farming", async () => {
    it("rewards tokens for staking", async () => {
      let result;
      // Check inverstor balance
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokens("100"),
        "customer wallet balance before staking"
      );
      // Check stakig for customer
      await tether.approve(decentralBank.address, tokens("100"), {
        from: customer,
      });
      await decentralBank.depositTokens(tokens("100"), { from: customer });

      // Check update customer's balance
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokens("0"),
        "customer wallet balance after staking"
      );

      // Check updated balance of DecentralBank
      result = await tether.balanceOf(decentralBank.address);
      assert.equal(
        result.toString(),
        tokens("100"),
        "DecentralBank updated balance after staking from customer"
      );

      // Is Staking balance
      result = await decentralBank.isStaking(customer);
      assert.equal(
        result.toString(),
        "true",
        "customer is staking status after staking"
      );

      // Issue Tokens
      await decentralBank.issueTokens({ from: owner });

      // Ensure only the owner can Issue Tokens
      await decentralBank.issueTokens({ from: customer }).should.be.rejected;
    });
  });
});
