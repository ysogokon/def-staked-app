const { assert } = require("console");

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
});
