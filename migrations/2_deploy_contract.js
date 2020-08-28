const TenderRegistry = artifacts.require("TenderRegistry");

module.exports = function(deployer) {
  deployer.deploy(TenderRegistry);
};
