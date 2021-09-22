const SunFlowerSeedToken = artifacts.require('SunFlowerSeedToken');
const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(SunFlowerSeedToken);
  const seedToken = await SunFlowerSeedToken.deployed();

  // Deploy Mock Tether Token
  await deployer.deploy(Tether);
  const tether = await Tether.deployed();

  // Deploy RWD Token
  await deployer.deploy(RWD);
  const rwd = await RWD.deployed();

  // Deploy DecentralBank
  await deployer.deploy(DecentralBank, rwd.address, tether.address);
  const decentralBank = await DecentralBank.deployed();

  // Transfer all tokens to DecentralBank (1 million)
  await rwd.transfer(decentralBank.address, '1000000000000000000000000');

  // Transfer 100 Mock Tether tokens to investor
  await tether.transfer(accounts[1], '100000000000000000000');

  await seedToken.transfer(accounts[1], '100000000000000000000');
};
