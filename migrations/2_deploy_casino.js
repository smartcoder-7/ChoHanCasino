const ChoHanCasino = artifacts.require("ChoHanCasino.sol");

module.exports = function (deployer) {
  deployer.deploy(ChoHanCasino, web3.utils.toWei('0.1', 'ether'), {
    gas: 3000000
  });
};
