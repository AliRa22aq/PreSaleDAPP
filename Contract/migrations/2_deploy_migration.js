const Presale = artifacts.require("Presale.sol");
const ERC20 = artifacts.require("ERC20.sol");
const PICNIC = artifacts.require("PICNIC.sol");

module.exports = function (deployer) {
  deployer.deploy(Presale);
  deployer.deploy(PICNIC);
  deployer.deploy(ERC20);
};
