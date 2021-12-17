const Presale = artifacts.require("Presale.sol");
const PresaleToken = artifacts.require("PresaleToken.sol");
const PICNIC = artifacts.require("PICNIC.sol");

module.exports = function (deployer) {
  deployer.deploy(Presale);
  deployer.deploy(PICNIC);
  deployer.deploy(PresaleToken);
};
