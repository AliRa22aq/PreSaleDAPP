const PICNICLocker = artifacts.require("PICNICLocker.sol");
const TestCoin = artifacts.require("TestCoin.sol");

module.exports = function (deployer) {
  deployer.deploy(PICNICLocker);
  deployer.deploy(TestCoin);
};
